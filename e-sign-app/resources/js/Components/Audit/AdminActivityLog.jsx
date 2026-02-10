import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { 
    Activity, 
    Upload, 
    Eye, 
    CheckCircle2, 
    XCircle, 
    LogIn, 
    LogOut, 
    FileText, 
    Search, 
    Filter, 
    ChevronLeft, 
    ChevronRight,
    MapPin,
    Calendar,
    User as UserIcon,
    AlertCircle,
    Archive,
    Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
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
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";

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

            const response = await axios.get("/admin/activity/data", {
                params,
            });
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

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({ ...prev, current_page: page }));
    };

    const getActivityIcon = (action) => {
        const iconMap = {
            document_uploaded: { icon: Upload, color: "text-blue-500", bg: "bg-blue-500/10" },
            document_viewed: { icon: Eye, color: "text-muted-foreground", bg: "bg-muted" },
            document_signed: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
            document_rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
            user_login: { icon: LogIn, color: "text-primary", bg: "bg-primary/10" },
            user_logout: { icon: LogOut, color: "text-primary", bg: "bg-primary/10" },
            document_archived: { icon: Archive, color: "text-amber-500", bg: "bg-amber-500/10" },
            document_deleted: { icon: Trash2, color: "text-destructive", bg: "bg-destructive/10" },
        };

        const config = iconMap[action] || { icon: Activity, color: "text-muted-foreground", bg: "bg-muted" };
        const Icon = config.icon;

        return (
            <div className={cn("flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center shadow-sm", config.bg)}>
                <Icon className={cn("h-5 w-5", config.color)} />
            </div>
        );
    };

    const formatActionText = (action) => {
        const textMap = {
            document_uploaded: "Document uploaded",
            document_viewed: "Document viewed",
            document_signed: "Document signed",
            document_rejected: "Document rejected",
            workflow_created: "Workflow created",
            document_archived: "Document archived",
            document_deleted: "Document deleted",
            user_login: "User logged in",
            user_logout: "User logged out",
        };
        return textMap[action] || action.replace("_", " ");
    };

    if (loading && activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent shadow-md"></div>
                <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-[0.2em]">Loading Log</p>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-6 flex items-center gap-3 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-bold">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
            <CardHeader className="p-8 border-b border-border/50 bg-muted/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Activity className="h-6 w-6 text-primary" />
                            </div>
                            Activity Log
                        </CardTitle>
                        <CardDescription className="text-sm font-medium">
                            Monitoring system events and user actions across the platform.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <div className="p-8 border-b border-border/40 bg-muted/10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 ml-1">
                            <UserIcon className="h-3 w-3" />
                            User Agent
                        </label>
                        <Select value={filters.user_id} onValueChange={(v) => handleFilterChange("user_id", v)}>
                            <SelectTrigger className="bg-card border-border/60 hover:border-primary/50 transition-all rounded-xl h-11">
                                <SelectValue placeholder="All Users" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">All Users</SelectItem>
                                {users?.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 ml-1">
                            <Filter className="h-3 w-3" />
                            Core Action
                        </label>
                        <Select value={filters.action} onValueChange={(v) => handleFilterChange("action", v)}>
                            <SelectTrigger className="bg-card border-border/60 hover:border-primary/50 transition-all rounded-xl h-11">
                                <SelectValue placeholder="All Actions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">All Actions</SelectItem>
                                <SelectItem value="document_uploaded" className="flex items-center gap-2">Uploads</SelectItem>
                                <SelectItem value="document_viewed">Views</SelectItem>
                                <SelectItem value="document_signed">Signatures</SelectItem>
                                <SelectItem value="document_rejected">Rejections</SelectItem>
                                <SelectItem value="workflow_created">Workflows</SelectItem>
                                <SelectItem value="user_login">Logins</SelectItem>
                                <SelectItem value="user_logout">Logouts</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 ml-1">
                            <Calendar className="h-3 w-3" />
                            From Date
                        </label>
                        <Input
                            type="date"
                            value={filters.date_from}
                            onChange={(e) => handleFilterChange("date_from", e.target.value)}
                            className="bg-card border-border/60 hover:border-primary/50 rounded-xl h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 ml-1">
                            <Calendar className="h-3 w-3" />
                            To Date
                        </label>
                        <Input
                            type="date"
                            value={filters.date_to}
                            onChange={(e) => handleFilterChange("date_to", e.target.value)}
                            className="bg-card border-border/60 hover:border-primary/50 rounded-xl h-11"
                        />
                    </div>
                </div>
            </div>

            <CardContent className="p-0">
                {activities.length === 0 ? (
                    <div className="py-24 text-center">
                        <div className="mx-auto h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <h4 className="text-lg font-bold text-foreground">No events found</h4>
                        <p className="text-sm text-muted-foreground">Try adjusting your filters to see more results.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/40 bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-16">Icon</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Details</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Context</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hidden md:table-cell">Identity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {activities.map((activity) => (
                                    <tr key={activity.id} className="group hover:bg-muted/10 transition-colors animate-in fade-in duration-500">
                                        <td className="p-6 align-top">
                                            {getActivityIcon(activity.action)}
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                                        {activity.user ? activity.user.name : "System Process"}
                                                    </span>
                                                    <Badge variant="outline" className="text-[9px] h-4 py-0 font-black uppercase tracking-tighter bg-muted/30">
                                                        {formatActionText(activity.action)}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                    <Calendar className="h-3 w-3 opacity-50" />
                                                    {format(new Date(activity.created_at), "MMM d, yyyy · HH:mm:ss")}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className="flex flex-col gap-2 min-w-[200px]">
                                                {activity.document_id && (
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-3 w-3 text-primary" />
                                                        <span className="text-xs font-bold text-primary uppercase tracking-tighter">Doc ID: {activity.document_id}</span>
                                                    </div>
                                                )}
                                                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                                                    <div className="p-3 bg-muted/40 rounded-xl space-y-2 border border-border/20">
                                                        {Object.entries(activity.metadata).map(([key, value]) => (
                                                            <div key={key} className="flex flex-col gap-0.5">
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">{key.replace("_", " ")}</span>
                                                                <span className="text-[11px] font-semibold text-foreground/80 line-clamp-2">{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6 align-top hidden md:table-cell">
                                            <div className="flex flex-col gap-1.5">
                                                {activity.ip_address && (
                                                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-muted/60 rounded-md border border-border/50 self-start">
                                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-[10px] font-black font-mono tracking-tight">{activity.ip_address}</span>
                                                    </div>
                                                )}
                                                <div className="text-[10px] text-muted-foreground italic font-medium max-w-[150px] truncate" title={activity.user_agent}>
                                                    {activity.user_agent}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>

            {pagination.last_page > 1 && (
                <div className="p-8 border-t border-border/50 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Showing <span className="text-foreground">{(pagination.current_page - 1) * pagination.per_page + 1}</span> to <span className="text-foreground">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> of <span className="text-foreground">{pagination.total}</span> events
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-card shadow-sm rounded-lg h-9 px-4 font-bold border-border/60"
                            onClick={() => handlePageChange(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Prev
                        </Button>
                        <div className="flex items-center px-4 h-9 bg-card border border-border/60 rounded-lg text-xs font-black">
                            {pagination.current_page} / {pagination.last_page}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-card shadow-sm rounded-lg h-9 px-4 font-bold border-border/60"
                            onClick={() => handlePageChange(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.last_page}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default AdminActivityLog;
