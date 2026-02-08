import { Button } from "./ui/button";

export default function SecondaryButton({
    type = "button",
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <Button
            {...props}
            type={type}
            variant="outline"
            className={`uppercase tracking-widest text-xs shadow-sm ${className}`}
            disabled={disabled}
        >
            {children}
        </Button>
    );
}
