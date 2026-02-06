import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const ActivityTimeline = ({ documentId }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(
                    `/api/documents/${documentId}/activity`,
                );
                setActivities(response.data.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load activity timeline");
                setLoading(false);
            }
        };

        fetchActivities();
    }, [documentId]);

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

    const groupActivitiesByDate = (activities) => {
        const grouped = {};

        activities.forEach((activity) => {
            const date = format(new Date(activity.created_at), "yyyy-MM-dd");
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(activity);
        });

        return grouped;
    };

    const getActivityIcon = (action) => {
        switch (action) {
            case "document_uploaded":
                return (
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-blue-600"
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
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-gray-600"
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
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-green-600"
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
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-red-600"
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
            case "workflow_created":
                return (
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-purple-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-gray-600"
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
            default:
                return action.replace("_", " ");
        }
    };

    const groupedActivities = groupActivitiesByDate(activities);

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Activity Timeline
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Track all activities related to this document
                </p>
            </div>

            {Object.keys(groupedActivities).length === 0 ? (
                <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                    No activity recorded yet
                </div>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {Object.keys(groupedActivities)
                        .sort((a, b) => new Date(b) - new Date(a))
                        .map((date) => (
                            <li key={date} className="p-4 sm:p-6">
                                <div className="text-sm font-medium text-gray-900 mb-3">
                                    {format(
                                        new Date(date),
                                        "EEEE, MMMM d, yyyy",
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {groupedActivities[date].map(
                                        (activity, index) => (
                                            <div
                                                key={activity.id}
                                                className="flex space-x-3"
                                            >
                                                {getActivityIcon(
                                                    activity.action,
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm text-gray-900">
                                                        <span className="font-medium">
                                                            {activity.user
                                                                ? activity.user
                                                                      .name
                                                                : "System"}
                                                        </span>
                                                        <span className="mx-1">
                                                            ·
                                                        </span>
                                                        <span>
                                                            {formatActionText(
                                                                activity.action,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {format(
                                                            new Date(
                                                                activity.created_at,
                                                            ),
                                                            "h:mm a",
                                                        )}
                                                        {activity.ip_address && (
                                                            <span className="ml-2">
                                                                from IP:{" "}
                                                                {
                                                                    activity.ip_address
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                    {activity.metadata &&
                                                        Object.keys(
                                                            activity.metadata,
                                                        ).length > 0 && (
                                                            <div className="mt-1 text-sm text-gray-600">
                                                                {activity
                                                                    .metadata
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
                                                                {activity
                                                                    .metadata
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
                                                                {activity
                                                                    .metadata
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
                                        ),
                                    )}
                                </div>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

export default ActivityTimeline;
