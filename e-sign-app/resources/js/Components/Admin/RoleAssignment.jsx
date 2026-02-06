import React, { useState } from "react";
import Dropdown from "@/Components/Dropdown";
import InputError from "@/Components/InputError";

export default function RoleAssignment({ user, onRoleChange, currentUser }) {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    const handleRoleChange = (newRole) => {
        if (newRole === user.role) return;

        // Check if trying to demote the last admin
        if (user.role === "admin" && newRole !== "admin") {
            setError("Cannot remove last admin");
            return;
        }

        // Check if trying to change own role to non-admin
        if (
            user.id === currentUser.id &&
            user.role === "admin" &&
            newRole !== "admin"
        ) {
            setError("Cannot demote yourself from admin");
            return;
        }

        setProcessing(true);
        setError("");

        onRoleChange(user.id, newRole)
            .catch((err) => {
                if (err.response && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("Failed to update role");
                }
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const getRoleColor = (role) => {
        switch (role) {
            case "admin":
                return "bg-red-100 text-red-800";
            case "member":
                return "bg-blue-100 text-blue-800";
            case "viewer":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div>
            <Dropdown>
                <Dropdown.Trigger>
                    <button
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={processing}
                    >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        <svg
                            className="ml-1 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </Dropdown.Trigger>

                <Dropdown.Content>
                    <div className="px-4 py-2 text-sm text-gray-700">
                        Change Role
                    </div>
                    <div className="border-t border-gray-100"></div>
                    <button
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${user.role === "admin" ? "bg-gray-100 font-medium" : ""}`}
                        onClick={() => handleRoleChange("admin")}
                        disabled={processing}
                    >
                        Admin
                    </button>
                    <button
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${user.role === "member" ? "bg-gray-100 font-medium" : ""}`}
                        onClick={() => handleRoleChange("member")}
                        disabled={processing}
                    >
                        Member
                    </button>
                    <button
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${user.role === "viewer" ? "bg-gray-100 font-medium" : ""}`}
                        onClick={() => handleRoleChange("viewer")}
                        disabled={processing}
                    >
                        Viewer
                    </button>
                </Dropdown.Content>
            </Dropdown>

            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
}
