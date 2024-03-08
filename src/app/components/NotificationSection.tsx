"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { device } from "../styles/breakpoints";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../styles/theme";
import { useSession } from "next-auth/react";
import SubNavigation from "../components/SubNavigation";

export default function NotificationSection() {
  const [theme, setTheme] = useState("dark");
  const [email, setEmail] = useState(""); // Replace with user's email from session
  const [username, setUsername] = useState(""); // Replace with user's username from session
  const isDarkTheme = theme === "dark";
  const [formInput, setFormInput] = useState<undefined>(); // Update the type of formInput to undefined
  const { data: session } = useSession();
  function handleReset() {
    setFormInput(undefined); // Set formInput state to undefined
  }
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    setActiveSection(window.location.hash);
  }, []);

  return (
    <>
      <Label>Recommended Reading</Label>
      <p>
        Featured stories, vidoes and packages that we think you’ll enjoy based
        on your reading history.
      </p>{" "}
      <Label>Mobile</Label>
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleReset();
        }}
        autoComplete="off"
      />
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

const SettingsTitle = styled.div`
  cursor: pointer;
`;

const Row = styled.div`
  overflow: scroll;
`;

const SettingsContainer = styled.div`
  margin: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const SubSection = styled.div`
  margin-bottom: 10px;
`;

const SubSectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Label = styled.label`
  // Add styles for labels
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #005fa3;
  }
`;

const SubNavigationRow = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
`;
