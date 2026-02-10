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
                return "bg-success/10 text-success border-success/20";
            case "inactive":
                return "bg-destructive/10 text-destructive border-destructive/20";
            case "pending":
                return "bg-warning/10 text-warning border-warning/20";
            default:
                return "bg-muted text-muted-foreground border-border";
        }
    };

    const handlePageChange = (page) => {
        fetchUsers(page);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-foreground leading-tight">
                    User Management
                </h2>
            }
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg border border-border">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-foreground">
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
                                    className="bg-background text-foreground border-border rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                >
                                    <option value="" className="bg-card">All Roles</option>
                                    <option value="admin" className="bg-card">Admin</option>
                                    <option value="member" className="bg-card">Member</option>
                                    <option value="viewer" className="bg-card">Viewer</option>
                                </select>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="bg-background text-foreground border-border rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                >
                                    <option value="" className="bg-card">All Status</option>
                                    <option value="active" className="bg-card">Active</option>
                                    <option value="inactive" className="bg-card">Inactive</option>
                                    <option value="pending" className="bg-card">Pending</option>
                                </select>
                            </div>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                                </div>
                            ) : (
                                 <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-border">
                                        <thead className="bg-muted/50 text-muted-foreground uppercase tracking-wider text-xs font-bold">
                                            <tr>
                                                <th className="px-6 py-4 text-left">
                                                    Name
                                                </th>
                                                <th className="px-6 py-4 text-left">
                                                    Email
                                                </th>
                                                <th className="px-6 py-4 text-left">
                                                    Role
                                                </th>
                                                <th className="px-6 py-4 text-left">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                         <tbody className="bg-transparent divide-y divide-border">
                                            {users.map((user) => (
                                                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-foreground">
                                                            {user.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-muted-foreground">
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
                                                            className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase rounded-full border ${getStatusColor(user.status)}`}
                                                        >
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Dropdown>
                                                            <Dropdown.Trigger>
                                                                <button className="text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                                                                    Actions
                                                                    <svg
                                                                        className="h-4 w-4"
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
                                        <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                                            <div className="text-sm text-muted-foreground">
                                                Showing{" "}
                                                <span className="font-bold text-foreground">
                                                    {(pagination.current_page - 1) *
                                                        pagination.per_page +
                                                        1}
                                                </span>{" "}
                                                to{" "}
                                                <span className="font-bold text-foreground">
                                                    {Math.min(
                                                        pagination.current_page *
                                                            pagination.per_page,
                                                        pagination.total,
                                                    )}
                                                </span>{" "}
                                                of <span className="font-bold text-foreground">{pagination.total}</span> results
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
                                                    className="px-4 py-1.5 border border-border bg-card rounded-lg text-sm font-medium text-foreground disabled:opacity-30 hover:bg-muted transition-colors"
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
                                                    className="px-4 py-1.5 border border-border bg-card rounded-lg text-sm font-medium text-foreground disabled:opacity-30 hover:bg-muted transition-colors"
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
