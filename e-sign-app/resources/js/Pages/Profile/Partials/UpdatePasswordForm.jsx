import { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { FormField } from "@/Components/ui/form-field";
import { Loader2, CheckCircle2, Lock } from "lucide-react";

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-xl font-black text-foreground uppercase tracking-widest">
                    Update Password
                </h2>

                <p className="mt-2 text-sm text-muted-foreground font-medium">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-8 space-y-6">
                <FormField
                    label="Current Password"
                    id="current_password"
                    type="password"
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    autoComplete="current-password"
                    error={errors.current_password}
                    ref={currentPasswordInput}
                />

                <FormField
                    label="New Password"
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    autoComplete="new-password"
                    error={errors.password}
                    ref={passwordInput}
                />

                <FormField
                    label="Confirm New Password"
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    autoComplete="new-password"
                    error={errors.password_confirmation}
                />

                <div className="flex items-center gap-4 pt-2">
                    <Button 
                        disabled={processing} 
                        className="rounded-xl h-12 px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                    >
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
                    </Button>

                    {recentlySuccessful && (
                        <p className="text-sm text-green-600 font-bold flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Password successfully updated
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
