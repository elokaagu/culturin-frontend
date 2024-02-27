import * as React from "react";
import styled from "styled-components";
import Image from "next/image";
import { device } from "../styles/breakpoints";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { client } from "../lib/sanity";
import { simpleBlogCard } from "../../../lib/interface";
import { urlFor } from "../lib/sanity";
import { useState, useEffect } from "react";
// Data From Cloudinary

const data = [
  {
    city: "Enugu, Nigeria",
    author: "elokaagu",
    // imageSrc: "/images/eloka1.jpg",
    imageSrc:
      "https://res.cloudinary.com/drfkw9rgh/image/upload/v1705760936/bot7b62mf5uwjjhfxj5z.jpg",
  },
  {
    city: "Lisbon, Portugal",
    author: "louisleonidas",
    imageSrc:
      "https://res.cloudinary.com/drfkw9rgh/image/upload/v1704889319/htsnt5rzrvjcfnrixbqy.jpg",
  },
  {
    city: "LA, California",
    author: "cynthiabahati",
    imageSrc:
      "https://res.cloudinary.com/drfkw9rgh/image/upload/v1704889319/xss8yv2irwwxsxndwqr9.jpg",
  },
  {
    city: "Berlin, Germany",
    author: "elokaagu",
    // imageSrc: "/images/eloka1.jpg",
    imageSrc:
      "https://res.cloudinary.com/drfkw9rgh/image/upload/v1704890835/mnvamvov5orwyqcum4mo.jpg",
  },
  {
    city: "Tokyo, Japan",
    author: "louisleonidas",
    imageSrc:
      "https://res.cloudinary.com/drfkw9rgh/image/upload/v1704890832/a6lbnlsgijnutpufvjxu.jpg",
  },

  {
    city: "Dubai, Middle East",
    author: "unikernest",
    imageSrc:
      "https://res.cloudinary.com/drfkw9rgh/image/upload/v1704889319/hdfbvawg6isdoft0sghq.jpg",
  },
  // Add more data objects as needed
];

export default function VideoHero() {
  return (
    <AppBody>
      <VideoCard>
        <Link href="/stream">
          <VideoCardBody>
            <CldImage
              src="https://res.cloudinary.com/drfkw9rgh/image/upload/v1705760936/bot7b62mf5uwjjhfxj5z.jpg"
              alt="Picture of the author"
              placeholder="blur"
              fill
              style={{ objectFit: "cover" }}
              blurDataURL="https://res.cloudinary.com/drfkw9rgh/image/upload/v1705760936/bot7b62mf5uwjjhfxj5z.jpg"
              priority={true}
            />
          </VideoCardBody>
        </Link>
        <VideoCardText>
          <h1>Munchies</h1>
          <VideoCardAuthor>
            <p>Anthony Bourdain</p>
          </VideoCardAuthor>
        </VideoCardText>
      </VideoCard>
    </AppBody>
  );
}

const AppBody = styled.div`
  padding: 10px;
  display: flex;
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
  flex-direction: row;
  width: 100%;
  line-height: 1.5;
  @media ${device.laptop} {
    margin-left: 20px;
  }
  @media ${device.mobile} {
    padding: 6px;
    line-height: 1.5;
    margin-left: 0px;
  }
`;

const VideoCard = styled.div`
  padding-bottom: 20px;
  padding-right: 20px;
`;

const VideoCardBody = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: left;
  height: 200px;
  width: 400px;
  padding: 20px;
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
    width: 150px;
  }
`;

const VideoCardText = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  color: ${(props) => props.theme.title};

  h1 {
    cursor: pointer;
    font-size: 16px;
    padding-bottom: 10px;

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

const VideoCardAuthor = styled.div`
  display: flex;
  pointer: cursor;
  flex-direction: row;
  align-items: center;
`;

const AvatarContainer = styled.div`
  display: flex;
  margin-right: 6px;
`;
