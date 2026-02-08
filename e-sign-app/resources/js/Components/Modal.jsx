import { Dialog, DialogContent } from "./ui/dialog";

export default function Modal({
    children,
    show = false,
    maxWidth = "2xl",
    closeable = true,
    onClose = () => {},
}) {
    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
    }[maxWidth];

    return (
        <Dialog
            open={show}
            onOpenChange={(open) => !open && closeable && onClose()}
        >
            <DialogContent className={`mb-6 ${maxWidthClass}`}>
                {children}
            </DialogContent>
        </Dialog>
    );
}
