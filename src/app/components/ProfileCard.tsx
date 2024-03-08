import * as React from "react";
import styled from "styled-components";
import { device } from "../styles/breakpoints";
import Link from "next/link";
import Image from "next/image";

export default function ProfileCard({
  article,
}: {
  article: {
    title: string;
    description: string;
    imageSrc: string;
    author: string;
  };
}) {
  return (
    <AppBody>
      <Card>
        <CardBody>
          <Image
            src={article.imageSrc}
            alt={article.title}
            placeholder="blur"
            fill
            style={{ objectFit: "cover" }}
            blurDataURL={article.imageSrc}
          />
        </CardBody>
        <CardText>
          <p>{article?.title}</p>
          <CardAuthor>
            <p>{article?.description}</p>
          </CardAuthor>
        </CardText>
      </Card>
    </AppBody>
  );
}

const AppBody = styled.div`
  padding: 10px;
  display: flex;
  margin-top: 20px;

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

const Card = styled.div`
  padding-bottom: 20px;
  padding-right: 20px;
`;

const CardBody = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: left;
  height: 200px;
  width: 250px;
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
