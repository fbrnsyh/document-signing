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
}) {
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
        if (field.status === "completed") return;
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl text-center border border-gray-100">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="h-10 w-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Document Rejected
                    </h1>
                    <p className="text-gray-500 mb-8">
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
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl text-center border border-gray-100">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Signing Complete!
                    </h1>
                    <p className="text-gray-500 mb-8">
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
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
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
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl text-center border border-gray-100">
                    <div
                        className={`w-20 h-20 ${isSequentialError ? "bg-yellow-50" : "bg-red-50"} rounded-full flex items-center justify-center mx-auto mb-6`}
                    >
                        <XCircle
                            className={`h-10 w-10 ${isSequentialError ? "text-yellow-500" : "text-red-500"}`}
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {isCancelled
                            ? "Signing Request Cancelled"
                            : isSequentialError
                              ? "Sequential Signing"
                              : "Document Loading Error"}
                    </h1>
                    <p className="text-gray-500 mb-8">
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
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <Head title={`Sign - ${initialWorkflow.document.title}`} />

            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900 leading-none">
                            {initialWorkflow.document.title}
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">
                            Requested by{" "}
                            {initialWorkflow.document.uploader?.name ||
                                "System"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 mr-6 text-sm">
                        <span className="text-gray-400">Progress:</span>
                        <span className="font-bold text-indigo-600">
                            {
                                fields.filter((f) => f.status === "completed")
                                    .length
                            }{" "}
                            / {fields.length}
                        </span>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-600 transition-all duration-500"
                                style={{
                                    width: `${(fields.filter((f) => f.status === "completed").length / fields.length) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    <SecondaryButton
                        onClick={() => setIsRejectModalOpen(true)}
                        className="text-red-600 hover:bg-red-50 border-gray-200"
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
                </div>
            </header>

            <main className="flex-grow flex flex-col md:flex-row h-[calc(100vh-73px)]">
                {/* PDF Viewer Container */}
                <div className="flex-grow bg-slate-200 overflow-auto p-4 md:p-8 flex justify-center custom-scrollbar">
                    <div className="relative shadow-2xl bg-white h-fit">
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
                                                ? "border-green-500 bg-green-50/50 cursor-default"
                                                : "border-indigo-400 bg-indigo-50/80 hover:bg-indigo-100 hover:border-indigo-600 cursor-pointer shadow-sm hover:shadow-md animate-pulse hover:animate-none",
                                        )}
                                    >
                                        {isCompleted ? (
                                            <div className="flex flex-col items-center opacity-70 scale-90">
                                                <CheckCircle2 className="h-4 w-4 text-green-600 mb-0.5" />
                                                <span className="text-[8px] font-bold text-green-700 uppercase tracking-tighter">
                                                    Signed
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Signature className="h-4 w-4 text-indigo-600 mb-0.5 group-hover:scale-110 transition-transform" />
                                                <span className="text-[8px] font-extrabold text-indigo-700 uppercase tracking-tighter text-center">
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
                <aside className="w-full md:w-72 bg-white border-l border-gray-200 p-6 flex flex-col shrink-0 overflow-y-auto">
                    <div className="mb-8">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                            Navigation
                        </h3>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4">
                            <button
                                disabled={pageNumber <= 1}
                                onClick={() => setPageNumber((p) => p - 1)}
                                className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <span className="text-sm font-bold text-gray-700">
                                Page {pageNumber} / {numPages}
                            </span>
                            <button
                                disabled={pageNumber >= numPages}
                                onClick={() => setPageNumber((p) => p + 1)}
                                className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
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
                                            ? "bg-green-50 border-green-100 text-green-700"
                                            : "bg-white border-gray-100 text-gray-600 hover:border-indigo-200",
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {f.status === "completed" ? (
                                            <CheckCircle2 className="h-4 w-4" />
                                        ) : (
                                            <div className="h-4 w-4 rounded-full border-2 border-indigo-200 group-hover:border-indigo-400" />
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

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider">
                                Secure Signing
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-tight">
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
