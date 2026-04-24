"use client";

import React, { useId } from "react";
import {
  get,
  type FieldErrors,
  type FieldValues,
  type Path,
  type RegisterOptions,
  type UseFormRegister,
} from "react-hook-form";

type InputProps<T extends FieldValues> = {
  id: Path<T>;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  /** Extra validation (merged with `required` when applicable). */
  rules?: Omit<RegisterOptions<T, Path<T>>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs">;
  /** Optional hint shown below the field when there is no error. */
  helperText?: string;
  placeholder?: string;
  autoComplete?: string;
};

function fieldErrorMessage<T extends FieldValues>(
  errors: FieldErrors<T>,
  id: Path<T>
): string | undefined {
  const err = get(errors, id);
  if (!err || typeof err !== "object") return undefined;
  if (!("message" in err) || err.message === undefined || err.message === null) {
    return undefined;
  }
  return String(err.message);
}

export default function Input<T extends FieldValues>({
  id,
  label,
  type = "text",
  disabled = false,
  required = false,
  register,
  errors,
  rules,
  helperText,
  placeholder,
  autoComplete = "off",
}: InputProps<T>) {
  const reactId = useId();
  const idStr = String(id);
  const errorId = `${reactId}-${idStr}-error`;
  const hintId = `${reactId}-${idStr}-hint`;
  const errorMessage = fieldErrorMessage(errors, id);
  const invalid = Boolean(errorMessage);
  const describedBy =
    [helperText && !invalid ? hintId : null, invalid ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const validation: RegisterOptions<T, Path<T>> = {
    ...rules,
    ...(required ? { required: `${label} is required` } : {}),
  };

  const inputClassName = [
    "w-full rounded-md border bg-neutral-100 px-3 py-2.5 text-sm text-neutral-900 outline-none transition-[border-color,box-shadow] dark:bg-black/40 dark:text-white",
    "placeholder:text-neutral-400 dark:placeholder:text-white/35",
    "focus-visible:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-200 dark:focus-visible:border-white/50 dark:focus-visible:ring-white/25",
    "disabled:cursor-not-allowed disabled:opacity-50",
    invalid
      ? "border-rose-400/60 focus-visible:border-rose-400/80 focus-visible:ring-rose-400/25"
      : "border-neutral-200 focus-visible:border-neutral-400 dark:border-white/15 dark:focus-visible:border-white/40",
  ].join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={idStr} className="text-sm font-medium text-neutral-700 dark:text-white/80">
        {label}
        {required ? (
          <span className="ml-0.5 text-rose-300" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <input
        {...register(id, validation)}
        autoComplete={autoComplete}
        id={idStr}
        type={type}
        disabled={disabled}
        aria-required={required}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        placeholder={placeholder}
        className={inputClassName}
      />
      {helperText && !invalid ? (
        <p id={hintId} className="text-xs text-neutral-500 dark:text-white/50">
          {helperText}
        </p>
      ) : null}
      {invalid ? (
        <p id={errorId} className="text-sm text-rose-300" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
