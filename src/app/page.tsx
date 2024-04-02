"use client";

import styled from "styled-components";
import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { device } from "./styles/breakpoints";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "./styles/theme";
import { Toggle } from "styled-icons/ionicons-outline";
import { useSession } from "next-auth/react";
import VideoHero from "./components/VideoHero";
import ProviderHero from "./components/ProviderHero";
import Link from "next/link";

// import dynamic from "next/dynamic";

// import prisma from "../app/api/auth/[...nextauth]/prisma";

//Session Data

type Session = {
  user: {
    name: string;
    email: string;
    // Add any other properties you expect 'user' to have
  };
  // Add any other properties you expect 'session' to have
};

// Scroll Component

// Theme Provider

// Dynamic imports

// const Hero = dynamic(() => import("./components/Hero"));

// const DynamicHero = dynamic(() => import("./components/Hero"), {
//   loading: () => <p>Loading...</p>,
// });

export default function Home() {
  // Scroll Component

  // Scroll to the target section
  const scrollToSection = () => {
    const section = document.getElementById("target-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  // States
  const { data: session } = useSession();

  const [theme, setTheme] = useState("dark");
  const [isNavOpen, setIsNavOpen] = useState(false); // Define isNavOpen state

  const isDarkTheme = theme === "dark";

  // Scroll Component

  // Toggle Theme

  const toggleTheme = () => {
    setTheme(isDarkTheme ? "light" : "dark");
  };

  // Sign up or Sign in

  // if (!session) {
  //   // Redirect or show a message if there is no session
  //   // Or handle the unauthenticated state as needed
  //   redirect("/signin");
  // }

  // Dymamic imports
  const [showMore, setShowMore] = useState(false);

  // Return
  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <>
          <GlobalStyles />

          <Body>
            <HeroSection>
              <HeroTitle>
                <h1>Think global, travel local</h1>
                <p>Discover a world of culture</p>
                <HeroButton onClick={scrollToSection}>Explore</HeroButton>
              </HeroTitle>
              {/* <HeroVideoSection>
                  <video
                    autoPlay
                    muted
                    loop
                    style={{ width: "100%", height: "auto" }}
                  >
                    <source src="/path/to/your/video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </HeroVideoSection> */}
            </HeroSection>
            <Row>
              <Title>
                <div id="target-section">
                  <Link href="/trending" passHref>
                    <h1>Trending Stories</h1>
                  </Link>
                  <p>Discover a world of travel, inspiration and culture</p>
                </div>
              </Title>
              {/* <ViewAll>
                <Link href="/trending" passHref>
                  View All
                </Link>
              </ViewAll> */}

              <Switch>
                <SwitchItem>
                  <Toggle size={20} onClick={toggleTheme} />
                </SwitchItem>
              </Switch>
            </Row>
            <Row>
              <Hero />
            </Row>
            <Row>
              <Title>
                <h1>Top Videos</h1>
                <p>Watch highlights from the world</p>
              </Title>
            </Row>
            <VideoRow>
              <VideoHero />
            </VideoRow>

            <Row>
              <Title>
                <h1>Wellness</h1>
                <p>Discover the best in regenerative travel</p>
              </Title>
            </Row>
            <Row>
              <ProviderHero />
            </Row>

            <Row>
              <Title>
                <h1>A global taste</h1>
                <p>Indulge in foods from all around the world</p>
              </Title>
            </Row>
            <Row>
              <Hero />
            </Row>
          </Body>
        </>
      </ThemeProvider>
    </>
  );
}

const Body = styled.div`
  background: ${(props) => props.theme.body};
  width: 100%;
  height: 100%;
  padding-top: 150px;
  transition: all 0.25s ease;

  @media ${device.mobile} {
    padding-top: 100px;
  }
`;

const HeroVideoSection = styled.div`
  width: 100%;
  height: auto; // Adjust based on your design needs
  overflow: hidden; // Ensures the video doesn't exceed the container's bounds
  position: relative; // Allows for positioning the title or other elements on top of the video
`;

const HeroSection = styled.div`
  height: 50vh;
  display: flex;
  padding: 20px;
  flex direction: column;
  flex: 1;
`;

const HeroTitle = styled.div`
  margin: auto 10px;
  padding-left: auto;
  padding-top: 20px;
  padding-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  cursor: pointer;

  h1 {
    margin-bottom: 20px;
  }

  @media ${device.mobile} {
    padding-left: 0px;
  }
`;

const Row = styled.div`
display: flex;
padding: 20px;
flex direction: column;
justify: space-between;
flex: 1;
overflow: scroll;
a {
  text-decoration: none;
  color: ${(props) => props.theme.title};
}

@media ${device.mobile} {
  padding: 10px;
  overflow: scroll;
  }
`;

const VideoRow = styled.div`
display: flex;
padding: 20px;
flex direction: column;
flex: 1;
overflow: scroll;
@media ${device.mobile} {
  padding: 10px;
  overflow: scroll;
  }
`;

const Switch = styled.div`
  padding-top: 40px;
  display: flex;
  align-items: right;
  position: fixed;
  z-index: 200;
  cursor: pointer;
  flex: 1;
  justify-content: flex-end;
  margin-right: 30px;
`;

const SwitchItem = styled.div`
  padding-right: 8px;
  position: fixed;
  right: 40px;
  bottom: 20px;
`;

const Title = styled.div`
  margin: auto 10px;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  cursor: pointer;

  h1 {
    background: #111111;
    padding: 10px;
    border-radius: 10px;
    width: fit-content;
    margin-bottom: 15px;
    transition: background-color 0.3s; /* Smooth transition for background color */

    &:hover {
      background-color: #222222; /* Darker grey on hover */
    }
  }

  @media ${device.mobile} {
    padding-left: 0px;
  }
`;

const SidebarMobile = styled.div`
  display: none;
  @media ${device.mobile} {
    display: block;
  }
`;

const HeroButton = styled.div`
  margin-top: 20px;
  border-radius: 5px;
  width: 100px;
  ${"" /* border: 1px solid white; */}
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  color: black;
  font-weight: 600;
  cursor: pointer;
  background: ${(props) => props.theme.title};
  color: ${(props) => props.theme.body};

  &:hover {
    background: grey;
    transition: 0.3s ease-in-out;
  }

  @media ${device.mobile} {
    width: 100px;
  }
`;

const ViewAll = styled.div`
  display: flex;
  flex-direction: row;
  color: ${(props) => props.theme.body};
`;
