import { useState } from 'react';
import { User, Users, ListOrdered, ChevronRight } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';
import clsx from 'clsx';

export default function ModeSelector({ documentId, workflowId, initialMode, onCreated, onUpdated }) {
    const [mode, setMode] = useState(initialMode || 'direct');
    const [loading, setLoading] = useState(false);

    const modes = [
        {
            id: 'direct',
            name: 'Direct Signing (Self-Sign)',
            description: 'You are the only signer. Quick and easy for documents you just need to sign yourself.',
            icon: User,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        {
            id: 'sequential',
            name: 'Sequential Signing',
            description: 'Signers sign one after another in a specific order. Each person is notified when it is their turn.',
            icon: ListOrdered,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
        },
        {
            id: 'parallel',
            name: 'Parallel Signing',
            description: 'Everyone can sign at the same time. No specific order is enforced.',
            icon: Users,
            color: 'text-green-500',
            bg: 'bg-green-50',
        },
    ];

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (workflowId) {
                const response = await axios.patch(`/api/workflows/${workflowId}`, { mode });
                onUpdated(response.data);
            } else {
                // Wait, backend store needs document_id
                const response = await axios.post('/api/workflows', { 
                    document_id: documentId,
                    mode 
                });
                onCreated(response.data);
            }
        } catch (error) {
            console.error('Failed to save workflow mode', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-10">
                {modes.map((m) => {
                    const Icon = m.icon;
                    return (
                        <div
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={clsx(
                                'relative flex flex-col p-6 cursor-pointer rounded-2xl border-2 transition-all duration-200 hover:shadow-lg',
                                mode === m.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-200 bg-white hover:border-gray-300'
                            )}
                        >
                            <div className={clsx('h-12 w-12 rounded-xl flex items-center justify-center mb-4', m.bg)}>
                                <Icon className={clsx('h-6 w-6', m.color)} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{m.name}</h3>
                            <p className="text-sm text-gray-500 flex-grow">{m.description}</p>
                            
                            {mode === m.id && (
                                <div className="absolute top-4 right-4 h-6 w-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-white" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end">
                <PrimaryButton 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="gap-2"
                >
                    Continue to {mode === 'direct' ? 'Field Placement' : 'Signers'}
                    <ChevronRight className="h-4 w-4" />
                </PrimaryButton>
            </div>
        </div>
    );
}
