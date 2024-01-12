/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { device } from "../styles/breakpoints";
import { CldImage } from "next-cloudinary";

export default function Posts() {
  return (
    <>
      <Header />
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

        <Title>
          <h1>Enugu, Nigeria</h1>
        </Title>
        <Subtitle>
          <h3>Unveiling Enugu's Rich Cultural Heritage</h3>
        </Subtitle>
        <ImageContainer>
          {" "}
          <ImageWrap>
            <CldImage
              src="https://res.cloudinary.com/drfkw9rgh/image/upload/v1704889319/htsnt5rzrvjcfnrixbqy.jpg"
              alt="mainImage"
              placeholder="blur"
              width={700}
              height={500}
              blurDataURL="https://res.cloudinary.com/drfkw9rgh/image/upload/v1704889319/htsnt5rzrvjcfnrixbqy.jpg"
              style={{
                // width: "100%",
                // height: "auto",
                objectFit: "cover",
                position: "relative",
              }}
              draggable="false"
            />
          </ImageWrap>
        </ImageContainer>

        <Body>
          <p>
            Enugu, often referred to as the "Coal City State," is a Nigerian
            city that boasts a diverse and vibrant cultural heritage. Located in
            the southeastern region of Nigeria, Enugu is not only known for its
            historical significance but also for the tapestry of cultures that
            have woven together to create a unique cultural identity. One of the
            most prominent aspects of Enugu's cultural heritage is its rich
            history. The city served as the capital of the short-lived Republic
            of Biafra during the Nigerian Civil War, making it a symbol of
            resilience and determination in the face of adversity. Visitors can
            explore the remnants of this turbulent period through various
            museums and memorials, gaining insight into the city's historical
            struggles and triumphs. Enugu's cultural heritage is also deeply
            intertwined with its indigenous people, primarily the Igbo.
          </p>
          <p>
            The Igbo culture is celebrated through colorful festivals, dances,
            and traditional ceremonies. One such event is the New Yam Festival,
            known as "Iri Ji Ohuru" in Igbo, which is a time-honored tradition
            where the people of Enugu come together to thank the gods for a
            bountiful harvest. The festival is characterized by music, dance,
            masquerades, and feasting, showcasing the cultural richness of the
            Igbo people. Music and dance play a significant role in Enugu's
            cultural heritage. The city is known for its traditional music,
            which often features drums, flutes, and other indigenous
            instruments. The high-energy dances like "Ogene" and "Ekwe" are
            performed at various cultural events and ceremonies, bringing people
            together and preserving the cultural identity of the region. Enugu
            also boasts a culinary heritage that reflects its cultural
            diversity. The city's cuisine is a fusion of traditional Igbo dishes
            and influences from neighboring ethnic groups. Visitors can savor
            delicious meals such as "Nsala" (white soup), "Oha" soup, and "Ugba"
            (oil bean seed) garnished with palm oil and spices, providing a
            delightful gastronomic experience.{" "}
          </p>
          <p>
            {" "}
            In conclusion, Enugu's cultural heritage is a tapestry of history,
            tradition, music, dance, and culinary delights. The citys
            resilience, rich Igbo culture, and diverse influences make it a
            fascinating destination for those seeking to explore Nigerias
            cultural diversity. Enugu invites you to experience its heritage,
            welcoming you with open arms and a vibrant cultural embrace.
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
  align-items: center;
  background: black;
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;

  @media ${device.mobile} {
    padding-left: 0px;
    padding-top: 80px;
    align-items: left;
  }
`;

const Title = styled.div`
  margin: auto 10px;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  @media ${device.mobile} {
    padding-left: 0px;
    align-items: center;
    margin-left: 0px;

    h1 {
      font-size: 20px;
    }
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
  cursor: pointer;

  h3 {
    font-size: 20px;
    margin-bottom: 20px;
    color: grey;
  }

  @media ${device.mobile} {
    padding-left: 10px;
    align-items: left;
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
  align-items: center;
  cursor: pointer;

  p {
    font-size: 18px;
    padding-bottom: 36px;
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
    // top: 150px;
    display: none;
  }
`;

const ImageContainer = styled.div`
  padding-bottom: 20px;
  border-radius: 20px;
  cursor: pointer;

  @media ${device.mobile} {
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
      border-radius: 5px;
      object-fit: cover;
    }
  }
`;
