import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import ModeSelector from "@/Components/Workflow/ModeSelector";
import SignerManagement from "@/Components/Workflow/SignerManagement";
import FieldPlacement from "@/Components/Workflow/FieldPlacement";
import ReviewAndSend from "@/Components/Workflow/ReviewAndSend";
import { CheckCircle, Circle, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/Components/ui/card";

export default function Workflow({ auth, document: initialDocument }) {
    const [step, setStep] = useState(1);
    const [document, setDocument] = useState(initialDocument);
    const [workflow, setWorkflow] = useState(initialDocument.workflow);

    const steps = [
        { id: 1, name: "Select Mode", description: "How to sign?" },
        { id: 2, name: "Signers", description: "Who signs?" },
        { id: 3, name: "Placement", description: "Where to sign?" },
        { id: 4, name: "Review", description: "Ready?" },
    ];

    // Auto-skip signers if direct mode
    useEffect(() => {
        if (step === 2 && workflow?.mode === "direct") {
            setStep(3);
        }
    }, [step, workflow]);

    const handleWorkflowCreated = (newWorkflow) => {
        setWorkflow(newWorkflow);
        setStep(2);
    };

    const handleWorkflowUpdated = (updatedWorkflow) => {
        setWorkflow(updatedWorkflow);
        setStep(2);
    };

    const nextStep = () => setStep((s) => Math.min(s + 1, 4));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-bold text-2xl text-foreground tracking-tight">
                    Workflow: <span className="text-primary font-extrabold">{document.title}</span>
                </h2>
            }
        >
            <Head title={`Workflow - ${document.title}`} />

            <div className="py-12 bg-muted/30 min-h-[calc(100vh-64px)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="border-none shadow-xl bg-card overflow-hidden rounded-3xl">
                        <CardContent className="p-0">
                            {/* Stepper Header */}
                            <div className="bg-muted/50 border-b border-border/50 p-6 md:p-10">
                                <nav aria-label="Progress">
                                    <ol role="list" className="flex items-center justify-between max-w-4xl mx-auto">
                                        {steps.map((s, index) => (
                                            <li key={s.name} className="flex-1 relative last:flex-none">
                                                <div className="flex items-center group">
                                                    <div className="flex flex-col items-center relative z-10 transition-transform duration-300 group-hover:scale-105">
                                                        <div
                                                            className={cn(
                                                                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500 shadow-md",
                                                                step > s.id
                                                                    ? "bg-primary border-primary"
                                                                    : step === s.id
                                                                      ? "border-primary bg-card ring-4 ring-primary/10"
                                                                      : "border-border bg-card",
                                                            )}
                                                        >
                                                            {step > s.id ? (
                                                                <CheckCircle className="h-6 w-6 text-primary-foreground" />
                                                            ) : (
                                                                <span
                                                                    className={cn(
                                                                        "text-sm font-bold",
                                                                        step === s.id
                                                                            ? "text-primary"
                                                                            : "text-muted-foreground",
                                                                    )}
                                                                >
                                                                    {s.id}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="mt-3 text-center hidden md:block">
                                                            <p
                                                                className={cn(
                                                                    "text-xs font-black uppercase tracking-widest transition-colors",
                                                                    step === s.id
                                                                        ? "text-primary"
                                                                        : "text-muted-foreground/60",
                                                                )}
                                                            >
                                                                {s.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    {index !== steps.length - 1 && (
                                                        <div className="flex-grow mx-4 hidden sm:block">
                                                            <div className={cn(
                                                                "h-1 rounded-full transition-all duration-1000",
                                                                step > s.id ? "bg-primary" : "bg-border"
                                                            )} />
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </nav>
                            </div>

                            {/* Step Content Content */}
                            <div className="p-6 md:p-12 min-h-[500px] animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {step === 1 && (
                                    <ModeSelector
                                        documentId={document.id}
                                        workflowId={workflow?.id}
                                        initialMode={workflow?.mode}
                                        onCreated={handleWorkflowCreated}
                                        onUpdated={handleWorkflowUpdated}
                                    />
                                )}

                                {step === 2 && (
                                    <SignerManagement
                                        workflow={workflow}
                                        onNext={nextStep}
                                        onBack={prevStep}
                                        onWorkflowUpdate={setWorkflow}
                                    />
                                )}

                                {step === 3 && (
                                    <FieldPlacement
                                        document={document}
                                        workflow={workflow}
                                        onNext={nextStep}
                                        onBack={() =>
                                            workflow.mode === "direct"
                                                ? setStep(1)
                                                : prevStep()
                                        }
                                        onWorkflowUpdate={setWorkflow}
                                    />
                                )}

                                {step === 4 && (
                                    <ReviewAndSend
                                        document={document}
                                        workflow={workflow}
                                        onBack={prevStep}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
