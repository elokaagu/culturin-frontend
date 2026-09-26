"use client";

import { useRef, useState } from "react";

import { HONEYPOT_FIELD, STARTED_AT_FIELD } from "@/lib/spamGuard";

/**
 * Invisible bot trap for public forms: render `trap` inside the <form> and spread `trapPayload()`
 * into the JSON body. People never see or fill the field; the server checks both values.
 */
export function useSpamTrap() {
  const startedAt = useRef<number>(Date.now());
  const [value, setValue] = useState("");

  const trap = (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Website
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
    </div>
  );

  const trapPayload = () => ({ [HONEYPOT_FIELD]: value, [STARTED_AT_FIELD]: startedAt.current });

  return { trap, trapPayload };
}
