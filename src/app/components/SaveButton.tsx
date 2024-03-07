import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";
import React from "react";

// SaveButton.js or within the BlogArticle component file

const SaveButton = ({ contentId }: { contentId: string }) => {
  const { data: session } = useSession();

  const handleSave = async () => {
    if (!session) {
      alert("You must be signed in to save articles!");
      return;
    }

    try {
      const response = await fetch("/api/save-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contentId }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Article saved:", data);
        // Perform actions on success, e.g., show a confirmation message
      } else {
        throw new Error(data.message || "Could not save the article");
      }
    } catch (error) {
      console.error("Error saving article:", error);
      // Handle errors, e.g., show an error message
    }
  };

  return <button onClick={handleSave}>Save Article</button>;
};
