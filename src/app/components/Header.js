import React from "react";
import styled from "styled-components";
import { Search } from "styled-icons/boxicons-regular";
import { ChevronDown } from "styled-icons/boxicons-regular";
import Image from "next/image";
import Link from "next/link";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Button,
  DropdownSection,
  DropdownItem,
  cn,
} from "@nextui-org/react";

export default function Header() {
  return (
    <Head>
      <HeaderLeft>
        <ul>
          <li>
            <Link href="/">
              <Image
                src="/culturin_logo.svg"
                width={100}
                height={100}
                draggable={false}
              />
            </Link>
          </li>
        </ul>
      </HeaderLeft>
      <HeaderRight>
        <ul>
          <li>
            <Link href="/search">
              <Search size="20" />
            </Link>
          </li>
          <li>
            {/* Countries <ChevronDown size="20" /> */}
            <Dropdown
              backdrop="blur"
              style={{
                width: "250px",
              }}
            >
              <DropdownTrigger>
                <Button variant="flat" color="white" disableAnimation="true">
                  Countries <ChevronDown size="20" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem>United States</DropdownItem>
                <DropdownItem>Europe</DropdownItem>
                <DropdownItem>Africa</DropdownItem>
                <DropdownItem>Asia</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
          <li>News</li>
          <li>TV</li>
          <li>Events</li>
          <li>
            <SigninButton>Sign In</SigninButton>
          </li>
        </ul>
      </HeaderRight>
    </Head>
  );
}

const Head = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  background: black;
  padding: 50px;
  flex: 1;

  h1 {
    font-weight: 600;
    font-size: 25px;
    color: white;
    cursor: pointer;
  }

  p {
    font-size: 20px;
    color: white;
    cursor: pointer;
  }

  h2 {
    font-weight: 400;
    color: white;
    font-size: 1rem;
  }

  li {
    list-style: none;
    display: inline-block;
    color: white;
    padding: 20px;
    cursor: pointer;
  }

  ul {
    list-style: none;
    display: inline-block;
    color: white;
  }

  ul li {
    text-decoration: none;
    color: white;
  }
  ul li:hover {
    color: grey;
    transition: 0.3s ease-in-out;
  }
`;

const HeaderLeft = styled.div`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
    transition: 0.3s ease-in-out;
  }
`;

const HeaderRight = styled.div``;

const SigninButton = styled.div`
  border-radius: 999px;
  width: 100%;
  ${"" /* border: 1px solid white; */}
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: white;
  color: black;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: grey;
    transition: 0.3s ease-in-out;
  }
`;
