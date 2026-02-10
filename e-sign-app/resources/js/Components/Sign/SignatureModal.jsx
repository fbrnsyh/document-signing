import { useState } from 'react';
import Modal from '@/Components/Modal';
import { Signature, Type, Upload, X } from 'lucide-react';
import clsx from 'clsx';
import SignatureCanvas from './SignatureCanvas';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

export default function SignatureModal({ show, onClose, onSave, field }) {
    const [method, setMethod] = useState('draw');
    const [typedName, setTypedName] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);

    const methods = [
        { id: 'draw', name: 'Draw', icon: Signature },
        { id: 'type', name: 'Type', icon: Type },
        { id: 'upload', name: 'Upload', icon: Upload },
    ];

    const handleTypedSave = () => {
        if (!typedName) return;
        // Create canvas with typed name
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        ctx.font = 'italic 48px "Brush Script MT", cursive'; // Or similar script font
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName, 200, 75);
        onSave(canvas.toDataURL('image/png'));
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => onSave(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Signature className="h-5 w-5 text-primary" />
                        Apply Your Signature
                    </h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex border-b border-border mb-6">
                    {methods.map((m) => {
                        const Icon = m.icon;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setMethod(m.id)}
                                className={clsx(
                                    'flex-1 py-3 text-sm font-medium transition-colors border-b-2 flex items-center justify-center gap-2',
                                    method === m.id
                                        ? 'border-primary text-primary bg-primary/10'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {m.name}
                            </button>
                        );
                    })}
                </div>

                {method === 'draw' && (
                    <SignatureCanvas onSave={onSave} onCancel={onClose} />
                )}

                {method === 'type' && (
                    <div className="space-y-6 py-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Type your name</label>
                            <TextInput
                                className="w-full text-2xl font-serif italic text-center p-4 bg-background text-foreground border-border"
                                value={typedName}
                                onChange={(e) => setTypedName(e.target.value)}
                                placeholder="Your Name"
                                autoFocus
                            />
                        </div>
                        <div className="bg-muted p-6 rounded-xl border border-border flex flex-col items-center justify-center h-40">
                            <span className="text-xs text-muted-foreground/50 mb-4 uppercase tracking-widest font-semibold text-center">Preview</span>
                            <span className="text-4xl font-serif italic text-foreground border-b border-border pb-2 px-10">
                                {typedName || 'Sign Here'}
                            </span>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                            <PrimaryButton onClick={handleTypedSave} disabled={!typedName}>
                                Apply Signature
                            </PrimaryButton>
                        </div>
                    </div>
                )}

                {method === 'upload' && (
                    <div className="space-y-6 py-4">
                        <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center bg-muted hover:bg-muted/80 transition-colors cursor-pointer relative">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                            />
                            <div className="p-4 bg-card rounded-full shadow-sm mb-4">
                                <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">Click or drag signature image</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG or SVG (Max 5MB)</p>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
