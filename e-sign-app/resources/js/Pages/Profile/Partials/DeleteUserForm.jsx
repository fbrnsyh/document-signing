import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { FormField } from "@/Components/ui/form-field";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle,
    DialogTrigger
} from "@/Components/ui/dialog";
import { AlertCircle, Trash2, Loader2 } from "lucide-react";

export default function DeleteUserForm({ className = '' }) {
    const [open, setOpen] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: '',
    });

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-xl font-black text-destructive uppercase tracking-widest flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    Danger Zone
                </h2>

                <p className="mt-2 text-sm text-muted-foreground font-medium">
                    Once your account is deleted, all of its resources and data will be permanently deleted.
                </p>
            </header>

            <div className="mt-6">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive" className="rounded-xl h-12 px-8 font-black uppercase tracking-widest shadow-lg shadow-destructive/20">
                            Delete Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black uppercase tracking-tight text-destructive flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                Confirm Deletion
                            </DialogTitle>
                            <DialogDescription className="font-medium pt-2">
                                Are you absolutely sure you want to delete your account? This action cannot be undone.
                                Please enter your password to confirm.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={deleteUser} className="py-4 space-y-6">
                            <FormField
                                label="Confirm Password"
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                ref={passwordInput}
                                error={errors.password}
                                placeholder="Enter your password"
                                autoFocus
                            />

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => setOpen(false)}
                                    className="rounded-xl font-bold"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="destructive" 
                                    disabled={processing}
                                    className="rounded-xl font-black uppercase tracking-widest"
                                >
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Permanently Delete
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}
