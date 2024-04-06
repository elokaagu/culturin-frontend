import { GetServerSideProps } from "next";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { device } from "../styles/breakpoints";
import ProfileCard from "../components/ProfileCard";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../styles/theme";
import { connectMongoDB } from "../../libs/mongodb";
import { ObjectId } from "mongodb";
import { useSession } from "next-auth/react";

interface ProfileProps {
  // Define the shape of your props
  name: string;
  email: string;
}
interface Article {
  _id: string;
  title: string;
  description: string;
  imageSrc: string;
  author: string;
}

const createUsernameSlug = (name: string) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "");
};

// profile/[userId].page.tsx

// ... other imports

export default function ProfilePage({ name, email }: ProfileProps) {
  const { data: session } = useSession();
  console.log("session", session);
  const [theme, setTheme] = useState("dark");
  const isDarkTheme = theme === "dark";
  const [userData, setUserData] = useState({ name, email });

  useEffect(() => {
    // If session is available, fetch user data client-side
    if (session?.user?.id) {
      fetch(`/api/user/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          // Update user data state
          setUserData({ name: data.name, email: data.email });
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [session]);

  // const [savedArticles, setSavedArticles] = useState<Article[]>([]);

  // useEffect(() => {
  //   const fetchSavedArticles = async () => {
  //     if (!session) return;

  //     setIsLoading(true);

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
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchSavedArticles();
  // }, [session]);

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles />
        <AppBody>
          <ProfileTitle>
            <h1>
              {session?.user?.name?.split(" ")[0] + "'s" || "Your"} Profile
              Welcome back {userData.name}
            </h1>
          </ProfileTitle>
          <p>Name </p>
          <Row>
            {/* {savedArticles.map((article) => (
              <ProfileCard key={article._id} article={article} />
            ))} */}
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
