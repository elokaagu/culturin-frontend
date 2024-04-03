import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Plus, Search } from "styled-icons/boxicons-regular";
import { ChevronDown } from "styled-icons/boxicons-regular";
import Image from "next/image";
import Link from "next/link";
import { device } from "../styles/breakpoints";
import { GoogleSignInButton } from "./AuthButtons";
import SearchBar from "./SearchBar";
import Hamburger from "hamburger-react";
import Sidebar from "./Sidebar";
import { Dispatch, SetStateAction } from "react";
import ThemeToggle from "./ThemeToggle";
import { Sun, Moon } from "styled-icons/boxicons-regular";
import { useTheme } from "../styles/ThemeContext";

export default function Header() {
  // const [theme, setTheme] = useState("light");
  const [headerClass, setHeaderClass] = useState("transparentHeader");
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme(); // Use the theme and toggleTheme from context

  const isDarkTheme = theme === "dark";

  // useEffect(() => {
  //   const onScroll = () => {
  //     const scrollCheck = window.scrollY > 0;
  //     setIsScrolled(scrollCheck);
  //   };

  //   // Attach scroll event listener
  //   window.addEventListener("scroll", onScroll);

  //   // Clean up event listener on component unmount
  //   return () => window.removeEventListener("scroll", onScroll);
  // }, []);

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 0;
      setHeaderClass(show ? "solidHeader" : "transparentHeader");
    };

    // Attach the handler on component mount
    window.addEventListener("scroll", handleScroll);

    // Detach the handler on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array means this runs once on mount

  // Toggle Theme

  // const toggleTheme = () => {
  //   setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  // };

  const [isOpen, setIsOpen] = useState(false);
  const toggling = () => setIsOpen(!isOpen);
  const [selectedOption, setSelectedOption] = useState(null);

  const onOptionClicked = (value: React.SetStateAction<null>) => () => {
    setSelectedOption(value);
    setIsOpen(false);
    console.log(selectedOption);
  };

  const [isNavOpen, setIsNavOpen] = useState(false);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // New state for mobile sidebar

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  type SidebarProps = {
    isNavOpen: boolean;
    setIsNavOpen: Dispatch<SetStateAction<boolean>>;
  };

  return (
    <>
      <StyledHeader isScrolled={isScrolled}>
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
            <li>
              {/* <Switch>
                <Sun size={20} onClick={toggleTheme} />
              </Switch> */}
            </li>
            <ul>
              {/* <Link href="/create">
                <li>
                  <Plus size="20" />
                  <span />
                  Create
                </li>
              </Link> */}

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

              {/* <Link href="/spotlight">
                <li>News</li>
              </Link> */}

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
                  toggled={isMobileSidebarOpen}
                  toggle={handleMobileSidebarToggle}
                  size={20}
                  onToggle={() => setIsNavOpen(!isNavOpen)}
                />
                {isMobileSidebarOpen && (
                  <Sidebar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
                )}
              </HamburgerMenu>
            </ul>
          </HeaderRightMobile>
        </Head>
      </StyledHeader>
    </>
  );
}

const Head = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  position: fixed;
  width: calc(100% - 60px);
  z-index: 1000;
  background: black;
  // background: linear-gradient(to bottom, #000000 20%, transparent 100%);

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
    width: calc(100% - 20px);
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

type StyledHeaderProps = {
  isScrolled: boolean;
};

const StyledHeader = styled.header<StyledHeaderProps>`
  transition: background-color 0.3s ease;
  background: ${(props) =>
    props.isScrolled
      ? "linear-gradient(to right, #000000, #434343)"
      : "transparent"};
  position: fixed;
  width: 100%;
  z-index: 1000;
`;

const HeaderLeft = styled.div`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
    transition: 0.3s ease-in-out;
  }
  flex: 0.33;
  z-index: 600;
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
