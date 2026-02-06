import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import InviteUserModal from "@/Components/Admin/InviteUserModal";
import RoleAssignment from "@/Components/Admin/RoleAssignment";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Dropdown from "@/Components/Dropdown";
import axios from "axios";

export default function UserManagement({ auth }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 0,
    });

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const params = {
                page,
                per_page: pagination.per_page,
            };

            if (search) params.search = search;
            if (roleFilter) params.role = roleFilter;
            if (statusFilter) params.status = statusFilter;

            const response = await axios.get("/api/admin/users", { params });
            setUsers(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                per_page: response.data.per_page,
                total: response.data.total,
                last_page: response.data.last_page,
            });
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, roleFilter, statusFilter]);

    const handleInviteUser = async (userData) => {
        try {
            await axios.post("/api/admin/invitations", userData);
            fetchUsers();
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.patch(`/api/admin/users/${userId}/role`, {
                role: newRole,
            });
            fetchUsers();
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const handleToggleUserStatus = async (user) => {
        try {
            if (user.status === "active") {
                await axios.patch(`/api/admin/users/${user.id}/deactivate`);
            } else {
                await axios.patch(`/api/admin/users/${user.id}/activate`);
            }
            fetchUsers();
        } catch (error) {
            console.error("Error toggling user status:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800";
            case "inactive":
                return "bg-red-100 text-red-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handlePageChange = (page) => {
        fetchUsers(page);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    User Management
                </h2>
            }
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Team Members
                                </h3>
                                <PrimaryButton
                                    onClick={() => setShowInviteModal(true)}
                                >
                                    Invite User
                                </PrimaryButton>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <TextInput
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <select
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(e.target.value)
                                    }
                                    className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="member">Member</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>

                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <RoleAssignment
                                                            user={user}
                                                            currentUser={
                                                                auth.user
                                                            }
                                                            onRoleChange={
                                                                handleRoleChange
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}
                                                        >
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Dropdown>
                                                            <Dropdown.Trigger>
                                                                <button className="text-indigo-600 hover:text-indigo-900">
                                                                    Actions
                                                                    <svg
                                                                        className="ml-1 h-4 w-4 inline"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M19 9l-7 7-7-7"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </Dropdown.Trigger>
                                                            <Dropdown.Content>
                                                                <a
                                                                    href={`/profile/${user.id}`}
                                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    View Profile
                                                                </a>
                                                                <button
                                                                    onClick={() =>
                                                                        handleToggleUserStatus(
                                                                            user,
                                                                        )
                                                                    }
                                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    disabled={
                                                                        user.id ===
                                                                        auth
                                                                            .user
                                                                            .id
                                                                    }
                                                                >
                                                                    {user.status ===
                                                                    "active"
                                                                        ? "Deactivate"
                                                                        : "Activate"}
                                                                </button>
                                                            </Dropdown.Content>
                                                        </Dropdown>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {pagination.last_page > 1 && (
                                        <div className="mt-4 flex justify-between items-center">
                                            <div className="text-sm text-gray-700">
                                                Showing{" "}
                                                {(pagination.current_page - 1) *
                                                    pagination.per_page +
                                                    1}{" "}
                                                to{" "}
                                                {Math.min(
                                                    pagination.current_page *
                                                        pagination.per_page,
                                                    pagination.total,
                                                )}{" "}
                                                of {pagination.total} results
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handlePageChange(
                                                            pagination.current_page -
                                                                1,
                                                        )
                                                    }
                                                    disabled={
                                                        pagination.current_page ===
                                                        1
                                                    }
                                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handlePageChange(
                                                            pagination.current_page +
                                                                1,
                                                        )
                                                    }
                                                    disabled={
                                                        pagination.current_page ===
                                                        pagination.last_page
                                                    }
                                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <InviteUserModal
                show={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                onInvite={handleInviteUser}
            />
        </AuthenticatedLayout>
    );
}
