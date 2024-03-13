"use client";
import React, { useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { device } from "../styles/breakpoints";
import ProfileCard from "../components/ProfileCard";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../styles/theme";
import { useSession } from "next-auth/react";
import { fetchUsers } from "../lib/data";

const Profile = async () => {
  const [theme, setTheme] = useState("dark");

  const isDarkTheme = theme === "dark";
  const { data: session } = useSession();
  const users = (await fetchUsers()) ?? []; // Add nullish coalescing operator to handle undefined users array
  console.log(users);
  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles />
        <AppBody>
          <ProfileTitle>
            <h1> {session?.user?.name?.split(" ")[0] || "Your"} Profile</h1>
          </ProfileTitle>
          <Row>
            {users.map((user) => (
              <ProfileCard
                key={user.id}
                article={{
                  title: user.name,
                  description: user.email,
                  imageSrc: user.image,
                  author: user.name,
                }} // Add closing parenthesis here
              />
            ))}
          </Row>
        </AppBody>
      </ThemeProvider>
    </>
  );
};

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
};`;
