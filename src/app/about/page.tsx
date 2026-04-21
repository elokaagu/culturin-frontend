"use client";

import styled from "styled-components";
import React from "react";
import Header from "../components/Header";
import Link from "next/link";
import { device } from "../styles/breakpoints";

export default function About() {
  return (
    <>
      <Header />
      <Page>
        <Content>
          <section aria-labelledby="about-heading">
            <Title id="about-heading">About Culturin</Title>
            <Lead>
              Culturin is an online culture and travel platform that curates the
              best cultural gems from around the world. Welcome to Culturin,
              where exploration meets inspiration.
            </Lead>
          </section>

          <section aria-label="Mission and approach">
            <Paragraph>
              Our mission is to take you on a journey through the vibrant tapestry
              of global cultures, connecting you with places you have never been
              and people you have never met. At Culturin, travel is more than just a
              destination; it is an immersive experience that offers insight into
              the local traditions, art, cuisine, history, and philosophy that shape
              our global community.
            </Paragraph>
            <Paragraph>
              Our expertly curated content guides you through both the well-trodden
              tourist paths and the hidden gems that offer a more authentic
              perspective. Whether you are planning your next big adventure or
              simply looking to explore from the comfort of your home, Culturin
              provides a window into the cultures that shape our world. It is not
              just about where you go; it is about what you discover along the way.
            </Paragraph>
            <Paragraph>
              Embark on a cultural journey with Culturin, and find the inspiration
              that fuels your wanderlust. Dive into our articles, browse our
              destination guides, and become part of a community that celebrates
              the richness and diversity of our world.
            </Paragraph>
          </section>

          <Actions>
            <ExploreLink href="/">Explore</ExploreLink>
          </Actions>
        </Content>
      </Page>
    </>
  );
}

const Page = styled.main`
  padding: 20px;
  padding-top: 150px;
  display: flex;
  flex: 1;
  justify-content: center;
  background: black;
  min-height: 100%;
  line-height: 1.75;
  color: white;

  @media ${device.mobile} {
    padding-top: 120px;
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.15;
`;

const Lead = styled.p`
  margin: 0;
  margin-top: 12px;
  font-size: clamp(16px, 2.2vw, 20px);
  color: rgba(255, 255, 255, 0.88);
`;

const Paragraph = styled.p`
  margin: 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.86);
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-start;
  padding-top: 8px;
`;

const ExploreLink = styled(Link)`
  margin-top: 8px;
  border-radius: 8px;
  padding: 10px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  text-decoration: none;
  background: ${(props) => props.theme.title};
  color: ${(props) => props.theme.body};

  &:hover {
    background: grey;
    transition: 0.2s ease-in-out;
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.85);
    outline-offset: 3px;
  }
`;
