import { useState, useEffect } from 'react';
import { UserPlus, Trash2, GripVertical, ChevronRight, ChevronLeft, Mail, User, Users } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import axios from 'axios';
import { Reorder } from 'framer-motion';

export default function SignerManagement({ workflow, onNext, onBack }) {
    const [signers, setSigners] = useState(workflow.signers || []);
    const [newSigner, setNewSigner] = useState({ email: '', name: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await axios.post(`/api/workflows/${workflow.id}/signers`, newSigner);
            setSigners([...signers, response.data]);
            setNewSigner({ email: '', name: '' });
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || { message: error.response.data.message });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (signerId) => {
        try {
            await axios.delete(`/api/workflows/${workflow.id}/signers/${signerId}`);
            setSigners(signers.filter(s => s.id !== signerId));
        } catch (error) {
            console.error('Failed to remove signer', error);
        }
    };

    const handleReorder = async (newOrder) => {
        setSigners(newOrder);
        try {
            const orders = newOrder.map((s, index) => ({ id: s.id, order: index + 1 }));
            await axios.patch(`/api/workflows/${workflow.id}/signers/reorder`, { orders });
        } catch (error) {
            console.error('Failed to update signer order', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Signers</h3>
                <p className="text-gray-500">
                    {workflow.mode === 'sequential' 
                        ? 'Add signers in the order they should sign. Drag to reorder.' 
                        : 'Add all people who need to sign this document.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Add Signer Form */}
                <div className="bg-gray-50 p-6 rounded-2xl h-fit border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-indigo-600" />
                        Add New Signer
                    </h4>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Full Name" />
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-gray-400" />
                                </div>
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="block w-full pl-10"
                                    value={newSigner.name}
                                    onChange={(e) => setNewSigner({ ...newSigner, name: e.target.value })}
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email Address" />
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="block w-full pl-10"
                                    value={newSigner.email}
                                    onChange={(e) => setNewSigner({ ...newSigner, email: e.target.value })}
                                    placeholder="jane@example.com"
                                    required
                                />
                            </div>
                            <InputError message={errors.email || errors.message} />
                        </div>

                        <PrimaryButton className="w-full justify-center" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Signer'}
                        </PrimaryButton>
                    </form>
                </div>

                {/* Signers List */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                        Signers List ({signers.length}/10)
                    </h4>
                    
                    {signers.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-400">No signers added yet.</p>
                        </div>
                    ) : (
                        <Reorder.Group 
                            axis="y" 
                            values={signers} 
                            onReorder={workflow.mode === 'sequential' ? handleReorder : () => {}}
                            className="space-y-3"
                        >
                            {signers.map((signer, index) => (
                                <Reorder.Item 
                                    key={signer.id} 
                                    value={signer}
                                    className="bg-white p-4 rounded-xl border border-gray-200 flex items-center shadow-sm group"
                                >
                                    {workflow.mode === 'sequential' && (
                                        <div className="mr-4 text-gray-400 cursor-grab active:cursor-grabbing">
                                            <GripVertical className="h-5 w-5" />
                                        </div>
                                    )}
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2">
                                            {workflow.mode === 'sequential' && (
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                                                    {index + 1}
                                                </span>
                                            )}
                                            <span className="font-medium text-gray-900">{signer.name}</span>
                                        </div>
                                        <div className="text-sm text-gray-500">{signer.email}</div>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(signer.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    )}

                    {errors.signers && <div className="mt-4 text-sm text-red-600 font-medium">{errors.signers}</div>}
                </div>
            </div>

            <div className="mt-12 flex justify-between border-t border-gray-100 pt-8">
                <SecondaryButton onClick={onBack} className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </SecondaryButton>
                <PrimaryButton 
                    onClick={onNext} 
                    disabled={signers.length === 0}
                    className="gap-2"
                >
                    Continue to Field Placement
                    <ChevronRight className="h-4 w-4" />
                </PrimaryButton>
            </div>
        </div>
    );
}
