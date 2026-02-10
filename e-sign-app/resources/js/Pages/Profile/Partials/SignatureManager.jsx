import { useState, useRef } from "react";
import { useForm } from "@inertiajs/react";
import SignatureCanvas from "@/Components/Sign/SignatureCanvas";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle,
    DialogTrigger
} from "@/Components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { 
    PenLine, 
    Type, 
    Upload, 
    Trash2, 
    Plus, 
    CheckCircle2, 
    Loader2,
    AlertCircle,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignatureManager({ signature, className = "" }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeTab, setActiveTab] = useState("draw");
    const signatureRef = useRef(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        signature: "",
        signature_type: "drawn",
    });

    const createSignature = (e) => {
        e.preventDefault();

        if (activeTab === "draw") {
            if (signatureRef.current) {
                const signatureData = signatureRef.current.toDataURL();
                setData("signature", signatureData);
                setData("signature_type", "drawn");
            }
        }

        post(route("profile.signature.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowCreateModal(false);
            },
            onError: (errors) => {
                console.error("Signature save error:", errors);
            },
        });
    };

    const deleteSignature = (e) => {
        e.preventDefault();

        post(route("profile.signature.delete"), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-foreground uppercase tracking-widest">
                            Digital Signature
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground font-medium">
                            Manage your saved signature for instant document signing.
                        </p>
                    </div>
                    {signature && (
                        <Badge variant="outline" className="border-green-500/20 bg-green-500/5 text-green-600 font-bold px-3">
                            VERIFIED
                        </Badge>
                    )}
                </div>
            </header>

            <div className="mt-8">
                {signature ? (
                    <div className="space-y-6">
                        <div className="relative group">
                            <div className="p-8 border border-border/60 rounded-[2rem] bg-muted/20 flex items-center justify-center min-h-[160px] shadow-inner overflow-hidden">
                                <img
                                    src={signature.signature_url}
                                    alt="Your signature"
                                    className="max-h-24 dark:invert opacity-90 group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-background/80 hover:bg-background" onClick={() => setShowCreateModal(true)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full shadow-lg shadow-destructive/20" onClick={() => setShowDeleteModal(true)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Button 
                                variant="outline"
                                onClick={() => setShowCreateModal(true)}
                                className="rounded-xl h-12 px-8 font-black uppercase tracking-widest border-2"
                            >
                                <PenLine className="mr-2 h-4 w-4" />
                                Replace Signature
                            </Button>

                            <Button 
                                variant="ghost"
                                onClick={() => setShowDeleteModal(true)}
                                className="rounded-xl h-12 px-8 font-bold text-destructive hover:bg-destructive/10"
                            >
                                Clear Signature
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-border/60 rounded-[2rem] bg-muted/5 group hover:bg-muted/10 transition-colors">
                        <div className="h-16 w-16 bg-background rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                            <PenLine className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <p className="text-muted-foreground font-medium italic mb-6">
                            No saved signature detected in your vault.
                        </p>
                        <Button 
                            onClick={() => setShowCreateModal(true)}
                            className="rounded-2xl h-14 px-10 font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Initialize Signature
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Signature Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="sm:max-w-[600px] rounded-3xl p-0 overflow-hidden gap-0">
                    <form onSubmit={createSignature}>
                        <DialogHeader className="p-8 bg-muted/20 border-b">
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                                <PenLine className="h-6 w-6 text-primary" />
                                Create New Signature
                            </DialogTitle>
                            <DialogDescription className="font-medium">
                                Choose your preferred method to create a secure digital signature.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="p-8">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 h-12 p-1.5 bg-muted rounded-2xl mb-8">
                                    <TabsTrigger value="draw" className="rounded-xl font-bold uppercase text-[10px] tracking-widest">
                                        <PenLine className="mr-2 h-3 w-3" />
                                        Draw
                                    </TabsTrigger>
                                    <TabsTrigger value="type" className="rounded-xl font-bold uppercase text-[10px] tracking-widest">
                                        <Type className="mr-2 h-3 w-3" />
                                        Type
                                    </TabsTrigger>
                                    <TabsTrigger value="upload" className="rounded-xl font-bold uppercase text-[10px] tracking-widest">
                                        <Upload className="mr-2 h-3 w-3" />
                                        Upload
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="draw" className="mt-0 ring-offset-background focus-visible:outline-none">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Drawing Pad</span>
                                            <Button type="button" variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest px-3 rounded-lg hover:bg-sky-500/10 hover:text-sky-600 transition-colors" onClick={() => signatureRef.current?.clear()}>
                                                Reset Pad
                                            </Button>
                                        </div>
                                        <div className="border border-border/80 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden shadow-inner">
                                            <SignatureCanvas ref={signatureRef} />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="type" className="mt-0 ring-offset-background focus-visible:outline-none">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Type Signature Name</label>
                                        <Input
                                            id="typed-signature"
                                            placeholder="John Doe"
                                            className="h-14 rounded-2xl border-border/60 text-2xl px-6"
                                            style={{ fontFamily: "'Dancing Script', cursive, 'Brush Script MT', 'Alex Brush', cursive" }}
                                            onChange={(e) => {
                                                setData("signature", e.target.value);
                                                setData("signature_type", "typed");
                                            }}
                                        />
                                        <p className="text-[10px] font-medium text-muted-foreground italic px-2">
                                            * Our system uses premium brush lettering fonts for typed signatures.
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="upload" className="mt-0 ring-offset-background focus-visible:outline-none">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Upload Signature File</label>
                                        <div 
                                            className="border-2 border-dashed border-border/60 rounded-2xl p-8 flex flex-col items-center justify-center group hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer relative"
                                            onClick={() => document.getElementById('uploaded-signature').click()}
                                        >
                                            <input
                                                id="uploaded-signature"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setData("signature", reader.result);
                                                            setData("signature_type", "uploaded");
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            {data.signature && data.signature_type === 'uploaded' ? (
                                                <div className="max-h-32 p-4">
                                                    <img src={data.signature} alt="Preview" className="max-h-full max-w-full dark:invert opacity-80" />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                        <Upload className="h-6 w-6 text-muted-foreground/30" />
                                                    </div>
                                                    <p className="text-sm font-bold text-muted-foreground">Click or Drag to Upload</p>
                                                    <p className="text-[10px] font-medium text-muted-foreground/60 mt-1 uppercase tracking-tighter">PNG, JPG or SVG (Max 2MB)</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <DialogFooter className="p-8 bg-muted/10 border-t items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                <Info className="h-3 w-3" />
                                Encrypted and secure
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowCreateModal(false)}
                                    className="rounded-xl font-bold h-11"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl h-11 px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/10"
                                >
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Finalize Signature
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight text-destructive flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Clear Signature
                        </DialogTitle>
                        <DialogDescription className="font-medium pt-2">
                            Are you sure you want to delete your saved signature? This will remove it from our secure vault permanently.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <DialogFooter className="pt-4 gap-2 sm:gap-0">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => setShowDeleteModal(false)}
                            className="rounded-xl font-bold h-11"
                        >
                            Keep Signature
                        </Button>
                        <Button 
                            onClick={deleteSignature}
                            variant="destructive" 
                            disabled={processing}
                            className="rounded-xl font-black uppercase tracking-widest h-11"
                        >
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}
