import * as React from "react";
import styled from "styled-components";
import Image from "next/image";
import { device } from "../styles/breakpoints";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { client } from "../lib/sanity";
import { simpleBlogCard, videoCard } from "../../../lib/interface";
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

export default function ProviderHero() {
  return (
    <>
      <AppBody>
        <ProviderCard>
          <Link href="/providers">
            <ProviderCardBody>
              <CldImage
                src="https://res.cloudinary.com/drfkw9rgh/image/upload/v1704890832/a6lbnlsgijnutpufvjxu.jpg"
                alt="Picture of the author"
                width={400}
                height={200}
              />
            </ProviderCardBody>
          </Link>
          <ProviderCardText>
            <h1>Dogpound Welness Retreat</h1>
          </ProviderCardText>
          <ProviderCardAuthor>
            {" "}
            <p>Dogpound</p>
          </ProviderCardAuthor>
        </ProviderCard>
      </AppBody>
    </>
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

const ProviderCard = styled.div`
  padding-bottom: 20px;
  padding-right: 20px;
`;

const ProviderCardBody = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: left;
  height: 300px;
  width: 300px;

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
