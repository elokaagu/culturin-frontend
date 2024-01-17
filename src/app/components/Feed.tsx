"use client";
import React from "react";
import styled from "styled-components";
import { CldImage } from "next-cloudinary";
import { device } from "../styles/breakpoints";
import Link from "next/link";

export default function Feed() {
  return (
    <AppBody>
      <Link href="/" passHref>
        <BackLink>
          <svg
            width="16"
            height="16"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
          {"   "}
          back
        </BackLink>
      </Link>

      <FeedContainer>
        <FeedText>
          <h1>Introducing Cynthia Bailey</h1>
          <p>American star talks travel, culture and health </p>
          <span>17th January 2024</span>
        </FeedText>
        <FeedImage>
          <Link href="/spotlight/posts">
            <ImageWrap>
              <CldImage
                src="https://res.cloudinary.com/drfkw9rgh/image/upload/v1705493709/ojcn4o1quyu8e6fdyaws.webp"
                alt="mainImage"
                placeholder="blur"
                width={250}
                height={150}
                blurDataURL="https://res.cloudinary.com/drfkw9rgh/image/upload/v1704889319/htsnt5rzrvjcfnrixbqy.jpg"
                style={{
                  // width: "100%",
                  // height: "auto",
                  objectFit: "cover",
                  position: "relative",
                  objectPosition: "center",
                }}
                draggable="false"
              />
            </ImageWrap>
          </Link>
        </FeedImage>
      </FeedContainer>
    </AppBody>
  );
}

const AppBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 50px;
`;

const FeedContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: 10px;
  background-color: black;
  //   border: 1px solid #222222;
  cursor: pointer;
  width: 50%;
  &:hover {
    background: #222222;
    transition: 0.3s ease-in-out;
  }

  h1 {
    font-size: 20px;
  }

  p {
    color: #999999;
  }

  span {
    color: #999999;
    font-size: 12px;
  }

  a {
    text-decoration: none;
  }
`;

const FeedText = styled.div`
  display: flex;
  flex-direction: column;
`;

const FeedImage = styled.div`
  cursor: pointer;
  img {
    border-radius: 10px;
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

const BackLink = styled.a`
  color: rgb(250, 193, 0);
  padding-bottom: 20px;
  text-decoration: none;
  position: fixed;
  left: 50px;
  top: 200px;

  :hover {
    color: white;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
  }

  @media ${device.mobile} {
    // position: fixed;
    // left: 20px;
    // top: 105px;
    display: none;
  }
`;
