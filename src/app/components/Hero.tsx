import * as React from "react";
import styled from "styled-components";
import Image from "next/image";
import { device } from "../styles/breakpoints";

export default function Hero() {
  return (
    <AppBody>
      <CardBody />
      <CardText>
        <h1>Beats Beyond Borders</h1>
        <p>The Rise of Hip Hop In The Middle East </p>
        {/* <span>
          <b>Read More</b>
        </span> */}
      </CardText>
    </AppBody>
  );
}

const AppBody = styled.div`
  padding: 20px;
  display: flex;
  margin-top: 20px;
  margin-left: 30px;
  flex-direction: column;
  width: 100%;
  line-height: 2;
  @media ${device.laptop} {
    margin-left: 20px;
  }
  @media ${device.mobile} {
    padding: 6px;
    line-height: 1.8;
    margin-left: 0px;
  }
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

  @media ${device.laptop} {
    height: 200px;
  }

  @media ${device.mobile} {
    height: 150px;
  }
`;

const CardText = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  color: white;

  h1 {
    cursor: pointer;
    font-size: 20px;

    @media ${device.laptop} {
      font-size: 16px;
    }
  }

  p {
    cursor: pointer;
    font-size: 16px;

    @media ${device.laptop} {
      font-size: 12px;
    }
  }

  span {
    cursor: pointer;
    font-size: 14px;

    @media ${device.laptop} {
      font-size: 12px;
    }
  }
`;
