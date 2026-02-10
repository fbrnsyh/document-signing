import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    FileText,
    Clock,
    CheckCircle2,
    ArrowRight,
    User,
    Users,
    FileEdit,
    Send,
    AlertCircle,
    ChevronRight,
    Bell,
    Plus
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";

export default function Dashboard({
    auth,
    pending_signature = [],
    waiting_on_others = [],
    recently_completed = [],
    drafts = [],
    counts = {},
}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="font-bold text-2xl text-foreground tracking-tight text-center sm:text-left">
                        Welcome back, {auth.user.name.split(' ')[0]}
                    </h2>
                    <Button asChild className="rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 w-fit self-center sm:self-auto uppercase">
                        <Link href={route('documents.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            UPLOAD DOCUMENT
                        </Link>
                    </Button>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-muted/30 min-h-[calc(100vh-64px)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    {/* Hero / Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Actions Required"
                            count={counts.pending_signature || 0}
                            icon={Bell}
                            color="text-amber-500"
                            bg="bg-amber-500/10"
                        />
                        <StatCard
                            title="Active Flows"
                            count={counts.waiting_on_others || 0}
                            icon={Users}
                            color="text-blue-500"
                            bg="bg-blue-500/10"
                        />
                        <StatCard
                            title="Completed"
                            count={counts.recently_completed || 0}
                            icon={CheckCircle2}
                            color="text-green-500"
                            bg="bg-green-500/10"
                        />
                        <StatCard
                            title="Drafts"
                            count={counts.drafts || 0}
                            icon={FileEdit}
                            color="text-indigo-500"
                            bg="bg-indigo-500/10"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Section: Waiting for Your Signature */}
                            <section>
                                <SectionHeader
                                    title="Waiting for Your Signature"
                                    icon={Clock}
                                    count={pending_signature.length}
                                />
                                <div className="mt-4 space-y-4">
                                    {pending_signature.length === 0 ? (
                                        <EmptyState message="No documents waiting for your signature." />
                                    ) : (
                                        pending_signature.map((doc) => (
                                            <PendingSignatureCard
                                                key={doc.id}
                                                doc={doc}
                                            />
                                        ))
                                    )}
                                </div>
                            </section>

                            {/* Section: Waiting on Others */}
                            <section>
                                <SectionHeader
                                    title="Waiting on Others"
                                    icon={Users}
                                    count={waiting_on_others.length}
                                />
                                <div className="mt-4 grid grid-cols-1 gap-6">
                                    {waiting_on_others.length === 0 ? (
                                        <EmptyState message="All documents have been signed." icon={CheckCircle2} />
                                    ) : (
                                        waiting_on_others.map((doc) => (
                                            <WaitingOnOthersCard
                                                key={doc.id}
                                                doc={doc}
                                            />
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-8">
                            {/* Section: Recently Completed */}
                            <section>
                                <SectionHeader
                                    title="Recently Completed"
                                    icon={CheckCircle2}
                                />
                                <div className="mt-4 space-y-3">
                                    {recently_completed.length === 0 ? (
                                        <EmptyState message="No recently completed documents." compact />
                                    ) : (
                                        recently_completed.map((doc) => (
                                            <CompletedDocumentCard
                                                key={doc.id}
                                                doc={doc}
                                            />
                                        ))
                                    )}
                                </div>
                            </section>

                            {/* Section: Drafts */}
                            <section>
                                <SectionHeader title="Rough Drafts" icon={FileEdit} />
                                <div className="mt-4 space-y-3">
                                    {drafts.length === 0 ? (
                                        <EmptyState message="No drafts in progress." compact />
                                    ) : (
                                        drafts.map((doc) => (
                                            <DraftDocumentCard
                                                key={doc.id}
                                                doc={doc}
                                            />
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, count, icon: Icon, color, bg }) {
    return (
        <Card className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", bg)}>
                        <Icon className={cn("h-6 w-6", color)} />
                    </div>
                    <div className="text-3xl font-black text-foreground tabular-nums">
                        {count}
                    </div>
                </div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    {title}
                </div>
            </CardContent>
        </Card>
    );
}

function SectionHeader({ title, icon: Icon, count }) {
    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest text-foreground">{title}</h3>
            </div>
            {count > 0 && (
                <Badge variant="secondary" className="font-bold">
                    {count}
                </Badge>
            )}
        </div>
    );
}

function EmptyState({ message, icon: Icon = FileText, compact = false }) {
    return (
        <div className={cn(
            "bg-muted/30 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center",
            compact ? "p-8" : "p-16"
        )}>
            <div className="h-12 w-12 bg-background rounded-full flex items-center justify-center mb-3 shadow-sm">
                <Icon className="h-6 w-6 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground text-sm font-medium italic">{message}</p>
        </div>
    );
}

function PendingSignatureCard({ doc }) {
    return (
        <Card className="border-none shadow-md rounded-3xl overflow-hidden group hover:shadow-lg transition-all border-l-4 border-l-amber-500">
            <CardContent className="p-0">
                <div className="flex items-center gap-6 p-6">
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-amber-500/10 text-amber-600 shadow-inner">
                        <FileText className="h-8 w-8" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="text-lg font-black text-foreground truncate group-hover:text-amber-600 transition-colors">
                            {doc.title}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold mt-1">
                            <User className="h-3 w-3" />
                            By {doc.uploader?.name || "System"}
                            <span className="opacity-30">•</span>
                            <Clock className="h-3 w-3" />
                            {new Date(doc.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <Button asChild className="rounded-2xl h-12 px-8 font-black bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20">
                            <Link href={doc.signing_token ? route("sign.index", doc.signing_token) : route("documents.show", doc.id)}>
                                SIGN NOW
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function WaitingOnOthersCard({ doc }) {
    const { progress } = doc;
    return (
        <Card className="border-none shadow-md rounded-3xl overflow-hidden hover:shadow-lg transition-all group">
            <CardContent className="p-6">
                <div className="flex items-center gap-5 mb-6">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-600">
                        <Users className="h-7 w-7" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="text-lg font-black text-foreground truncate group-hover:text-blue-600 transition-colors">
                            {doc.title}
                        </div>
                        <div className="text-xs text-muted-foreground font-bold mt-0.5 uppercase tracking-tighter">
                            Active Workflow
                        </div>
                    </div>
                    <Badge variant="outline" className="h-6 border-blue-500/20 bg-blue-500/5 text-blue-600 font-bold px-3">
                        {progress.signed}/{progress.total} SIGNED
                    </Badge>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <span>Completion Progress</span>
                            <span>{Math.round(progress.percentage)}%</span>
                        </div>
                        <Progress value={progress.percentage} className="h-2 bg-muted transition-all" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex -space-x-2 overflow-hidden">
                            {doc.signers.map((signer, index) => (
                                <div
                                    key={index}
                                    title={`${signer.name || signer.email} (${signer.status})`}
                                    className={cn(
                                        "inline-block h-8 w-8 rounded-full ring-2 ring-background flex items-center justify-center text-[10px] font-black uppercase",
                                        signer.status === "signed" 
                                            ? "bg-green-500 text-white" 
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {(signer.name || signer.email).charAt(0)}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" asChild className="rounded-xl font-bold h-9 bg-muted/50">
                                <Link href={route("documents.show", doc.id)}>VIEW DETAILS</Link>
                            </Button>
                            <ReminderButton documentId={doc.id} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function CompletedDocumentCard({ doc }) {
    return (
        <Card className="border-none shadow-sm rounded-2xl hover:shadow-md transition-all group bg-white/50 dark:bg-zinc-900/50">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="text-sm font-black text-foreground truncate group-hover:text-green-600 transition-colors">
                            {doc.title}
                        </div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5 tracking-tighter">
                            Completed {new Date(doc.completed_at).toLocaleDateString()}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-primary">
                        <Link href={route("documents.show", doc.id)}>
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function ReminderButton({ documentId }) {
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null

    const handleSendReminder = () => {
        setIsSending(true);
        setStatus(null);

        router.post(
            route("documents.reminder", documentId),
            {},
            {
                onSuccess: () => {
                    setStatus("success");
                    setTimeout(() => setStatus(null), 3000);
                },
                onError: () => {
                    setStatus("error");
                    setTimeout(() => setStatus(null), 3000);
                },
                onFinish: () => {
                    setIsSending(false);
                },
            },
        );
    };

    return (
        <div className="relative">
            <Button
                onClick={handleSendReminder}
                disabled={isSending}
                size="sm"
                className={cn(
                    "rounded-xl font-bold h-9 shadow-lg shadow-blue-500/10",
                    status === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                )}
            >
                {isSending ? "SENDING..." : (status === 'success' ? 'SENT!' : 'REIND')}
            </Button>
            {status === 'error' && (
                <div className="absolute bottom-full mb-2 right-0 px-3 py-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-lg whitespace-nowrap">
                    Failed to send
                </div>
            )}
        </div>
    );
}

function DraftDocumentCard({ doc }) {
    return (
        <Card className="border-none shadow-sm rounded-2xl hover:shadow-md transition-all group bg-white/50 dark:bg-zinc-900/50">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                        <FileEdit className="h-5 w-5" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="text-sm font-black text-foreground truncate group-hover:text-indigo-600 transition-colors">
                            {doc.title}
                        </div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5 tracking-tighter">
                            Updated {new Date(doc.updated_at).toLocaleDateString()}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-indigo-600">
                        <Link href={route("documents.workflow", doc.id)}>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
