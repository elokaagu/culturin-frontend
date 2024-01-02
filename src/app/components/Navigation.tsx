import React from "react";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return <></>;
};

export default Navigation;
