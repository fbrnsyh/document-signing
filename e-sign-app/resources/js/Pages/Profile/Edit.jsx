import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import SignatureManager from "./Partials/SignatureManager";
import { Head } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/card";

export default function Edit({ auth, mustVerifyEmail, status, signature }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-bold text-2xl text-foreground tracking-tight">
                    Profile Settings
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12 bg-muted/30 min-h-[calc(100vh-64px)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                        <CardContent className="p-6 sm:p-10">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                        <CardContent className="p-6 sm:p-10">
                            <UpdatePasswordForm className="max-w-xl" />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                        <CardContent className="p-6 sm:p-10">
                            <SignatureManager
                                signature={signature}
                                className="max-w-xl"
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-destructive/5 border-destructive/10">
                        <CardContent className="p-6 sm:p-10">
                            <DeleteUserForm className="max-w-xl" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
