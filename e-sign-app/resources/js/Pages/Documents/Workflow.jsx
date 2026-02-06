import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import ModeSelector from "@/Components/Workflow/ModeSelector";
import SignerManagement from "@/Components/Workflow/SignerManagement";
import FieldPlacement from "@/Components/Workflow/FieldPlacement";
import ReviewAndSend from "@/Components/Workflow/ReviewAndSend";
import { CheckCircle, Circle, ChevronRight, ChevronLeft } from "lucide-react";
import clsx from "clsx";

export default function Workflow({ auth, document: initialDocument }) {
    const [step, setStep] = useState(1);
    const [document, setDocument] = useState(initialDocument);
    const [workflow, setWorkflow] = useState(initialDocument.workflow);

    const steps = [
        { id: 1, name: "Select Mode", description: "How should people sign?" },
        { id: 2, name: "Signers", description: "Who needs to sign?" },
        { id: 3, name: "Placement", description: "Where should they sign?" },
        { id: 4, name: "Review", description: "Ready to send?" },
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
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Configure Workflow: {document.title}
                </h2>
            }
        >
            <Head title={`Workflow - ${document.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Stepper */}
                            <nav aria-label="Progress" className="mb-8">
                                <ol
                                    role="list"
                                    className="flex items-center justify-evenly"
                                >
                                    {steps.map((s, index) => (
                                        <li
                                            key={s.name}
                                            className={clsx(
                                                index !== steps.length - 1
                                                    ? "pr-8 sm:pr-20"
                                                    : "",
                                                "relative",
                                            )}
                                        >
                                            <div
                                                className="flex items-center"
                                                aria-current={
                                                    step === s.id
                                                        ? "step"
                                                        : undefined
                                                }
                                            >
                                                <div
                                                    className={clsx(
                                                        "flex h-8 w-8 items-center justify-center rounded-full border-2 z-10",
                                                        step > s.id
                                                            ? "bg-indigo-600 border-indigo-600"
                                                            : step === s.id
                                                              ? "border-indigo-600"
                                                              : "border-gray-300",
                                                    )}
                                                >
                                                    {step > s.id ? (
                                                        <CheckCircle className="h-5 w-5 text-white" />
                                                    ) : (
                                                        <span
                                                            className={clsx(
                                                                "text-sm font-medium",
                                                                step === s.id
                                                                    ? "text-indigo-600"
                                                                    : "text-gray-500",
                                                            )}
                                                        >
                                                            {s.id}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="ml-4 hidden sm:block">
                                                    <p
                                                        className={clsx(
                                                            "text-sm font-medium",
                                                            step === s.id
                                                                ? "text-indigo-600"
                                                                : "text-gray-500",
                                                        )}
                                                    >
                                                        {s.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {s.description}
                                                    </p>
                                                </div>
                                            </div>
                                            {index !== steps.length - 1 && (
                                                <div
                                                    className="absolute top-4 left-[75%] h-0.5 bg-gray-200"
                                                    style={{
                                                        width: "calc(100% - 10rem)",
                                                    }}
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            </nav>

                            {/* Step Content */}
                            <div className="mt-10">
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
