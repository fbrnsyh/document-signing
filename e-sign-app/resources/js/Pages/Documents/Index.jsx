import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Search, Plus, Download, Settings, Eye, Archive, ArchiveRestore, FolderPlus, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Index({ auth, documents, folders, filters }) {
    const [search, setSearch] = React.useState(filters.search || "");
    const [isCreatingFolder, setIsCreatingFolder] = React.useState(false);
    const [newFolderName, setNewFolderName] = React.useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("documents.index"),
            { ...filters, search },
            { preserveState: true },
        );
    };

    const createFolder = () => {
        if (!newFolderName.trim()) return;
        router.post(
            route("folders.store"),
            { name: newFolderName },
            {
                onSuccess: () => {
                    setIsCreatingFolder(false);
                    setNewFolderName("");
                },
            },
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-foreground leading-tight">
                        My Documents
                    </h2>
                    <Link
                        href={route("documents.create", {
                            folder_id: filters.folder_id,
                        })}
                    >
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Document
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Documents" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sidebar */}
                        <div className="w-full md:w-64 flex-shrink-0">
                            <Card className="h-fit">
                                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-sm font-bold">Folders</CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setIsCreatingFolder(true)}
                                    >
                                        <FolderPlus className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    {isCreatingFolder && (
                                        <div className="mb-4 space-y-2">
                                            <Input
                                                value={newFolderName}
                                                onChange={(e) => setNewFolderName(e.target.value)}
                                                placeholder="Folder name"
                                                className="h-8 text-xs"
                                                autoFocus
                                                onKeyDown={(e) => e.key === "Enter" && createFolder()}
                                            />
                                            <div className="flex space-x-2">
                                                <Button size="sm" className="h-7 text-xs px-2" onClick={createFolder}>
                                                    Save
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 text-xs px-2"
                                                    onClick={() => setIsCreatingFolder(false)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <nav className="space-y-1">
                                        <Link
                                            href={route("documents.index", {
                                                ...filters,
                                                folder_id: undefined,
                                            })}
                                            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                                                !filters.folder_id
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                        >
                                            <Folder className="mr-2 h-4 w-4 opacity-50" />
                                            All Documents
                                        </Link>
                                        {folders.map((folder) => (
                                            <div key={folder.id}>
                                                <Link
                                                    href={route("documents.index", {
                                                        ...filters,
                                                        folder_id: folder.id,
                                                    })}
                                                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                                                        Number(filters.folder_id) === folder.id
                                                            ? "bg-primary/10 text-primary"
                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    }`}
                                                >
                                                    <Folder className="mr-2 h-4 w-4 opacity-50" />
                                                    <span className="truncate">{folder.name}</span>
                                                </Link>
                                                {folder.children?.map((sub) => (
                                                    <Link
                                                        key={sub.id}
                                                        href={route("documents.index", {
                                                            ...filters,
                                                            folder_id: sub.id,
                                                        })}
                                                        className={`ml-6 flex items-center px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                                            Number(filters.folder_id) === sub.id
                                                                ? "bg-primary/10 text-primary"
                                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        }`}
                                                    >
                                                        <span className="truncate">{sub.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        ))}
                                    </nav>

                                    <div className="mt-8 pt-4 border-t">
                                        <Link
                                            href={route("documents.index", {
                                                ...filters,
                                                include_archived: !filters.include_archived,
                                            })}
                                            className="flex items-center px-2 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {filters.include_archived ? (
                                                <><ArchiveRestore className="mr-2 h-3.5 w-3.5" /> Hide Archived</>
                                            ) : (
                                                <><Archive className="mr-2 h-3.5 w-3.5" /> Show Archived</>
                                            )}
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                        <form onSubmit={handleSearch} className="w-full sm:max-w-sm relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="search"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder="Search documents..."
                                                className="pl-9"
                                            />
                                        </form>
                                        <div className="flex flex-wrap gap-2">
                                            {["all", "draft", "pending", "completed"].map((status) => (
                                                <Link
                                                    key={status}
                                                    href={route("documents.index", {
                                                        ...filters,
                                                        status: status === "all" ? undefined : status,
                                                    })}
                                                >
                                                    <Badge
                                                        variant={(filters.status || "all") === status ? "default" : "secondary"}
                                                        className="cursor-pointer hover:bg-primary/90 transition-colors capitalize"
                                                    >
                                                        {status}
                                                    </Badge>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {documents.data.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Archive className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                                            <p className="text-muted-foreground">
                                                No documents found matching your criteria.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Title</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Created At</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {documents.data.map((doc) => (
                                                        <TableRow
                                                            key={doc.id}
                                                            className={doc.archived_at ? "opacity-60 bg-muted/30" : ""}
                                                        >
                                                            <TableCell className="font-medium">
                                                                <Link
                                                                    href={route("documents.show", doc.id)}
                                                                    className="hover:text-primary transition-colors flex items-center gap-2"
                                                                >
                                                                    <span className="truncate max-w-[200px] sm:max-w-xs">{doc.title}</span>
                                                                    {doc.archived_at && (
                                                                        <Badge variant="outline" className="text-[10px] h-4 px-1">
                                                                            Archived
                                                                        </Badge>
                                                                    )}
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col gap-1 items-start">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={cn(
                                                                            "capitalize",
                                                                            doc.status === "completed" && "border-success text-success bg-success/5",
                                                                            doc.status === "cancelled" && "border-destructive text-destructive bg-destructive/5",
                                                                            doc.status === "pending" && "border-warning text-warning bg-warning/5"
                                                                        )}
                                                                    >
                                                                        {doc.status}
                                                                    </Badge>
                                                                    {!doc.is_owner && doc.my_status && (
                                                                        <Badge 
                                                                            variant="secondary" 
                                                                            className={cn(
                                                                                "text-[10px] h-4 px-1 w-fit",
                                                                                (doc.my_status === 'completed' || doc.my_status === 'signed') && "bg-success/20 text-success border-success/30",
                                                                                doc.is_my_turn && "bg-primary/20 text-primary border-primary/30 animate-pulse"
                                                                            )}
                                                                        >
                                                                            {doc.my_status === 'completed' || doc.my_status === 'signed' ? 'Signed' : (doc.is_my_turn ? 'Your Turn' : 'Waiting')}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground text-xs">
                                                                {new Date(doc.created_at).toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button variant="ghost" size="icon" asChild title="Download">
                                                                        <a href={route("documents.download", doc.id)}>
                                                                            <Download className="h-4 w-4" />
                                                                        </a>
                                                                    </Button>
                                                                    {doc.status === "draft" && !doc.archived_at && (
                                                                        <Button variant="ghost" size="icon" asChild title="Configure">
                                                                            <Link href={route("documents.workflow", doc.id)}>
                                                                                <Settings className="h-4 w-4" />
                                                                            </Link>
                                                                        </Button>
                                                                    )}
                                                                    <Button variant="ghost" size="icon" asChild title="View">
                                                                        <Link href={route("documents.show", doc.id)}>
                                                                            <Eye className="h-4 w-4" />
                                                                        </Link>
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>

                                            <div className="mt-8 flex justify-center">
                                                <div className="flex items-center gap-1">
                                                    {documents.links.map((link, i) => (
                                                        <Link
                                                            key={i}
                                                            href={link.url || "#"}
                                                            className={cn(
                                                                "h-9 px-3 flex items-center justify-center text-sm font-medium border rounded-md transition-colors",
                                                                link.active
                                                                    ? "border-primary bg-primary/10 text-primary"
                                                                    : "border-border text-muted-foreground hover:bg-muted"
                                                            )}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                            preserveScroll
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
