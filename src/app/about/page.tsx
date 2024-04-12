"use client";
import styled from "styled-components";
import React, { useState } from "react";
import Header from "../components/Header";
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
        </AppBody>
      </ThemeProvider>
    </div>
  );
}

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

const ShareButtonContainer = styled.div`
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

  // color: rgb(250, 193, 0);
  // padding-bottom: 20px;
  // text-decoration: none;
  // position: fixed;
  // right: 50px;
  // top: 200px;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  color: black;
  font-size: 18px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: left;
  flex-direction: row;
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

const OfferBody = styled.div`
  margin: auto;
  margin-top: 20px;
  width: 95%;
  align-items: left;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
  cursor: pointer;
  background: #111111;
  border-radius: 10px;

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

const OfferBenefit = styled.div``;

const Features = styled.div`
  margin-top: 40px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 1px solid #111111;
  border-radius: 10px;
  background: black;
  color: white;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const LearnMoreButton = styled.button`
  margin-top: 50px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: white;
  color: black;
  font-weight: bold;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const MembershipSection = styled.section`
  width: 100%;
  padding: 60px 0;
  color: black;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
`;

const MembershipTitle = styled.h2`
  font-size: 2em;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 20px;
  color: white;
`;

const MembershipInfo = styled.p`
  font-size: 1.2em;
  text-align: center;
  margin-bottom: 40px;
`;

const PricingCard = styled.div`
  width: 350px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PricingToggle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-bottom: 30px;
`;

const ToggleOption = styled.span<ToggleOptionProps>`
  font-weight: bold;
  cursor: pointer;
  background-color: ${(props) =>
    props.active
      ? "#DDEEFF"
      : "transparent"}; // Example active color, adjust as needed
  padding: 10px;
  border-radius: 10px;
  &:first-child {
    margin-right: 5px;
  }
  &:last-child {
    margin-left: 5px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const PriceAmount = styled.span`
  font-size: 3em;
  font-weight: bold;
`;

const PricePer = styled.span`
  font-size: 1em;
`;

const BilledDetail = styled.span`
  font-size: 0.8em;
  color: #666;
`;

const BestValueLabel = styled.span`
  font-size: 0.9em;
  color: green;
  margin: 10px 0;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
`;

const Benefit = styled.li`
  font-size: 1em;
  margin: 10px 0;
  &:before {
    content: "✔";
    color: green;
    margin-right: 10px;
  }
`;

const ApplyButton = styled.button`
  padding: 10px 20px;
  background: black;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #333;
  }
`;

const CTASection = styled.section`
  background-color: black;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  text-align: center;
  border-radius: 10px;
  color: #000;
`;

const CTATitle = styled.h2`
  font-size: 2em;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 20px;
  color: white;
`;

const CTASubtitle = styled.p`
  font-size: 1em;
  margin-bottom: 30px;
  color: white;
`;

const EmailInput = styled.input`
  font-size: 1em;
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-bottom: 2px solid #000;
  background-color: white;
  color: #000;
  width: 280px;
  align-self: center;
  border-radius: 10px;
  outline: none;
  text-align: left;

  &::placeholder {
    color: #000;
  }
`;

const GetStartedButton = styled.button`
  font-size: 1em;
  color: #000;
  background-color: #fff;
  padding: 10px 20px;
  width: 300px;
  align-self: center;
  font-weight: bold;
  border-radius: 10px;
  border: 2px solid #000; /* or another color for the border */
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;
