import MobileNavLink from "@/Components/MobileNavLink";
import { LayoutDashboard, FileText, User, Users, Activity } from "lucide-react";

export default function MobileBottomNav({ user }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
            <div className="bg-card/80 backdrop-blur-lg border-t border-border flex items-center justify-around h-16 pb-safe px-2">
                <MobileNavLink
                    href={route("dashboard")}
                    active={route().current("dashboard")}
                    icon={LayoutDashboard}
                >
                    Dashboard
                </MobileNavLink>
                <MobileNavLink
                    href={route("documents.index")}
                    active={route().current("documents.*")}
                    icon={FileText}
                >
                    Documents
                </MobileNavLink>
                {user?.isAdmin && (
                    <>
                        <MobileNavLink
                            href={route("admin.users")}
                            active={route().current("admin.users")}
                            icon={Users}
                        >
                            Users
                        </MobileNavLink>
                        <MobileNavLink
                            href={route("admin.activity")}
                            active={route().current("admin.activity")}
                            icon={Activity}
                        >
                            Activity
                        </MobileNavLink>
                    </>
                )}
                <MobileNavLink
                    href={route("profile.edit")}
                    active={route().current("profile.edit")}
                    icon={User}
                >
                    Profile
                </MobileNavLink>
            </div>
        </div>
    );
}
