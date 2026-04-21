"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import Link from "next/link";
import { device } from "../../styles/breakpoints";
import type { fullProvider, imageAsset } from "../../../libs/interface";
import Image from "next/image";

import { getCmsBrowserClient } from "../../../lib/cms/browser";
import { getProviderBySlug } from "../../../lib/cms/queries";

function imageUrl(img: imageAsset | undefined) {
  const u = img?.url;
  return typeof u === "string" && u.startsWith("http") ? u : "";
}

export default function Provider({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<fullProvider | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const db = getCmsBrowserClient();
      if (!db) return;
      const fetchedData = await getProviderBySlug(db, params.slug);
      setData(fetchedData);
    };

    void fetchData();
  }, [params.slug]);
  return (
    <>
      <Header />
      <AppBody>
          <ProviderWrapper>
            <Title>
              <h1>{data?.eventName}</h1>
            </Title>
            <Subtitle>
              <h3>{data?.name}</h3>
            </Subtitle>
            <ImageContainer>
              {data?.images && data.images.length > 0 && (
                <ImageColumnLeft>
                  <ImageWrap>
                    <Image
                      src={imageUrl(data.images[0])}
                      alt={`Image ${data.images[0]._id}`}
                      placeholder="blur"
                      width={600}
                      height={400}
                      priority={true}
                      quality={90}
                      blurDataURL={imageUrl(data.images[0])}
                      style={{
                        // width: "100%",
                        // height: "auto",
                        objectFit: "cover",
                        position: "relative",
                      }}
                      draggable="false"
                    />
                  </ImageWrap>
                </ImageColumnLeft>
              )}

              <ImageColumnRight>
                {data?.images && data.images.length > 1 && (
                  <ImageWrap>
                    <Image
                      src={imageUrl(data.images[1])}
                      alt={`Image ${data.images[1]._id}`}
                      placeholder="blur"
                      width={300}
                      height={195}
                      quality={90}
                      blurDataURL={imageUrl(data.images[1])}
                      style={{
                        // width: "100%",
                        // height: "auto",
                        objectFit: "cover",
                        position: "relative",
                      }}
                      draggable="false"
                    />
                  </ImageWrap>
                )}
                {data?.images && data.images.length > 2 && (
                  <ImageWrap>
                    <Image
                      src={imageUrl(data.images[2])}
                      alt={`Image ${data.images[2]._id}`}
                      placeholder="blur"
                      width={300}
                      height={195}
                      quality={90}
                      blurDataURL={imageUrl(data.images[2])}
                      style={{
                        // width: "100%",
                        // height: "auto",
                        objectFit: "cover",
                        position: "relative",
                      }}
                      draggable="false"
                    />
                  </ImageWrap>
                )}
              </ImageColumnRight>
            </ImageContainer>
            <About>
              <h1>About</h1>
              <p>{data?.description} </p>
            </About>
            <Banner>
              <p>Location: {data?.location}</p>
              <p>Contact: {data?.contactEmail} </p>
              <p>Website: {data?.contactWebsite} </p>
            </Banner>
            <Banner>
              <Link
                href={data?.contactWebsite || ""}
                passHref
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <HeroButton>Book</HeroButton>
              </Link>
            </Banner>
          </ProviderWrapper>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  padding: 40px;
  display: flex;
  padding-top: var(--header-offset);
  align-items: flex-start;
  background: ${(props) => props.theme.body};
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;

  @media ${device.mobile} {
    padding-left: 0px;
    align-items: flex-start;
    margin-left: 0;
  }
`;

const Title = styled.div`
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;

  @media ${device.mobile} {
    align-items: flex-start;
    margin-left: 0;
    width: 100%;

    h1 {
      font-size: 25px;
      align-items: flex-start;
      margin-left: 10px;
      width: 100%;
    }
  }
`;

const Subtitle = styled.div`
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;

  h3 {
    font-size: 20px;
    margin-bottom: 20px;
    color: grey;
  }

  @media ${device.mobile} {
    padding-left: 10px;
    align-items: flex-start;
  }
`;

const About = styled.div`
  margin: auto;
  align-items: flex-start;

  h1 {
    font-size: 20px;
    margin-bottom: 20px;
    color: grey;
  }
  p {
    font-size: 18px;
    padding-bottom: 36px;
    color: white;
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

const ImageContainer = styled.div`
  padding-bottom: 20px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  img {
    border-radius: 10px;
    margin-right: 20px;
  }

  @media ${device.mobile} {
    margin: 0 auto;
    padding-left: 10px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;

    img {
      margin-left: 0;
      border-radius: 10px;
      width: 300px;
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

const ProviderWrapper = styled.div`
  margin: auto;
  width: 60%;
  padding-top: 30px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;

  span {
    font-size: 18px;
    color: grey;
  }

  p {
    font-size: 18px;
    color: white;
  }

  @media ${device.mobile} {
    padding-left: 20px;
    align-items: flex-start;
    width: 100%;

    p {
      font-size: 18px;
      padding-bottom: 36px;
      color: white;
    }
  }

  @media ${device.mobile} {
    margin-left: 0px;
    border-radius: 10px;
    width: 300px;
    height: 50%;
    overflow: scroll;
  }
`;

const ImageColumnLeft = styled.div``;

const ImageColumnRight = styled.div``;

const Banner = styled.div``;

const HeroButton = styled.div`
  margin-top: 20px;
  border-radius: 5px;
  width: 100px;
  ${"" /* border: 1px solid white; */}
  padding: 10px;
  display: flex;
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
  }
`;
