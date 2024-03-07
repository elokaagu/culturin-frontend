"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import { ThemeProvider } from "styled-components";
import Link from "next/link";
import { device } from "../../styles/breakpoints";
import { client, urlFor } from "../../lib/sanity";
import { fullBlog } from "../../../../lib/interface";
import { lightTheme, darkTheme, GlobalStyles } from "../../styles/theme";
import Image from "next/image";
import { url } from "inspector";
import { PortableText } from "@portabletext/react";

async function getData(slug: string) {
  const query = `
  *[_type == "blog" && slug.current == '${slug}'] {
    "currentSlug": slug.current,
      title,
      titleImage,
      body,
      summary,
  }[0]`;

  const data = await client.fetch(query);
  return data;
}

export default function BlogArticle({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<fullBlog | null>(null);
  const [theme, setTheme] = useState("dark");
  const isDarkTheme = theme === "dark";

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getData(params.slug);
      setData(fetchedData);
    };

    fetchData();
  }, [params.slug]);

  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles />
      </ThemeProvider>
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
          <h1>{data?.title}</h1>
        </Title>
        <Subtitle>
          <h3>{data?.summary}</h3>
        </Subtitle>
        <ImageContainer>
          {" "}
          {data?.titleImage && (
            <ImageWrap>
              <Image
                src={urlFor(data?.titleImage).url()}
                alt="titleImage"
                placeholder="blur"
                width={700}
                height={500}
                blurDataURL={urlFor(data?.titleImage).url()}
                style={{
                  // width: "100%",
                  // height: "auto",
                  objectFit: "cover",
                  position: "relative",
                }}
                draggable="false"
                priority={true}
              />
            </ImageWrap>
          )}
        </ImageContainer>
        <Body>
          <PortableText value={data?.body} />
          <SaveButtonContainer>Add to profile</SaveButtonContainer>
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
  margin: auto;
  width: 50%;
  margin: auto 10px;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
  cursor: pointer;

  @media ${device.mobile} {
    align-items: left;
    margin-left: 0;
    width: 100%;

    h1 {
      font-size: 25px;
      align-items: left;
      margin-left: 40px;
      width: 100%;
    }
  }
`;

const Subtitle = styled.div`
  margin: auto;
  width: 50%;
  margin: auto 10px;
  padding-left: 30px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
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
  align-items: left;
  cursor: pointer;

  p {
    font-size: 18px;
    padding-top: 5px;
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
    // top: 105px;
    display: none;
  }
`;

const ImageContainer = styled.div`
  padding-bottom: 20px;
  cursor: pointer;
  img {
    border-radius: 10px;
  }

  @media ${device.mobile} {
    margin: 0 auto;
    padding-left: 10px;
    border-radius: 20px;

    img {
      margin-left: 0;
      border-radius: 10px;
      width: 360px;
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

const SaveButtonContainer = styled.div`
  border-radius: 10px;
  width: 120px;
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

  // color: rgb(250, 193, 0);
  // padding-bottom: 20px;
  // text-decoration: none;
  // position: fixed;
  // right: 50px;
  // top: 200px;
`;
