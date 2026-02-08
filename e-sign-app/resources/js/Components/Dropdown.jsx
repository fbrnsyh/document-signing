import { Link } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Dropdown = ({ children }) => {
    return <DropdownMenu>{children}</DropdownMenu>;
};

const Trigger = ({ children }) => {
    return <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>;
};

const Content = ({
    align = "right",
    width = "48",
    contentClasses = "py-1",
    children,
}) => {
    return (
        <DropdownMenuContent
            align={align === "right" ? "end" : "start"}
            className={`${width === "48" ? "w-48" : ""} ${contentClasses}`}
        >
            {children}
        </DropdownMenuContent>
    );
};

const DropdownLink = ({ className = "", children, ...props }) => {
    return (
        <DropdownMenuItem asChild>
            <Link {...props} className={className}>
                {children}
            </Link>
        </DropdownMenuItem>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
