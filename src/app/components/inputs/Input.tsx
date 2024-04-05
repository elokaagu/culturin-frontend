"use client";
import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import styled from "styled-components";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled = false,
  required = false,
  register,
  errors,
}) => {
  return (
    <AppBody>
      <label htmlFor={id}>{label}</label>
      <input
        autoComplete="off"
        id={id}
        type={type}
        disabled={disabled}
        required={required}
        {...register(id, { required: true })}
        placeholder=""
      />
    </AppBody>
  );
};

export default Input;

const AppBody = styled.div``;
