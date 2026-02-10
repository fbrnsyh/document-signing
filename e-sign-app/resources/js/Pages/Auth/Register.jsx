import { useEffect } from 'react';
import { Checkbox } from '@/Components/ui/checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/Components/ui/button';
import { FormField } from '@/Components/ui/form-field';
import { Label } from '@/Components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-4">
                <FormField
                    label="Name"
                    id="name"
                    name="name"
                    value={data.name}
                    autoComplete="name"
                    autoFocus
                    error={errors.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                />

                <FormField
                    label="Email"
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    autoComplete="username"
                    error={errors.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                />

                <FormField
                    label="Password"
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    autoComplete="new-password"
                    error={errors.password}
                    onChange={(e) => setData('password', e.target.value)}
                    required
                />

                <FormField
                    label="Confirm Password"
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    autoComplete="new-password"
                    error={errors.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    required
                />

                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={data.terms}
                            onCheckedChange={(checked) => setData('terms', checked)}
                            required
                        />
                        <Label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-opacity-70"
                        >
                            I agree to the <a target="_blank" href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a> and <a target="_blank" href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>
                        </Label>
                    </div>
                    {errors.terms && (
                        <p className="text-sm font-medium text-destructive">
                            {errors.terms}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-end mt-4 pt-2">
                    <Link
                        href={route('login')}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                    >
                        Already registered?
                    </Link>

                    <Button className="ml-4" disabled={processing} type="submit">
                        Register
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
