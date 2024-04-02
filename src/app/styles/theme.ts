import { DefaultTheme, createGlobalStyle } from "styled-components";
import { device } from "./breakpoints";

declare module "styled-components" {
  export interface DefaultTheme {
    body: string;
    title: string;
    subtitle: string;
  }
}

export const GlobalStyles = createGlobalStyle`
    body {
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.title};
         transition: background 0.5s ease-in, color 0.5s ease-in;
        @media ${device.mobile} {
          body {
            overflow: hidden;
          }
        }
    }
`;
export const lightTheme = {
  body: "#ffffff",
  title: "#000000",
  subtitle: "grey",
  button: "#000000",
};
export const darkTheme = {
  body: "#000000",
  title: "#ffffff",
  subtitle: "grey",
  button: "#ffffff",
};
