import { useState } from 'react';
import { 
    Send, 
    Save, 
    ChevronLeft, 
    FileText, 
    Users, 
    Layers, 
    CheckCircle2, 
    AlertCircle 
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import axios from 'axios';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export default function ReviewAndSend({ document, workflow, onBack }) {
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);

    const handleSend = async () => {
        setSending(true);
        setError(null);
        try {
            const response = await axios.post(`/api/workflows/${workflow.id}/initiate`);
            
            if (response.data.redirect_url) {
                window.location.href = response.data.redirect_url;
                return;
            }

            router.visit('/dashboard', { 
                method: 'get',
                data: { flash: { message: 'Workflow initiated successfully!' } } 
            });
        } catch (error) {
            setSending(false);
            if (error.response?.status === 422) {
                setError(error.response.data.message);
            } else {
                setError('Failed to initiate workflow. Please try again.');
            }
        }
    };

    const handleSaveDraft = () => {
        router.visit('/dashboard');
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 mb-6 border border-green-500/20">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight text-foreground">Final Review</h3>
                <p className="text-lg text-muted-foreground mt-2">Everything looks ready! Review the details below before sending.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Document Summary */}
                <Card className="flex flex-col items-center text-center shadow-sm">
                    <CardHeader className="pt-8 pb-2">
                        <div className="h-14 w-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-2 mx-auto">
                            <FileText className="h-7 w-7" />
                        </div>
                        <CardTitle className="text-base font-bold">Document</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-8">
                        <p className="text-sm text-muted-foreground truncate max-w-[200px] mb-4">{document.title}</p>
                        <Badge variant="secondary" className="uppercase text-[10px] tracking-wider font-bold">
                            {workflow.mode}
                        </Badge>
                    </CardContent>
                </Card>

                {/* Signers Summary */}
                <Card className="flex flex-col items-center text-center shadow-sm border-primary/10">
                    <CardHeader className="pt-8 pb-2">
                        <div className="h-14 w-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2 mx-auto">
                            <Users className="h-7 w-7" />
                        </div>
                        <CardTitle className="text-base font-bold">Signers</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-8">
                        <p className="text-sm text-muted-foreground mb-4">
                            {workflow.mode === 'direct' ? '1 (Self)' : `${workflow.signers?.length || 0} participants`}
                        </p>
                        <div className="flex -space-x-2 justify-center">
                             {workflow.signers?.slice(0, 3).map((s, i) => (
                                 <div key={i} className="h-8 w-8 rounded-full bg-primary border-2 border-card flex items-center justify-center text-[10px] text-primary-foreground font-bold shadow-sm">
                                     {s.name[0]}
                                 </div>
                             ))}
                             {(workflow.signers?.length > 3) && (
                                 <div className="h-8 w-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] text-muted-foreground font-bold shadow-sm">
                                     +{workflow.signers.length - 3}
                                 </div>
                             )}
                        </div>
                    </CardContent>
                </Card>

                {/* Fields Summary */}
                <Card className="flex flex-col items-center text-center shadow-sm">
                    <CardHeader className="pt-8 pb-2">
                        <div className="h-14 w-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-2 mx-auto">
                            <Layers className="h-7 w-7" />
                        </div>
                        <CardTitle className="text-base font-bold">Fields</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-8">
                        <p className="text-sm text-muted-foreground mb-4">{workflow.fields?.length || 0} placement(s)</p>
                        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-tighter">
                            Across {new Set(workflow.fields?.map(f => f.page_number)).size || 0} pages
                        </div>
                    </CardContent>
                </Card>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-8">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-border pt-10">
                <Button variant="outline" onClick={onBack} disabled={sending} className="min-w-[140px] gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </Button>
                
                <Button variant="ghost" onClick={handleSaveDraft} disabled={sending} className="min-w-[140px] gap-2">
                    <Save className="h-4 w-4" />
                    Draft
                </Button>

                <Button 
                    onClick={handleSend} 
                    disabled={sending}
                    size="lg"
                    className="min-w-[200px] gap-3 h-12 text-md font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
                >
                    {sending ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Sending...
                        </>
                    ) : (
                        <>
                            Send for Signature
                            <Send className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
