import { studioFieldInputClass, studioMutedClass } from "@/app/studio/_lib/studioTheme";
import { cn } from "@/lib/utils";

type FieldProps = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
};

export function Field({ name, label, type = "text", required = false, defaultValue = "" }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className={cn("font-medium", studioMutedClass)}>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className={studioFieldInputClass}
      />
    </label>
  );
}
