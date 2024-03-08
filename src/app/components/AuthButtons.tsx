"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import styled from "styled-components";
import { device } from "../styles/breakpoints";
import { useState } from "react";
import { ChevronDown } from "styled-icons/boxicons-regular";
import Link from "next/link";

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

export function GoogleSignInButton() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  if (session) {
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
                {session &&
                  session.user &&
                  (session.user as { id: string })?.id && (
                    <Link
                      href={`/profile/${(session.user as { id: string }).id}`}
                      passHref
                    >
                      <a>Profile</a>
                    </Link>
                  )}
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
