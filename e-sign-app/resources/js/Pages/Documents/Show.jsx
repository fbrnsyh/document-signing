import React, { useState, useEffect, useRef, useCallback } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import ActivityTimeline from "@/Components/Audit/ActivityTimeline";
import AuditExport from "@/Components/Audit/AuditExport";
import * as pdfjs from "pdfjs-dist";
import { ChevronLeft, ChevronRight, Loader2, PenTool } from "lucide-react";

// Set worker path - use local worker with fallback to CDN
pdfjs.GlobalWorkerOptions.workerSrc = `/build/pdf.worker.min.mjs`;

export default function Show({ auth, document }) {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("details");
    const [signingToken, setSigningToken] = useState(null);
    const { data, setData, patch, processing, errors, reset } = useForm({
        title: document.title,
        tags: document.tags || [],
    });

    const [newTag, setNewTag] = useState("");

    // PDF viewer states
    const [pdfLoading, setPdfLoading] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.5);
    const [pdfError, setPdfError] = useState(null);

    const canvasRef = useRef(null);
    const pdfRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();
        patch(route("documents.update", document.id), {
            onSuccess: () => setIsEditing(false),
        });
    };

    const addTag = () => {
        if (!newTag.trim()) return;
        if (data.tags.length >= 10) {
            alert("Maximum 10 tags allowed");
            return;
        }
        if (!data.tags.includes(newTag.trim())) {
            setData("tags", [...data.tags, newTag.trim()]);
        }
        setNewTag("");
    };

    const removeTag = (tagToRemove) => {
        setData(
            "tags",
            data.tags.filter((t) => t !== tagToRemove),
        );
    };

    const handleArchive = () => {
        if (confirm("Are you sure you want to archive this document?")) {
            router.post(route("documents.archive", document.id));
        }
    };

    const handleRestore = () => {
        router.post(route("documents.restore", document.id));
    };

    const isOwner = auth.user.id === document.uploader_id;

    // Check if current user needs to sign this document
    const needsToSign = document.workflow?.signers?.some(
        (signer) =>
            (signer.user_id === auth.user.id ||
                signer.email === auth.user.email) &&
            signer.status === "pending",
    );

    // Generate signing token if user needs to sign
    useEffect(() => {
        if (needsToSign) {
            const signer = document.workflow?.signers?.find(
                (signer) =>
                    (signer.user_id === auth.user.id ||
                        signer.email === auth.user.email) &&
                    signer.status === "pending",
            );

            if (signer) {
                // Generate a simple token (in production, this should be done server-side)
                const token = btoa(
                    JSON.stringify({
                        signer_id: signer.id,
                        workflow_id: document.workflow.id,
                        expires_at: new Date(
                            Date.now() + 24 * 60 * 60 * 1000,
                        ).toISOString(),
                    }),
                );
                setSigningToken(token);
            }
        }
    }, [needsToSign, document.workflow, auth.user]);

    // Load PDF when switching to details tab
    useEffect(() => {
        if (activeTab === "details" && !pdfRef.current) {
            // Small delay to ensure canvas is mounted
            const timer = setTimeout(() => {
                loadPDF();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [activeTab]);

    const loadPDF = async () => {
        setPdfLoading(true);
        setPdfError(null);

        try {
            const response = await fetch(
                route("documents.download", document.id),
            );
            if (!response.ok) {
                throw new Error("Failed to fetch PDF");
            }
            const arrayBuffer = await response.arrayBuffer();

            const loadingTask = pdfjs.getDocument({
                data: arrayBuffer,
            });
            const pdf = await loadingTask.promise;
            pdfRef.current = pdf;
            setNumPages(pdf.numPages);

            // Wait a bit for canvas to be ready
            setTimeout(() => {
                renderPage(1);
            }, 100);
        } catch (error) {
            console.error("Error loading PDF:", error);
            setPdfError(error.message || "Failed to load document");
        } finally {
            setPdfLoading(false);
        }
    };

    const renderPage = useCallback(
        async (pageNum) => {
            if (!pdfRef.current || !canvasRef.current) {
                console.log("Cannot render page: PDF or canvas not ready");
                return;
            }

            try {
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
            } catch (error) {
                console.error("Error rendering page:", error);
                setPdfError(
                    `Failed to render page ${pageNum}: ${error.message}`,
                );
            }
        },
        [scale],
    );

    useEffect(() => {
        if (pdfRef.current && canvasRef.current) {
            renderPage(pageNumber);
        }
    }, [pageNumber, scale, renderPage]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Document Details
                    </h2>
                    <div className="flex space-x-2">
                        {needsToSign && signingToken && (
                            <Link href={route("sign.index", signingToken)}>
                                <PrimaryButton className="bg-orange-600 hover:bg-orange-700">
                                    <PenTool className="h-4 w-4 mr-2" />
                                    Sign Document
                                </PrimaryButton>
                            </Link>
                        )}
                        <a href={route("documents.download", document.id)}>
                            <SecondaryButton>Download</SecondaryButton>
                        </a>
                        {isOwner && !document.archived_at && (
                            <SecondaryButton onClick={handleArchive}>
                                Archive
                            </SecondaryButton>
                        )}
                        {isOwner && document.archived_at && (
                            <PrimaryButton onClick={handleRestore}>
                                Restore
                            </PrimaryButton>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`Document - ${document.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200">
                            <nav
                                className="-mb-px flex space-x-8 px-6"
                                aria-label="Tabs"
                            >
                                <button
                                    onClick={() => setActiveTab("details")}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === "details"
                                            ? "border-indigo-500 text-indigo-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    Document Details
                                </button>
                                <button
                                    onClick={() => setActiveTab("activity")}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === "activity"
                                            ? "border-indigo-500 text-indigo-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    Activity Timeline
                                </button>
                            </nav>
                        </div>

                        {activeTab === "details" && (
                            <>
                                <div className="p-6 text-gray-900">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1">
                                            {isEditing ? (
                                                <form
                                                    onSubmit={submit}
                                                    className="space-y-4 max-w-xl"
                                                >
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="title"
                                                            value="Title"
                                                        />
                                                        <TextInput
                                                            id="title"
                                                            type="text"
                                                            className="mt-1 block w-full"
                                                            value={data.title}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "title",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            required
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.title
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div>
                                                        <InputLabel value="Tags" />
                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                            {data.tags.map(
                                                                (tag) => (
                                                                    <span
                                                                        key={
                                                                            tag
                                                                        }
                                                                        className="inline-flex items-center px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-semibold"
                                                                    >
                                                                        {tag}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                removeTag(
                                                                                    tag,
                                                                                )
                                                                            }
                                                                            className="ml-1 text-indigo-500 hover:text-indigo-700"
                                                                        >
                                                                            &times;
                                                                        </button>
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <TextInput
                                                                type="text"
                                                                className="flex-1 text-sm"
                                                                value={newTag}
                                                                onChange={(e) =>
                                                                    setNewTag(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Add a tag..."
                                                                onKeyDown={(
                                                                    e,
                                                                ) =>
                                                                    e.key ===
                                                                        "Enter" &&
                                                                    (e.preventDefault(),
                                                                    addTag())
                                                                }
                                                            />
                                                            <SecondaryButton
                                                                type="button"
                                                                onClick={addTag}
                                                            >
                                                                Add
                                                            </SecondaryButton>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {data.tags.length}
                                                            /10 tags used
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center space-x-3">
                                                        <PrimaryButton
                                                            disabled={
                                                                processing
                                                            }
                                                        >
                                                            Save Changes
                                                        </PrimaryButton>
                                                        <SecondaryButton
                                                            onClick={() => {
                                                                setIsEditing(
                                                                    false,
                                                                );
                                                                reset();
                                                            }}
                                                        >
                                                            Cancel
                                                        </SecondaryButton>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                                        {document.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        {
                                                            document.original_filename
                                                        }
                                                    </p>

                                                    <div className="flex flex-wrap gap-2 mb-6">
                                                        {document.tags?.length >
                                                        0 ? (
                                                            document.tags.map(
                                                                (tag) => (
                                                                    <span
                                                                        key={
                                                                            tag
                                                                        }
                                                                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                                                                    >
                                                                        #{tag}
                                                                    </span>
                                                                ),
                                                            )
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">
                                                                No tags added
                                                            </span>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {isOwner && !isEditing && (
                                            <SecondaryButton
                                                onClick={() =>
                                                    setIsEditing(true)
                                                }
                                            >
                                                Edit Details
                                            </SecondaryButton>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                                Status
                                            </p>
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    document.status ===
                                                    "completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : document.status ===
                                                            "cancelled"
                                                          ? "bg-red-100 text-red-800"
                                                          : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {document.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                                Size
                                            </p>
                                            <p className="text-sm text-gray-900">
                                                {(
                                                    document.file_size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                                Uploaded On
                                            </p>
                                            <p className="text-sm text-gray-900">
                                                {new Date(
                                                    document.created_at,
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-gray-50">
                                    {pdfLoading ? (
                                        <div className="flex flex-col items-center justify-center h-96">
                                            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                                            <p className="text-gray-500 font-medium">
                                                Loading document...
                                            </p>
                                        </div>
                                    ) : pdfError ? (
                                        <div className="flex flex-col items-center justify-center h-96">
                                            <div className="text-center">
                                                <svg
                                                    className="mx-auto h-12 w-12 text-red-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1"
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                    />
                                                </svg>
                                                <p className="mt-2 text-sm text-red-500">
                                                    {pdfError}
                                                </p>
                                                <a
                                                    href={route(
                                                        "documents.download",
                                                        document.id,
                                                    )}
                                                    className="mt-4 inline-block text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                                >
                                                    Download to view document
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                                <button
                                                    disabled={pageNumber <= 1}
                                                    onClick={() =>
                                                        setPageNumber(
                                                            (p) => p - 1,
                                                        )
                                                    }
                                                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-all"
                                                >
                                                    <ChevronLeft className="h-5 w-5" />
                                                </button>
                                                <span className="text-sm font-medium text-gray-700">
                                                    Page {pageNumber} /{" "}
                                                    {numPages || 1}
                                                </span>
                                                <button
                                                    disabled={
                                                        pageNumber >=
                                                        (numPages || 1)
                                                    }
                                                    onClick={() =>
                                                        setPageNumber(
                                                            (p) => p + 1,
                                                        )
                                                    }
                                                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-all"
                                                >
                                                    <ChevronRight className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <div className="flex justify-center">
                                                <div className="relative shadow-lg bg-white">
                                                    <canvas
                                                        ref={canvasRef}
                                                        className="max-w-full h-auto"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === "activity" && (
                            <div className="p-6">
                                <div className="flex justify-end mb-4">
                                    <AuditExport documentId={document.id} />
                                </div>
                                <ActivityTimeline documentId={document.id} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
