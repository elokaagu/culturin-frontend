import React, { useState } from "react";
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
  cn,
} from "@nextui-org/react";

const options = ["United States", "Europe", "Africa", "Asia"];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggling = () => setIsOpen(!isOpen);
  const [selectedOption, setSelectedOption] = useState(null);

  const onOptionClicked = (value) => () => {
    setSelectedOption(value);
    setIsOpen(false);
    console.log(selectedOption);
  };

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
              <SearchIcon size="20" />
            </Link>
          </li>
          {/* Countries <ChevronDown size="20" /> */}
          <li>
            <DropdownContainer>
              <DropdownHeader onClick={toggling}>
                Countries
                <ChevronDown size="20" />
              </DropdownHeader>
              {isOpen && (
                <DropdownListContainer>
                  <DropdownList>
                    <DropdownItem>USA</DropdownItem>
                    <DropdownItem>Africa</DropdownItem>
                    <DropdownItem>Asia</DropdownItem>
                    <DropdownItem>Europe</DropdownItem>
                  </DropdownList>
                </DropdownListContainer>
              )}
            </DropdownContainer>
          </li>
          {/* <li>News</li>
          <li>TV</li>
          <li>Events</li> */}
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
  height: 60px;
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
`;

const SearchIcon = styled(Search)`
  color: white;
`;

const DropdownHeader = styled.div`
  /* width: 100%;
  border: black;
  display: flex;
  flex-direction: row; */
`;

const DropdownContainer = styled("div")``;

const DropdownList = styled("ul")`
  margin: 30px;
  margin-left: -10px;
  color: black;
  background: white;
  z-index: 100;
  border-radius: 10px;
`;

const DropdownItem = styled("li")`
  list-style: none;
  color: black;
  width: 100%;
`;

const DropdownListContainer = styled.div`
  position: absolute;
  color: black;
  width: 200px;
  z-index: 100;

  ul:hover {
    list-style: none;
    color: black;
  }

  ul li {
    text-decoration: none;
    color: black;
  }
`;
