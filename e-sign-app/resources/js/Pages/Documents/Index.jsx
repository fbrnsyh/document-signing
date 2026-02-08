import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";

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
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        My Documents
                    </h2>
                    <Link
                        href={route("documents.create", {
                            folder_id: filters.folder_id,
                        })}
                    >
                        <PrimaryButton>Upload Document</PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="Documents" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex gap-6">
                        {/* Sidebar */}
                        <div className="w-64 flex-shrink-0">
                            <div className="bg-card border text-card-foreground overflow-hidden shadow-sm sm:rounded-lg p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold">Folders</h3>
                                    <button
                                        onClick={() =>
                                            setIsCreatingFolder(true)
                                        }
                                        className="text-gray-400 hover:text-indigo-600"
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
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {isCreatingFolder && (
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            value={newFolderName}
                                            onChange={(e) =>
                                                setNewFolderName(e.target.value)
                                            }
                                            placeholder="Folder name"
                                            className="w-full text-xs rounded border-gray-300 mb-2"
                                            autoFocus
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                createFolder()
                                            }
                                        />
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={createFolder}
                                                className="text-xs text-indigo-600 font-bold"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setIsCreatingFolder(false)
                                                }
                                                className="text-xs text-gray-400"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <nav className="space-y-1">
                                    <Link
                                        href={route("documents.index", {
                                            ...filters,
                                            folder_id: undefined,
                                        })}
                                        className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                            !filters.folder_id
                                                ? "bg-indigo-100 text-indigo-700"
                                                : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        <svg
                                            className="mr-3 h-5 w-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                            />
                                        </svg>
                                        All Documents
                                    </Link>
                                    {folders.map((folder) => (
                                        <div key={folder.id}>
                                            <Link
                                                href={route("documents.index", {
                                                    ...filters,
                                                    folder_id: folder.id,
                                                })}
                                                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                                    Number(
                                                        filters.folder_id,
                                                    ) === folder.id
                                                        ? "bg-indigo-100 text-indigo-700"
                                                        : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                            >
                                                <svg
                                                    className="mr-3 h-5 w-5 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                                    />
                                                </svg>
                                                <span className="truncate">
                                                    {folder.name}
                                                </span>
                                            </Link>
                                            {/* Subfolders check */}
                                            {folder.children?.map((sub) => (
                                                <Link
                                                    key={sub.id}
                                                    href={route(
                                                        "documents.index",
                                                        {
                                                            ...filters,
                                                            folder_id: sub.id,
                                                        },
                                                    )}
                                                    className={`ml-4 flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                                        Number(
                                                            filters.folder_id,
                                                        ) === sub.id
                                                            ? "bg-indigo-100 text-indigo-700"
                                                            : "text-gray-600 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <span className="truncate">
                                                        {sub.name}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                </nav>

                                <div className="mt-8 pt-4 border-t border-gray-100">
                                    <Link
                                        href={route("documents.index", {
                                            ...filters,
                                            include_archived:
                                                !filters.include_archived,
                                        })}
                                        className="flex items-center px-2 py-2 text-xs font-medium"
                                    >
                                        {filters.include_archived
                                            ? "Hide Archived"
                                            : "Show Archived"}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900">
                                    <div className="mb-6 flex justify-between items-center">
                                        <form
                                            onSubmit={handleSearch}
                                            className="flex-1 max-w-sm"
                                        >
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={search}
                                                    onChange={(e) =>
                                                        setSearch(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Search documents..."
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                                <button
                                                    type="submit"
                                                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                                                >
                                                    <svg
                                                        className="h-4 w-4 text-gray-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </form>
                                        <div className="flex space-x-2">
                                            {[
                                                "all",
                                                "draft",
                                                "pending",
                                                "completed",
                                            ].map((status) => (
                                                <Link
                                                    key={status}
                                                    href={route(
                                                        "documents.index",
                                                        {
                                                            ...filters,
                                                            status:
                                                                status === "all"
                                                                    ? undefined
                                                                    : status,
                                                        },
                                                    )}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                                        (filters.status ||
                                                            "all") === status
                                                            ? "bg-indigo-600 text-white"
                                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        status.slice(1)}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {documents.data.length === 0 ? (
                                        <div className="text-center py-12">
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1"
                                                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                                />
                                            </svg>
                                            <p className="text-gray-500 mb-4">
                                                No documents found matching your
                                                criteria.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Title
                                                            </th>
                                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Status
                                                            </th>
                                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Created At
                                                            </th>
                                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {documents.data.map(
                                                            (doc) => (
                                                                <tr
                                                                    key={doc.id}
                                                                    className={
                                                                        doc.archived_at
                                                                            ? "bg-gray-50 grayscale opacity-80"
                                                                            : ""
                                                                    }
                                                                >
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                        <Link
                                                                            href={route(
                                                                                "documents.show",
                                                                                doc.id,
                                                                            )}
                                                                            className="text-gray-900 font-medium hover:text-indigo-600 truncate block max-w-xs"
                                                                            title={
                                                                                doc.title
                                                                            }
                                                                        >
                                                                            {
                                                                                doc.title
                                                                            }
                                                                            {doc.archived_at && (
                                                                                <span className="ml-2 text-[10px] bg-gray-200 text-gray-500 px-1 rounded uppercase">
                                                                                    Archived
                                                                                </span>
                                                                            )}
                                                                        </Link>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        <span
                                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                                doc.status ===
                                                                                "completed"
                                                                                    ? "bg-green-100 text-green-800"
                                                                                    : doc.status ===
                                                                                        "cancelled"
                                                                                      ? "bg-red-100 text-red-800"
                                                                                      : "bg-yellow-100 text-yellow-800"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                doc.status
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {new Date(
                                                                            doc.created_at,
                                                                        ).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                        <a
                                                                            href={route(
                                                                                "documents.download",
                                                                                doc.id,
                                                                            )}
                                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                                        >
                                                                            Download
                                                                        </a>
                                                                        {doc.status ===
                                                                            "draft" &&
                                                                            !doc.archived_at && (
                                                                                <Link
                                                                                    href={route(
                                                                                        "documents.workflow",
                                                                                        doc.id,
                                                                                    )}
                                                                                    className="text-indigo-600 hover:text-indigo-900 mr-4 font-bold"
                                                                                >
                                                                                    Configure
                                                                                </Link>
                                                                            )}
                                                                        <Link
                                                                            href={route(
                                                                                "documents.show",
                                                                                doc.id,
                                                                            )}
                                                                            className="text-gray-600 hover:text-gray-900"
                                                                        >
                                                                            View
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mt-8 flex justify-center">
                                                <nav
                                                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                                    aria-label="Pagination"
                                                >
                                                    {documents.links.map(
                                                        (link, i) => (
                                                            <Link
                                                                key={i}
                                                                href={
                                                                    link.url ||
                                                                    "#"
                                                                }
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                    link.active
                                                                        ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                                } ${i === 0 ? "rounded-l-md" : ""} ${i === documents.links.length - 1 ? "rounded-r-md" : ""}`}
                                                                dangerouslySetInnerHTML={{
                                                                    __html: link.label,
                                                                }}
                                                                preserveScroll
                                                            />
                                                        ),
                                                    )}
                                                </nav>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
