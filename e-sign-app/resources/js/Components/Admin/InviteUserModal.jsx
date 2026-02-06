import React, { useState } from "react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputError from "@/Components/InputError";

export default function InviteUserModal({ show, onClose, onInvite }) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("member");
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        onInvite({ email, role })
            .then(() => {
                setEmail("");
                setRole("member");
                onClose();
            })
            .catch((error) => {
                if (error.response && error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else if (error.response && error.response.data.message) {
                    setErrors({ email: error.response.data.message });
                }
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const handleClose = () => {
        if (!processing) {
            setEmail("");
            setRole("member");
            setErrors({});
            onClose();
        }
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Invite New User
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Send an invitation to a new user to join the team.
                </p>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email Address" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="role" value="Role" />
                    <select
                        id="role"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                        <option value="viewer">Viewer</option>
                    </select>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton
                        onClick={handleClose}
                        disabled={processing}
                    >
                        Cancel
                    </SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        {processing ? "Sending..." : "Send Invitation"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
