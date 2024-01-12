/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Hero from "../components/Hero";

export default function Posts() {
  return (
    <>
      <Header />
      <AppBody>
        <Title>
          <h1>Enugu, Nigeria</h1>
        </Title>
        <Subtitle>
          <h3>Unveiling Enugu's Rich Cultural Heritage</h3>
        </Subtitle>
        <Body>
          <p>
            Enugu, often referred to as the "Coal City State," is a Nigerian
            city that boasts a diverse and vibrant cultural heritage. Located in
            the southeastern region of Nigeria, Enugu is not only known for its
            historical significance but also for the tapestry of cultures that
            have woven together to create a unique cultural identity. One of the
            most prominent aspects of Enugu's cultural heritage is its rich
            history. The city served as the capital of the short-lived Republic
            of Biafra during the Nigerian Civil War, making it a symbol of
            resilience and determination in the face of adversity. Visitors can
            explore the remnants of this turbulent period through various
            museums and memorials, gaining insight into the city's historical
            struggles and triumphs. Enugu's cultural heritage is also deeply
            intertwined with its indigenous people, primarily the Igbo.
          </p>
          <p>
            The Igbo culture is celebrated through colorful festivals, dances,
            and traditional ceremonies. One such event is the New Yam Festival,
            known as "Iri Ji Ohuru" in Igbo, which is a time-honored tradition
            where the people of Enugu come together to thank the gods for a
            bountiful harvest. The festival is characterized by music, dance,
            masquerades, and feasting, showcasing the cultural richness of the
            Igbo people. Music and dance play a significant role in Enugu's
            cultural heritage. The city is known for its traditional music,
            which often features drums, flutes, and other indigenous
            instruments. The high-energy dances like "Ogene" and "Ekwe" are
            performed at various cultural events and ceremonies, bringing people
            together and preserving the cultural identity of the region. Enugu
            also boasts a culinary heritage that reflects its cultural
            diversity. The city's cuisine is a fusion of traditional Igbo dishes
            and influences from neighboring ethnic groups. Visitors can savor
            delicious meals such as "Nsala" (white soup), "Oha" soup, and "Ugba"
            (oil bean seed) garnished with palm oil and spices, providing a
            delightful gastronomic experience.{" "}
          </p>
          <p>
            {" "}
            In conclusion, Enugu's cultural heritage is a tapestry of history,
            tradition, music, dance, and culinary delights. The citys
            resilience, rich Igbo culture, and diverse influences make it a
            fascinating destination for those seeking to explore Nigerias
            cultural diversity. Enugu invites you to experience its heritage,
            welcoming you with open arms and a vibrant cultural embrace.
          </p>
        </Body>
      </AppBody>
    </>
  );
}

const AppBody = styled.div`
  padding: 40px;
  display: flex;
  padding-top: 150px;
  align-items: left;
  background: black;
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: white;
`;

const Title = styled.div`
  margin: auto 10px;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  h3 {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

const Subtitle = styled.div`
  margin: auto 10px;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  h3 {
    font-size: 20px;
    margin-bottom: 20px;
    color: grey;
  }
`;

const Body = styled.div`
  margin: auto;
  width: 50%;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  p {
    font-size: 18px;
    padding-bottom: 36px;
    color: white;
  }
`;
