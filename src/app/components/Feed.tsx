"use client";
import React from "react";
import styled from "styled-components";
import { CldImage } from "next-cloudinary";
import { device } from "../styles/breakpoints";

export default function Feed() {
  return (
    <AppBody>
      <FeedContainer>
        <FeedText>
          <h1>Introducing Cynthia Bailey</h1>
          <p>American star talks travel, culture and health </p>
          <span>17th January 2024</span>
        </FeedText>
        <FeedImage>
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
