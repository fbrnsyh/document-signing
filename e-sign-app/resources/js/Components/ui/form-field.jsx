import React from "react";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "../../lib/utils";

const FormField = React.forwardRef(({ label, error, className, id, ...props }, ref) => {
    const fieldId = id || props.name;
    
    return (
        <div className={cn("grid w-full items-center gap-1.5", className)}>
            {label && <Label htmlFor={fieldId}>{label}</Label>}
            <Input
                id={fieldId}
                ref={ref}
                className={cn(error && "border-destructive focus-visible:ring-destructive")}
                {...props}
            />
            {error && (
                <p className="text-sm font-medium text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
});

FormField.displayName = "FormField";

export { FormField };
