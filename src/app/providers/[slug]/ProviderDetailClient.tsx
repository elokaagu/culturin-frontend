"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";

import Header from "../../components/Header";
import { device } from "../../styles/breakpoints";
import type { fullProvider, imageAsset } from "../../../libs/interface";
import {
  IMAGE_BLUR_DATA_URL,
  isBundledPlaceholderSrc,
  resolveContentImageSrc,
} from "../../../lib/imagePlaceholder";

function imageUrl(img: imageAsset | undefined) {
  const u = img?.url;
  if (typeof u !== "string") return "";
  const t = u.trim();
  if (!t) return "";
  if (t.startsWith("https://") || t.startsWith("http://") || t.startsWith("/")) return t;
  return "";
}

function externalBookHref(raw: string | undefined): string {
  const s = (raw || "").trim();
  if (!s) return "#";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `https://${s}`;
}

export default function ProviderDetailClient({ data }: { data: fullProvider }) {
  const bookUrl = externalBookHref(data.contactWebsite);
  const images = data.images ?? [];
  const primarySrc = resolveContentImageSrc(imageUrl(images[0]));
  const secondarySrc = resolveContentImageSrc(imageUrl(images[1]));
  const tertiarySrc = resolveContentImageSrc(imageUrl(images[2]));
  const primaryAlt = images[0]?._id ? `Image ${images[0]._id}` : data.eventName || "Experience image";
  const secondaryAlt = images[1]?._id ? `Image ${images[1]._id}` : `${data.eventName || "Experience"} — gallery`;
  const tertiaryAlt = images[2]?._id ? `Image ${images[2]._id}` : `${data.eventName || "Experience"} — gallery`;

  return (
    <>
      <Header />
      <AppBody>
        <ProviderWrapper>
          <Title>
            <h1>{data.eventName}</h1>
          </Title>
          <Subtitle>
            <h3>{data.name}</h3>
          </Subtitle>
          <ImageContainer>
            <ImageColumnLeft>
              <ImageWrap>
                <Image
                  src={primarySrc}
                  alt={primaryAlt}
                  width={600}
                  height={400}
                  loading="lazy"
                  quality={90}
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  style={{
                    objectFit: "cover",
                    position: "relative",
                  }}
                  draggable={false}
                  unoptimized={isBundledPlaceholderSrc(primarySrc)}
                />
              </ImageWrap>
            </ImageColumnLeft>

            <ImageColumnRight>
              <ImageWrap>
                <Image
                  src={secondarySrc}
                  alt={secondaryAlt}
                  width={300}
                  height={195}
                  loading="lazy"
                  quality={90}
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  style={{
                    objectFit: "cover",
                    position: "relative",
                  }}
                  draggable={false}
                  unoptimized={isBundledPlaceholderSrc(secondarySrc)}
                />
              </ImageWrap>
              <ImageWrap>
                <Image
                  src={tertiarySrc}
                  alt={tertiaryAlt}
                  width={300}
                  height={195}
                  loading="lazy"
                  quality={90}
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  style={{
                    objectFit: "cover",
                    position: "relative",
                  }}
                  draggable={false}
                  unoptimized={isBundledPlaceholderSrc(tertiarySrc)}
                />
              </ImageWrap>
            </ImageColumnRight>
          </ImageContainer>
          <About>
            <h1>About</h1>
            <p>{data.description}</p>
          </About>
          <Banner>
            <p>Location: {data.location}</p>
            <p>Contact: {data.contactEmail}</p>
            <p>Website: {data.contactWebsite}</p>
          </Banner>
          <Banner>
            {bookUrl !== "#" ? (
              <a
                href={bookUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <HeroButton>Book</HeroButton>
              </a>
            ) : (
              <HeroButton
                as="div"
                aria-disabled
                style={{ cursor: "not-allowed", opacity: 0.5, pointerEvents: "none" }}
              >
                Book
              </HeroButton>
            )}
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
      border-radius: 20px;
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
