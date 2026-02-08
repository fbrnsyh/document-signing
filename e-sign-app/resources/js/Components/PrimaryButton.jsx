import { Button } from "./ui/button";

export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <Button
            {...props}
            className={`uppercase tracking-widest text-xs ${className}`}
            disabled={disabled}
        >
            {children}
        </Button>
    );
}
