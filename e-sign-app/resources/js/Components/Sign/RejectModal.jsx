import { useState } from 'react';
import Modal from '@/Components/Modal';
import { XCircle, AlertTriangle, X } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';

export default function RejectModal({ show, onClose, onConfirm, processing }) {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (reason.length < 10) {
            setError('Reason must be at least 10 characters long.');
            return;
        }
        setError('');
        onConfirm(reason);
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-destructive flex items-center gap-2">
                        <XCircle className="h-5 w-5" />
                        Reject Document
                    </h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                    <p className="text-sm text-destructive leading-relaxed font-medium">
                        Rejecting this document will cancel the entire signing workflow for all parties. This action cannot be undone.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Reason for rejection *</label>
                        <textarea
                            className="w-full bg-background border-border text-foreground rounded-xl focus:ring-destructive focus:border-destructive min-h-[120px] text-sm"
                            placeholder="Please explain why you are rejecting this document..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        {error && <InputError message={error} className="mt-2 text-destructive" />}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                        <DangerButton onClick={handleSubmit} disabled={processing}>
                            {processing ? 'Processing...' : 'Reject Document'}
                        </DangerButton>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
