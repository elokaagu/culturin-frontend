import * as React from "react";
import styled from "styled-components";
import Image from "next/image";
import { device } from "../styles/breakpoints";
import Link from "next/link";
import { client } from "../lib/sanity";
import { providerCard } from "../../libs/interface";
import { useState, useEffect } from "react";

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
    return [];
  }
}

export default function ProviderHero() {
  const [data, setData] = useState<providerCard[]>([]);
  useEffect(() => {
    async function fetchData() {
      const fetchedData = await getData();
      setData(fetchedData);
    }
    fetchData();
  }, []);

  return (
    <>
      <AppBody>
        {data.map((providerData, index) => (
          <ProviderCard key={index}>
            <Link href={`/providers/${providerData.slug}`}>
              <ProviderCardBody>
                <Image
                  src={providerData?.bannerImage?.image?.url} // Provide a fallback image URL
                  alt={providerData?.bannerImage?.alt || "Default Alt Text"} // Provide default alt text
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
