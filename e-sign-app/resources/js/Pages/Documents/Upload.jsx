import React, { useState, useCallback } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/Components/ui/button";
import { 
    Select, 
    SelectContent, 
    SelectGroup, 
    SelectItem, 
    SelectLabel, 
    SelectTrigger, 
    SelectValue 
} from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Upload as UploadIcon, X, CheckCircle2, AlertCircle, FileText, Loader2 } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

export default function Upload({ auth, folders, selectedFolderId }) {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState({});
    const [selectedFolder, setSelectedFolder] = useState(
        selectedFolderId?.toString() || ""
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
        maxFiles: 10,
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
                await axios.post(
                    "/documents",
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
        if (files.every((f) => f.status === "completed" || f.status === "pending")) {
            const redirectParams = selectedFolder ? { folder_id: selectedFolder } : {};
            router.visit(route("documents.index", redirectParams));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-bold text-2xl text-foreground tracking-tight">
                    Upload Documents
                </h2>
            }
        >
            <Head title="Upload" />

            <div className="py-12 bg-muted/30 min-h-[calc(100vh-64px)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                        <CardHeader className="bg-card p-8 pb-4">
                            <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                                <UploadIcon className="h-5 w-5 text-primary" />
                                Add Files
                            </CardTitle>
                            <CardDescription>
                                Securely upload your documents to start the signing workflow.
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="p-8 pt-4">
                            <div
                                {...getRootProps()}
                                className={cn(
                                    "border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 relative group",
                                    isDragActive
                                        ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                                        : "border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/30"
                                )}
                            >
                                <input {...getInputProps()} />
                                <div className="space-y-4">
                                    <div className="mx-auto h-16 w-16 flex-shrink-0 bg-primary/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <UploadIcon className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-base font-bold text-foreground">
                                            Click to upload <span className="text-muted-foreground font-normal">or drag and drop</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            PDF, DOCX, PNG, JPG up to 25MB (Max 10 files)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Folder Selection */}
                            {folders && folders.length > 0 && (
                                <div className="mt-8 p-6 bg-muted/50 rounded-2xl border border-border/50">
                                    <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">
                                        Destination Folder
                                    </label>
                                    <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                                        <SelectTrigger className="w-full h-11 bg-card border-border shadow-sm rounded-xl">
                                            <SelectValue placeholder="Select a folder" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">No Folder</SelectItem>
                                            {folders.map((folder) => (
                                                <SelectGroup key={folder.id}>
                                                    <SelectLabel className="font-bold text-primary">{folder.name}</SelectLabel>
                                                    <SelectItem value={folder.id.toString()}>
                                                        {folder.name}
                                                    </SelectItem>
                                                    {folder.children?.map((sub) => (
                                                        <SelectItem key={sub.id} value={sub.id.toString()} className="pl-6 text-sm">
                                                            {sub.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {files.length > 0 && (
                                <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <h3 className="font-black uppercase tracking-widest text-xs text-muted-foreground">
                                            Upload Queue ({files.length}/10)
                                        </h3>
                                        {uploading && (
                                            <Badge variant="outline" className="animate-pulse gap-2">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Processing
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {files.map((file) => (
                                            <div
                                                key={file.id}
                                                className="group bg-card p-4 rounded-2xl border border-border flex items-center justify-between hover:shadow-md transition-all duration-200"
                                            >
                                                <div className="flex items-center space-x-4 min-w-0">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-primary/5 rounded-xl flex items-center justify-center">
                                                        <FileText className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-foreground truncate">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground font-semibold">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-4">
                                                    {progress[file.id] !== undefined && file.status !== "completed" && (
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-24 bg-muted rounded-full h-1.5 overflow-hidden">
                                                                <div
                                                                    className="bg-primary h-full transition-all duration-500"
                                                                    style={{ width: `${progress[file.id]}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-[10px] font-bold tabular-nums">{progress[file.id]}%</span>
                                                        </div>
                                                    )}
                                                    
                                                    {file.status === "completed" ? (
                                                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 gap-1 px-2 py-0.5">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            Done
                                                        </Badge>
                                                    ) : file.status === "error" ? (
                                                        <Badge variant="destructive" className="gap-1 px-2 py-0.5" title={file.error}>
                                                            <AlertCircle className="h-3 w-3" />
                                                            Error
                                                        </Badge>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeFile(file.id)}
                                                            className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5"
                                                            disabled={uploading}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border mt-8">
                                        <Button
                                            variant="outline"
                                            className="h-11 px-8 rounded-xl"
                                            onClick={() => router.visit(route("documents.index", selectedFolder ? { folder_id: selectedFolder } : {}))}
                                            disabled={uploading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="h-11 px-10 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
                                            onClick={uploadFiles}
                                            disabled={uploading || files.length === 0 || files.length > 10}
                                        >
                                            {uploading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <UploadIcon className="h-4 w-4" />
                                                    Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
);
}
