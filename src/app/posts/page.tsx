"use client";
import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Hero from "../components/Hero";

export default function Posts() {
  return (
    <>
      <Header />
      <AppBody>
        <Title>
          <p>Enugu, Nigeria</p>
        </Title>
        <Subtitle>
          <p>Enugu is derived from the Nigerian word for Utopia</p>
        </Subtitle>
        <Body>
          <p>
            Ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Cumque, nostrum quis. Error alias aliquid, asperiores soluta
            temporibus et doloremque rerum architecto saepe harum. Mollitia
            aspernatur corporis temporibus quasi sed officiis?
          </p>
        </Body>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  padding: 40px;
  display: flex;
  padding-top: 150px;
  flex: 1;
  align-items: left;
  background: black;
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;
`;

const Title = styled.div`
  margin: auto 10px;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  cursor: pointer;

  h3 {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

const Subtitle = styled.div`
  margin: auto 10px;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  cursor: pointer;

  h3 {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

const Body = styled.div`
  margin: auto 0px;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  cursor: pointer;
`;
