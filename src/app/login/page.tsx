"use client";
import styled from "styled-components";
import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import { device } from "../styles/breakpoints";
// import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { CredentialsForm } from "../components/CredentialsForm";
import { GoogleSignInButton } from "../components/AuthButtons";

export default function Login() {
  return (
    <>
      <Header />
      <AppBody>
        <h1>Sign In</h1>
        <GoogleSignInButton />
        <CredentialsForm />
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  padding: 20px;
  display: flex;
  background: black;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  line-height: 2;
`;
