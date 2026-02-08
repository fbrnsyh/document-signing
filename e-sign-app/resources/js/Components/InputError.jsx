import { Alert } from "./ui/alert";

export default function InputError({ message, className = "", ...props }) {
    return message ? (
        <Alert variant="destructive" className={className} {...props}>
            {message}
        </Alert>
    ) : null;
}
