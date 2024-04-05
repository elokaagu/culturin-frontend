"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import { ThemeProvider } from "styled-components";
import Link from "next/link";
import { device } from "../../styles/breakpoints";
import { client, urlFor } from "../../lib/sanity";
import { fullProvider } from "../../../libs/interface";
import { lightTheme, darkTheme, GlobalStyles } from "../../styles/theme";
import Image from "next/image";

async function getData(slug: string) {
  const query = `
  *[_type == "providers" && slug.current == '${slug}'] {
    name,
    eventName,
    "slug": slug.current,
    "bannerImage": {
      "image": {
        "url": bannerImage.image.asset->url,
        "alt": bannerImage.caption
      }
    },     
    description,
    location,
    "contactEmail": contact.email,
    "contactPhone": contact.phone,
    "contactWebsite": contact.website,
    
    prices[],
    "images": images[].asset->{
      _id,
      url,
      "dimensions": metadata.dimensions
    }
  }[0]
  
      `;

  const data = await client.fetch(query);
  return data;
}

export default function Provider({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<fullProvider | null>(null);
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
                      src={urlFor(data.images[0].url).url()}
                      alt={`Image ${data.images[0]._id}`} // Assuming no alt text in imageAsset, using _id as fallback
                      placeholder="blur"
                      width={600}
                      height={400}
                      priority={true}
                      quality={90} // Adjust quality as needed, defaults to 75
                      blurDataURL={urlFor(data.images[0].url).url()}
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
                      src={urlFor(data.images[1].url).url()}
                      alt={`Image ${data.images[1]._id}`}
                      placeholder="blur"
                      width={300}
                      height={195}
                      quality={90} // Adjust quality as needed, defaults to 75
                      blurDataURL={urlFor(data.images[1].url).url()}
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
                      src={urlFor(data.images[2].url).url()}
                      alt={`Image ${data.images[2]._id}`}
                      placeholder="blur"
                      width={300}
                      height={195}
                      quality={90} // Adjust quality as needed, defaults to 75
                      blurDataURL={urlFor(data.images[2].url).url()}
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
      </ThemeProvider>
    </>
  );
}

const AppBody = styled.div`
  padding: 40px;
  display: flex;
  padding-top: 150px;
  align-items: left;
  background: ${(props) => props.theme.body};
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;

  @media ${device.mobile} {
    padding-left: 0px;
    padding-top: 80px;
    align-items: left;
    margin-left: 0;
  }
`;

const Title = styled.div`
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
      margin-left: 10px;
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
    padding-left: 10px;
    align-items: left;
  }
`;

const About = styled.div`
  margin: auto;
  align-items: left;

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
  align-items: left;
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
    align-items: left;
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
