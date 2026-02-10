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
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm font-medium">
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
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-info"
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
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-muted-foreground"
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
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-success"
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
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-destructive"
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
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-primary"
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
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-muted-foreground"
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
        <div className="bg-card shadow sm:rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-border">
                <h3 className="text-lg font-bold text-foreground">
                    Activity Timeline
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    Track all activities related to this document
                </p>
            </div>

            {Object.keys(groupedActivities).length === 0 ? (
                <div className="px-4 py-12 text-center text-muted-foreground">
                    No activity recorded yet
                </div>
            ) : (
                <ul className="divide-y divide-border">
                    {Object.keys(groupedActivities)
                        .sort((a, b) => new Date(b) - new Date(a))
                        .map((date) => (
                            <li key={date} className="p-4 sm:p-6 hover:bg-muted/30 transition-colors">
                                <div className="text-sm font-bold text-foreground mb-4 flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-primary mr-2" />
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
                                                    <div className="text-sm text-foreground">
                                                        <span className="font-bold">
                                                            {activity.user
                                                                ? activity.user
                                                                      .name
                                                                : "System"}
                                                        </span>
                                                        <span className="mx-2 text-muted-foreground/50">
                                                            ·
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            {formatActionText(
                                                                activity.action,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground/70 mt-0.5">
                                                        {format(
                                                            new Date(
                                                                activity.created_at,
                                                            ),
                                                            "h:mm a",
                                                        )}
                                                        {activity.ip_address && (
                                                            <span className="ml-3 px-2 py-0.5 bg-muted rounded text-[10px]">
                                                                IP: {activity.ip_address}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {activity.metadata &&
                                                        Object.keys(
                                                            activity.metadata,
                                                        ).length > 0 && (
                                                            <div className="mt-2 p-2 bg-muted/50 rounded-lg text-xs text-muted-foreground space-y-1">
                                                                {activity
                                                                    .metadata
                                                                    .document_title && (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-semibold uppercase text-[9px] tracking-wider text-muted-foreground/60">Title:</span>
                                                                        <span className="text-foreground/80">{activity.metadata.document_title}</span>
                                                                    </div>
                                                                )}
                                                                {activity
                                                                    .metadata
                                                                    .reason && (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-semibold uppercase text-[9px] tracking-wider text-muted-foreground/60">Reason:</span>
                                                                        <span className="text-foreground/80">{activity.metadata.reason}</span>
                                                                    </div>
                                                                )}
                                                                {activity
                                                                    .metadata
                                                                    .signers_count && (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-semibold uppercase text-[9px] tracking-wider text-muted-foreground/60">Signers:</span>
                                                                        <span className="text-foreground/80">{activity.metadata.signers_count}</span>
                                                                    </div>
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
