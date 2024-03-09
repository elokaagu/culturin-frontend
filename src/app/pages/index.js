import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import Home from "../../page";

export default function Index({ session }) {
  return <Home session={session} />;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log("Session:", session); // Check the session value in the server logs

  if (!session) {
    console.log("No session:", session); // Check the session value in the server logs

    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
