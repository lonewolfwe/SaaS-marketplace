import { FileText, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const REPORTS = [
    { title: "Financial Summary (Monthly)", description: "Revenue, payouts, and taxes for the selected month.", date: "Oct 2023" },
    { title: "User Growth Report", description: "New signups, churn rate, and LTV analysis.", date: "Oct 2023" },
    { title: "Content Moderation Log", description: "History of all flagged and removed listings.", date: "Last 30 Days" },
    { title: "Platform Health Check", description: "System uptime, errors, and performance metrics.", date: "Real-time" },
];

export default function AdminReports() {
    return (
        <div className="space-y-6 font-sans text-sm">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div>
                    <h2 className="font-bold text-lg leading-none">System Reports</h2>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">Export data for analysis and compliance.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {REPORTS.map((report, i) => (
                    <Card key={i} className="rounded-sm border-border shadow-none p-4 hover:border-primary/50 transition-colors group cursor-pointer">
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
        </div>
    );
}
