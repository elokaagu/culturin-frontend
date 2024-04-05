"use client";
import { useState } from "react";
import Header from "../components/Header";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import styled from "styled-components";
import axios from "axios";
import { signIn } from "next-auth/react";
import Input from "../components/inputs/Input";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    console.log(data);
    axios.post("/api/register", data).then(() => {
      toast.success("User created successfully");
      signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/",
      });
    });
  };

  return (
    <>
      <Header />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />
    </>
  );
}
