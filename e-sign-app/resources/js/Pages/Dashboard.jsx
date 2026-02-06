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
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-10">
                    {/* Hero / Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Waiting for Your Signature"
                            count={counts.pending_signature || 0}
                            icon={Clock}
                            color="text-orange-600"
                            bg="bg-orange-50"
                        />
                        <StatCard
                            title="Waiting on Others"
                            count={counts.waiting_on_others || 0}
                            icon={Users}
                            color="text-blue-600"
                            bg="bg-blue-50"
                        />
                        <StatCard
                            title="Recently Completed"
                            count={counts.recently_completed || 0}
                            icon={CheckCircle}
                            color="text-green-600"
                            bg="bg-green-50"
                        />
                        <StatCard
                            title="Drafts"
                            count={counts.drafts || 0}
                            icon={FileEdit}
                            color="text-purple-600"
                            bg="bg-purple-50"
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
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div
                className={clsx(
                    "h-12 w-12 rounded-2xl flex items-center justify-center mb-4",
                    bg,
                )}
            >
                <Icon className={clsx("h-6 w-6", color)} />
            </div>
            <div className="text-2xl font-black text-gray-900">{count}</div>
            <div className="text-sm font-medium text-gray-500">{title}</div>
        </div>
    );
}

function SectionHeader({ title, icon: Icon }) {
    return (
        <div className="flex items-center gap-2 px-2">
            <Icon className="h-5 w-5 text-gray-400" />
            <h3 className="font-bold text-gray-900">{title}</h3>
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center">
            <p className="text-gray-400 text-sm">{message}</p>
        </div>
    );
}

function PendingSignatureCard({ doc }) {
    return (
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow group">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-orange-50 text-orange-600">
                <Clock className="h-7 w-7" />
            </div>
            <div className="flex-grow min-w-0">
                <div className="text-lg font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    {doc.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
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
                className="px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-100 transition-all"
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
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-5 mb-4">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600">
                    <Users className="h-7 w-7" />
                </div>
                <div className="flex-grow min-w-0">
                    <div className="text-lg font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                        {doc.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                        Created on{" "}
                        {new Date(doc.created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>
                        {progress.signed}/{progress.total} signed
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Signers List */}
            <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">Signers</div>
                <div className="flex flex-wrap gap-2">
                    {doc.signers.map((signer, index) => (
                        <div
                            key={index}
                            className={clsx(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                signer.status === "signed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800",
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
                    className="px-4 py-2 rounded-xl font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
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
        <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow group">
            <div className="h-10 w-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
            </div>
            <div className="flex-grow min-w-0">
                <div className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    {doc.title}
                </div>
                <div className="text-xs text-gray-500">
                    Completed on{" "}
                    {new Date(doc.completed_at).toLocaleDateString()}
                </div>
            </div>
            <Link
                href={route("documents.show", doc.id)}
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
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
                className="px-4 py-2 rounded-xl font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSending ? "Sending..." : "Send Reminder"}
            </button>
            {message && (
                <div
                    className={`absolute top-full mt-2 left-0 right-0 px-3 py-2 rounded-lg text-sm text-center ${
                        message.includes("success")
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
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
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow group">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-purple-50 text-purple-600">
                <FileEdit className="h-7 w-7" />
            </div>
            <div className="flex-grow min-w-0">
                <div className="text-lg font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    {doc.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                    Last updated on{" "}
                    {new Date(doc.updated_at).toLocaleDateString()}
                </div>
            </div>
            <Link
                href={route("documents.workflow", doc.id)}
                className="px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-100 transition-all"
            >
                Continue
                <ArrowRight className="h-4 w-4" />
            </Link>
        </div>
    );
}
