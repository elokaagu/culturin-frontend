"use client";
import styled from "styled-components";
import React, { useState } from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { ChevronDown } from "styled-icons/boxicons-regular";
import Link from "next/link";
import { device } from "../styles/breakpoints";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, darkTheme, lightTheme } from "../styles/theme";

interface ToggleOptionProps {
  active: boolean;
}

export default function About() {
  // States
  const [theme, setTheme] = useState("dark");

  const isDarkTheme = theme === "dark";
  return (
    <div>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles />
        <AppBody>
          {/* <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}> */}
          <Title>
            <h1>About Culturin</h1>
          </Title>
          <Subtitle>
            <h2>
              Culturin is a online culture and travel platform, that curates the
              best cultural gems from around the world. Welcome to Culturin,
              where exploration meets inspiration.
            </h2>
            <br />
            <p>
              Our mission is to take you on a journey through the vibrant
              tapestry of global cultures, connecting you with places you’ve
              never been and people you have never met. At Culturin, travel is
              more than just a destination; it is an immersive experience that
              offers insight into the local traditions, art, cuisine, history,
              and philosophy that shape our global community.
            </p>
            <br />
            <p>
              {" "}
              Our expertly curated content guides you through both the
              well-trodden tourist paths and the hidden gems that offer a more
              authentic perspective. Whether you are planning your next big
              adventure or simply looking to explore from the comfort of your
              home, Culturin provides a window into the cultures that shape our
              world. It is not just about where you go; it is about what you
              discover along the way. Embark on a cultural journey with
              Culturin, and find the inspiration that fuels your wanderlust.
              Dive into our articles, browse our destination guides, and become
              a part of a community that celebrates the richness and diversity
              of our world. Join us in embracing the spirit of exploration and
              cultural connection.
            </p>
          </Subtitle>

          <Body>
            <Link href="/">
              <HeroButton>Explore</HeroButton>
            </Link>
          </Body>
          {/* </motion.div> */}
        </AppBody>
      </ThemeProvider>
    </div>
  );
}

// const AppBody = styled(motion.div)`
//   padding: 20px;
//   padding-top: 150px;
//   display: flex;
//   flex: 1;
//   align-items: center;
//   background: black;
//   flex-direction: column;
//   height: 100%;
//   line-height: 2;
//   color: white;
// `;

const AppBody = styled.div`
  padding: 20px;
  padding-top: 150px;
  display: flex;
  flex: 1;
  align-items: center;
  background: black;
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;
`;

const Title = styled.div`
  margin: auto;
  width: 50%;
  margin: auto 10px;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
  cursor: pointer;
  transition: background-color 0.3s;

  @media ${device.mobile} {
    align-items: left;
    margin-left: 0;
    width: 100%;

    h1 {
      font-size: 25px;
      align-items: left;
      margin-left: 20px;
      width: 100%;
    }
  }
`;

const Subtitle = styled.div`
  margin: auto;
  width: 50%;
  margin: auto 10px;
  padding-left: 30px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
  cursor: pointer;

  h3 {
    font-size: 20px;
    margin-bottom: 20px;
    color: grey;
  }

  @media ${device.mobile} {
    margin-left: 60px;
    padding-left: 10px;
    align-items: left;
    width: 100%;
  }
`;

const AdvisorTitle = styled.div`
  align-items: center;

  @media ${device.mobile} {
    align-items: left;
    margin-left: 0;
    width: 100%;
  }
`;

const Body = styled.div`
  margin: auto;
  width: 50%;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
  cursor: pointer;
  a {
    text-decoration: none;
  }

  p {
    font-size: 18px;
    padding-top: 5px;
    padding-bottom: 20px;
    color: white;
  }

  @media ${device.mobile} {
    padding-left: 20px;
    align-items: left;
    width: 100%;

    p {
      font-size: 18px;
      padding-bottom: 36px;
      color: white;
    }
  }
`;

const ImageContainer = styled.div`
  padding-bottom: 20px;
  cursor: pointer;
  img {
    border-radius: 10px;
  }

  @media ${device.mobile} {
    margin: 0 auto;
    padding-left: 10px;
    border-radius: 20px;

    img {
      margin-left: 0;
      border-radius: 10px;
      width: 360px;
    }
  }
`;

const ImageWrap = styled.span`
  & > span {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 20px;
    object-fit: cover;
  }

  @media ${device.mobile} {
    & > span {
      object-fit: cover;
      border-radius: 20px; /* Rounded edges on mobile */
    }
  }
`;

const SaveButtonContainer = styled.div`
  border-radius: 10px;
  width: 120px;
  padding: 10px;
  display: flex;
  margin-right: 20px;
  flex-direction: column;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  background-color: white;
  color: black;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: grey;
    transition: 0.3s ease-in-out;
  }

  @media ${device.mobile} {
    width: 100px;
    font-size: 14px;
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
