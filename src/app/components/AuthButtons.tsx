"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import styled from "styled-components";
import { device } from "../styles/breakpoints";
import { useState } from "react";
import { ChevronDown } from "styled-icons/boxicons-regular";
import Link from "next/link";
import React, { useEffect } from "react";

// export function HomeSigninButton() {
//   const { data: session } = useSession();

//   if (session) {
//     return (
//       <SigninButton
//         onClick={async () => {
//           await signOut();
//         }}
//       >
//         {session?.user?.name?.split(" ")[0] || "Guest"}
//       </SigninButton>
//     );
//   }
//   return (
//     <SigninButton
//       onClick={async () => {
//         await signIn("credentials", {
//           redirect: true,
//           callbackUrl: "/",
//         });
//       }}
//     >
//       Sign in
//     </SigninButton>
//   );
// }

// const createUsernameSlug = (name: string) => {
//   const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
//   const lowerCase = normalized.toLowerCase();
//   const noSpaces = lowerCase.replace(/\s+/g, "");
//   const urlFriendly = noSpaces.replace(/[^a-z0-9-]/g, "");
//   return urlFriendly;
// };

// function createSlugFromUsername(username: string) {
//   // Remove spaces and convert to lowercase
//   return username.replace(/\s+/g, "").toLowerCase();
// }

const createUsernameSlug = (name: string) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "");
};

export function GoogleSignInButton() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const userId = session?.user?.id || "guest"; // Fallback to "guest" if not signed in

  const userProfileApiUrl = session?.user?.id
    ? `/profile/${session.user.id}`
    : "/profile/guest";

  const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // const userProfileApiUrl = session?.user?.name
  //   ? `${NEXT_PUBLIC_API_BASE_URL}/profile/${encodeURIComponent(
  //       session.user.name
  //     )}`
  //   : `${NEXT_PUBLIC_API_BASE_URL}/profile/guest`;

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      console.log("User ID:", session.user.id); // This should now log a defined ID
    }
  }, [session, status]);
  if (status === "loading") {
    return <div>Loading...</div>; // Or some loading spinner
  }

  if (session) {
    const username = session.user?.name || "Guest";
    console.log("username", username);
    console.log("session", session);
    console.log(session.user.id); // Now you should have the Google user ID
    const profileUrl = session.user.id
      ? `/profile/${session.user.id}`
      : "/profile/guest";

    return (
      <>
        <SigninButton
          // onClick={async () => {
          //   await signOut({
          //     redirect: false,
          //     callbackUrl: "/",
          //   });
          // }}
          onClick={toggleDropdown}
        >
          {session?.user?.name?.split(" ")[0] || "Guest"}
          {/* <ChevronDown size="20" /> */}
        </SigninButton>
        {showDropdown && (
          <DropdownListContainer>
            <DropdownList>
              <DropdownItem>
                {/* <Link href={`/profile/${userId}`}>Profile</Link> */}
                {/* <Link href={`/profile/${createUsernameSlug(userId)}`}> */}
                <Link href={profileUrl}>Profile</Link>
              </DropdownItem>

              <DropdownItem>
                <Link href="/settings">Settings</Link>
              </DropdownItem>
              <DropdownItem>
                <Link href="/assistant">Culturin AI</Link>
              </DropdownItem>
              <DropdownItem
                onClick={async () => {
                  await signOut({
                    redirect: false,
                    callbackUrl: "/",
                  });
                  setShowDropdown(false);
                }}
              >
                <a>Sign out</a>
              </DropdownItem>
            </DropdownList>
          </DropdownListContainer>
        )}
      </>
    );
  }
  return (
    <SigninButton
      onClick={async () => {
        await signIn("google", {
          redirect: true,
          callbackUrl: "/",
        });
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

// export function GithubSignInButton() {
//   const { data: session } = useSession();

//   if (session) {
//     return (
//       <>
//         {session?.user?.name} <br />
//         <button onClick={() => signOut()}>Sign out</button>
//       </>
//     );
//   }
//   return (
//     <>
//       Sign in <br />
//       <button onClick={() => signIn()}>Sign in</button>
//     </>
//   );

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
// }

// export function CredentialsSignInButton() {
//   const { data: session } = useSession();

//   if (session) {
//     return (
//       <>
//         {session?.user?.name} <br />
//         <button onClick={() => signOut()}>Sign out</button>
//       </>
//     );
//   }
//   return (
//     <>
//       Sign in <br />
//       <button onClick={() => signIn()}>Sign in</button>
//     </>
//   );

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
// }

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

const DropdownHeader = styled.div`
  /* width: 100%;
  border: black;
  display: flex;
  flex-direction: row; */
`;

const DropdownContainer = styled("div")`
  @media ${device.mobile} {
    display: none;
  }
`;

const DropdownList = styled("ul")`
  margin: 30px;
  margin-left: 10px;
  color: black;
  background: white;
  z-index: 100;
  border-radius: 10px;
  animation: fadeIn 0.3s;

  @keyframes fadeIn {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

const DropdownItem = styled("li")`
  list-style: none;
  color: black;
  width: 100%;
  a {
    text-decoration: none;
    color: black;
  }

  a:hover {
    color: #4444;
  }
`;

const DropdownListContainer = styled.div`
  position: absolute;
  color: black;
  width: 200px;
  z-index: 100;
  right: 0;

  ul:hover {
    list-style: none;
    color: black;
  }

  ul li {
    text-decoration: none;
    color: black;
  }
`;
