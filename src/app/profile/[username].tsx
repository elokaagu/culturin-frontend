// "use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { device } from "../styles/breakpoints";
import ProfileCard from "../components/ProfileCard";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../styles/theme";
import { useSession, getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  // Get the username from the URL

  const username = session?.user?.name || "Guest";
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/${username}`;

  // if (!username) {
  //   return {
  //     props: {
  //       error: "Username not found", // Pass a custom error message or code
  //     },
  //   };
  // }

  try {
    // const apiUrl = `${
    //   process.env.NEXT_PUBLIC_API_BASE_URL
    // }/profile/${encodeURIComponent(username.toString())}`;

    const res = await fetch(apiUrl);

    if (!res.ok) throw new Error(`API call failed with status: ${res.status}`);
    const data = await res.json();
    console.log("Profile data:", data); // Log the response data for debugging
    return { props: { data } };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return { props: { error: "Profile data could not be fetched." } };
  }
};

// const fetchUserProfile = async (username: string, session: any) => {
//   if (!session) {
//     console.error("Session not found. User is likely not logged in.");
//     return;
//   }

//   try {
//     // const userProfileApiUrl = `http://localhost:3000/profile/${encodeURIComponent(
//     //   username
//     // )}`;

//     const userProfileApiUrl = `${
//       process.env.NEXT_PUBLIC_API_BASE_URL
//     }/profile/${encodeURIComponent(session?.user?.name)}`;

//     const response = await fetch(userProfileApiUrl, {
//       method: "GET", // or 'POST', depending on your API method
//       headers: {
//         "Content-Type": "application/json",
//         // Include authorization headers if needed:
//         // 'Authorization': 'Bearer your-auth-token-here'
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const profileData = await response.json();
//     console.log("Fetched profile data", profileData);
//     return profileData;
//   } catch (error) {
//     console.error("Failed to fetch user profile data:", error);
//     return null;
//   }
// };

export default function Profile({
  profileData,
  error,
  message,
}: {
  profileData: any;
  error: any;
  message: any;
}) {
  const [theme, setTheme] = useState("dark");
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  const isDarkTheme = theme === "dark";
  const [savedArticles, setSavedArticles] = useState([]);
  const { data: session } = useSession();
  console.log("session", session);
  const router = useRouter();
  const { username } = router.query;

  // Fetching saved articles
  // useEffect(() => {
  //   const fetchSavedArticles = async () => {
  //     if (!session) return;

  //     setIsLoading(true);

  //     setError("");

  //     try {
  //       const res = await fetch("/api/user-saved-articles", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           // Include authorization if your API requires it
  //           Authorization: `Bearer ${(session as any).token}`,
  //         },
  //       });

  //       if (!res.ok) {
  //         const errMessage = await res.text(); // Assuming the server responds with a plain text error message
  //         switch (res.status) {
  //           case 404:
  //             throw new Error("Articles not found.");
  //           case 401:
  //             throw new Error("Unauthorized. Please log in again.");
  //           case 500:
  //             throw new Error("Server error. Please try again later.");
  //           default:
  //             throw new Error(errMessage || "An unknown error occurred.");
  //         }
  //       }

  //       const { savedArticles } = await res.json();
  //       setSavedArticles(savedArticles);
  //     } catch (error) {
  //       console.error("Failed to fetch saved articles:", error);
  //       setError("Failed to fetch saved articles");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchSavedArticles();
  // }, [session]);

  // if (!data) {
  //   return <div>Data not found</div>;
  // }

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;
  // if (!data) return <div>Data not found</div>;

  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles />
        <AppBody>
          <ProfileTitle>
            <h1>
              {profileData?.user?.name?.split(" ")[0] + "'s" || "Your"} Profile
            </h1>
          </ProfileTitle>
          <p>Profile Page</p>
          <h1>Const Profile: {username}</h1>
          <Row>
            {/* {savedArticles.map(
              (article: {
                _id: string;
                title: string;
                description: string;
                imageSrc: string;
                author: string;
              }) => (
                <ProfileCard key={article._id} article={article} />
              )
            )} */}
          </Row>
        </AppBody>
      </ThemeProvider>
    </>
  );
}

const AppBody = styled.div`
  padding: 40px;
  display: flex;
  padding-top: 150px;
  align-items: left;
  background: black;
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;
  overflow: none;

  @media ${device.mobile} {
    padding-left: 0px;
    padding-top: 80px;
    align-items: left;
  }
`;

const ProfileTitle = styled.div`
  cursor: pointer;
  padding: 10px;
`;

const Row = styled.div`
  overflow: scroll;
`;
