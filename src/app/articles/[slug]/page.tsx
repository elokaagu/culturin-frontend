"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import { ThemeProvider } from "styled-components";
import Link from "next/link";
import { device } from "../../styles/breakpoints";
import { client, urlFor } from "../../lib/sanity";
import { fullBlog } from "../../../../libs/interface";
import { lightTheme, darkTheme, GlobalStyles } from "../../styles/theme";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { useSession } from "next-auth/react";
import { createGlobalStyle } from "styled-components";

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
  const { data: session } = useSession();
  const [data, setData] = useState<fullBlog | null>(null);
  const [theme, setTheme] = useState("dark");
  const isDarkTheme = theme === "dark";
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getData(params.slug);
      setData(fetchedData);
    };

    fetchData();
  }, [params.slug]);

  const handleSaveArticle = async () => {
    if (!session) {
      console.error("You must be logged in to save articles.");
      return;
    }

    try {
      const res = await fetch("/api/save-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include authorization if your API requires it
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ articleId: data?._id }),
      });

      if (!res.ok) {
        throw new Error("Failed to save the article.");
      }

      // Optionally, fetch updated list of saved articles or trigger a state update
      console.log("Article saved successfully!");
      setShowModal(true); // Show the modal on success
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  const handleShareArticle = async () => {
    const articleUrl = window.location.href; // Gets the current page URL

    if (navigator.share) {
      // Web Share API is available
      try {
        await navigator.share({
          title: data?.title, // Use your article's title here
          text: "Check out this article!", // Custom text for the share
          url: articleUrl,
        });
        console.log("Article shared successfully!");
      } catch (error) {
        console.error("Error sharing the article:", error);
      }
    } else {
      // Fallback to copying the URL to the clipboard
      try {
        await navigator.clipboard.writeText(articleUrl);
        console.log("Article URL copied to clipboard!");
        setModalMessage("Article URL copied to clipboard!"); // Set message for the modal
        setShowModal(true); // Show the modal
        setTimeout(() => {
          setShowModal(false); // Optionally hide the modal after a few seconds
        }, 3000);
      } catch (error) {
        console.error("Failed to copy the article URL:", error);
      }
    }
  };

  return (
    <>
      <Header />
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyles />
        <GlobalTransitionStyle />
      </ThemeProvider>
      <AppBody>
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
          <ButtonsContainer>
            <SaveButtonContainer onClick={handleSaveArticle}>
              Add to profile
              {showModal && <Modal>Article Saved to Profile</Modal>}
            </SaveButtonContainer>
            <ShareButtonContainer onClick={handleShareArticle}>
              Share article
              {showModal && <Modal>{modalMessage}</Modal>}
            </ShareButtonContainer>
          </ButtonsContainer>
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
  transition: all 0.25s ease;
  color: white;
  &.blurred {
    filter: blur(2px);
  }

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
  transition: background-color 0.3s;

  @media ${device.mobile} {
    align-items: left;
    margin-left: 0;
    width: 100%;

    h1 {
      font-size: 25px;
      align-items: left;
      margin-left: 20px;
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
    margin-left: 60px;
    padding-left: 10px;
    align-items: left;
    width: 100%;
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
    padding-bottom: 20px;
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
  margin-right: 20px;
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
    font-size: 14px;
  }

  // color: rgb(250, 193, 0);
  // padding-bottom: 20px;
  // text-decoration: none;
  // position: fixed;
  // right: 50px;
  // top: 200px;
`;

const ShareButtonContainer = styled.div`
  border-radius: 10px;
  width: 120px;
  padding: 10px;
  display: flex;
  margin-right: 20px;
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
    font-size: 14px;
  }

  // color: rgb(250, 193, 0);
  // padding-bottom: 20px;
  // text-decoration: none;
  // position: fixed;
  // right: 50px;
  // top: 200px;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  color: black;
  font-size: 18px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: left;
  flex-direction: row;
`;

const GlobalTransitionStyle = createGlobalStyle`
  * {
    transition: all 0.25s ease;
  }
`;
