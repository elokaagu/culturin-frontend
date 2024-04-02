import React from "react";
import { Sun, Moon } from "styled-icons/boxicons-regular";
import styled from "styled-components";

const ThemeToggle = ({
  theme,
  toggleTheme,
}: {
  theme: string;
  toggleTheme: () => void;
}) => {
  return (
    <ToggleContainer onClick={toggleTheme}>
      {theme === "dark" ? <Sun size="24" /> : <Moon size="24" />}
    </ToggleContainer>
  );
};

const ToggleContainer = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: none;
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

export default ThemeToggle;
