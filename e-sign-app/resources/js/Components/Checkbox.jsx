import { Checkbox } from "./ui/checkbox";

export default function CustomCheckbox({ className = "", ...props }) {
    return <Checkbox {...props} className={className} />;
}
