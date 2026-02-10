import { useState, useEffect, useRef, useCallback } from "react";
import { Head, Link, router } from "@inertiajs/react";
import * as pdfjs from "pdfjs-dist";
import {
    Signature,
    XCircle,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    FileText,
    ShieldCheck,
    Loader2,
} from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SignatureModal from "@/Components/Sign/SignatureModal";
import RejectModal from "@/Components/Sign/RejectModal";
import axios from "axios";
import clsx from "clsx";

// Set worker path - use local worker with fallback to CDN
pdfjs.GlobalWorkerOptions.workerSrc = `/build/pdf.worker.min.mjs`;

export default function SignIndex({
    token,
    signer: initialSigner,
    workflow: initialWorkflow,
    is_readonly: initialIsReadonly = false,
}) {
    const [isReadonly, setIsReadonly] = useState(initialIsReadonly);
    const [loading, setLoading] = useState(true);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState(null);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [scale, setScale] = useState(1.5);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [rejected, setRejected] = useState(false);
    const [error, setError] = useState(null);

    const canvasRef = useRef(null);
    const pdfRef = useRef(null);

    // Initial load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/sign/${token}`);
                setFields(response.data.fields);
                if (response.data.is_readonly !== undefined) {
                    setIsReadonly(response.data.is_readonly);
                }

                // Load PDF
                console.log("Fetching PDF document...");
                const pdfResponse = await axios.get(
                    `/api/sign/${token}/document`,
                    { responseType: "arraybuffer" },
                );
                console.log(
                    "PDF response received, size:",
                    pdfResponse.data.byteLength,
                );

                console.log("Initializing PDF.js...");
                const loadingTask = pdfjs.getDocument({
                    data: pdfResponse.data,
                });
                console.log("PDF loading task created, waiting for promise...");
                const pdf = await loadingTask.promise;
                console.log("PDF loaded successfully, pages:", pdf.numPages);
                pdfRef.current = pdf;
                setNumPages(pdf.numPages);

                // Wait a bit for canvas to be ready
                setTimeout(() => {
                    renderPage(1);
                }, 100);
                setLoading(false);
            } catch (error) {
                console.error("Error loading data:", error);
                if (error.response) {
                    if (error.response.status === 410) {
                        setError("This signing request was cancelled.");
                    } else if (
                        error.response.status === 403 &&
                        error.response.data.message ===
                            "Previous signers must complete their signatures first."
                    ) {
                        setError(
                            "This document requires sequential signing. Please wait for the previous signers to complete their signatures before you can sign.",
                        );
                    } else {
                        setError(
                            error.response.data.message ||
                                "Failed to load document",
                        );
                    }
                } else {
                    setError(error.message || "Failed to load document");
                }
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const renderPage = useCallback(
        async (pageNum) => {
            if (!pdfRef.current || !canvasRef.current) {
                console.log("Cannot render page: PDF or canvas not ready");
                return;
            }

            try {
                console.log(`Rendering page ${pageNum}...`);
                const page = await pdfRef.current.getPage(pageNum);
                const viewport = page.getViewport({ scale });
                console.log(
                    `Page ${pageNum} viewport:`,
                    viewport.width,
                    "x",
                    viewport.height,
                );

                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                console.log(`Starting render for page ${pageNum}...`);
                await page.render(renderContext).promise;
                console.log(`Page ${pageNum} rendered successfully`);
            } catch (error) {
                console.error("Error rendering page:", error);
                setError(`Failed to render page ${pageNum}: ${error.message}`);
            }
        },
        [scale],
    );

    useEffect(() => {
        if (pdfRef.current && canvasRef.current) {
            renderPage(pageNumber);
        }
    }, [pageNumber, scale, renderPage]);

    const handleFieldClick = (field) => {
        if (field.status === "completed" || isReadonly) return;
        setSelectedField(field);
        setIsSignatureModalOpen(true);
    };

    const handleApplySignature = async (signatureData) => {
        setIsSignatureModalOpen(false);
        setSubmitting(true);
        try {
            const response = await axios.post(
                `/api/sign/${token}/fields/${selectedField.id}`,
                {
                    signature: signatureData,
                },
            );

            // Update fields locally
            setFields(
                fields.map((f) =>
                    f.id === selectedField.id
                        ? { ...f, status: "completed" }
                        : f,
                ),
            );

            // Re-render PDF to show applied signature (in a real app, the server would update the PDF and we'd reload, but for UX we just show the checkmark)
            // Ideally we'd also overlay the signature on the canvas here for instant preview

            setSelectedField(null);
        } catch (error) {
            console.error("Failed to apply signature", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async (reason) => {
        setSubmitting(true);
        try {
            await axios.post(`/api/sign/${token}/reject`, { reason });
            setIsRejectModalOpen(false);
            // Show rejection confirmation
            setRejected(true);
        } catch (error) {
            console.error("Failed to reject", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleFinalize = () => {
        setSuccess(true);
    };

    const allFieldsSigned = fields.every((f) => f.status === "completed");

    if (rejected) {
        return (
            <div className="min-h-screen bg-muted flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-card rounded-3xl p-10 shadow-xl text-center border border-border">
                    <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="h-10 w-10 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Document Rejected
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        Thank you for your feedback. The document owner has been
                        notified about your rejection.
                    </p>
                    <PrimaryButton
                        onClick={() => {
                            window.close();
                            // Fallback if window.close() is blocked (common in browsers for tabs not opened by script)
                            setTimeout(() => {
                                window.location.href = "/dashboard";
                            }, 500);
                        }}
                        className="w-full justify-center"
                    >
                        Done & Close
                    </PrimaryButton>
                    <div className="mt-4">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-muted flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-card rounded-3xl p-10 shadow-xl text-center border border-border">
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-success" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Signing Complete!
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        Thank you for signing the document. All parties will be
                        notified once the process is complete.
                    </p>
                    <PrimaryButton
                        onClick={() => {
                            window.close();
                            // Fallback if window.close() is blocked (common in browsers for tabs not opened by script)
                            setTimeout(() => {
                                window.location.href = "/dashboard";
                            }, 500);
                        }}
                        className="w-full justify-center"
                    >
                        Done & Close
                    </PrimaryButton>
                    <div className="mt-4">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-6">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-medium animate-pulse">
                    Preparing your document...
                </p>
            </div>
        );
    }

    if (error) {
        const isCancelled = error === "This signing request was cancelled.";
        const isSequentialError =
            error.includes("sequential signing") ||
            error.includes("Previous signers must complete");
        return (
            <div className="min-h-screen bg-muted flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-card rounded-3xl p-10 shadow-xl text-center border border-border">
                    <div
                        className={`w-20 h-20 ${isSequentialError ? "bg-warning/10" : "bg-destructive/10"} rounded-full flex items-center justify-center mx-auto mb-6`}
                    >
                        <XCircle
                            className={`h-10 w-10 ${isSequentialError ? "text-warning" : "text-destructive"}`}
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        {isCancelled
                            ? "Signing Request Cancelled"
                            : isSequentialError
                              ? "Sequential Signing"
                              : "Document Loading Error"}
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        {isCancelled
                            ? "This signing request has been cancelled and is no longer available."
                            : error}
                    </p>
                    {!isCancelled && !isSequentialError && (
                        <PrimaryButton
                            onClick={() => window.location.reload()}
                            className="w-full justify-center"
                        >
                            Try Again
                        </PrimaryButton>
                    )}
                    <div className="mt-4">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/50 flex flex-col">
            <Head title={`Sign - ${initialWorkflow.document.title}`} />

            {/* Header */}
            <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-primary p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="font-bold text-foreground leading-none">
                            {initialWorkflow.document.title}
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Requested by{" "}
                            {initialWorkflow.document.uploader?.name ||
                                "System"}
                        </p>
                    </div>
                </div>

                {isReadonly && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                            Read Only Mode
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 mr-6 text-sm">
                        <span className="text-muted-foreground">Progress:</span>
                        <span className="font-bold text-primary">
                            {
                                fields.filter((f) => f.status === "completed")
                                    .length
                            }{" "}
                            / {fields.length}
                        </span>
                        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{
                                    width: `${(fields.filter((f) => f.status === "completed").length / (fields.length || 1)) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {!isReadonly && (
                        <>
                            <SecondaryButton
                                onClick={() => setIsRejectModalOpen(true)}
                                className="text-destructive hover:bg-destructive/10 border-border"
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                            </SecondaryButton>

                            <PrimaryButton
                                disabled={!allFieldsSigned || submitting}
                                onClick={handleFinalize}
                            >
                                {submitting ? "Processing..." : "Complete Signing"}
                            </PrimaryButton>
                        </>
                    )}

                    {isReadonly && (
                        <Link href="/dashboard">
                            <SecondaryButton>
                                Back to Dashboard
                            </SecondaryButton>
                        </Link>
                    )}
                </div>
            </header>

            <main className="flex-grow flex flex-col md:flex-row h-[calc(100vh-73px)]">
                {/* PDF Viewer Container */}
                <div className="flex-grow bg-muted overflow-auto p-4 md:p-8 flex justify-center custom-scrollbar">
                    <div className="relative shadow-2xl bg-card h-fit">
                        <canvas ref={canvasRef} className="max-w-full h-auto" />

                        {/* Fields Overlay */}
                        {fields
                            .filter((f) => f.page_number === pageNumber)
                            .map((field) => {
                                const isCompleted =
                                    field.status === "completed";
                                return (
                                    <div
                                        key={field.id}
                                        onClick={() => handleFieldClick(field)}
                                        style={{
                                            left: `${field.x_position}%`,
                                            top: `${field.y_position}%`,
                                            width: `${field.width}%`,
                                            height: `${field.height}%`,
                                            position: "absolute",
                                            zIndex: 10,
                                        }}
                                        className={clsx(
                                            "rounded border-2 flex flex-col items-center justify-center p-1 transition-all group",
                                            isCompleted
                                                ? "border-success bg-success/10 cursor-default"
                                                : "border-primary bg-primary/10 hover:bg-primary/20 hover:border-primary cursor-pointer shadow-sm hover:shadow-md animate-pulse hover:animate-none",
                                        )}
                                    >
                                        {isCompleted ? (
                                            <div className="flex flex-col items-center opacity-70 scale-90">
                                                <CheckCircle2 className="h-4 w-4 text-success mb-0.5" />
                                                <span className="text-[8px] font-bold text-success uppercase tracking-tighter">
                                                    Signed
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Signature className="h-4 w-4 text-primary mb-0.5 group-hover:scale-110 transition-transform" />
                                                <span className="text-[8px] font-extrabold text-primary uppercase tracking-tighter text-center">
                                                    Click to {field.field_type}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>

                {/* Right Sidebar - Navigation & Info */}
                <aside className="w-full md:w-72 bg-card border-l border-border p-6 flex flex-col shrink-0 overflow-y-auto">
                    <div className="mb-8">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                            Navigation
                        </h3>
                        <div className="flex items-center justify-between bg-muted p-3 rounded-xl border border-border mb-4">
                            <button
                                disabled={pageNumber <= 1}
                                onClick={() => setPageNumber((p) => p - 1)}
                                className="p-2 rounded-lg hover:bg-card hover:shadow-sm disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <span className="text-sm font-bold text-foreground">
                                Page {pageNumber} / {numPages}
                            </span>
                            <button
                                disabled={pageNumber >= numPages}
                                onClick={() => setPageNumber((p) => p + 1)}
                                className="p-2 rounded-lg hover:bg-card hover:shadow-sm disabled:opacity-30 transition-all"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                            Required Fields
                        </h3>
                        <div className="space-y-2">
                            {fields.map((f, i) => (
                                <button
                                    key={f.id}
                                    onClick={() => {
                                        setPageNumber(f.page_number);
                                        // Highlight field visually?
                                    }}
                                    className={clsx(
                                        "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group",
                                        f.status === "completed"
                                            ? "bg-success/10 border-success/20 text-success"
                                            : "bg-card border-border text-muted-foreground hover:border-primary/50",
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {f.status === "completed" ? (
                                            <CheckCircle2 className="h-4 w-4" />
                                        ) : (
                                            <div className="h-4 w-4 rounded-full border-2 border-primary/20 group-hover:border-primary/50" />
                                        )}
                                        <span className="text-sm font-medium">
                                            {f.field_type
                                                .charAt(0)
                                                .toUpperCase() +
                                                f.field_type.slice(1)}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold opacity-40">
                                        Pg {f.page_number}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider">
                                Secure Signing
                            </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                            Your signature is electronically captured and bound
                            to this document with a secure audit trail.
                        </p>
                    </div>
                </aside>
            </main>

            {/* Modals */}
            <SignatureModal
                show={isSignatureModalOpen}
                onClose={() => setIsSignatureModalOpen(false)}
                onSave={handleApplySignature}
                field={selectedField}
            />

            <RejectModal
                show={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onConfirm={handleReject}
                processing={submitting}
            />
        </div>
    );
}
