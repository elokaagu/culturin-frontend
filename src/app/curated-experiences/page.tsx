/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Link from "next/link";
import { ThemeProvider } from "styled-components";
import { device } from "../styles/breakpoints";
import { lightTheme, darkTheme, GlobalStyles } from "../styles/theme";
import { client } from "../lib/sanity";
import Image from "next/image";
import { providerCard } from "../../../lib/interface";

async function getData() {
  const query = `
    *[_type == "providers"] {
      name,
      eventName,
      "slug": slug.current,
      "bannerImage": {
        "image": {
          "url": bannerImage.image.asset->url,
          "alt": bannerImage.caption
        }
      },
    }
 `;
  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error("Failed to fetch data from Sanity:", error);
    return []; // Return an empty array or appropriate error response
  }
}

export default function Videos() {
  const [theme, setTheme] = useState("dark");
  const isDarkTheme = theme === "dark";

  const [data, setData] = useState<providerCard[]>([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedData = await getData();
      setData(fetchedData);
    }
    fetchData();
  }, []);

  console.log(data);

  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <>
          <GlobalStyles />

          <AppBody>
            <Title>
              <h1>Curated experiences</h1>
            </Title>
            <Subtitle>
              <p>Handpicked by the Culturin team </p>
            </Subtitle>

            <ProviderContainer>
              {data.map((providerData, index) => (
                <ProviderCard key={index}>
                  <Link href={`/providers/${providerData.slug}`}>
                    <ProviderCardBody>
                      <Image
                        src={providerData?.bannerImage?.image?.url} // Provide a fallback image URL
                        alt={
                          providerData?.bannerImage?.alt || "Default Alt Text"
                        } // Provide default alt text
                        width={300}
                        height={300}
                        quality={90} // Adjust quality as needed, defaults to 75
                        style={{
                          objectFit: "cover",
                          position: "relative",
                        }}
                      />
                    </ProviderCardBody>
                  </Link>
                  <ProviderCardText>
                    <h1>{providerData?.eventName}</h1>
                  </ProviderCardText>
                  <ProviderCardAuthor>
                    {" "}
                    <p>{providerData?.name}</p>
                  </ProviderCardAuthor>
                </ProviderCard>
              ))}
            </ProviderContainer>
          </AppBody>
        </>
      </ThemeProvider>
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
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
  cursor: pointer;

  @media ${device.mobile} {
    align-items: left;
    margin-left: 0;
    margin-top: 20px;
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
    margin-left: 80px;
    width: 100%;
  }
`;

const ProviderContainer = styled.div`
  margin: auto;
  width: 100%;
  padding: 20px 0px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-items: center;
  align-items: start;

  h1 {
    font-size: 25px;
    color: white;
    width: 100%;
  }

  p {
    font-size: 18px;
    color: white;
    width: 100%;
  }

  @media ${device.mobile} {
    width: 100%;
    grid-template-columns: 1fr;

    h1 {
      font-size: 25px;
      color: white;
      width: 70%;
    }
    p {
      font-size: 18px;
      color: white;
      width: 70%;
    }
  }
`;

const ProviderCard = styled.div`
  padding-bottom: 20px;
  padding-right: 20px;
`;

const ProviderCardBody = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: left;
  height: 320px;
  width: 420px;

  border-radius: 8px;
  drop-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background: #1a1a1a;
  cursor: pointer;
  box-shadow: 0px 6px 8px rgba(25, 50, 47, 0.08),
    0px 4px 4px rgba(18, 71, 52, 0.02), 0px 1px 16px rgba(18, 71, 52, 0.03);

  img {
    border-radius: 8px;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  &:hover {
    background-color: #4444;
    opacity: 0.4;
    transform: scale(0.98);
    transition: 0.3s ease-in-out;
  }

  @media ${device.laptop} {
    height: 200px;
  }

  @media ${device.mobile} {
    height: 200px;
    width: 300px;
  }
`;

const ProviderCardText = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  color: ${(props) => props.theme.title};

  h1 {
    cursor: pointer;
    font-size: 16px;

    @media ${device.laptop} {
      font-size: 16px;
    }

    @media ${device.mobile} {
      font-size: 14px;
    }
  }

  p {
    cursor: pointer;
    font-size: 14px;
    -webkit-line-clamp: 2;

    color: ${(props) => props.theme.subtitle};

    @media ${device.laptop} {
      font-size: 12px;
      color: grey;
    }

    @media ${device.mobile} {
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

const ProviderCardAuthor = styled.div`
  display: flex;
  pointer: cursor;
  flex-direction: row;
  align-items: center;
`;

const AvatarContainer = styled.div`
  display: flex;
  margin-right: 6px;
`;
