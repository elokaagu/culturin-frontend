"use client";

import { useCallback, useEffect, useState } from "react";

export const SETTINGS_SECTION_IDS = [
  "#account",
  "#notifications",
  "#payments",
] as const;

export type SettingsSectionId = (typeof SETTINGS_SECTION_IDS)[number];

const ALLOWED = new Set<string>(SETTINGS_SECTION_IDS);

export function normalizeSettingsHash(raw: string): SettingsSectionId {
  if (ALLOWED.has(raw)) return raw as SettingsSectionId;
  return "#account";
}

/**
 * Keeps settings tab state in sync with the URL hash (`#account`, etc.).
 */
export function useSettingsSection() {
  const [section, setSection] = useState<SettingsSectionId>(() => {
    if (typeof window === "undefined") return "#account";
    return normalizeSettingsHash(window.location.hash);
  });

  const readHash = useCallback(() => {
    if (typeof window === "undefined") return;
    setSection(normalizeSettingsHash(window.location.hash));
  }, []);

  useEffect(() => {
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [readHash]);

  return section;
}
