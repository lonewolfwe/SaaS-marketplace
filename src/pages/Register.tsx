import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { API_URL } from '@/config';

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer'); // basic role selection
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName || 'User',
                    lastName: lastName || 'Name',
                    email,
                    password,
                    role
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Auto-login and redirect
            login(data.token, data.data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-8 w-full max-w-md mx-auto animate-fade-in">
            <div className="text-center space-y-2">
                <h1 className="font-display text-3xl font-bold tracking-tight">Create an account</h1>
                <p className="text-muted-foreground text-sm">
                    Enter your email below to create your account
                </p>
            </div>

            <Card className="border-border/60 shadow-lg">
                <CardContent className="pt-6">
                    <form onSubmit={handleRegister} className="space-y-4">
                        {error && <div className="text-red-500 text-xs">{error}</div>}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground" htmlFor="firstName">First Name</label>
                                <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground" htmlFor="lastName">Last Name</label>
                                <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required disabled={isLoading} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground" htmlFor="email">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground" htmlFor="password">Password</label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground" htmlFor="role">I am a</label>
                            <select
                                id="role"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="buyer">Buyer (I want to buy)</option>
                                <option value="seller">Seller (I want to sell)</option>
                            </select>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="text-center text-xs text-muted-foreground max-w-xs mx-auto">
                By clicking continue, you agree to our{" "}
                <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
                    Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                </Link>
                .
            </div>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline underline-offset-4">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
