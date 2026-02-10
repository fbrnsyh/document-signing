import { useState, useEffect, useRef, useCallback } from "react";
import { useMotionValue, motion } from "framer-motion";
import * as pdfjs from "pdfjs-dist";
import {
    Signature,
    Type,
    Calendar,
    StickyNote,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Plus,
    X,
    User,
    Settings,
    MousePointer2,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import axios from "axios";
import { cn } from "@/lib/utils";

// Set worker path
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const DraggableField = ({ 
    field, 
    workflow, 
    pageRef, 
    canvasRef, 
    selectedField, 
    setSelectedField, 
    handleFieldMove, 
    getFieldStyle,
    fieldTypes
}) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const type = fieldTypes.find((t) => t.id === field.field_type);
    const signer = workflow.signers?.find((s) => s.id === field.signer_id);

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={pageRef}
            style={{
                ...getFieldStyle(field),
                x,
                y,
            }}
            onDragEnd={(e, info) => {
                if (!canvasRef.current) return;

                const canvasRect = canvasRef.current.getBoundingClientRect();
                const fieldElement = e.target.closest(".drag-field");
                if (!fieldElement) return;

                // Use the bounding box of the element to get its absolute position
                const elementRect = fieldElement.getBoundingClientRect();
                
                const newX = ((elementRect.left - canvasRect.left) / canvasRect.width) * 100;
                const newY = ((elementRect.top - canvasRect.top) / canvasRect.height) * 100;

                // Update state
                handleFieldMove(
                    field.id,
                    Math.max(0, Math.min(100 - field.width, newX)),
                    Math.max(0, Math.min(100 - field.height, newY)),
                );

                // Reset motion values immediately to prevent double-transforms
                x.set(0);
                y.set(0);
            }}
            onClick={() => setSelectedField(field)}
            whileDrag={{ scale: 1.02, zIndex: 50 }}
            className={cn(
                "drag-field rounded border-2 flex flex-col items-center justify-center p-1 cursor-move group",
                selectedField?.id === field.id
                    ? "border-primary bg-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.3)] ring-1 ring-primary/30"
                    : "border-primary/40 bg-card/90 hover:border-primary/70 hover:shadow-md"
            )}
        >
            <div className="flex flex-col items-center justify-center w-full h-full transition-colors duration-200">
                <div className="flex items-center gap-1 filter drop-shadow-sm">
                    {type && (
                        <type.icon
                            className={cn("h-3 w-3", type.color)}
                        />
                    )}
                    <span className="text-[9px] font-extrabold uppercase tracking-tight truncate leading-none">
                        {field.field_type}
                    </span>
                </div>
                <div className="mt-0.5 px-1.5 py-0.5 bg-muted/80 rounded-sm border border-border/50 max-w-[90%]">
                    <p className="text-[7px] font-bold text-muted-foreground truncate text-center uppercase tracking-tighter">
                        {signer ? signer.name : "Unassigned"}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default function FieldPlacement({ document, workflow, onNext, onBack, onWorkflowUpdate }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [fields, setFields] = useState(workflow.fields || []);

    // Sync local fields with workflow fields from parent
    useEffect(() => {
        setFields(workflow.fields || []);
    }, [workflow.fields]);

    const [selectedField, setSelectedField] = useState(null);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const pageRef = useRef(null);
    const canvasRef = useRef(null);
    const pdfRef = useRef(null);
    const [scale, setScale] = useState(1.5);

    const fieldTypes = [
        {
            id: "signature",
            name: "Signature",
            icon: Signature,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            id: "initial",
            name: "Initial",
            icon: Type,
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            id: "date",
            name: "Date",
            icon: Calendar,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            id: "text",
            name: "Text Input",
            icon: StickyNote,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
    ];

    // Load PDF
    useEffect(() => {
        const loadPdf = async () => {
            try {
                const url = `/documents/${document.id}/download`;
                const loadingTask = pdfjs.getDocument(url);
                const pdf = await loadingTask.promise;
                pdfRef.current = pdf;
                setNumPages(pdf.numPages);
                renderPage(1);
                setLoading(false);
            } catch (error) {
                console.error("Error loading PDF:", error);
            }
        };
        loadPdf();
    }, [document.id]);

    const renderPage = useCallback(
        async (pageNum) => {
            if (!pdfRef.current) return;

            const page = await pdfRef.current.getPage(pageNum);
            const viewport = page.getViewport({ scale });

            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            await page.render(renderContext).promise;
        },
        [scale],
    );

    useEffect(() => {
        if (pdfRef.current) renderPage(pageNumber);
    }, [pageNumber, scale, renderPage]);

    const handleAddField = async (type) => {
        const signerId = workflow.signers?.[0]?.id;

        if (!signerId) {
            alert(
                "No signers found. Please ensure at least one signer is added to the workflow.",
            );
            return;
        }

        const newFieldData = {
            signer_id: signerId,
            page_number: pageNumber,
            x_position: 10.0,
            y_position: 10.0,
            width: 15.0,
            height: 5.0,
            field_type: type,
            is_required: true,
        };

        try {
            const response = await axios.post(
                `/api/workflows/${workflow.id}/fields`,
                newFieldData,
            );
            const newField = response.data;
            const updatedFields = [...fields, newField];
            setFields(updatedFields);
            onWorkflowUpdate?.({ ...workflow, fields: updatedFields });
            setTimeout(() => {
                setSelectedField(newField);
            }, 50);
        } catch (error) {
            console.error("Failed to add field", error);
        }
    };

    const handleRemoveField = async (fieldId) => {
        try {
            await axios.delete(
                `/api/workflows/${workflow.id}/fields/${fieldId}`,
            );
            const updatedFields = fields.filter((f) => f.id !== fieldId);
            setFields(updatedFields);
            onWorkflowUpdate?.({ ...workflow, fields: updatedFields });
            setSelectedField(null);
        } catch (error) {
            console.error("Failed to remove field", error);
        }
    };

    const handleFieldMove = async (fieldId, x, y) => {
        try {
            const xPos = parseFloat(x.toFixed(2));
            const yPos = parseFloat(y.toFixed(2));

            // Optimistic update
            const updatedFields = fields.map((f) =>
                f.id === fieldId ? { ...f, x_position: xPos, y_position: yPos } : f
            );
            setFields(updatedFields);
            onWorkflowUpdate?.({ ...workflow, fields: updatedFields });

            await axios.patch(
                `/api/workflows/${workflow.id}/fields/${fieldId}`,
                {
                    x_position: xPos,
                    y_position: yPos,
                },
            );
        } catch (error) {
            console.error("Failed to move field", error);
            // Revert on error if needed, but for now we maintain the state
        }
    };

    const getFieldStyle = (field) => {
        return {
            left: `${field.x_position}%`,
            top: `${field.y_position}%`,
            width: `${field.width}%`,
            height: `${field.height}%`,
            position: "absolute",
            zIndex: 10,
        };
    };

    const handleSignerChange = async (newSignerId) => {
        if (!selectedField) return;
        try {
            const response = await axios.patch(
                `/api/workflows/${workflow.id}/fields/${selectedField.id}`,
                {
                    signer_id: newSignerId,
                },
            );

            const updatedFields = fields.map((f) =>
                f.id === selectedField.id
                    ? { ...f, ...response.data }
                    : f,
            );
            setFields(updatedFields);
            onWorkflowUpdate?.({ ...workflow, fields: updatedFields });
            setSelectedField({ ...selectedField, ...response.data });
        } catch (error) {
            console.error("Failed to update field signer:", error);
        }
    };

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-muted-foreground font-medium">Loading document editor...</p>
            </div>
        );

    return (
        <div className="flex flex-col xl:flex-row gap-8">
            {/* Sidebar - Tools & Properties */}
            <div className="w-full xl:w-80 flex flex-col gap-6 order-2 xl:order-1">
                <Card className="shadow-sm">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Plus className="h-4 w-4 text-primary" />
                            Toolbox
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Add signing elements to the page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 grid grid-cols-2 gap-2">
                        {fieldTypes.map((t) => {
                            const Icon = t.icon;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => handleAddField(t.id)}
                                    className="flex flex-col items-center justify-center p-3 border border-border bg-card rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all gap-1.5 group"
                                >
                                    <div className={cn("p-1.5 rounded-md", t.bg)}>
                                        <Icon className={cn("h-4 w-4", t.color)} />
                                    </div>
                                    <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-foreground">
                                        {t.name}
                                    </span>
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>

                {selectedField && (
                    <Card className="shadow-md border-primary/20 animate-in fade-in slide-in-from-right-4">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Settings className="h-4 w-4 text-primary" />
                                    Properties
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => setSelectedField(null)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    Assigned Recipient
                                </label>
                                <Select
                                    value={selectedField.signer_id?.toString()}
                                    onValueChange={handleSignerChange}
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select signer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {workflow.signers?.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()} className="text-xs">
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5 pt-2 border-t">
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                    <span>Type:</span>
                                    <Badge variant="outline" className="h-4 text-[9px] uppercase px-1">
                                        {selectedField.field_type}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                    <span>Required:</span>
                                    <Badge variant="secondary" className="h-4 text-[9px] px-1">
                                        Yes
                                    </Badge>
                                </div>
                            </div>

                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveField(selectedField.id)}
                                className="w-full h-8 text-xs gap-2"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove Field
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="mt-auto space-y-3 pt-6 border-t border-border/50">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="w-full justify-start gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Prev Step
                    </Button>
                    <Button
                        onClick={onNext}
                        className="w-full justify-between gap-2"
                    >
                        <span className="flex items-center gap-2">
                            Review & Send
                        </span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Main Editor - PDF Viewer */}
            <div className="flex-grow flex flex-col gap-4 order-1 xl:order-2">
                <div className="bg-card border border-border rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={pageNumber <= 1}
                            onClick={() => setPageNumber((p) => p - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="px-3 py-1 bg-muted rounded-md border text-[13px] font-medium min-w-[100px] text-center">
                            Page {pageNumber} / {numPages}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={pageNumber >= numPages}
                            onClick={() => setPageNumber((p) => p + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                            <MousePointer2 className="h-3 w-3" />
                            Drag and drop fields to position
                        </div>
                    </div>
                </div>

                <div
                    ref={containerRef}
                    className="relative bg-muted/30 rounded-2xl overflow-auto p-4 md:p-12 shadow-inner border border-border min-h-[700px] flex justify-center"
                >
                    <div
                        ref={pageRef}
                        className="relative shadow-2xl bg-card h-fit border border-border/50"
                    >
                        <canvas ref={canvasRef} className="max-w-full h-auto" />

                        {fields
                            .filter((f) => f.page_number === pageNumber)
                            .map((field) => (
                                <DraggableField
                                    key={field.id}
                                    field={field}
                                    workflow={workflow}
                                    pageRef={pageRef}
                                    canvasRef={canvasRef}
                                    selectedField={selectedField}
                                    setSelectedField={setSelectedField}
                                    handleFieldMove={handleFieldMove}
                                    getFieldStyle={getFieldStyle}
                                    fieldTypes={fieldTypes}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
