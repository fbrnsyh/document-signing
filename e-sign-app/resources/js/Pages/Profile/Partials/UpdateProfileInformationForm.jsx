import { Link, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { FormField } from "@/Components/ui/form-field";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-xl font-black text-foreground uppercase tracking-widest">
                    Profile Information
                </h2>

                <p className="mt-2 text-sm text-muted-foreground font-medium">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <FormField
                    label="Name"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    autoComplete="name"
                    error={errors.name}
                />

                <FormField
                    label="Email"
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                    autoComplete="username"
                    error={errors.email}
                />

                <FormField
                    label="Phone Number"
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    autoComplete="tel"
                    error={errors.phone}
                    placeholder="+1 (555) 000-0000"
                />

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                        <p className="text-sm text-amber-600 font-bold mb-2">
                            Your email address is unverified.
                        </p>
                        <Link
                            href={route("verification.send")}
                            method="post"
                            as="button"
                            className="text-xs font-black uppercase tracking-widest text-amber-700 hover:text-amber-800 underline underline-offset-4"
                        >
                            Re-send verification email
                        </Link>

                        {status === "verification-link-sent" && (
                            <div className="mt-3 font-bold text-xs text-green-600 flex items-center gap-1.5 capitalize">
                                <CheckCircle2 className="h-3 w-3" />
                                New link sent!
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <Button 
                        disabled={processing} 
                        className="rounded-xl h-12 px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                    >
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>

                    {recentlySuccessful && (
                        <p className="text-sm text-green-600 font-bold flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Profile updated successfully
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
