import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const { data, setData, post, errors } = useForm({
        first_name: '',
        last_name:'',
        email: '',
        password: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/register');
    }

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <form method='post' onSubmit={handleSubmit}>
                <>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        id="first"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="first"
                                        name="first"
                                        placeholder="First name"
                                        onChange={(e)=>setData('first_name', e.target.value)}
                                        value={data.first_name}
                                    />
                                    <InputError
                                        message={errors.first_name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex-1">
                                    <Input
                                        id="last"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={2}
                                        autoComplete="last"
                                        name="last"
                                        placeholder="Last name"
                                        onChange={(e)=>setData('last_name', e.target.value)}
                                        value={data.last_name}
                                    />
                                    <InputError
                                        message={errors.last_name}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={4}
                                autoComplete="email"
                                name="email"
                                placeholder="email@example.com"
                                onChange={(e)=>setData('email', e.target.value)}
                                value={data.email}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={5}
                                autoComplete="new-password"
                                name="password"
                                placeholder="Password"
                                onChange={(e)=>setData('password', e.target.value)}
                                value={data.password}
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/*<div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirm password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={6}
                                autoComplete="new-password"
                                name="password_confirmation"
                                placeholder="Confirm password"
                                onChange={(e)=>setData('password', e.target.value)}
                                value={data.password}
                            />
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>*/}

                        <Button
                            type="submit"
                            className="mt-2 w-full"
                            tabIndex={7}
                            data-test="register-user-button"
                        >
                            {/*processing && <Spinner />*/}
                            Create account
                        </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground mt-6">
                        <Link href={'/login'}>Already have an account?</Link>
                    </div>
                </>
            </form>
        </AuthLayout>
    );
}
