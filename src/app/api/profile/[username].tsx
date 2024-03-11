// "use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import Link from "next/link";
import { device } from "../../styles/breakpoints";
import ProfileCard from "../../components/ProfileCard";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../../styles/theme";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

export async function handler(req: any, res: any) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({
      message: "You must be signed in to view the protected content.",
    });
  }
  const { username } = req.query;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the username from the URL
  const { username } = context.params || {};

  if (!username) {
    // If username isn't found in the URL, return a 404 page
    return { notFound: true };
  }

  try {
    const res = await fetch(`http://localhost:3000/api/profile/${username}`);

    if (!res.ok) {
      // If the response is not okay, return a 404 page
      console.log(`API call failed with status: ${res.status}`); // Log for debugging

      return { notFound: true };
    }

    const data = await res.json();
    console.log("Profile data:", data); // Log the response data for debugging

    return { props: { data } };
  } catch (error) {
    // If there's an error during fetch, log it and return a 404 page
    console.error("Error fetching profile data:", error);
    return { notFound: true };
  }
};

const fetchUserProfile = async () => {
  try {
    const userProfileApiUrl = "http://localhost:3000/api/profile/${username}"; // Replace with the actual API URL

    const response = await fetch(userProfileApiUrl, {
      method: "GET", // or 'POST', depending on your API method
      headers: {
        "Content-Type": "application/json",
        // Include authorization headers if needed:
        // 'Authorization': 'Bearer your-auth-token-here'
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const profileData = await response.json();
    // Do something with the profile data
    console.log(profileData);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    // Handle errors here
  }
};

// useEffect(() => {
//   if (session?.user?.name) {
//     fetchUserProfile();
//   }
// }, [session?.user?.name]);

export default function Profile({ data }: { data: any }) {
  const [theme, setTheme] = useState("dark");

  const isDarkTheme = theme === "dark";
  const [savedArticles, setSavedArticles] = useState([]);
  const { data: session } = useSession();
  console.log("session", session);
  useEffect(() => {
    const fetchSavedArticles = async () => {
      if (session) {
        try {
          const res = await fetch("/api/user-saved-articles", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Include authorization if your API requires it
              Authorization: `Bearer ${(session as any).token}`,
            },
          });

          if (!res.ok) {
            throw new Error("Failed to fetch saved articles");
          }
          const { savedArticles } = await res.json();
          setSavedArticles(savedArticles);
        } catch (error) {
          console.error("Error fetching saved articles", error);
        }
      }
    };
    fetchSavedArticles();
  }, [session]);

  if (!data) {
    return <div>Data not found</div>;
  }

  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles />
        <AppBody>
          <ProfileTitle>
            <h1>
              {session?.user?.name?.split(" ")[0] + "'s" || "Your"} Profile
            </h1>
          </ProfileTitle>
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
