"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Header from "../components/Header";
import Input from "../components/inputs/Input";
import { useSupabaseAuth } from "../components/SupabaseAuthProvider";

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterForm() {
  const { supabase } = useSupabaseAuth();
  const router = useRouter();
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

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    if (!supabase) {
      toast.error("Supabase is not configured.");
      return;
    }
    setIsLoading(true);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.signUp({
      email: data.email.trim(),
      password: data.password,
      options: {
        data: {
          full_name: data.name.trim(),
          name: data.name.trim(),
        },
        emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
      },
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message || "Could not create account.");
      return;
    }

    toast.success("Check your email to confirm your account, then sign in.");
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-md flex-col gap-6 bg-neutral-50 px-5 pb-16 pt-[var(--header-offset)] text-neutral-900 dark:bg-black dark:text-white">
        <div>
          <h1 className="text-2xl font-semibold">Create an account</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/65">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-amber-700 underline-offset-2 hover:underline dark:text-amber-400">
              Sign in
            </Link>
            .
          </p>
        </div>
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
            className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            {isLoading ? "Creating…" : "Register"}
          </button>
        </form>
      </main>
    </>
  );
}
