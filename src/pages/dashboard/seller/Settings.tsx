import { useState, useEffect } from 'react';
import { User, Lock, Bell, CreditCard, Save, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { cn } from '../../../lib/utils';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';

export default function SellerSettings() {
    const { token, user, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        bio: '',
        website: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.profile?.firstName || '',
                lastName: user.profile?.lastName || '',
                companyName: user.profile?.companyName || '',
                bio: user.profile?.bio || '',
                website: ''
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await fetch(`${API_URL}/users/update-profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.status === 'success') {
                setMessage({ type: 'success', text: 'Profile updated successfully' });
                // Refresh local user context to update sidebar etc.
                if (refreshUser) await refreshUser();
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Network error occurred' });
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile & Brand', icon: User },
        { id: 'payouts', label: 'Payout Settings', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
    ];

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in font-sans pb-20">
            <div>
                <h2 className="font-display font-bold text-3xl tracking-tight">Settings</h2>
                <p className="text-muted-foreground mt-1">Manage your seller profile and account preferences.</p>
            </div>

            <div className="grid md:grid-cols-[240px_1fr] gap-8">
                {/* Sidebar Navigation */}
                <div className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                activeTab === tab.id
                                    ? "bg-secondary text-foreground"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="space-y-6">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <Card className="border-border shadow-sm">
                                <CardHeader>
                                    <CardTitle>Public Profile</CardTitle>
                                    <CardDescription>This is how customers see you on the marketplace.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">First Name</label>
                                            <Input name="firstName" value={formData.firstName} onChange={handleChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Last Name</label>
                                            <Input name="lastName" value={formData.lastName} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Display Name / Company</label>
                                        <Input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g. Acme Corp" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {message && (
                                <div className={cn("p-3 rounded-md text-sm flex items-center gap-2", message.type === 'success' ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600")}>
                                    {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : null}
                                    {message.text}
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button className="gap-2" onClick={handleSaveProfile} disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payouts' && (
                        <Card className="border-border shadow-sm">
                            <CardHeader>
                                <CardTitle>Payout Method</CardTitle>
                                <CardDescription>Connect with Stripe to receive earnings.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-muted/20 border border-border rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-[#635BFF] rounded flex items-center justify-center text-white font-bold">S</div>
                                        <div>
                                            <div className="font-semibold text-sm">Stripe Connect</div>
                                            <div className="text-xs text-muted-foreground font-medium">Not connected</div>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Connect</Button>
                                </div>
                                <p className="text-xs text-muted-foreground">In a real app, this would redirect to Stripe Onboarding.</p>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'security' && (
                        <Card className="border-border shadow-sm">
                            <CardHeader>
                                <CardTitle>Security</CardTitle>
                                <CardDescription>Manage your password and authentication.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline">Change Password</Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
