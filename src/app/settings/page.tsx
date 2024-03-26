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
import AccountSection from "../components/AccountSection";
import NotificationSection from "../components/NotificationSection";
import PaymentSection from "../components/PaymentSection";

export default function Settings() {
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
    // Update the active section when the hash changes
    const handleHashChange = () => {
      setActiveSection(window.location.hash);
    };

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "#account":
        return <AccountSection />;
      case "#notifications":
        return <NotificationSection />;

      case "#payments":
        return <PaymentSection />;
      // ... handle other cases
      default:
        return <AccountSection />; // Default section
    }
  };

  const toggleTheme = () => {
    setTheme(isDarkTheme ? "light" : "dark");
  };

  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles />
        <AppBody>
          <SettingsContainer>
            <SettingsTitle>
              {session?.user?.name?.split(" ")[0] + "'s" || "Your"} Settings
            </SettingsTitle>
            <Section>
              {/* <SubNavigation /> */}
              <SubNavigationRow>
                <SectionTitle
                  active={activeSection === "#account"}
                  onClick={() => setActiveSection("#account")}
                >
                  Account
                </SectionTitle>
                <SectionTitle
                  active={activeSection === "#notifications"}
                  onClick={() => setActiveSection("#notifications")}
                >
                  Notifications
                </SectionTitle>
                <SectionTitle
                  active={activeSection === "#payments"}
                  onClick={() => setActiveSection("#payments")}
                >
                  Payments
                </SectionTitle>
              </SubNavigationRow>
              {renderSection()}
              {/* <Label>Email address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleReset();
                }}
                autoComplete="off"
              />
              <Label>Username</Label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleReset();
                }}
                autoComplete="off"
              /> */}
            </Section>
            <SubSection>
              <p>Appearance</p>
              <Button
                onClick={toggleTheme}
                style={{ marginBottom: "20px", marginTop: "10px" }}
              >
                {isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
              </Button>
            </SubSection>
          </SettingsContainer>
        </AppBody>
      </ThemeProvider>
    </>
  );
}

const AppBody = styled.div`
  background: ${(props) => props.theme.body};
  padding: 40px;
  display: flex;
  padding-top: 150px;
  align-items: left;
  // background: black;
  flex-direction: column;
  height: 100%;
  line-height: 2;
  // color: white;
  color: ${(props) => props.theme.title};
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

const SectionTitle = styled.h2<{ active?: boolean }>`
  font-size: 18px;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    color: #0077cc;
    // transition: 0.2s;
  }
  margin-right: 20px;
  color: ${({ active }) => (active ? "#0077cc" : "white")};
  text-decoration: ${({ active }) => (active ? "underline" : "none")};
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

  flex-direction: row;
`;
