import { Link } from "@inertiajs/react";

export default function MobileNavLink({
    active = false,
    className = "",
    children,
    icon: Icon,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition duration-150 ease-in-out focus:outline-none ${
                active
                    ? "text-primary dark:text-primary"
                    : "text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
            } ${className}`}
        >
            <Icon className={`h-5 w-5 mb-1 ${active ? "stroke-[2.5px]" : "stroke-2"}`} />
            <span className="text-[10px] font-medium tracking-wide truncate w-full text-center">
                {children}
            </span>
        </Link>
    );
}
