import React, { useState } from "react";
import styled from "styled-components";
import { Plus, Search } from "styled-icons/boxicons-regular";
import { ChevronDown } from "styled-icons/boxicons-regular";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { device } from "../styles/breakpoints";
import { GoogleSignInButton } from "./AuthButtons";
import SearchBar from "./SearchBar";
import { Toggle } from "styled-icons/ionicons-outline";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../styles/theme";
import Hamburger from "hamburger-react";
import Sidebar from "./Sidebar";

export default function Header() {
  const [theme, setTheme] = useState("light");

  const isDarkTheme = theme === "dark";

  // Toggle Theme

  const toggleTheme = () => {
    setTheme(isDarkTheme ? "light" : "dark");
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggling = () => setIsOpen(!isOpen);
  const [selectedOption, setSelectedOption] = useState(null);

  const onOptionClicked = (value: React.SetStateAction<null>) => () => {
    setSelectedOption(value);
    setIsOpen(false);
    console.log(selectedOption);
  };

  return (
    <>
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
                  alt="culturin logo"
                />
              </Link>
            </li>
          </ul>
        </HeaderLeft>
        <HeaderCenter>
          <SearchBar />
        </HeaderCenter>
        <HeaderRight>
          {/* <li>
            <Switch>
              <Toggle size={20} onClick={toggleTheme} />
            </Switch>
          </li> */}
          <ul>
            <Link href="/create">
              <li>
                <Plus size="20" /> <span />
                Create
              </li>
            </Link>

            {/* <Link href="/search">Upload</Link> */}
            <li>
              <DropdownContainer>
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
                        <Link href="/countries/north-america">
                          North America
                        </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link href="/countries/south-america">
                          South America
                        </Link>
                      </DropdownItem>
                    </DropdownList>
                  </DropdownListContainer>
                )}
              </DropdownContainer>
            </li>
            {/* <li>News</li>
          <li>TV</li>
          <li>Events</li> */}
            <li>
              <GoogleSignInButton />
              {/* <SigninButton
              onClick={async () => {
                await signIn();
              }}
            >
              Sign In
            </SigninButton> */}
            </li>
          </ul>
        </HeaderRight>
        <HeaderRightMobile>
          <ul>
            <HamburgerMenu>
              <Hamburger
                rounded
                toggled={isOpen}
                toggle={toggling}
                size={20}
                onToggle={() => {
                  console.log("toggle");
                }}
              />
            </HamburgerMenu>
          </ul>
        </HeaderRightMobile>
      </Head>
    </>
  );
}

const Head = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  /* position: fixed;
  width: calc(100% - 80px); */
  z-index: 100;
  background: black;
  padding-top: 40px;
  padding-bottom: 40px;
  padding-left: 30px;
  padding-right: 30px;

  @media ${device.laptop} {
    padding: 20px;
  }

  @media ${device.mobile} {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 10px;
    padding-right: 20px;
  }

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

const HeaderLeft = styled.div`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
    transition: 0.3s ease-in-out;
  }
  flex: 0.33;
`;

const HeaderRight = styled.div`
  /* flex: 0.33;
  align-items: right; */
  justify-content: space-between;
  @media ${device.mobile} {
    display: none;
  }
`;

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

const DropdownContainer = styled("div")`
  @media ${device.mobile} {
    display: none;
  }
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

const HeaderCenter = styled.div`
  flex: 1;
  @media ${device.mobile} {
    display: flex;
  }
`;

const Switch = styled.div``;

const HamburgerMenu = styled.div`
  display: none;
  @media ${device.mobile} {
    display: flex;
  }
`;

const HeaderRightMobile = styled.div`
  /* flex: 0.33;
  align-items: right; */
  display: none;
  @media ${device.mobile} {
    display: flex;
  }
  justify-content: space-between;
`;
