"use client";

import { useState, type FormEvent } from "react";

export default function RSVPForm({ eventSlug }: { eventSlug: string }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("Enter your first and last name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/event-rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          company: company.trim(),
          title: title.trim(),
          linkedin: linkedin.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-10 max-w-md">
        <p className="text-lg font-medium" style={{ color: "#1c1a17" }}>
          You&rsquo;re on the list.
        </p>
        <p className="mt-2 text-sm" style={{ color: "#6b6456" }}>
          We&rsquo;ll be in touch with details, tickets, and everything you need to know before the night.
        </p>
      </div>
    );
  }

  const fieldClass =
    "w-full rounded-none border-b-2 bg-transparent px-0 py-3 text-base outline-none transition placeholder:text-[#9e9080] focus:border-[#1c1a17] disabled:opacity-60";

  return (
    <form onSubmit={handleSubmit} className="mt-10 flex max-w-lg flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <input
          type="text"
          required
          autoComplete="given-name"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={loading}
          className={fieldClass}
          style={{ borderColor: "#9e9080", color: "#1c1a17" }}
        />
        <input
          type="text"
          required
          autoComplete="family-name"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={loading}
          className={fieldClass}
          style={{ borderColor: "#9e9080", color: "#1c1a17" }}
        />
      </div>
      <input
        type="email"
        required
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        className={fieldClass}
        style={{ borderColor: "#9e9080", color: "#1c1a17" }}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <input
          type="text"
          autoComplete="organization"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          disabled={loading}
          className={fieldClass}
          style={{ borderColor: "#9e9080", color: "#1c1a17" }}
        />
        <input
          type="text"
          autoComplete="organization-title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          className={fieldClass}
          style={{ borderColor: "#9e9080", color: "#1c1a17" }}
        />
      </div>
      <input
        type="url"
        placeholder="LinkedIn URL"
        value={linkedin}
        onChange={(e) => setLinkedin(e.target.value)}
        disabled={loading}
        className={fieldClass}
        style={{ borderColor: "#9e9080", color: "#1c1a17" }}
      />

      {error ? (
        <p className="m-0 text-sm font-medium" style={{ color: "#dc4444" }}>
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-fit shrink-0 rounded-none px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-opacity disabled:opacity-60"
        style={{ background: "#1c1a17", color: "#e8e3da" }}
      >
        {loading ? "Sending…" : "Request Access"}
      </button>
    </form>
  );
}
