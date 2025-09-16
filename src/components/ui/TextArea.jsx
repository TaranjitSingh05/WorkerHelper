import React from "react";
import { cn } from "../../utils/cn";

const TextArea = React.forwardRef(({
    className,
    label,
    description,
    error,
    required = false,
    id,
    rows = 3,
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const textAreaId = id || `textarea-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Base textarea classes
    const baseTextAreaClasses = "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical";

    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={textAreaId}
                    className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        error ? "text-destructive" : "text-foreground"
                    )}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>
            )}

            <textarea
                className={cn(
                    baseTextAreaClasses,
                    error && "border-destructive focus-visible:ring-destructive",
                    className
                )}
                ref={ref}
                id={textAreaId}
                rows={rows}
                {...props}
            />

            {description && !error && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}

            {error && (
                <p className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
});

TextArea.displayName = "TextArea";

export default TextArea;