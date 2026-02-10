import { useState } from "react";
import {
    UserPlus,
    Trash2,
    GripVertical,
    ChevronRight,
    ChevronLeft,
    Mail,
    User,
    Users,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { FormField } from "@/Components/ui/form-field";
import axios from "axios";
import { Reorder } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SignerManagement({
    workflow,
    onNext,
    onBack,
    onWorkflowUpdate,
}) {
    const [signers, setSigners] = useState(workflow.signers || []);
    const [newSigner, setNewSigner] = useState({ email: "", name: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await axios.post(
                `/api/workflows/${workflow.id}/signers`,
                newSigner,
            );
            const updatedSigners = [...signers, response.data];
            setSigners(updatedSigners);
            setNewSigner({ email: "", name: "" });

            onWorkflowUpdate({
                ...workflow,
                signers: updatedSigners,
            });
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(
                    error.response.data.errors || {
                        message: error.response.data.message,
                    },
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (signerId) => {
        try {
            await axios.delete(
                `/api/workflows/${workflow.id}/signers/${signerId}`,
            );
            const updatedSigners = signers.filter((s) => s.id !== signerId);
            setSigners(updatedSigners);

            onWorkflowUpdate({
                ...workflow,
                signers: updatedSigners,
            });
        } catch (error) {
            console.error("Failed to remove signer", error);
        }
    };

    const handleReorder = async (newOrder) => {
        setSigners(newOrder);
        try {
            const orders = newOrder.map((s, index) => ({
                id: s.id,
                order: index + 1,
            }));
            await axios.patch(`/api/workflows/${workflow.id}/signers/reorder`, {
                orders,
            });

            onWorkflowUpdate({
                ...workflow,
                signers: newOrder,
            });
        } catch (error) {
            console.error("Failed to update signer order", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h3 className="text-2xl font-bold tracking-tight mb-2">
                    Manage Signers
                </h3>
                <p className="text-muted-foreground">
                    {workflow.mode === "sequential"
                        ? "Add signers in the order they should sign. Drag to reorder."
                        : "Add all people who need to sign this document."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Add Signer Form */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-primary" />
                            Add New Signer
                        </CardTitle>
                        <CardDescription>
                            Enter details for a new recipient.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <FormField
                                label="Full Name"
                                value={newSigner.name}
                                onChange={(e) =>
                                    setNewSigner({
                                        ...newSigner,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Jane Doe"
                                required
                                error={errors.name}
                            />

                            <FormField
                                label="Email Address"
                                type="email"
                                value={newSigner.email}
                                onChange={(e) =>
                                    setNewSigner({
                                        ...newSigner,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="jane@example.com"
                                required
                                error={errors.email || errors.message}
                            />

                            <Button
                                className="w-full"
                                disabled={loading}
                                type="submit"
                            >
                                {loading ? "Adding..." : "Add Signer"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Signers List */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <Label className="text-base font-semibold">
                            Signers List ({signers.length}/10)
                        </Label>
                    </div>

                    {signers.length === 0 ? (
                        <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed border-border/50">
                            <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                            <p className="text-muted-foreground text-sm">
                                No signers added yet.
                            </p>
                        </div>
                    ) : (
                        <Reorder.Group
                            axis="y"
                            values={signers}
                            onReorder={
                                workflow.mode === "sequential"
                                    ? handleReorder
                                    : () => {}
                            }
                            className="space-y-3"
                        >
                            {signers.map((signer, index) => (
                                <Reorder.Item
                                    key={signer.id}
                                    value={signer}
                                    className="bg-card p-4 rounded-lg border border-border flex items-center shadow-sm group hover:border-primary/50 transition-colors"
                                >
                                    {workflow.mode === "sequential" && (
                                        <div className="mr-3 text-muted-foreground/30 cursor-grab active:cursor-grabbing hover:text-primary transition-colors">
                                            <GripVertical className="h-4 w-4" />
                                        </div>
                                    )}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            {workflow.mode === "sequential" && (
                                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                                    {index + 1}
                                                </span>
                                            )}
                                            <span className="font-semibold text-sm text-foreground truncate">
                                                {signer.name}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {signer.email}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemove(signer.id)}
                                        className="h-8 w-8 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    )}

                    {errors.signers && (
                        <div className="px-1 text-sm text-destructive font-medium animate-in slide-in-from-top-1">
                            {errors.signers}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-12 flex justify-between border-t border-border pt-8">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </Button>
                <Button
                    onClick={() => {
                        onWorkflowUpdate({
                            ...workflow,
                            signers: signers,
                        });
                        onNext();
                    }}
                    disabled={signers.length === 0}
                    className="gap-2"
                >
                    Continue to Field Placement
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
