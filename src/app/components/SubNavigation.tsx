import React from "react";
import styled from "styled-components";
import Link from "next/link";

export default function SubNavigation() {
  return (
    <>
      <NavContainer>
        <NavLink href="/settings#account" passHref>
          <NavAnchor>Account</NavAnchor>
        </NavLink>
        <NavLink href="/settings#notifications" passHref>
          <NavAnchor>Notifications</NavAnchor>
        </NavLink>
        <NavLink href="/settings#payments" passHref>
          <NavAnchor>Payments</NavAnchor>
        </NavLink>
        {/* ... other links */}
      </NavContainer>
    </>
  );
}

const NavContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background: #f5f5f5; // Example styling
`;

const NavLink = styled(Link)`
  margin-right: 20px; // Example styling
`;

const NavAnchor = styled.a`
  color: #0077cc; // Example styling
  cursor: pointer;
  &:hover {
    color: #005fa3; // Example styling
  }
`;
