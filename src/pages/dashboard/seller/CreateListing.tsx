import { useState } from 'react';
import { Plus, X, ChevronRight, ChevronLeft, Check, Image as ImageIcon, DollarSign, FileText, Sparkles, Layers, TrendingUp, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '@/config';

const STEPS = [
    { id: 1, label: 'Basics', icon: FileText, desc: "Title & category" },
    { id: 2, label: 'Media', icon: ImageIcon, desc: "Images & files" },
    { id: 3, label: 'Pricing', icon: DollarSign, desc: "Cost & delivery" },
    { id: 4, label: 'Review', icon: Check, desc: "Final check" },
];

export default function CreateListing() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        tagline: '', // logic to put this in description or separate? Backend 'Listing' model doesn't have tagline. Let's append to description or ignore for now.
        category: '',
        subCategory: '',
        description: '',
        price: '',
        priceModel: 'one-time', // 'one-time' or 'subscription'
        coverImage: ''
    });

    const [features, setFeatures] = useState(['']);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const addFeature = () => setFeatures([...features, '']);
    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };
    const removeFeature = (index: number) => {
        const newFeatures = features.filter((_, i) => i !== index);
        setFeatures(newFeatures);
    };

    const handlePublish = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Transform data for backend
            const listingData = {
                title: formData.title,
                description: `**${formData.tagline}**\n\n${formData.description}\n\n### Key Features\n${features.map(f => `- ${f}`).join('\n')}`,
                category: formData.category,
                price: Number(formData.price),
                pricingModel: formData.priceModel === 'subscription' ? 'subscription_monthly' : 'one_time',
                images: formData.coverImage ? [formData.coverImage] : [],
                status: 'pending' // Make it pending so it's ready for review (and potentially visible in some filtered views)
            };

            const response = await fetch(`${API_URL}/listings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(listingData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create listing');
            }

            // Success
            navigate('/dashboard/seller/listings');
        } catch (err: any) {
            setError(err.message);
            // Show error (maybe scroll to top or show toast? For now, simple alert or inline error if we add it)
            alert(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Create New Listing</h2>
                    <p className="text-muted-foreground mt-1">Share your product with thousands of developers.</p>
                </div>
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    Save as Draft
                </button>
            </div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-12">
                {/* Sidebar Stepper */}
                <div className="hidden lg:block space-y-2 sticky top-24 self-start">
                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;

                        return (
                            <div
                                key={step.id}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                                    isActive ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50 border border-transparent"
                                )}
                            >
                                <div
                                    className={cn(
                                        "h-10 w-10 rounded-lg flex items-center justify-center border transition-colors",
                                        isActive ? "border-primary bg-primary text-primary-foreground shadow-sm" :
                                            isCompleted ? "border-primary/50 bg-primary/10 text-primary" :
                                                "border-border bg-background text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                </div>
                                <div>
                                    <div className={cn("font-semibold text-sm", isActive ? "text-foreground" : "text-muted-foreground")}>{step.label}</div>
                                    <div className="text-xs text-muted-foreground">{step.desc}</div>
                                </div>
                                {isActive && (
                                    <ChevronRight className="h-4 w-4 ml-auto text-primary animate-in slide-in-from-left-2" />
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Mobile Stepper */}
                <div className="lg:hidden flex justify-between gap-2 overflow-x-auto pb-4">
                    {STEPS.map((step) => (
                        <div key={step.id} className={cn(
                            "flex flex-col items-center gap-1 min-w-[80px]",
                            step.id === currentStep ? "opacity-100" : "opacity-50"
                        )}>
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border",
                                step.id <= currentStep ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"
                            )}>
                                {step.id}
                            </div>
                            <span className="text-xs font-medium">{step.label}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-8">
                    <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm min-h-[500px]">
                        {/* Step 1: Basics */}
                        {/* Step 1: Basics */}
                        {currentStep === 1 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div className="border-b border-border pb-6">
                                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Product Details
                                    </h3>
                                    <p className="text-muted-foreground">The core information about what you're selling.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none">Product Title <span className="text-destructive">*</span></label>
                                            <input
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                placeholder="e.g. Pro Analytics Suite"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none">Tagline <span className="text-destructive">*</span></label>
                                            <input
                                                name="tagline"
                                                value={formData.tagline}
                                                onChange={handleChange}
                                                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                placeholder="e.g. The analytics tool for modern SaaS"
                                            />
                                            <p className="text-xs text-muted-foreground">Catchy 50-character description for cards and listings.</p>
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none">Category <span className="text-destructive">*</span></label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                >
                                                    <option value="">Select a category</option>
                                                    <option value="Marketing">Marketing</option>
                                                    <option value="DevTools">DevTools</option>
                                                    <option value="Productivity">Productivity</option>
                                                    <option value="Design">Design</option>
                                                    <option value="Finance">Finance</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none">Sub-category</label>
                                                <select
                                                    name="subCategory"
                                                    value={formData.subCategory}
                                                    onChange={handleChange}
                                                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                >
                                                    <option value="">Select sub-category</option>
                                                    <option value="SEO">SEO</option>
                                                    <option value="Email">Email</option>
                                                    <option value="Social Media">Social Media</option>
                                                    <option value="Analytics">Analytics</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none">Description <span className="text-destructive">*</span></label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                                                placeholder="Describe your product in detail..."
                                            />
                                            <p className="text-xs text-muted-foreground">Markdown is supported.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Media & Features */}
                        {currentStep === 2 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div className="border-b border-border pb-6">
                                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5 text-primary" />
                                        Media & Features
                                    </h3>
                                    <p className="text-muted-foreground">Visuals increase conversion by 40%.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none">Cover Image URL</label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <input
                                                        name="coverImage"
                                                        value={formData.coverImage}
                                                        onChange={handleChange}
                                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-9 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        placeholder="https://example.com/image.png"
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Paste a direct link to your product image (Unsplash, etc.)</p>
                                        </div>

                                        {formData.coverImage && (
                                            <div className="mt-4 rounded-xl border border-border overflow-hidden h-48 w-full md:w-80 bg-muted relative">
                                                <img
                                                    src={formData.coverImage}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+URL'; }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 pt-6">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium leading-none">Key Features</label>
                                            <span className="text-xs text-muted-foreground">Add up to 8 features</span>
                                        </div>
                                        <div className="space-y-3">
                                            {features.map((feature, index) => (
                                                <div key={index} className="flex gap-2 group">
                                                    <div className="relative flex-1">
                                                        <Sparkles className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                        <input
                                                            value={feature}
                                                            onChange={(e) => updateFeature(index, e.target.value)}
                                                            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                            placeholder="e.g. Real-time collaborations"
                                                            autoFocus={index === features.length - 1 && index > 0}
                                                        />
                                                    </div>
                                                    {features.length > 1 && (
                                                        <button
                                                            onClick={() => removeFeature(index)}
                                                            className="h-10 w-10 flex items-center justify-center rounded-md border border-input hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                onClick={addFeature}
                                                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline px-1"
                                            >
                                                <Plus className="h-4 w-4" /> Add another feature
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Pricing */}
                        {currentStep === 3 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div className="border-b border-border pb-6">
                                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                        Pricing Strategy
                                    </h3>
                                    <p className="text-muted-foreground">How do you want to sell your product?</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium leading-none">Pricing Model</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => setFormData({ ...formData, priceModel: 'one-time' })}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-4 rounded-xl border-2 shadow-sm h-32 gap-3 transition-all",
                                                        formData.priceModel === 'one-time' ? "border-primary bg-primary/5 text-primary" : "border-input bg-background hover:bg-accent hover:border-primary/50 text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    <div className={cn("p-2 rounded-full", formData.priceModel === 'one-time' ? "bg-primary/20" : "bg-muted")}><DollarSign className="h-5 w-5" /></div>
                                                    <span className="font-semibold">One-time</span>
                                                </button>
                                                <button
                                                    onClick={() => setFormData({ ...formData, priceModel: 'subscription' })}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-4 rounded-xl border-2 shadow-sm h-32 gap-3 transition-all",
                                                        formData.priceModel === 'subscription' ? "border-primary bg-primary/5 text-primary" : "border-input bg-background hover:bg-accent hover:border-primary/50 text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    <div className={cn("p-2 rounded-full", formData.priceModel === 'subscription' ? "bg-primary/20" : "bg-muted")}><Layers className="h-5 w-5" /></div>
                                                    <span className="font-semibold">Subscription</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none">Price Amount ($)</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">$</span>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background pl-7 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-medium"
                                                    placeholder="49.00"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-xl bg-muted/40 border border-border h-fit">
                                        <h4 className="font-semibold mb-4 text-sm flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4" /> Revenue Calculator
                                        </h4>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Listing Price</span>
                                                <span className="font-medium">$49.00</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Platform Fee (5%)</span>
                                                <span className="text-red-500 font-medium">-$2.45</span>
                                            </div>
                                            <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                                                <span className="font-bold">You Earn</span>
                                                <span className="font-bold text-xl text-green-600">$46.55</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                                                Payouts are processed automatically to your connected Stripe account every Wednesday.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Review */}
                        {currentStep === 4 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div className="border-b border-border pb-6">
                                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        Review & Publish
                                    </h3>
                                    <p className="text-muted-foreground">Double check everything before going live.</p>
                                </div>

                                <div className="rounded-xl border border-border overflow-hidden bg-background shadow-lg max-w-2xl mx-auto">
                                    <div className="h-56 bg-muted w-full relative group cursor-pointer">
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground z-10">
                                            <div className="flex flex-col items-center gap-2">
                                                <ImageIcon className="h-10 w-10 opacity-50" />
                                                <span className="text-sm font-medium">Listing Preview Cover</span>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                            <div>
                                                <div className="inline-flex items-center rounded-full border border-transparent bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-2">
                                                    {formData.category || 'Category'}
                                                </div>
                                                <h4 className="text-2xl font-bold tracking-tight">{formData.title || 'Product Title'}</h4>
                                                <p className="text-muted-foreground mt-1 text-lg">{formData.tagline || 'Your product tagline'}</p>
                                            </div>
                                            <div className="text-2xl font-bold">${formData.price || '0.00'}</div>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-border">
                                            <h5 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Includes</h5>
                                            <ul className="grid sm:grid-cols-2 gap-3">
                                                {features.filter(f => f).map((feature, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm">
                                                        <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                                                            <Check className="h-3 w-3" />
                                                        </div>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border max-w-2xl mx-auto">
                                    <input type="checkbox" id="terms" className="h-4 w-4 rounded border-input text-primary focus:ring-primary" />
                                    <label htmlFor="terms" className="text-sm text-foreground select-none cursor-pointer">
                                        I agree to the <span className="underline hover:text-primary">Terms of Service</span> and confirm I have rights to sell this product.
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2 mb-4">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {/* Footer Nav */}
                    <div className="flex justify-between pt-4">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1 || isLoading}
                            className="flex items-center gap-2 h-11 px-8 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <ChevronLeft className="h-4 w-4" /> Back
                        </button>

                        {currentStep < STEPS.length ? (
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 h-11 px-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors shadow-lg shadow-primary/20"
                            >
                                Next Step <ChevronRight className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handlePublish}
                                disabled={isLoading}
                                className="flex items-center gap-2 h-11 px-8 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium transition-colors shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>Publishing...</>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" /> Publish Listing
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
