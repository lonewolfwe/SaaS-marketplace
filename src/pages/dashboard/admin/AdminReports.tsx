import { FileText, Download, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';

interface Report {
    id: number;
    title: string;
    description: string;
    date: string;
}

interface ApiResponse<T> {
    status: string;
    data: T;
}

export default function AdminReports() {
    const { token } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/reports`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json() as ApiResponse<{ reports: Report[] }>;
            if (data.status === 'success') {
                setReports(data.data.reports);
            }
        } catch (err) {
            console.error("Failed to fetch reports", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchReports();
    }, [token]);

    return (
        <div className="space-y-6 font-sans text-sm animate-fade-in">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div>
                    <h2 className="font-bold text-lg leading-none">System Reports</h2>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">Export data for analysis and compliance.</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchReports} className="h-8 gap-2">
                    <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {isLoading && reports.length === 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="h-32 bg-muted/20 animate-pulse border-border shadow-none" />
                    ))}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {reports.map((report) => (
                        <Card key={report.id} className="rounded-sm border-border shadow-none p-4 hover:border-primary/50 transition-colors group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-10 w-10 bg-muted/50 rounded flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                    <FileText size={20} />
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <Download size={16} />
                                </Button>
                            </div>
                            <h3 className="font-bold text-sm mb-1">{report.title}</h3>
                            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{report.description}</p>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono bg-muted/30 w-fit px-2 py-1 rounded">
                                <Calendar size={10} />
                                {report.date}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
