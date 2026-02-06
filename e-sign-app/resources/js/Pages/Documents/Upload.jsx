import React, { useState, useCallback } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useDropzone } from "react-dropzone";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import axios from "axios";

export default function Upload({ auth, folders, selectedFolderId }) {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState({});
    const [selectedFolder, setSelectedFolder] = useState(
        selectedFolderId || "",
    );

    const onDrop = useCallback((acceptedFiles) => {
        setFiles((prev) => [
            ...prev,
            ...acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                    status: "pending",
                    id: Math.random().toString(36).substring(7),
                }),
            ),
        ]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
        },
        maxSize: 25 * 1024 * 1024, // 25MB
    });

    const removeFile = (id) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const uploadFiles = async () => {
        setUploading(true);

        for (const file of files) {
            if (file.status === "completed") continue;

            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", file.name || "Untitled Document");

            if (selectedFolder) {
                formData.append("folder_id", selectedFolder);
            }

            try {
                const response = await axios.post(
                    "/api/documents/upload",
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                        onUploadProgress: (progressEvent) => {
                            const percent = Math.round(
                                (progressEvent.loaded * 100) /
                                    progressEvent.total,
                            );
                            setProgress((prev) => ({
                                ...prev,
                                [file.id]: percent,
                            }));
                        },
                    },
                );

                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === file.id ? { ...f, status: "completed" } : f,
                    ),
                );
            } catch (error) {
                console.error("Upload failed", error);
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === file.id
                            ? {
                                  ...f,
                                  status: "error",
                                  error:
                                      error.response?.data?.message ||
                                      "Upload failed",
                              }
                            : f,
                    ),
                );
            }
        }

        setUploading(false);
        // If all successful, redirect to list
        if (
            files.every(
                (f) => f.status === "completed" || f.status === "pending",
            )
        ) {
            const redirectParams = selectedFolder
                ? { folder_id: selectedFolder }
                : {};
            router.visit(route("documents.index", redirectParams));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Upload Documents
                </h2>
            }
        >
            <Head title="Upload" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                                isDragActive
                                    ? "border-indigo-400 bg-indigo-50"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                            <input {...getInputProps()} />
                            <div className="space-y-2">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="text-gray-600">
                                    <span className="font-medium text-indigo-600">
                                        Click to upload
                                    </span>{" "}
                                    or drag and drop
                                </div>
                                <p className="text-xs text-gray-500">
                                    PDF, DOCX, PNG, JPG up to 25MB (Max 10
                                    files)
                                </p>
                            </div>
                        </div>

                        {/* Folder Selection */}
                        {folders && folders.length > 0 && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Folder (Optional)
                                </label>
                                <select
                                    value={selectedFolder}
                                    onChange={(e) =>
                                        setSelectedFolder(e.target.value)
                                    }
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">No Folder</option>
                                    {folders.map((folder) => (
                                        <optgroup
                                            key={folder.id}
                                            label={folder.name}
                                        >
                                            <option value={folder.id}>
                                                {folder.name}
                                            </option>
                                            {folder.children?.map((sub) => (
                                                <option
                                                    key={sub.id}
                                                    value={sub.id}
                                                >
                                                    &nbsp;&nbsp;{sub.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>
                        )}

                        {files.length > 0 && (
                            <div className="mt-8 space-y-4">
                                <h3 className="font-medium text-gray-900">
                                    Upload Queue ({files.length}/10)
                                </h3>
                                <div className="divide-y divide-gray-100">
                                    {files.map((file) => (
                                        <div
                                            key={file.id}
                                            className="py-3 flex items-center justify-between"
                                        >
                                            <div className="flex items-center space-x-3 truncate">
                                                <div className="p-2 bg-gray-50 rounded">
                                                    <span className="text-xs font-bold uppercase text-gray-500">
                                                        {file.name
                                                            ? file.name
                                                                  .split(".")
                                                                  .pop()
                                                            : "FILE"}
                                                    </span>
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {file.name ||
                                                            "Unknown file"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {(
                                                            file.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{" "}
                                                        MB
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                {progress[file.id] !==
                                                    undefined && (
                                                    <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            suppressHydrationWarning
                                                            className="bg-indigo-600 h-1.5 rounded-full"
                                                            style={{
                                                                width: `${progress[file.id]}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                )}
                                                {file.status === "completed" ? (
                                                    <span className="text-green-600 text-xs font-semibold">
                                                        Done
                                                    </span>
                                                ) : file.status === "error" ? (
                                                    <span
                                                        className="text-red-600 text-xs font-semibold"
                                                        title={file.error}
                                                    >
                                                        Error
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            removeFile(file.id)
                                                        }
                                                        className="text-gray-400 hover:text-red-600"
                                                        disabled={uploading}
                                                    >
                                                        <svg
                                                            className="h-5 w-5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end space-x-3 pt-4 border-t">
                                    <SecondaryButton
                                        onClick={() => {
                                            const redirectParams =
                                                selectedFolder
                                                    ? {
                                                          folder_id:
                                                              selectedFolder,
                                                      }
                                                    : {};
                                            router.visit(
                                                route(
                                                    "documents.index",
                                                    redirectParams,
                                                ),
                                            );
                                        }}
                                        disabled={uploading}
                                    >
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton
                                        onClick={uploadFiles}
                                        disabled={
                                            uploading ||
                                            files.length === 0 ||
                                            files.length > 10
                                        }
                                    >
                                        {uploading
                                            ? "Uploading..."
                                            : "Upload Files"}
                                    </PrimaryButton>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
