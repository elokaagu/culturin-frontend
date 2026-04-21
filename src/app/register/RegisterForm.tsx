"use client";

import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Header from "../components/Header";
import Input from "../components/inputs/Input";

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("User created successfully");
        signIn("credentials", {
          email: data.email,
          password: data.password,
          callbackUrl: "/",
        });
      })
      .catch(() => {
        toast.error("Could not create account. Try a different email.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-md flex-col gap-5 px-5 pb-16 pt-[150px] text-white sm:pt-[120px]">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <Input<RegisterFormValues>
            id="name"
            label="Name"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            autoComplete="name"
          />
          <Input<RegisterFormValues>
            id="email"
            label="Email"
            type="email"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            autoComplete="email"
          />
          <Input<RegisterFormValues>
            id="password"
            label="Password"
            type="password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            autoComplete="new-password"
            helperText="Use at least 8 characters for a stronger password."
            rules={{
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters.",
              },
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating…" : "Register"}
          </button>
        </form>
      </main>
    </>
  );
}
