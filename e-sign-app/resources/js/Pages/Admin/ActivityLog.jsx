import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import AdminActivityLog from "@/Components/Audit/AdminActivityLog";

export default function ActivityLog({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-foreground leading-tight">
                    System Activity Log
                </h2>
            }
        >
            <Head title="System Activity Log" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <AdminActivityLog />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
