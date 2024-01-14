"use client";
import React from "react";
import styled from "styled-components";
import { useChat } from "ai/react";

export default function ChatComponent() {
  // Vercel AI SDK
  const { input, handleInputChange, handleSubmit, isLoading, messages } =
    useChat();

  console.log(messages);
  console.log(input);

  return (
    <>
      <ChatBox>
        <ChatForm onSubmit={handleSubmit}>
          <ChatInput
            type="textarea"
            name="search"
            placeholder="How can I help ?"
            autoComplete="off"
            value={input}
            onChange={handleInputChange}
          />
        </ChatForm>
      </ChatBox>
      <MessageBox>
        <BotMessage>
          <h3>Ibn</h3>
          <p>I am a robot that uses GPT-4 to recommend travel destinations</p>
        </BotMessage>
        <UserMessage>
          <h3>Eloka</h3>
          <p>That is great to know !</p>
        </UserMessage>
        <BotMessage>
          <h3>Ibn</h3>
          <p>Anything else I can help you with ?</p>
          <UserMessage>
            <h3>Eloka</h3>
            <p>
              Yes please, can you help me plan my trip to Hamburg on Feb 20th ?
            </p>
          </UserMessage>
        </BotMessage>
      </MessageBox>
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

  margin-bottom: 20px;
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

const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  border-radius: 10px;
  width: 50%;
  padding: 20px;
  padding-left: 20px;
  padding-right: 20px;
  background: #111111;
  color: white;
  font-weight: 600;
  cursor: pointer;

  h3 {
    font-weight: 450;
    margin-left: 10px;
    color: #888888;
  }

  p {
    margin-left: 10px;
  }

  &:hover {
    opacity: 0.8;
    transition: 0.3s ease-in-out;
  }
`;

const BotMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const UserMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
  margin-top: 10px;
  margin-bottom: 10px;
`;
