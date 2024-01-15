"use client";
import React from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import { device } from "../../styles/breakpoints";
import { CldUploadWidget } from "next-cloudinary";

export default function Upload() {
  return (
    <>
      <Header />
      <AppBody>
        <UploadContainer>
          <UploadDetails>
            <UploadTitle>
              <h1>Upload</h1>
              <p>Add to your collection</p>
            </UploadTitle>
            <UploadField>
              <CldUploadWidget uploadPreset="culturin">
                {({ open }) => {
                  return (
                    <UploadButton onClick={() => open()}>
                      Upload an image
                    </UploadButton>
                  );
                }}
              </CldUploadWidget>
            </UploadField>
          </UploadDetails>
        </UploadContainer>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  padding: 20px;
  padding-top: 150px;
  display: flex;
  flex: 1;
  align-items: center;
  background: black;
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;

  @media ${device.mobile} {
    align-items: left;
    margin-left: 0;
    width: 100%;
  }
`;

const UploadContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  @media ${device.mobile} {
    align-items: left;
    margin-left: 0;
    width: 100%;
  }
`;

const UploadTitle = styled.div`
  display: flex;
  flex-direction: column;

  @media ${device.mobile} {
    align-items: left;
    margin-left: 0;
    width: 100%;
  }
`;

const UploadDetails = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #222;
  border-radius: 15px;
  width: 300px;
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
  align-items: center;
  cursor: pointer;

  @media ${device.mobile} {
    align-items: left;
    margin-left: 0;
    width: 100%;
  }
`;

const UploadButton = styled.div`
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  background-color: white;
  color: black;
  font-weight: 600;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: grey;
    transition: 0.3s ease-in-out;
  }

  @media ${device.mobile} {
    align-items: left;
    margin-left: 0;
    width: 100%;
  }
`;
