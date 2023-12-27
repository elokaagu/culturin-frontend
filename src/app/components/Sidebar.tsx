import React from "react";
import styled from "styled-components";
import { device } from "../styles/breakpoints";

export default function Sidebar({}) {
  return (
    <SidebarContainer>
      <li>News</li>
      <li>TV</li>
      <li>Events</li>
    </SidebarContainer>
  );
}

const SidebarContainer = styled.div`
  display: column;
  flex: 1;
  z-index: 300;
  height: 100%;
  width: 100%;
  padding: 20px;

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
