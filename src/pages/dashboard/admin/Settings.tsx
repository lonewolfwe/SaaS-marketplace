import { useState } from 'react';
import { Globe, CreditCard, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { cn } from '../../../lib/utils';

export default function AdminSettings() {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [registrationsOpen, setRegistrationsOpen] = useState(true);

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
                            <button onClick={() => setMaintenanceMode(!maintenanceMode)} className={cn("text-2xl transition-colors", maintenanceMode ? "text-primary" : "text-muted-foreground")}>
                                {maintenanceMode ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="space-y-0.5">
                                <span className="text-sm font-medium text-foreground">Allow New Registrations</span>
                                <p className="text-xs text-muted-foreground">If disabled, new users cannot sign up.</p>
                            </div>
                            <button onClick={() => setRegistrationsOpen(!registrationsOpen)} className={cn("text-2xl transition-colors", registrationsOpen ? "text-primary" : "text-muted-foreground")}>
                                {registrationsOpen ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
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
                                <Input defaultValue="5.0" type="number" step="0.1" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Enterprise Commission (%)</label>
                                <Input defaultValue="2.5" type="number" step="0.1" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end pt-4">
                    <Button size="lg" className="gap-2">
                        <Save className="h-4 w-4" /> Save Configuration
                    </Button>
                </div>
            </div>
        </div>
    );
}
