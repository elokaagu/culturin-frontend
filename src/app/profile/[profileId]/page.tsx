"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import Link from "next/link";
import { device } from "../../styles/breakpoints";
import ProfileCard from "../../components/ProfileCard";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../../styles/theme";
import { useSession } from "next-auth/react";
import { fullBlog } from "../../../../lib/interface";
import { set } from "mongoose";

export default function Profile({ params }: { params: { profileId: string } }) {
  const [theme, setTheme] = useState("dark");

  const isDarkTheme = theme === "dark";
  const [savedArticles, setSavedArticles] = useState([]);

  const { data: session } = useSession();

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

  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles />
        <AppBody>
          <ProfileTitle>
            <h1>
              {" "}
              {session?.user?.name?.split(" ")[0] + "'s" || "Your"} Profile
            </h1>
          </ProfileTitle>
          {/* <Row>
            <ProfileCard />
          </Row> */}
          {/* <Row>
            {savedArticles.map(
              (article: {
                _id: string;
                title: string;
                description: string;
                imageSrc: string;
                author: string;
              }) => (
                <ProfileCard key={article._id} article={article} />
              )
            )}
          </Row> */}
          <p>Hello</p>
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
