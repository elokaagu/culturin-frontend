"use client";
import styled from "styled-components";
import React, { useState } from "react";
import Header from "../../components/Header";
import { ChevronDown } from "styled-icons/boxicons-regular";
import Link from "next/link";
import { device } from "../../styles/breakpoints";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../../styles/theme";

export default function Advisors() {
  const scrollToSection = () => {
    const section = document.getElementById("target-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
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
            <h1>Become a Culturin advisor</h1>
          </Title>
          <Subtitle>
            <p>
              {" "}
              Culturin is designed for the innovative and entrepreneurial travel
              advisor of tomorrow. Our core mission is to empower those with a
              deep-rooted passion for exploration and travel to generate a
              flexible income by curating and booking unforgettable journeys. At
              Culturin, we believe that travel is more than just visiting new
              destinations; its about creating experiences that last a lifetime.
            </p>
          </Subtitle>

          <Body>
            <p>
              Whether you are just starting out or looking to elevate your
              existing travel advisory business, Culturin offers the tools,
              resources, and community support needed to thrive in the dynamic
              world of travel planning. Join us and become part of a vibrant
              community of travel enthusiasts who are transforming their love
              for exploration into rewarding careers. Let Culturin be your guide
              to a successful and fulfilling future in the travel industry.
            </p>
            <HeroButton onClick={scrollToSection}>Apply</HeroButton>

            <OfferBody>
              <h1>Community</h1>
              <p>
                Our diverse, inclusive & engaged global community is designed to
                make you feel welcome.
              </p>
              <OfferBenefit></OfferBenefit>
            </OfferBody>
            <Features>
              <Feature>
                <p>Live networking events across the country</p>
              </Feature>
              <Feature>
                <p>Community app for collaboration and support</p>
              </Feature>
              <Feature>
                <p>Weekly online community & partner events</p>
              </Feature>
              <Feature>
                <p>Mentorship, FAM trips & site visits</p>
              </Feature>
            </Features>
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
