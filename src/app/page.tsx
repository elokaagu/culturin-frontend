"use client";

import styled from "styled-components";
import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { device } from "./styles/breakpoints";
import {
  loginIsRequiredServer,
  options,
} from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import prisma from "../app/api/auth/[...nextauth]/prisma";

type Session = {
  user: {
    name: string;
    email: string;
    // Add any other properties you expect 'user' to have
  };
  // Add any other properties you expect 'session' to have
};

export default function Home() {
  const [session, setSession] = React.useState<Session | null>(null);

  React.useEffect(() => {
    const fetchSession = async () => {
      await loginIsRequiredServer();
      const session = await getServerSession(options);
      setSession(session as Session | null);
    };
    fetchSession();
  }, []);

  return (
    <>
      <Header />
      <Body>
        <h1>Hey, {session?.user?.name}</h1>
        <Row>
          <Hero />
          <Hero />
          <Hero />
        </Row>
        <Row>
          <Hero />
          <Hero />
          <Hero />
        </Row>
      </Body>
    </>
  );
}

const Body = styled.div`
  ${"" /* margin-top: 60px; */}
  ${
    "" /* margin-left: 20px;
  margin-right: 40px; */
  }
  background: black;
  width: 100%;
  height: 100%;
`;

const Row = styled.div`
display: flex;
flex direction: columnn;
flex: 1;
@media ${device.mobile} {
  padding: 10px;
  }
`;
