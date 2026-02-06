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
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import axios from 'axios';
import { router } from '@inertiajs/react';

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
            <div className="text-center mb-12">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-3xl font-extrabold text-gray-900">Final Review</h3>
                <p className="text-lg text-gray-500 mt-2">Everything looks ready! Review the details below before sending.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Document Summary */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                        <FileText className="h-7 w-7" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">Document</h4>
                    <p className="text-sm text-gray-500 truncate w-full">{document.title}</p>
                    <div className="mt-4 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase">
                        {workflow.mode} mode
                    </div>
                </div>

                {/* Signers Summary */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <div className="h-14 w-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                        <Users className="h-7 w-7" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">Signers</h4>
                    <p className="text-sm text-gray-500">
                        {workflow.mode === 'direct' ? '1 (Self)' : `${workflow.signers?.length || 0} participants`}
                    </p>
                    <div className="mt-4 flex -space-x-2">
                         {workflow.signers?.slice(0, 3).map((s, i) => (
                             <div key={i} className="h-8 w-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                                 {s.name[0]}
                             </div>
                         ))}
                         {(workflow.signers?.length > 3) && (
                             <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] text-gray-600 font-bold">
                                 +{workflow.signers.length - 3}
                             </div>
                         )}
                    </div>
                </div>

                {/* Fields Summary */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <div className="h-14 w-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
                        <Layers className="h-7 w-7" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">Fields</h4>
                    <p className="text-sm text-gray-500">{workflow.fields?.length || 0} placement(s)</p>
                    <div className="mt-4 text-xs text-gray-400 font-medium">
                        Across {new Set(workflow.fields?.map(f => f.page_number)).size || 0} pages
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-700 font-medium">{error}</div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-gray-100 pt-10">
                <SecondaryButton onClick={onBack} disabled={sending} className="min-w-[160px] justify-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Go Back
                </SecondaryButton>
                
                <SecondaryButton onClick={handleSaveDraft} disabled={sending} className="min-w-[160px] justify-center gap-2 border-dashed">
                    <Save className="h-4 w-4" />
                    Save as Draft
                </SecondaryButton>

                <PrimaryButton 
                    onClick={handleSend} 
                    disabled={sending}
                    className="min-w-[200px] justify-center gap-2 h-12 text-lg shadow-lg shadow-indigo-100"
                >
                    {sending ? 'Sending...' : 'Send for Signature'}
                    <Send className="h-5 w-5" />
                </PrimaryButton>
            </div>
        </div>
    );
}
