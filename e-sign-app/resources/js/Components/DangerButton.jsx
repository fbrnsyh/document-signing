import { Button } from "./ui/button";

export default function DangerButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <Button
            {...props}
            variant="destructive"
            className={`uppercase tracking-widest text-xs ${className}`}
            disabled={disabled}
        >
            {children}
        </Button>
    );
}
