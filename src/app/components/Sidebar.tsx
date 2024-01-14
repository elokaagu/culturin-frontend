import React from "react";
import styled from "styled-components";
import { device } from "../styles/breakpoints";

export default function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarText>
        <li>Create</li>
        <li>Destinations</li>
        <li>Logout</li>
      </SidebarText>
    </SidebarContainer>
  );
}

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: fixed;
  top: 0;
  left: 0;
  overflow-x: hidden;
  background-color: black;
  z-index: 200;
  height: 100%;
  width: 80%;
  padding-top: 60px;
  transition: all 0.25s ease;

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
