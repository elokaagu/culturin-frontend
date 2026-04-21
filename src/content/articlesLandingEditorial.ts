/**
 * Static long-form copy for `/articles`.
 * CMS (`getArticlesLandingPage`) only supplies the hero headline + intro when available;
 * this file owns the editorial body and imagery so the page has an explicit split:
 * remote hero (optional) + bundled longform (always).
 */

export const ARTICLES_LANDING_EDITORIAL = {
  /** Used when the CMS is unavailable or does not return a headline. */
  fallbackHeadline: "The cultural tapestry of Enugu",
  /** Used when the CMS is unavailable or does not return an intro. */
  fallbackIntro:
    "Enugu blends history, Igbo tradition, music, and food into a destination worth understanding before you go.",
  heroImage: {
    src: "https://res.cloudinary.com/drfkw9rgh/image/upload/v1704889319/hdfbvawg6isdoft0sghq.jpg",
    alt: "Street and architecture in Enugu, Nigeria",
    width: 980,
    height: 560,
  },
  bodyParagraphs: [
    `Enugu, often referred to as the "Coal City State," is a Nigerian city with a diverse and vibrant cultural heritage. Located in the southeastern region, it is known for historical significance and for the tapestry of cultures that shape a distinct local identity. One of the most prominent aspects is its rich history. The city served as the capital of the short-lived Republic of Biafra during the Nigerian Civil War, making it a symbol of resilience. Visitors can explore this period through museums and memorials, gaining insight into struggles and triumphs.`,
    `Enugu's cultural heritage is also deeply intertwined with its indigenous people, primarily the Igbo. Igbo culture is celebrated through festivals, dances, and traditional ceremonies. The New Yam Festival, known as "Iri Ji Ohuru" in Igbo, is a time-honored tradition where people come together to give thanks for the harvest. The festival features music, dance, masquerades, and feasting, showcasing cultural richness. Music and dance play a significant role: traditional music often features drums, flutes, and other indigenous instruments. High-energy dances like "Ogene" and "Ekwe" appear at events and ceremonies, bringing people together and preserving regional identity.`,
    `Enugu also boasts a culinary heritage that reflects diversity. The cuisine blends traditional Igbo dishes with influences from neighboring groups. Visitors can savor meals such as "Nsala" (white soup), "Oha" soup, and "Ugba" (oil bean seed) garnished with palm oil and spices—a memorable gastronomic experience.`,
    `In conclusion, Enugu's cultural heritage weaves together history, tradition, music, dance, and food. Resilience, Igbo culture, and diverse influences make it a fascinating destination for exploring Nigeria's cultural diversity. Enugu invites you to experience its heritage with a vibrant cultural embrace.`,
  ],
} as const;
