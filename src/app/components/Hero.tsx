import * as React from "react";
import styled from "styled-components";
import Image from "next/image";
import { device } from "../styles/breakpoints";
import { AvatarIcon } from "@nextui-org/react";
import ghosthouse from "../Images/ghosthouse.jpeg";
import Link from "next/link";

const imageStyle = {
  borderRadius: "50%",
  // border: "1px solid grey",
};

const data = [
  {
    city: "Enugu, Nigeria",
    author: "elokaagu",
    imageSrc: "/images/eloka1.jpg",
  },
  {
    city: "Lisbon, Portugal",
    author: "louisleonidas",
    imageSrc: "/images/car1.jpg",
  },
  {
    city: "LA, California",
    author: "cynthia",
    imageSrc: "/images/eloka1.jpg",
  },
  // Add more data objects as needed
];

export default function Hero() {
  return (
    <AppBody>
      {data.map((cardData, index) => (
        <Card key={index}>
          <Link href="/posts">
            <CardBody>
              <Image
                src={cardData.imageSrc}
                alt={cardData.city}
                layout="fill"
                placeholder="blur"
                objectFit="cover"
                blurDataURL={cardData.imageSrc}
              />
            </CardBody>
          </Link>

          <CardText>
            <h1>{cardData.city}</h1>
            <CardAuthor>
              {/* <AvatarContainer>
            <Image
              src="/eloka.jpeg"
              alt="elokaagu"
              priority={true}
              width={25}
              height={25}
              style={imageStyle}
            />
          </AvatarContainer> */}
              <p>{cardData.author}</p>
            </CardAuthor>
          </CardText>
        </Card>
      ))}
    </AppBody>
  );
}

const AppBody = styled.div`
  padding: 10px;
  display: flex;
  margin-top: 20px;
  /* margin-left: 30px;
  margin-right: 30px; */
  flex-direction: column;
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

const Card = styled.div`
  padding-bottom: 20px;
`;

const CardBody = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: left;
  height: 300px;
  /* padding: 20px; */
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
  }

  &:hover {
    background-color: #4444;
    transform: scale(0.99);
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

const CardText = styled.div`
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

const CardAuthor = styled.div`
  display: flex;
  pointer: cursor;
  flex-direction: row;
  align-items: center;
`;

const AvatarContainer = styled.div`
  display: flex;
  margin-right: 6px;
`;
