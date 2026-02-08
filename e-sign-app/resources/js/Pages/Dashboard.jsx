import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    FileText,
    Clock,
    CheckCircle,
    ArrowRight,
    User,
    Users,
    FileEdit,
    Send,
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

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
                <h2 className="font-semibold text-xl text-foreground leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-background/50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-10">
                    {/* Hero / Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Waiting for Your Signature"
                            count={counts.pending_signature || 0}
                            icon={Clock}
                            color="text-chart-5"
                            bg="bg-chart-5/10"
                        />
                        <StatCard
                            title="Waiting on Others"
                            count={counts.waiting_on_others || 0}
                            icon={Users}
                            color="text-chart-2"
                            bg="bg-chart-2/10"
                        />
                        <StatCard
                            title="Recently Completed"
                            count={counts.recently_completed || 0}
                            icon={CheckCircle}
                            color="text-chart-3"
                            bg="bg-chart-3/10"
                        />
                        <StatCard
                            title="Drafts"
                            count={counts.drafts || 0}
                            icon={FileEdit}
                            color="text-chart-4"
                            bg="bg-chart-4/10"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Pending Signature and Waiting on Others */}
                        <div className="space-y-8">
                            {/* Section: Waiting for Your Signature */}
                            <section>
                                <SectionHeader
                                    title="Waiting for Your Signature"
                                    icon={Clock}
                                />
                                <div className="mt-4 grid grid-cols-1 gap-4">
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
                                />
                                <div className="mt-4 grid grid-cols-1 gap-4">
                                    {waiting_on_others.length === 0 ? (
                                        <EmptyState message="All documents have been signed." />
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

                        {/* Right Column: Recently Completed and Drafts */}
                        <div className="space-y-8">
                            {/* Section: Recently Completed */}
                            <section>
                                <SectionHeader
                                    title="Recently Completed"
                                    icon={CheckCircle}
                                />
                                <div className="mt-4 grid grid-cols-1 gap-4">
                                    {recently_completed.length === 0 ? (
                                        <EmptyState message="No completed documents yet." />
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
                                <SectionHeader title="Drafts" icon={FileEdit} />
                                <div className="mt-4 grid grid-cols-1 gap-4">
                                    {drafts.length === 0 ? (
                                        <EmptyState message="No drafts in progress." />
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
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
            <div
                className={clsx(
                    "h-12 w-12 rounded-2xl flex items-center justify-center mb-4",
                    bg,
                )}
            >
                <Icon className={clsx("h-6 w-6", color)} />
            </div>
            <div className="text-2xl font-black text-card-foreground">
                {count}
            </div>
            <div className="text-sm font-medium text-muted-foreground">
                {title}
            </div>
        </div>
    );
}

function SectionHeader({ title, icon: Icon }) {
    return (
        <div className="flex items-center gap-2 px-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-bold text-card-foreground">{title}</h3>
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="bg-card/50 border-2 border-dashed border-border rounded-3xl p-10 text-center">
            <p className="text-muted-foreground text-sm">{message}</p>
        </div>
    );
}

function PendingSignatureCard({ doc }) {
    return (
        <div className="bg-card p-5 rounded-3xl border border-border shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow group">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-chart-5/10 dark:bg-chart-5/20 text-chart-5 dark:text-chart-5/80">
                <Clock className="h-7 w-7" />
            </div>
            <div className="flex-grow min-w-0">
                <div className="text-lg font-bold text-card-foreground truncate group-hover:text-primary transition-colors">
                    {doc.title}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                    Sent by {doc.uploader?.name || "Unknown"} on{" "}
                    {new Date(doc.created_at).toLocaleDateString()}
                </div>
            </div>
            <Link
                href={
                    doc.signing_token
                        ? route("sign.index", doc.signing_token)
                        : route("documents.show", doc.id)
                }
                className="px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 bg-chart-5 text-primary-foreground hover:bg-chart-5/90 dark:bg-chart-5/80 dark:hover:bg-chart-5/70 shadow-lg shadow-chart-5/20 dark:shadow-chart-5/10 transition-all"
            >
                Sign Now
                <ArrowRight className="h-4 w-4" />
            </Link>
        </div>
    );
}

function WaitingOnOthersCard({ doc }) {
    const { progress } = doc;
    return (
        <div className="bg-card p-5 rounded-3xl border border-border shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-5 mb-4">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-chart-2/10 dark:bg-chart-2/20 text-chart-2 dark:text-chart-2/80">
                    <Users className="h-7 w-7" />
                </div>
                <div className="flex-grow min-w-0">
                    <div className="text-lg font-bold text-card-foreground truncate group-hover:text-primary transition-colors">
                        {doc.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                        Created on{" "}
                        {new Date(doc.created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>
                        {progress.signed}/{progress.total} signed
                    </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                    <div
                        className="bg-chart-2 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Signers List */}
            <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-2">
                    Signers
                </div>
                <div className="flex flex-wrap gap-2">
                    {doc.signers.map((signer, index) => (
                        <div
                            key={index}
                            className={clsx(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                signer.status === "signed"
                                    ? "bg-chart-3/20 dark:bg-chart-3/30 text-chart-3 dark:text-chart-3/80"
                                    : "bg-muted text-muted-foreground",
                            )}
                        >
                            {signer.name || signer.email}
                            {signer.status === "signed" && " ✓"}
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Link
                    href={route("documents.show", doc.id)}
                    className="px-4 py-2 rounded-xl font-medium text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                    View Status
                </Link>
                <ReminderButton documentId={doc.id} />
            </div>
        </div>
    );
}

function CompletedDocumentCard({ doc }) {
    return (
        <div className="bg-card p-4 rounded-3xl border border-border flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow group">
            <div className="h-10 w-10 bg-chart-3/10 dark:bg-chart-3/20 text-chart-3 dark:text-chart-3/80 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
            </div>
            <div className="flex-grow min-w-0">
                <div className="text-sm font-bold text-card-foreground truncate group-hover:text-primary transition-colors">
                    {doc.title}
                </div>
                <div className="text-xs text-muted-foreground">
                    Completed on{" "}
                    {new Date(doc.completed_at).toLocaleDateString()}
                </div>
            </div>
            <Link
                href={route("documents.show", doc.id)}
                className="text-primary hover:text-primary/80 dark:text-primary/70 dark:hover:text-primary/60 transition-colors"
            >
                <FileText className="h-5 w-5" />
            </Link>
        </div>
    );
}

function ReminderButton({ documentId }) {
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState("");

    const handleSendReminder = () => {
        setIsSending(true);

        router.post(
            route("documents.reminder", documentId),
            {},
            {
                onSuccess: () => {
                    setMessage("Reminders sent successfully!");
                    setTimeout(() => setMessage(""), 3000);
                },
                onError: () => {
                    setMessage("Failed to send reminders. Please try again.");
                    setTimeout(() => setMessage(""), 3000);
                },
                onFinish: () => {
                    setIsSending(false);
                },
            },
        );
    };

    return (
        <div className="relative">
            <button
                onClick={handleSendReminder}
                disabled={isSending}
                className="px-4 py-2 rounded-xl font-medium text-sm bg-chart-2 text-primary-foreground hover:bg-chart-2/90 dark:bg-chart-2/80 dark:hover:bg-chart-2/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSending ? "Sending..." : "Send Reminder"}
            </button>
            {message && (
                <div
                    className={`absolute top-full mt-2 left-0 right-0 px-3 py-2 rounded-lg text-sm text-center ${
                        message.includes("success")
                            ? "bg-chart-3/20 dark:bg-chart-3/30 text-chart-3 dark:text-chart-3/80"
                            : "bg-destructive/20 dark:bg-destructive/30 text-destructive dark:text-destructive/80"
                    }`}
                >
                    {message}
                </div>
            )}
        </div>
    );
}

function DraftDocumentCard({ doc }) {
    return (
        <div className="bg-card p-5 rounded-3xl border border-border shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow group">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-chart-4/10 dark:bg-chart-4/20 text-chart-4 dark:text-chart-4/80">
                <FileEdit className="h-7 w-7" />
            </div>
            <div className="flex-grow min-w-0">
                <div className="text-lg font-bold text-card-foreground truncate group-hover:text-primary transition-colors">
                    {doc.title}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                    Last updated on{" "}
                    {new Date(doc.updated_at).toLocaleDateString()}
                </div>
            </div>
            <Link
                href={route("documents.workflow", doc.id)}
                className="px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 bg-chart-4 text-primary-foreground hover:bg-chart-4/90 dark:bg-chart-4/80 dark:hover:bg-chart-4/70 shadow-lg shadow-chart-4/20 dark:shadow-chart-4/10 transition-all"
            >
                Continue
                <ArrowRight className="h-4 w-4" />
            </Link>
        </div>
    );
}
