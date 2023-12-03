import React from "react";
import styled from "styled-components";
import Image from "next/image";

export default function Hero() {
  return (
    <AppBody>
      <CardBody />
      <CardText>
        <h1>Beats Beyond Borders</h1>
        <p>The Rise of Hip Hop In The Middle East </p>
        <span>
          <b>Read More</b>
        </span>
      </CardText>
    </AppBody>
  );
}

const AppBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  ${
    "" /* margin-left: 40px;
  margin-right: 40px; */
  }
  line-height: 2;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  height: 300px;
  padding: 20px;
  border-radius: 8px;
  drop-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background: #1a1a1a;
  cursor: pointer;

  &:hover {
    background-color: #4444;
    transform: scale(0.99);
    transition: 0.3s ease-in-out;
  }
`;

const CardText = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  h1 {
    cursor: pointer;
    font-size: 20px;
  }

  p {
    cursor: pointer;
    font-size: 16px;
  }

  span {
    cursor: pointer;
    font-size: 14px;
  }
`;
