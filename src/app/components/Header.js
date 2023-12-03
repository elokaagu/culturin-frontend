import React from "react";
import styled from "styled-components";
import { Search } from "styled-icons/boxicons-regular";
import { ChevronDown } from "styled-icons/boxicons-regular";

export default function Header() {
  return (
    <Head>
      <HeaderLeft>
        <h1>Culturin</h1>
      </HeaderLeft>
      <HeaderRight>
        <ul>
          <li>
            <Search size="20" />
          </li>
          <li>
            Countries <ChevronDown size="20" />
          </li>
          <li>News</li>
          <li>TV</li>
          <li>Events</li>
          <li>
            <Button>Sign In</Button>
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

const HeaderLeft = styled.div``;

const HeaderRight = styled.div``;

const Button = styled.div`
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
