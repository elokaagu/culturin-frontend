"use client";
import { GetServerSideProps } from "next";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import Link from "next/link";
import { device } from "../../styles/breakpoints";
import ProfileCard from "../../components/ProfileCard";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../../styles/theme";
import { connectMongoDB } from "../../../libs/mongodb";
import { ObjectId } from "mongodb";
import { useSession } from "next-auth/react";
import prisma from "../../../libs/prisma";

const createUsernameSlug = (name: string) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "");
};

// profile/[userId].page.tsx

// ... other imports

export default function ProfilePage() {
  const { data: session } = useSession();
  console.log("session", session);
  const [theme, setTheme] = useState("dark");
  const isDarkTheme = theme === "dark";
  const [userData, setUserData] = useState({ name: "", email: "" });
  const fetchDataFromApri = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/users/${session.user.id}`)
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
            </h1>
          </ProfileTitle>
          <Row>
            <p>This is the profile section where you save</p>
            <p>your favorite articles</p>
            <p>{userData.email}</p>
          </Row>
          <ProfileCardBody>
            <p>Browse your library</p>
          </ProfileCardBody>
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

const ProfileCardBody = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: left;
  height: 300px;
  width: 300px;

  border-radius: 8px;
  drop-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background: #1a1a1a;
  cursor: pointer;
  box-shadow: 0px 6px 8px rgba(25, 50, 47, 0.08),
    0px 4px 4px rgba(18, 71, 52, 0.02), 0px 1px 16px rgba(18, 71, 52, 0.03);

  img {
    border-radius: 8px;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  &:hover {
    background-color: #4444;
    opacity: 0.4;
    transform: scale(0.98);
    transition: 0.3s ease-in-out;
  }

  @media ${device.laptop} {
    height: 200px;
  }

  @media ${device.mobile} {
    height: 200px;
    width: 150px;
  }
`;

const ProviderCardText = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  color: ${(props) => props.theme.title};

  h1 {
    cursor: pointer;
    font-size: 16px;

    @media ${device.laptop} {
      font-size: 16px;
    }

    @media ${device.mobile} {
      font-size: 14px;
    }
  }

  p {
    cursor: pointer;
    font-size: 14px;
    -webkit-line-clamp: 2;

    color: ${(props) => props.theme.subtitle};

    @media ${device.laptop} {
      font-size: 12px;
      color: grey;
    }

    @media ${device.mobile} {
      font-size: 12px;
    }
  }

  span {
    cursor: pointer;
    font-size: 14px;

    @media ${device.laptop} {
      font-size: 12px;
    }
  }
`;

const ProviderCardAuthor = styled.div`
  display: flex;
  pointer: cursor;
  flex-direction: row;
  align-items: center;
`;
