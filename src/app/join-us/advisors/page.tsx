"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import styled from "styled-components";

import Header from "../../components/Header";
import { device } from "../../styles/breakpoints";

export default function AdvisorsPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  const scrollToSection = () => {
    document.getElementById("target-section")?.scrollIntoView({ behavior: "smooth" });
  };

  async function handleApply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormMessage("");
    const trimmed = email.trim();
    if (!trimmed) {
      setFormState("error");
      setFormMessage("Enter your email.");
      return;
    }

    setFormState("loading");
    try {
      const res = await fetch("/api/advisor-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, billingCycle }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setFormState("error");
        setFormMessage(data.error ?? "Something went wrong.");
        return;
      }
      setFormState("success");
      setFormMessage("Thanks — we received your application request.");
    } catch {
      setFormState("error");
      setFormMessage("Network error. Please try again.");
    }
  }

  return (
    <div>
      <Header />
      <AppBody>
        <Title>
          <h1>Become a Culturin advisor</h1>
        </Title>
        <Subtitle>
          <p>
            Culturin is designed for the innovative and entrepreneurial travel advisor of tomorrow. Our core mission is
            to empower those with a deep-rooted passion for exploration and travel to generate a flexible income by
            curating and booking unforgettable journeys. At Culturin, we believe that travel is more than just visiting
            new destinations; it&apos;s about creating experiences that last a lifetime.
          </p>
        </Subtitle>

        <Body>
          <p>
            Whether you are just starting out or looking to elevate your existing travel advisory business, Culturin
            offers the tools, resources, and community support needed to thrive in the dynamic world of travel planning.
            Join us and become part of a vibrant community of travel enthusiasts who are transforming their love for
            exploration into rewarding careers. Let Culturin be your guide to a successful and fulfilling future in the
            travel industry.
          </p>
          <ApplyScrollButton type="button" onClick={scrollToSection}>
            Apply
          </ApplyScrollButton>

          <OfferBody>
            <h2>Community</h2>
            <p>
              Our diverse, inclusive &amp; engaged global community is designed to make you feel welcome.
            </p>
          </OfferBody>
          <Features>
            <Feature>
              <p>Live networking events across the country</p>
            </Feature>
            <Feature>
              <p>Community app for collaboration and support</p>
            </Feature>
            <Feature>
              <p>Weekly online community &amp; partner events</p>
            </Feature>
            <Feature>
              <p>Mentorship, FAM trips &amp; site visits</p>
            </Feature>
          </Features>
          <MembershipSection>
            <MembershipTitle>Apply to join Culturin &amp; get everything you need to succeed</MembershipTitle>
            <MembershipInfo>Our advisors typically make back their membership fee within their first month.</MembershipInfo>
            <PricingCard>
              <PricingToggle>
                <ToggleOptionButton
                  type="button"
                  $active={billingCycle === "annual"}
                  onClick={() => setBillingCycle("annual")}
                >
                  ANNUAL
                </ToggleOptionButton>
                <ToggleOptionButton
                  type="button"
                  $active={billingCycle === "monthly"}
                  onClick={() => setBillingCycle("monthly")}
                >
                  MONTHLY
                </ToggleOptionButton>
              </PricingToggle>
              {billingCycle === "annual" ? (
                <>
                  <PriceAmount>$299</PriceAmount>
                  <PricePer>per year</PricePer>
                  <BilledDetail>billed every 12 months</BilledDetail>
                </>
              ) : (
                <>
                  <PriceAmount>$49</PriceAmount>
                  <PricePer>per month</PricePer>
                  <BilledDetail>billed every month</BilledDetail>
                </>
              )}
              <BestValueLabel>{billingCycle === "annual" ? "BEST VALUE: Save 50%" : ""}</BestValueLabel>

              <BenefitsList>
                <Benefit>Start at 70% commission split</Benefit>
                <Benefit>Live training and mentorship</Benefit>
                <Benefit>Access to 4,500+ preferred partners</Benefit>
                <Benefit>Custom marketing tools</Benefit>
                <Benefit>Global community of travel pros</Benefit>
              </BenefitsList>
              <ApplyButton type="button" onClick={scrollToSection}>
                APPLY
              </ApplyButton>
            </PricingCard>
          </MembershipSection>
          <div id="target-section">
            <CTASection>
              <CTATitle>Apply to join Culturin today &amp; get everything you need to succeed</CTATitle>
              <CTASubtitle>
                Book just $360/month in travel and you will cover your subscription fees. Everything after that is your
                profit to keep.
              </CTASubtitle>
              <form onSubmit={handleApply} className="flex flex-col items-center gap-3">
                <EmailInput
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  disabled={formState === "loading" || formState === "success"}
                  aria-invalid={formState === "error"}
                  aria-describedby={formMessage ? "apply-form-feedback" : undefined}
                />
                {formMessage ? (
                  <p
                    id="apply-form-feedback"
                    className={`max-w-sm text-center text-sm ${formState === "success" ? "text-emerald-400" : "text-red-400"}`}
                    role={formState === "error" ? "alert" : "status"}
                  >
                    {formMessage}
                  </p>
                ) : null}
                <GetStartedButton type="submit" disabled={formState === "loading" || formState === "success"}>
                  {formState === "loading" ? "Sending…" : "Apply"}
                </GetStartedButton>
              </form>
            </CTASection>
          </div>
        </Body>
      </AppBody>
    </div>
  );
}

const AppBody = styled.div`
  padding: 20px;
  padding-top: var(--header-offset);
  display: flex;
  flex: 1;
  align-items: center;
  background: ${({ theme }) => theme.body};
  flex-direction: column;
  height: 100%;
  line-height: 2;
  color: ${({ theme }) => theme.title};
`;

const Title = styled.div`
  margin: auto;
  width: 50%;
  margin: auto 10px;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: background-color 0.3s;

  @media ${device.mobile} {
    align-items: flex-start;
    margin-left: 0;
    width: 100%;

    h1 {
      font-size: 25px;
      align-items: flex-start;
      margin-left: 20px;
      width: 100%;
    }
  }
`;

const Subtitle = styled.div`
  margin: auto;
  width: 50%;
  margin: auto 10px;
  padding-left: 30px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  h3 {
    font-size: 20px;
    margin-bottom: 20px;
    color: grey;
  }

  @media ${device.mobile} {
    margin-left: 60px;
    padding-left: 10px;
    align-items: flex-start;
    width: 100%;
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
  align-items: flex-start;

  p {
    font-size: 18px;
    padding-top: 5px;
    padding-bottom: 20px;
    color: ${({ theme }) => theme.title};
  }

  @media ${device.mobile} {
    padding-left: 20px;
    align-items: flex-start;
    width: 100%;

    p {
      font-size: 18px;
      padding-bottom: 36px;
      color: ${({ theme }) => theme.title};
    }
  }
`;

const ApplyScrollButton = styled.button`
  margin-top: 20px;
  border-radius: 5px;
  width: 100px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: #ffffff;
  color: #000000;

  &:hover {
    background: grey;
    transition: 0.3s ease-in-out;
  }

  @media ${device.mobile} {
    width: 100px;
  }
`;

const OfferBody = styled.div`
  margin: auto;
  margin-top: 20px;
  width: 95%;
  align-items: flex-start;
  padding-left: 30px;
  padding-top: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #111111;
  border-radius: 10px;

  h2 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem;
    color: ${({ theme }) => theme.title};
  }

  p {
    font-size: 18px;
    padding-top: 5px;
    padding-bottom: 20px;
    color: ${({ theme }) => theme.title};
  }

  @media ${device.mobile} {
    padding-left: 20px;
    align-items: flex-start;
    width: 100%;

    p {
      font-size: 18px;
      padding-bottom: 36px;
      color: ${({ theme }) => theme.title};
    }
  }
`;

const Features = styled.div`
  margin-top: 40px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 1px solid #111111;
  border-radius: 10px;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.title};
  font-size: 1em;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const MembershipSection = styled.section`
  width: 100%;
  padding: 60px 0;
  color: black;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
`;

const MembershipTitle = styled.h2`
  font-size: 2em;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.title};
`;

const MembershipInfo = styled.p`
  font-size: 1.2em;
  text-align: center;
  margin-bottom: 40px;
  max-width: 36rem;
  color: rgba(255, 255, 255, 0.88);
`;

const PricingCard = styled.div`
  width: min(100%, 350px);
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PricingToggle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-bottom: 30px;
`;

const ToggleOptionButton = styled.button<{ $active: boolean }>`
  font-weight: bold;
  cursor: pointer;
  border: none;
  background-color: ${(props) => (props.$active ? "#DDEEFF" : "transparent")};
  padding: 10px;
  border-radius: 10px;
  color: #111;

  &:first-child {
    margin-right: 5px;
  }
  &:last-of-type {
    margin-left: 5px;
  }

  &:hover {
    opacity: 0.85;
  }
`;

const PriceAmount = styled.span`
  font-size: 3em;
  font-weight: bold;
  color: #111;
`;

const PricePer = styled.span`
  font-size: 1em;
  color: #111;
`;

const BilledDetail = styled.span`
  font-size: 0.8em;
  color: #666;
`;

const BestValueLabel = styled.span`
  font-size: 0.9em;
  color: green;
  margin: 10px 0;
  min-height: 1.25em;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
  width: 100%;
`;

const Benefit = styled.li`
  font-size: 1em;
  margin: 10px 0;
  color: #111;
  &:before {
    content: "✔";
    color: green;
    margin-right: 10px;
  }
`;

const ApplyButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.title};
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #333;
  }
`;

const CTASection = styled.section`
  background-color: ${({ theme }) => theme.body};
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  text-align: center;
  border-radius: 10px;
`;

const CTATitle = styled.h2`
  font-size: 2em;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.title};
`;

const CTASubtitle = styled.p`
  font-size: 1em;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.title};
`;

const EmailInput = styled.input`
  font-size: 1em;
  padding: 10px;
  margin-bottom: 4px;
  border: none;
  border-bottom: 2px solid #000;
  background-color: #ffffff;
  color: #000;
  width: min(100%, 320px);
  align-self: center;
  border-radius: 10px;
  outline: none;
  text-align: left;

  &::placeholder {
    color: #555;
  }

  &:disabled {
    opacity: 0.7;
  }
`;

const GetStartedButton = styled.button`
  font-size: 1em;
  color: #000;
  background-color: #fff;
  padding: 10px 20px;
  width: min(100%, 300px);
  align-self: center;
  font-weight: bold;
  border-radius: 10px;
  border: 2px solid #000;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;
