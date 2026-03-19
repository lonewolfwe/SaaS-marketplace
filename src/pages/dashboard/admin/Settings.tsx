import { useState, useEffect } from 'react';
import { Globe, CreditCard, Save, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { cn } from '../../../lib/utils';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';
import { toast } from 'react-hot-toast';

interface PlatformSettings {
    maintenanceMode: boolean;
    registrationsOpen: boolean;
    fees: {
        standard: number;
        enterprise: number;
    };
}

interface ApiResponse<T> {
    status: string;
    data: T;
}

export default function AdminSettings() {
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState<PlatformSettings>({
        maintenanceMode: false,
        registrationsOpen: true,
        fees: { standard: 5.0, enterprise: 2.5 }
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${API_URL}/admin/settings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json() as ApiResponse<{ settings: PlatformSettings }>;
                if (data.status === 'success') {
                    setSettings(data.data.settings);
                }
            } catch (err) {
                console.error("Failed to load settings", err);
                toast.error("Failed to load platform settings");
            } finally {
                setIsLoading(false);
            }
        };

        if (token) fetchSettings();
    }, [token]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`${API_URL}/admin/settings`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });
            const data = await res.json();
            if (data.status === 'success') {
                toast.success("Platform settings saved successfully");
            } else {
                throw new Error("Failed to save");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in font-sans">
            <div>
                <h2 className="font-display font-bold text-3xl tracking-tight">Platform Settings</h2>
                <p className="text-muted-foreground mt-1">Global configuration for the marketplace.</p>
            </div>

            <div className="grid gap-6">
                <Card className="border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> General Configuration</CardTitle>
                        <CardDescription>Control core platform availability and features.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="space-y-0.5">
                                <span className="text-sm font-medium text-foreground">Maintenance Mode</span>
                                <p className="text-xs text-muted-foreground">Disable all public access. Admins can still login.</p>
                            </div>
                            <button onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })} className={cn("text-2xl transition-colors", settings.maintenanceMode ? "text-primary" : "text-muted-foreground")}>
                                {settings.maintenanceMode ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="space-y-0.5">
                                <span className="text-sm font-medium text-foreground">Allow New Registrations</span>
                                <p className="text-xs text-muted-foreground">If disabled, new users cannot sign up.</p>
                            </div>
                            <button onClick={() => setSettings({ ...settings, registrationsOpen: !settings.registrationsOpen })} className={cn("text-2xl transition-colors", settings.registrationsOpen ? "text-primary" : "text-muted-foreground")}>
                                {settings.registrationsOpen ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Marketplace Fees</CardTitle>
                        <CardDescription>Adjust the platform commission rate.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Standard Commission (%)</label>
                                <Input
                                    value={settings.fees.standard}
                                    onChange={(e) => setSettings({ ...settings, fees: { ...settings.fees, standard: parseFloat(e.target.value) } })}
                                    type="number"
                                    step="0.1"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Enterprise Commission (%)</label>
                                <Input
                                    value={settings.fees.enterprise}
                                    onChange={(e) => setSettings({ ...settings, fees: { ...settings.fees, enterprise: parseFloat(e.target.value) } })}
                                    type="number"
                                    step="0.1"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end pt-4">
                    <Button size="lg" className="gap-2" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
