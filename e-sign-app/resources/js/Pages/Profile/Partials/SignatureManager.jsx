import { useState, useRef } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import SignatureCanvas from "@/Components/Sign/SignatureCanvas";
import { useForm } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

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
                <h2 className="text-lg font-medium text-gray-900">
                    Signature Management
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Manage your saved signature for quick document signing.
                </p>
            </header>

            <div className="mt-6">
                {signature ? (
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Current Signature" />
                            <div className="mt-2 p-4 border border-gray-300 rounded-md bg-gray-50">
                                <img
                                    src={signature.signature_url}
                                    alt="Your signature"
                                    className="h-20"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <SecondaryButton
                                onClick={() => setShowCreateModal(true)}
                            >
                                Create New Signature
                            </SecondaryButton>

                            <DangerButton
                                onClick={() => setShowDeleteModal(true)}
                            >
                                Delete Signature
                            </DangerButton>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-md">
                        <p className="text-gray-500 mb-4">
                            You don't have a saved signature yet.
                        </p>
                        <PrimaryButton onClick={() => setShowCreateModal(true)}>
                            Create Signature
                        </PrimaryButton>
                    </div>
                )}
            </div>

            {/* Create Signature Modal */}
            <Modal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            >
                <form onSubmit={createSignature} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Create New Signature
                    </h2>

                    <div className="mt-4">
                        <div className="flex space-x-4 border-b">
                            <button
                                type="button"
                                className={`py-2 px-4 ${activeTab === "draw" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-500"}`}
                                onClick={() => setActiveTab("draw")}
                            >
                                Draw
                            </button>
                            <button
                                type="button"
                                className={`py-2 px-4 ${activeTab === "type" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-500"}`}
                                onClick={() => setActiveTab("type")}
                            >
                                Type
                            </button>
                            <button
                                type="button"
                                className={`py-2 px-4 ${activeTab === "upload" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-500"}`}
                                onClick={() => setActiveTab("upload")}
                            >
                                Upload
                            </button>
                        </div>

                        <div className="mt-4">
                            {activeTab === "draw" && (
                                <div>
                                    <InputLabel value="Draw your signature" />
                                    <div className="mt-2 border border-gray-300 rounded-md">
                                        <SignatureCanvas ref={signatureRef} />
                                    </div>
                                </div>
                            )}

                            {activeTab === "type" && (
                                <div>
                                    <InputLabel
                                        htmlFor="typed-signature"
                                        value="Type your signature"
                                    />
                                    <input
                                        id="typed-signature"
                                        type="text"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        style={{
                                            fontFamily: "cursive",
                                            fontSize: "24px",
                                        }}
                                        onChange={(e) => {
                                            setData(
                                                "signature",
                                                e.target.value,
                                            );
                                            setData("signature_type", "typed");
                                        }}
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.signature}
                                    />
                                </div>
                            )}

                            {activeTab === "upload" && (
                                <div>
                                    <InputLabel
                                        htmlFor="uploaded-signature"
                                        value="Upload signature image"
                                    />
                                    <input
                                        id="uploaded-signature"
                                        type="file"
                                        accept="image/*"
                                        className="mt-1 block w-full"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setData(
                                                        "signature",
                                                        reader.result,
                                                    );
                                                    setData(
                                                        "signature_type",
                                                        "uploaded",
                                                    );
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.signature}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <SecondaryButton
                            onClick={() => setShowCreateModal(false)}
                        >
                            Cancel
                        </SecondaryButton>

                        <PrimaryButton disabled={processing}>
                            Save Signature
                        </PrimaryButton>
                    </div>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="mt-4 text-sm text-gray-600">
                            Signature saved.
                        </p>
                    </Transition>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
            >
                <form onSubmit={deleteSignature} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Delete Signature
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Are you sure you want to delete your saved signature?
                        This action cannot be undone.
                    </p>

                    <div className="mt-6 flex justify-end gap-4">
                        <SecondaryButton
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </SecondaryButton>

                        <DangerButton disabled={processing}>
                            Delete Signature
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
