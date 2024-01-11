"use client";
import React from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import { device } from "../../styles/breakpoints";
import { Plus } from "styled-icons/boxicons-regular";

export default function Upload() {
  return (
    <>
      <Header />
      <AppBody>
        <UploadContainer>
          <UploadDetails>
            <UploadTitle>
              <h1>Upload</h1>
              <p>Upload your images</p>
            </UploadTitle>
            <UploadField>
              <Plus size="20" />
            </UploadField>
          </UploadDetails>
        </UploadContainer>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: row;
  jusitfy-content: space-between;
  flex: 1;
  padding-top: 150px;
  background: black;
  height: 100%;
  line-height: 2;
  color: white;

  @media ${device.mobile} {
    padding-top: 100px;
  }
`;

const UploadContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const UploadTitle = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const UploadDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  border: 2px solid #222;
  border-radius: 15px;
  width: 320px;
  &:hover {
    opacity: 0.8;
    background: #111;
    transition: 0.3s ease-in-out;
  }
`;

const UploadField = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  cursor: pointer;
`;
