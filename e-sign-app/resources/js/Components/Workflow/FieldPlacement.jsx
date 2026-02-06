import { useState, useEffect, useRef, useCallback } from "react";
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
} from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import axios from "axios";
import clsx from "clsx";
import { motion } from "framer-motion";

// Set worker path
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function FieldPlacement({ document, workflow, onNext, onBack }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [fields, setFields] = useState(workflow.fields || []);
    const [selectedField, setSelectedField] = useState(null);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const pageRef = useRef(null);
    const canvasRef = useRef(null);
    const pdfRef = useRef(null);
    const [scale, setScale] = useState(1.5);

    console.log("selectedField", selectedField);

    const fieldTypes = [
        {
            id: "signature",
            name: "Signature",
            icon: Signature,
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            id: "initial",
            name: "Initial",
            icon: Type,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
        },
        {
            id: "date",
            name: "Date",
            icon: Calendar,
            color: "text-green-500",
            bg: "bg-green-50",
        },
        {
            id: "text",
            name: "Text Input",
            icon: StickyNote,
            color: "text-orange-500",
            bg: "bg-orange-50",
        },
    ];

    // Load PDF
    useEffect(() => {
        const loadPdf = async () => {
            try {
                const url = `/documents/${document.id}/download`; // Use download URL
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
        // Find first signer or owner
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
            x_position: 10.0, // Default 10%
            y_position: 10.0, // Default 10%
            width: 15.0, // Default 15%
            height: 5.0, // Default 5%
            field_type: type,
            is_required: true,
        };

        try {
            const response = await axios.post(
                `/api/workflows/${workflow.id}/fields`,
                newFieldData,
            );
            const newField = response.data;

            // Update fields array with the new field
            const updatedFields = [...fields, newField];
            setFields(updatedFields);

            // Force a small delay to ensure the state is updated before selecting the field
            setTimeout(() => {
                setSelectedField(newField);
            }, 50);
        } catch (error) {
            console.error("Failed to add field", error);
            if (error.response?.status === 422) {
                alert(
                    "Validation Error: " +
                        JSON.stringify(error.response.data.errors),
                );
            }
        }
    };

    const handleRemoveField = async (fieldId) => {
        try {
            await axios.delete(
                `/api/workflows/${workflow.id}/fields/${fieldId}`,
            );
            setFields(fields.filter((f) => f.id !== fieldId));
            setSelectedField(null);
        } catch (error) {
            console.error("Failed to remove field", error);
        }
    };

    const handleFieldMove = async (fieldId, x, y) => {
        console.log("fieldId ", fieldId);
        console.log("x ", x);
        console.log("y ", y);
        try {
            // Ensure x and y are properly formatted as numbers with 2 decimal places
            // to match the database precision (decimal(5, 2))
            const xPos = parseFloat(x.toFixed(2));
            const yPos = parseFloat(y.toFixed(2));

            const response = await axios.patch(
                `/api/workflows/${workflow.id}/fields/${fieldId}`,
                {
                    x_position: xPos,
                    y_position: yPos,
                },
            );

            // Update the fields array with the updated field from the response
            // This ensures all field properties are preserved
            // setFields(
            //     fields.map((f) =>
            //         f.id === fieldId ? { ...f, ...response.data } : f,
            //     ),
            // );

            // // Also update the selected field if it's the one being moved
            // if (selectedField && selectedField.id === fieldId) {
            //     setSelectedField({ ...selectedField, ...response.data });
            // }
        } catch (error) {
            console.error("Failed to move field", error);
        }
    };

    // Calculate absolute styles for fields
    const getFieldStyle = (field) => {
        if (!canvasRef.current) return {};
        const { width, height } = canvasRef.current;
        return {
            left: `${field.x_position}%`,
            top: `${field.y_position}%`,
            width: `${field.width}%`,
            height: `${field.height}%`,
            position: "absolute",
            zIndex: 10,
        };
    };

    if (loading)
        return (
            <div className="flex items-center justify-center p-20">
                Loading PDF...
            </div>
        );

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Tools & Properties */}
            <div className="w-full lg:w-80 flex flex-col gap-6 order-2 lg:order-1">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Plus className="h-4 w-4 text-indigo-600" />
                        Add Fields
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        {fieldTypes.map((t) => {
                            const Icon = t.icon;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => handleAddField(t.id)}
                                    className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors gap-2 group"
                                >
                                    <div
                                        className={clsx("p-2 rounded-lg", t.bg)}
                                    >
                                        <Icon
                                            className={clsx("h-5 w-5", t.color)}
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">
                                        {t.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {selectedField && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                <Settings className="h-4 w-4 text-indigo-600" />
                                Field Properties
                            </h4>
                            <button
                                onClick={() => setSelectedField(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Assigned To
                                </label>
                                <select
                                    className="block w-full text-sm border-gray-200 rounded-lg focus:ring-indigo-500"
                                    value={selectedField.signer_id}
                                    onChange={async (e) => {
                                        const newSignerId = e.target.value;
                                        try {
                                            const response = await axios.patch(
                                                `/api/workflows/${workflow.id}/fields/${selectedField.id}`,
                                                {
                                                    signer_id: newSignerId,
                                                },
                                            );

                                            // Update fields array with the updated field
                                            // Merge existing field data with the response to preserve all properties
                                            const updatedFields = fields.map(
                                                (f) =>
                                                    f.id === selectedField.id
                                                        ? {
                                                              ...f,
                                                              ...response.data,
                                                          }
                                                        : f,
                                            );
                                            setFields(updatedFields);

                                            // Update selected field with the response data
                                            // Merge to preserve all existing properties
                                            setSelectedField({
                                                ...selectedField,
                                                ...response.data,
                                            });
                                        } catch (error) {
                                            console.error(
                                                "Failed to update field signer:",
                                                error,
                                            );
                                            if (
                                                error.response?.status === 422
                                            ) {
                                                const errorMessages =
                                                    Object.values(
                                                        error.response.data
                                                            .errors,
                                                    ).flat();
                                                alert(
                                                    "Validation Error: " +
                                                        errorMessages.join(
                                                            ", ",
                                                        ),
                                                );
                                            }
                                        }
                                    }}
                                >
                                    {workflow.signers?.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} ({s.email})
                                        </option>
                                    ))}
                                    {workflow.mode === "direct" && (
                                        <option value="0">Self-Sign</option>
                                    )}
                                </select>
                            </div>

                            <button
                                onClick={() =>
                                    handleRemoveField(selectedField.id)
                                }
                                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Field
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex-grow md:block hidden" />

                <div className="space-y-3">
                    <SecondaryButton
                        onClick={onBack}
                        className="w-full justify-center gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={onNext}
                        className="w-full justify-center gap-2"
                    >
                        Review & Send
                        <ChevronRight className="h-4 w-4" />
                    </PrimaryButton>
                </div>
            </div>

            {/* Main Editor - PDF Viewer */}
            <div className="flex-grow flex flex-col gap-4 order-1 lg:order-2">
                {/* Page Controls */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                        <button
                            disabled={pageNumber <= 1}
                            onClick={() => setPageNumber((p) => p - 1)}
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                            Page {pageNumber} of {numPages}
                        </span>
                        <button
                            disabled={pageNumber >= numPages}
                            onClick={() => setPageNumber((p) => p + 1)}
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400 italic">
                            Drag fields to move them (Not implemented yet - tap
                            fields for properties)
                        </span>
                    </div>
                </div>

                {/* PDF Container */}
                <div
                    ref={containerRef}
                    className="relative bg-gray-200 rounded-2xl overflow-auto p-8 shadow-inner border border-gray-300 min-h-[600px] flex justify-center"
                >
                    <div
                        ref={pageRef}
                        className="relative shadow-2xl bg-white h-fit"
                    >
                        <canvas ref={canvasRef} className="max-w-full h-auto" />

                        {/* Fields Overlay */}
                        {fields
                            .filter((f) => f.page_number === pageNumber)
                            .map((field) => {
                                const type = fieldTypes.find(
                                    (t) => t.id === field.field_type,
                                );
                                const signer = workflow.signers?.find(
                                    (s) => s.id === field.signer_id,
                                );
                                return (
                                    <motion.div
                                        key={field.id}
                                        drag
                                        dragMomentum={false}
                                        dragElastic={0}
                                        dragConstraints={pageRef}
                                        onDragEnd={(e, info) => {
                                            if (
                                                !pageRef.current ||
                                                !canvasRef.current
                                            )
                                                return;

                                            const pageRect =
                                                pageRef.current.getBoundingClientRect();
                                            const canvasRect =
                                                canvasRef.current.getBoundingClientRect();

                                            // Get the final position of the dragged element
                                            const elementRect =
                                                e.target.getBoundingClientRect();

                                            // Calculate the absolute position relative to the canvas
                                            const relativeX =
                                                elementRect.left -
                                                canvasRect.left;
                                            const relativeY =
                                                elementRect.top -
                                                canvasRect.top;

                                            // Convert to percentage of the canvas
                                            let newX =
                                                (relativeX / canvasRect.width) *
                                                100;
                                            let newY =
                                                (relativeY /
                                                    canvasRect.height) *
                                                100;

                                            // Round to 2 decimal places to match database precision
                                            newX = Math.round(newX * 100) / 100;
                                            newY = Math.round(newY * 100) / 100;

                                            handleFieldMove(
                                                field.id,
                                                Math.max(
                                                    0,
                                                    Math.min(
                                                        100 - field.width,
                                                        newX,
                                                    ),
                                                ),
                                                Math.max(
                                                    0,
                                                    Math.min(
                                                        100 - field.height,
                                                        newY,
                                                    ),
                                                ),
                                            );
                                        }}
                                        onClick={() => setSelectedField(field)}
                                        style={{
                                            ...getFieldStyle(field),
                                            x: 0,
                                            y: 0,
                                        }}
                                        className={clsx(
                                            "rounded border-2 flex flex-col items-center justify-center p-1 cursor-move transition-colors",
                                            selectedField?.id === field.id
                                                ? "border-indigo-600 bg-indigo-100/50 shadow-lg"
                                                : "border-gray-400 bg-white/80",
                                        )}
                                    >
                                        <div className="flex items-center gap-1">
                                            {type && (
                                                <type.icon
                                                    className={clsx(
                                                        "h-3 w-3",
                                                        type.color,
                                                    )}
                                                />
                                            )}
                                            <span className="text-[10px] font-bold uppercase tracking-tighter truncate leading-none">
                                                {field.field_type}
                                            </span>
                                        </div>
                                        <span className="text-[8px] text-gray-600 truncate max-w-full text-center font-medium mt-0.5">
                                            {signer
                                                ? signer.name
                                                : "Unassigned"}
                                        </span>
                                    </motion.div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}
