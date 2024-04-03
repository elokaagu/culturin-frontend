import React, { useState } from "react";
import styled from "styled-components";
import { device } from "../styles/breakpoints";
import Link from "next/link";
import { Plus } from "styled-icons/boxicons-regular";
import { ChevronDown } from "styled-icons/boxicons-regular";
import { GoogleSignInButton } from "./AuthButtons";

interface SidebarProps {
  isNavOpen: boolean;
  setIsNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isNavOpen, setIsNavOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggling = () => setIsOpen(!isOpen);
  const [selectedOption, setSelectedOption] = useState(null);

  const onOptionClicked = (value: React.SetStateAction<null>) => () => {
    setSelectedOption(value);
    setIsOpen(false);
    console.log(selectedOption);
  };

  return (
    <SidebarContainer>
      <SidebarText>
        <SidebarItem>
          <Link href="/">
            <li>Home</li>
          </Link>
        </SidebarItem>

        <SidebarItem>
          <li>
            <DropdownHeader onClick={toggling}>
              Destinations
              <ChevronDown size="20" />
            </DropdownHeader>
            {isOpen && (
              <DropdownListContainer>
                <DropdownList>
                  <DropdownItem>
                    <Link href="/countries/africa">Africa</Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link href="/countries/asia">Asia</Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link href="/countries/europe">Europe</Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link href="/countries/north-america">North America</Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link href="/countries/south-america">South America</Link>
                  </DropdownItem>
                </DropdownList>
              </DropdownListContainer>
            )}
          </li>
        </SidebarItem>

        <SidebarItem>
          <li>
            <GoogleSignInButton />
          </li>
        </SidebarItem>
      </SidebarText>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: fixed;
  top: 0;
  left: 0;
  overflow-x: hidden;
  background-color: black;
  z-index: 100;
  height: 100%;
  width: 100%;
  padding-top: 60px;
  transition: all 0.25s ease;
  animation: fadeIn 0.3s;

  li {
    list-style: none;
    display: inline-block;
    color: white;
    padding: 20px;
    cursor: pointer;

    @media ${device.mobile} {
      padding: 10px;
    }
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

const SidebarText = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
`;

const DropdownHeader = styled.div`
  /* width: 100%;
  border: black;
  display: flex;
  flex-direction: row; */
`;

const DropdownList = styled("ul")`
  margin: 30px;
  margin-left: -10px;
  color: black;
  background: white;
  z-index: 100;
  border-radius: 10px;
  animation: fadeIn 0.3s;

  @keyframes fadeIn {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

const DropdownItem = styled("li")`
  list-style: none;
  color: black;
  width: 100%;
  a {
    text-decoration: none;
    color: black;
  }

  a:hover {
    color: #4444;
  }
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

const SidebarItem = styled.div`
  padding: 5px;
`;
