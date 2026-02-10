import { useState } from 'react';
import { User, Users, ListOrdered, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";

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
            bg: 'bg-blue-500/10',
        },
        {
            id: 'sequential',
            name: 'Sequential Signing',
            description: 'Signers sign one after another in a specific order. Each person is notified when it is their turn.',
            icon: ListOrdered,
            color: 'text-primary',
            bg: 'bg-primary/10',
        },
        {
            id: 'parallel',
            name: 'Parallel Signing',
            description: 'Everyone can sign at the same time. No specific order is enforced.',
            icon: Users,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
        },
    ];

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (workflowId) {
                const response = await axios.patch(`/api/workflows/${workflowId}`, { mode });
                onUpdated(response.data);
            } else {
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
                        <Card
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={cn(
                                'relative flex flex-col cursor-pointer transition-all duration-200 hover:shadow-md border-2',
                                mode === m.id ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'hover:border-primary/50'
                            )}
                        >
                            <CardHeader className="p-6 pb-2">
                                <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center mb-2', m.bg)}>
                                    <Icon className={cn('h-6 w-6', m.color)} />
                                </div>
                                <CardTitle className="text-lg font-bold">{m.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 flex-grow">
                                <CardDescription className="text-muted-foreground leading-relaxed">
                                    {m.description}
                                </CardDescription>
                            </CardContent>
                            
                            {mode === m.id && (
                                <div className="absolute top-4 right-4 h-5 w-5 bg-primary rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-200">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>

            <div className="flex justify-end">
                <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="group"
                >
                    {loading ? "Saving..." : (
                        <>
                            Continue to {mode === 'direct' ? 'Field Placement' : 'Signers'}
                            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
