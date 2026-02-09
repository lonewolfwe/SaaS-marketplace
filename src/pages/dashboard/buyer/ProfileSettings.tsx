import { useState, useEffect } from 'react';
import { User, Mail, Shield, Camera, Lock, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';
import { Button } from '@/components/ui/Button';

export default function BuyerProfile() {
    const { user, token, refreshUser } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        bio: '',
        companyName: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.profile?.firstName || '',
                lastName: user.profile?.lastName || '',
                email: user.email || '',
                bio: (user.profile as any)?.bio || '',
                companyName: (user.profile as any)?.companyName || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        setSuccessMessage('');
        try {
            const res = await fetch(`${API_URL}/users/update-profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    bio: formData.bio,
                    companyName: formData.companyName
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSuccessMessage('Profile updated successfully!');
                refreshUser();
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
                    <p className="text-muted-foreground">Manage your account information and preferences.</p>
                </div>
                <div className="flex gap-2 items-center">
                    {successMessage && <span className="text-sm text-green-600 flex items-center gap-1"><Check className="h-4 w-4" /> {successMessage}</span>}
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                {/* Sidebar Navigation for Settings (Visual only for now) */}
                <nav className="flex flex-col gap-1">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-accent text-accent-foreground">
                        <User className="h-4 w-4" />
                        General
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <Shield className="h-4 w-4" />
                        Security
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <Lock className="h-4 w-4" />
                        Billing
                    </button>
                </nav>

                <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-2 border-background ring-2 ring-border overflow-hidden">
                                    {user?.profile?.avatarUrl ? (
                                        <img src={user.profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        user?.profile?.firstName?.[0] || 'U'
                                    )}
                                </div>
                                <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <Camera className="h-6 w-6 text-white" />
                                </button>
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="font-bold text-lg">Your Avatar</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                                    This will be displayed on your profile and in public spaces.
                                </p>
                                <div className="mt-4 flex gap-2 justify-center sm:justify-start">
                                    <button className="text-xs font-medium border border-input bg-background hover:bg-accent px-3 py-1.5 rounded-md transition-colors">
                                        Upload New
                                    </button>
                                    <button className="text-xs font-medium text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-md transition-colors">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info Form */}
                    <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="firstName">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="firstName"
                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="lastName">Last Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="lastName"
                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="email"
                                        className="flex h-10 w-full rounded-md border border-input bg-muted pl-10 px-3 py-2 text-sm text-muted-foreground ring-offset-background cursor-not-allowed"
                                        value={formData.email}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="company">Company</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="company"
                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        placeholder="Company Name"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Bio</label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                placeholder="Tell us a little about yourself"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            />
                            <p className="text-[0.8rem] text-muted-foreground">
                                Brief description for your profile. URLs are hyperlinked.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-yellow-200 bg-yellow-50/50 p-4 dark:bg-yellow-900/10 dark:border-yellow-900/30">
                        <div className="flex gap-4">
                            <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900/40">
                                <Shield className="h-5 w-5 text-yellow-700 dark:text-yellow-500" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-yellow-900 dark:text-yellow-500 text-sm">Security Recommendation</h4>
                                <p className="text-sm text-yellow-700 dark:text-yellow-600 mt-1">
                                    Your account is not using Two-Factor Authentication. Enable it to add an extra layer of security.
                                </p>
                            </div>
                            <button className="text-sm font-semibold text-yellow-900 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 whitespace-nowrap self-center">
                                Enable 2FA →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
