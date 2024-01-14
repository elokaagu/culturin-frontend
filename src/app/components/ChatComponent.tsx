"use client";
import React from "react";
import styled from "styled-components";

export default function ChatComponent() {
  return (
    <>
      <ChatBox>
        <ChatForm>
          <ChatInput
            type="textarea"
            name="search"
            placeholder="How can I help ?"
            autoComplete="off"
          />
        </ChatForm>
      </ChatBox>
    </>
  );
}

const ChatForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const ChatBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  width: 50%;
  padding: 20px;
  padding-left: 20px;
  padding-right: 20px;
  background: #1e1e1e;
  color: white;
  font-weight: 600;
  cursor: pointer;

  p {
    margin-left: 10px;
  }

  &:hover {
    opacity: 0.8;
    transition: 0.3s ease-in-out;
  }
`;

const ChatInput = styled.input`
  background: transparent;
  margin-left: 10px;
  outline: none;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex: 2;
  border: none;
  height: 100%;
  color: white;
  font-weight: 600;
  font-size: 18px;
`;
