import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const AdminActivityLog = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [filters, setFilters] = useState({
        user_id: "",
        action: "",
        date_from: "",
        date_to: "",
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 50,
        total: 0,
    });

    useEffect(() => {
        fetchActivities();
        fetchUsers();
    }, [filters, pagination.current_page]);

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const response = await axios.get("/admin/users");
            setUsers(response.data.data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setUsersLoading(false);
        }
    };

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.current_page,
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, v]) => v !== ""),
                ),
            };

            console.log("Fetching activities with params:", params);
            const response = await axios.get("/admin/activity/data", {
                params,
            });
            console.log("Response received:", response.data);
            setActivities(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                per_page: response.data.per_page,
                total: response.data.total,
            });
            setLoading(false);
        } catch (err) {
            console.error("Error fetching activities:", err);
            setError("Failed to load activity log");
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({ ...prev, current_page: page }));
    };

    const getActivityIcon = (action) => {
        switch (action) {
            case "document_uploaded":
                return (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                            className="h-4 w-4 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>
                );
            case "document_viewed":
                return (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                            className="h-4 w-4 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                    </div>
                );
            case "document_signed":
                return (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                            className="h-4 w-4 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                );
            case "document_rejected":
                return (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <svg
                            className="h-4 w-4 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                );
            case "user_login":
                return (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg
                            className="h-4 w-4 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                        </svg>
                    </div>
                );
            case "user_logout":
                return (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg
                            className="h-4 w-4 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                            className="h-4 w-4 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                );
        }
    };

    const formatActionText = (action) => {
        switch (action) {
            case "document_uploaded":
                return "Document uploaded";
            case "document_viewed":
                return "Document viewed";
            case "document_signed":
                return "Document signed";
            case "document_rejected":
                return "Document rejected";
            case "workflow_created":
                return "Signing workflow created";
            case "document_archived":
                return "Document archived";
            case "document_deleted":
                return "Document deleted";
            case "user_login":
                return "User logged in";
            case "user_logout":
                return "User logged out";
            default:
                return action.replace("_", " ");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    System Activity Log
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Monitor all system activities across all users
                </p>
            </div>

            <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label
                            htmlFor="user_id"
                            className="block text-sm font-medium text-gray-700"
                        >
                            User
                        </label>
                        <select
                            id="user_id"
                            name="user_id"
                            value={filters.user_id}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            disabled={usersLoading}
                        >
                            <option value="">All Users</option>
                            {users?.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="action"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Action
                        </label>
                        <select
                            id="action"
                            name="action"
                            value={filters.action}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="">All Actions</option>
                            <option value="document_uploaded">
                                Document Uploaded
                            </option>
                            <option value="document_viewed">
                                Document Viewed
                            </option>
                            <option value="document_signed">
                                Document Signed
                            </option>
                            <option value="document_rejected">
                                Document Rejected
                            </option>
                            <option value="workflow_created">
                                Workflow Created
                            </option>
                            <option value="user_login">User Login</option>
                            <option value="user_logout">User Logout</option>
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="date_from"
                            className="block text-sm font-medium text-gray-700"
                        >
                            From Date
                        </label>
                        <input
                            type="date"
                            id="date_from"
                            name="date_from"
                            value={filters.date_from}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="date_to"
                            className="block text-sm font-medium text-gray-700"
                        >
                            To Date
                        </label>
                        <input
                            type="date"
                            id="date_to"
                            name="date_to"
                            value={filters.date_to}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
            </div>

            {activities.length === 0 ? (
                <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                    No activities found matching the current filters
                </div>
            ) : (
                <>
                    <ul className="divide-y divide-gray-200">
                        {activities.map((activity) => (
                            <li key={activity.id} className="p-4 sm:p-6">
                                <div className="flex space-x-3">
                                    {getActivityIcon(activity.action)}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-gray-900">
                                            <span className="font-medium">
                                                {activity.user
                                                    ? activity.user.name
                                                    : "System"}
                                            </span>
                                            <span className="mx-1">·</span>
                                            <span>
                                                {formatActionText(
                                                    activity.action,
                                                )}
                                            </span>
                                            {activity.document_id && (
                                                <span className="ml-2 text-indigo-600">
                                                    Document #
                                                    {activity.document_id}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {format(
                                                new Date(activity.created_at),
                                                "MMM d, yyyy h:mm a",
                                            )}
                                            {activity.ip_address && (
                                                <span className="ml-2">
                                                    from IP:{" "}
                                                    {activity.ip_address}
                                                </span>
                                            )}
                                        </div>
                                        {activity.metadata &&
                                            Object.keys(activity.metadata)
                                                .length > 0 && (
                                                <div className="mt-1 text-sm text-gray-600">
                                                    {activity.metadata
                                                        .document_title && (
                                                        <span>
                                                            Title:{" "}
                                                            {
                                                                activity
                                                                    .metadata
                                                                    .document_title
                                                            }
                                                        </span>
                                                    )}
                                                    {activity.metadata
                                                        .reason && (
                                                        <span>
                                                            Reason:{" "}
                                                            {
                                                                activity
                                                                    .metadata
                                                                    .reason
                                                            }
                                                        </span>
                                                    )}
                                                    {activity.metadata
                                                        .signers_count && (
                                                        <span>
                                                            Signers:{" "}
                                                            {
                                                                activity
                                                                    .metadata
                                                                    .signers_count
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {pagination.last_page > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() =>
                                        handlePageChange(
                                            pagination.current_page - 1,
                                        )
                                    }
                                    disabled={pagination.current_page === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() =>
                                        handlePageChange(
                                            pagination.current_page + 1,
                                        )
                                    }
                                    disabled={
                                        pagination.current_page ===
                                        pagination.last_page
                                    }
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing
                                        <span className="font-medium">
                                            {" "}
                                            {(pagination.current_page - 1) *
                                                pagination.per_page +
                                                1}{" "}
                                        </span>
                                        to
                                        <span className="font-medium">
                                            {" "}
                                            {Math.min(
                                                pagination.current_page *
                                                    pagination.per_page,
                                                pagination.total,
                                            )}{" "}
                                        </span>
                                        of
                                        <span className="font-medium">
                                            {" "}
                                            {pagination.total}{" "}
                                        </span>
                                        results
                                    </p>
                                </div>
                                <div>
                                    <nav
                                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                        aria-label="Pagination"
                                    >
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.current_page - 1,
                                                )
                                            }
                                            disabled={
                                                pagination.current_page === 1
                                            }
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <span className="sr-only">
                                                Previous
                                            </span>
                                            <svg
                                                className="h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                            {pagination.current_page} of{" "}
                                            {pagination.last_page}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.current_page + 1,
                                                )
                                            }
                                            disabled={
                                                pagination.current_page ===
                                                pagination.last_page
                                            }
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <span className="sr-only">
                                                Next
                                            </span>
                                            <svg
                                                className="h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminActivityLog;
