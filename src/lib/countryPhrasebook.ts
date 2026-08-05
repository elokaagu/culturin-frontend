/**
 * A handful of common words/phrases per country, for the public "Learn a few words"
 * homepage widget. Keyed to match `exploreWorldCountries` ids. Deliberately small —
 * this is a friendly teaser, not a language course (see the authenticated Language
 * tools panel on the profile page for real vocabulary building).
 */
export type PhrasebookEntry = {
  en: string;
  phrase: string;
};

export type CountryPhrasebook = {
  countryId: string;
  language: string;
  /** Shown when the language named isn't the country's only official language. */
  languageNote?: string;
  phrases: PhrasebookEntry[];
};

export const countryPhrasebooks: CountryPhrasebook[] = [
  {
    countryId: "japan",
    language: "Japanese",
    phrases: [
      { en: "Hello", phrase: "Konnichiwa" },
      { en: "Thank you", phrase: "Arigatou" },
      { en: "Please", phrase: "Onegaishimasu" },
    ],
  },
  {
    countryId: "portugal",
    language: "Portuguese",
    phrases: [
      { en: "Hello", phrase: "Olá" },
      { en: "Thank you", phrase: "Obrigado" },
      { en: "Please", phrase: "Por favor" },
    ],
  },
  {
    countryId: "morocco",
    language: "Moroccan Arabic",
    languageNote: "Darija — Morocco also speaks Amazigh (Berber) and French.",
    phrases: [
      { en: "Hello", phrase: "Salam" },
      { en: "Thank you", phrase: "Shukran" },
      { en: "Please", phrase: "'Afak" },
    ],
  },
  {
    countryId: "argentina",
    language: "Spanish",
    phrases: [
      { en: "Hello", phrase: "Hola" },
      { en: "Thank you", phrase: "Gracias" },
      { en: "Please", phrase: "Por favor" },
    ],
  },
  {
    countryId: "iceland",
    language: "Icelandic",
    phrases: [
      { en: "Hello", phrase: "Halló" },
      { en: "Thank you", phrase: "Takk" },
      { en: "Please", phrase: "Vinsamlegast" },
    ],
  },
  {
    countryId: "italy",
    language: "Italian",
    phrases: [
      { en: "Hello", phrase: "Ciao" },
      { en: "Thank you", phrase: "Grazie" },
      { en: "Please", phrase: "Per favore" },
    ],
  },
  {
    countryId: "mexico",
    language: "Spanish",
    phrases: [
      { en: "Hello", phrase: "Hola" },
      { en: "Thank you", phrase: "Gracias" },
      { en: "Please", phrase: "Por favor" },
    ],
  },
  {
    countryId: "south-africa",
    language: "Afrikaans",
    languageNote: "One of South Africa's 12 official languages.",
    phrases: [
      { en: "Hello", phrase: "Hallo" },
      { en: "Thank you", phrase: "Dankie" },
      { en: "Please", phrase: "Asseblief" },
    ],
  },
  {
    countryId: "vietnam",
    language: "Vietnamese",
    phrases: [
      { en: "Hello", phrase: "Xin chào" },
      { en: "Thank you", phrase: "Cảm ơn" },
      { en: "Please", phrase: "Làm ơn" },
    ],
  },
];

export function getCountryPhrasebook(countryId: string): CountryPhrasebook | undefined {
  return countryPhrasebooks.find((p) => p.countryId === countryId);
}
