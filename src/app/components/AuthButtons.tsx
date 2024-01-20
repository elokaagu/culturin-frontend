"use client";
// import Image from "next/image";
// import googleLogo from "/public/google.png";
// import githubLogo from "/public/github.png";
import { signIn, signOut, useSession } from "next-auth/react";
import styled from "styled-components";
import { device } from "../styles/breakpoints";

export function HomeSigninButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <SigninButton
        onClick={async () => {
          await signOut();
        }}
      >
        {session?.user?.name?.split(" ")[0] || "Guest"}
      </SigninButton>
    );
  }
  return (
    <SigninButton
      onClick={async () => {
        await signIn("credentials", {
          redirect: true,
          callbackUrl: "/",
        });
      }}
    >
      Sign in
    </SigninButton>
  );
}

export function GoogleSignInButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <SigninButton
        onClick={async () => {
          await signOut({
            redirect: false, // Prevents redirection after signing out
            callbackUrl: "/", // This is optional since redirect is false
          });
        }}
      >
        {session?.user?.name?.split(" ")[0] || "Guest"}
      </SigninButton>
    );
  }
  return (
    <SigninButton
      onClick={async () => {
        await signIn();
      }}
    >
      Sign in
    </SigninButton>
  );

  // const handleClick = () => {
  //   signIn("google");
  // };

  // return (
  //   <button
  //     onClick={handleClick}
  //     className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl  transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200"
  //   >
  //     <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
  //     <span className="ml-4">Continue with Google</span>
  //   </button>
  // );
}

export function GithubSignInButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        {session?.user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Sign in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );

  // const handleClick = () => {
  //   signIn("github");
  // };

  // return (
  //   <button
  //     onClick={handleClick}
  //     className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200"
  //   >
  //     <Image src={githubLogo} alt="Github Logo" width={20} height={20} />
  //     <span className="ml-4">Continue with Github</span>
  //   </button>
  // );
}

export function CredentialsSignInButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        {session?.user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Sign in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );

  // const handleClick = () => {
  //   signIn();
  // };

  // return (
  //   <button
  //     onClick={handleClick}
  //     className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200"
  //   >
  //     {/* <Image src={githubLogo} alt="Github Logo" width={20} height={20} /> */}
  //     <span className="ml-4">Continue with Email</span>
  //   </button>
  // );
}

const SigninButton = styled.div`
  border-radius: 999px;
  width: 100%;
  ${"" /* border: 1px solid white; */}
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  background-color: white;
  color: black;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: grey;
    transition: 0.3s ease-in-out;
  }

  @media ${device.mobile} {
    width: 100px;
  }
`;
