"use client";
import styled from "styled-components";
import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { device } from "./styles/breakpoints";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "./styles/theme";
import { useSession } from "next-auth/react";
import VideoHero from "./components/VideoHero";
import ProviderHero from "./components/ProviderHero";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
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

  // Return
  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <>
          <GlobalStyles />
          <Body>
            <HeroSection>
              <HeroContainer>
                <HeroTitle>
                  {/* <h1>Think global, travel local</h1> */}

                  <h1>Travel global, live local</h1>
                  <p>Discover a world of culture</p>
                  <HeroButton onClick={scrollToSection}>Explore</HeroButton>
                </HeroTitle>
              </HeroContainer>
            </HeroSection>

            <Row>
              <Title>
                <div id="target-section">
                  <Link href="/trending" passHref>
                    <h1>Trending Stories</h1>
                  </Link>
                </div>
                <p>Discover a world of travel, inspiration and culture</p>
              </Title>
            </Row>
            <Row>
              <Hero />
            </Row>
            <Row>
              <Title>
                <Link href="/videos" passHref>
                  <h1>Top Videos</h1>
                </Link>
                <p>Watch highlights from the world</p>
              </Title>
            </Row>
            <VideoRow>
              <VideoHero />
            </VideoRow>
            <Row>
              <Title>
                <Link href="/curated-experiences" passHref>
                  <h1>Curated Experiences</h1>
                </Link>
                <p>Browse our hand picked selection of experiences</p>
              </Title>
            </Row>
            <Row>
              <ProviderHero />
            </Row>

            {/* <Row>
              <Title>
                <h1>A global taste</h1>
                <p>Indulge in foods from all around the world</p>
              </Title>
            </Row>
            <Row>
              <Hero />
            </Row> */}
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
    padding-top: 120px;
  }
`;

const HeroSection = styled.div`
  // height: 50vh;
  // display: flex;
  // padding: 20px;
  // background-color: black;
  // flex direction: column;
  // flex: 1;
  height: 50vh;
  display: flex;
  justify-content: center; // This will center the child horizontally
  align-items: center; // This will center the child vertically
  padding: 20px;
  background-color: black;
  flex-direction: column;
  position: relative; // Only necessary if you are absolutely positioning any children
`;

const HeroContainer = styled.div`
  height: 50vh;
  display: flex;
  padding: 20px;
  width: 95%;

  border-radius: 10px;
  flex-direction: column;
  position: relative; // To position elements within it absolutely
  justify-content: center; // Center the content vertically
  align-items: center; // Center the content horizontally
  background-image: url("https://www.forbes.com/advisor/wp-content/uploads/2021/03/traveling-based-on-fare-deals.jpg"); // Add your background image path here
  background-size: cover; // Cover the entire area of the div
  background-position: center; // Center the background image
  color: white; // Assuming you want a light text over a dark image
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
  z-index: 2;

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
    font-size: 30px;
    border-radius: 10px;
    width: fit-content;
    margin-bottom: 15px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #222222;
    }
  }

  @media ${device.mobile} {
    padding-left: 0px;
  }
`;

const HeroButton = styled.div`
  margin-top: 20px;
  border-radius: 5px;
  width: 100px;
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

const ImageWrapper = styled.div`
  position: absolute;
  background-color: red;
  width: 100%; // Ensure it spans the full width or adjust as necessary
  height: 50vh; // Adjust height as needed
  top: /* Adjust this based on your header's height to position it right below the header */ ;
  z-index: 0; // Ensures that text and buttons with higher z-index values appear above the image
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
