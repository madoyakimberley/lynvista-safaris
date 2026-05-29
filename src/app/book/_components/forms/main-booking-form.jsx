"use client";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  CalendarDays,
  Users,
  Hotel,
  CreditCard,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import useBook from "@/app/hooks/useBook";
import useTours from "@/app/hooks/useTours";
import CalendarPicker from "../ui/calendar-picker";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  bg: "#f7f3ee",
  white: "#ffffff",
  dark: "#24150d",
  brown: "#5b2d12",
  gold: "#b98a44",
  goldSoft: "#d8b889",
  border: "#e7d8c8",
  muted: "#8a7768",
  lightText: "#c4b2a0",
  sidebar: "#24150d",
};

// ─────────────────────────────────────────────────────────────────────────────
// EXCHANGE RATES
// BASE DB CURRENCY = USD
// ─────────────────────────────────────────────────────────────────────────────

const exchangeRates = {
  USD: 1,
  KES: 129,
  EUR: 0.92,
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = ["Destination", "Travel Dates", "Travellers", "Final Details"];

function ProgressBar({ step }) {
  return (
    <div
      style={{
        width: "100%",
        marginBottom: "42px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0px",
          width: "100%",
        }}
      >
        {STEPS.map((label, index) => {
          const active = step === index;
          const completed = step > index;
          const last = index === STEPS.length - 1;

          return (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                flex: last ? "0" : 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: "85px",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "999px",
                    background: completed || active ? C.brown : "#efe5d9",
                    border: `1.5px solid ${
                      completed || active ? C.brown : "#e5d7c8"
                    }`,
                    color: completed || active ? "#fff" : "#9c8d80",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s ease",
                    boxShadow: active
                      ? "0 0 0 4px rgba(185,138,68,0.12)"
                      : "none",
                  }}
                >
                  {completed ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        fontFamily: "'Playfair Display', serif",
                      }}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                <span
                  style={{
                    fontSize: "11px",
                    color: completed || active ? C.dark : "rgba(36,21,13,0.45)",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: completed || active ? "700" : "500",
                    letterSpacing: "0.04em",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </div>

              {!last && (
                <div
                  style={{
                    flex: 1,
                    height: "2px",
                    background: completed ? C.brown : "#eadfd3",
                    marginBottom: "28px",
                    transition: "0.2s ease",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────

function TripSummary({ form }) {
  const formatDate = (date) => {
    if (!date) return "Not selected";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const nights =
    form.travel_start_date && form.travel_end_date
      ? Math.round(
          (new Date(form.travel_end_date) - new Date(form.travel_start_date)) /
            86400000,
        )
      : 0;

  const convertedPrice =
    Number(form.quoted_price || 0) * exchangeRates[form.currency];

  const Row = ({ icon, title, value, sub }) => (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "14px 0",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.goldSoft,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.42)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "4px",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "13px",
            color: value ? "#fff" : "rgba(255,255,255,0.35)",
            lineHeight: "1.5",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {value || "Not selected"}
        </div>

        {sub && (
          <div
            style={{
              marginTop: "3px",
              fontSize: "11px",
              color: C.goldSoft,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        background: C.sidebar,
        borderRadius: "18px",
        padding: "24px",
        width: "100%",
        maxWidth: "320px",
        position: "sticky",
        top: "24px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.16)",
      }}
    >
      <h3
        style={{
          margin: 0,
          color: "#fff",
          fontSize: "16px",
          fontWeight: "700",
          fontFamily: "'Playfair Display', serif",
          marginBottom: "22px",
        }}
      >
        Your Trip Summary
      </h3>

      <Row
        icon={<MapPin size={16} />}
        title="Destination"
        value={form.tour_package}
      />

      <Row
        icon={<CalendarDays size={16} />}
        title="Travel Dates"
        value={
          form.travel_start_date && form.travel_end_date
            ? `${formatDate(form.travel_start_date)} - ${formatDate(
                form.travel_end_date,
              )}`
            : null
        }
        sub={nights ? `${nights} Nights` : null}
      />

      <Row
        icon={<Users size={16} />}
        title="Travellers"
        value={`${form.adults} Adult${form.adults !== 1 ? "s" : ""}${
          form.children
            ? `, ${form.children} Child${form.children !== 1 ? "ren" : ""}`
            : ""
        }`}
      />

      <Row
        icon={<Hotel size={16} />}
        title="Accommodation"
        value={
          form.accommodation_type !== "None" ? form.accommodation_type : null
        }
      />

      <Row
        icon={<CreditCard size={16} />}
        title="Estimated Price"
        value={`${form.currency} ${convertedPrice.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}`}
      />

      <div
        style={{
          marginTop: "18px",
          paddingTop: "18px",
          borderTop: "1px dashed rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <ShieldCheck size={15} color={C.goldSoft} />

          <span
            style={{
              fontSize: "11px",
              color: C.goldSoft,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Expert Concierge Included
          </span>
        </div>

        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.55)",
            lineHeight: "1.7",
            fontSize: "12px",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Once your booking request is submitted, a Lynvista safari specialist
          will guide you through every stage of your experience.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1
// ─────────────────────────────────────────────────────────────────────────────

function StepDestinations({ form, setForm, tours, toursLoading, onNext }) {
  const ACCOMMODATION = [
    "None",
    "Hotel",
    "Resort",
    "Lodge",
    "Camp",
    "Apartment",
  ];

  return (
    <div>
      <h1
        style={{
          margin: "0 0 10px",
          fontSize: "clamp(28px,4vw,46px)",
          lineHeight: "1.1",
          color: C.brown,
          fontFamily: "'Playfair Display', serif",
          fontWeight: "700",
        }}
      >
        Your Kenyan Odyssey Starts Here
      </h1>

      <p
        style={{
          margin: "0 0 34px",
          fontSize: "14px",
          lineHeight: "1.7",
          color: C.muted,
          maxWidth: "620px",
          fontFamily: "'Playfair Display', serif",
        }}
      >
        Tell us about your dream adventure and our experts will curate a safari
        experience tailored to your travel style.
      </p>

      <label style={LABEL}>Where shall we begin?</label>

      <p style={SUBTEXT}>
        Select your preferred destination and safari experience.
      </p>

      {toursLoading ? (
        <div
          style={{
            border: `1px dashed ${C.border}`,
            background: "#fff",
            borderRadius: "14px",
            padding: "18px",
            color: C.muted,
            fontFamily: "'Playfair Display', serif",
            fontSize: "14px",
          }}
        >
          Refresh the page to fetch tour images.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
            gap: "14px",
            marginBottom: "28px",
          }}
        >
          {tours?.map((tour) => {
            const active = form.tour_package === tour.title;

            return (
              <button
                key={tour.id}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    tour_package: tour.title,
                    quoted_price: Number(tour.base_price || 0),
                  }))
                }
                style={{
                  padding: 0,
                  overflow: "hidden",
                  borderRadius: "14px",
                  border: active
                    ? `2px solid ${C.brown}`
                    : `1px solid ${C.border}`,
                  background: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "0.2s ease",
                  boxShadow: active ? "0 8px 26px rgba(91,45,18,0.12)" : "none",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "210px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.08))",
                    }}
                  />

                  {active && (
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        width: "28px",
                        height: "28px",
                        borderRadius: "999px",
                        background: C.white,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: C.brown,
                      }}
                    >
                      <Check size={15} strokeWidth={3} />
                    </div>
                  )}

                  <div
                    style={{
                      position: "absolute",
                      bottom: "14px",
                      left: "14px",
                      right: "14px",
                    }}
                  >
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "16px",
                        fontWeight: "700",
                        lineHeight: "1.3",
                        fontFamily: "'Playfair Display', serif",
                      }}
                    >
                      {tour.title}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <label style={LABEL}>Experience Style</label>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "34px",
        }}
      >
        {ACCOMMODATION.map((type) => {
          const active = form.accommodation_type === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  accommodation_type: type,
                }))
              }
              style={{
                padding: "10px 18px",
                borderRadius: "999px",
                border: active
                  ? `1.5px solid ${C.brown}`
                  : `1.5px solid ${C.border}`,
                background: active ? C.brown : "#fff",
                color: active ? "#fff" : C.dark,
                fontSize: "13px",
                fontWeight: active ? "700" : "500",
                fontFamily: "'Playfair Display', serif",
                cursor: "pointer",
                transition: "0.2s ease",
              }}
            >
              {type}
            </button>
          );
        })}
      </div>

      <NextBtn
        disabled={!form.tour_package}
        onClick={onNext}
        label="Select Travel Dates"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2
// ─────────────────────────────────────────────────────────────────────────────

function StepDates({ form, setForm, onBack, onNext }) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h1 style={PAGE_TITLE}>Choose Your Travel Dates</h1>

      <p style={PAGE_DESC}>
        Select the ideal period for your safari journey across Kenya.
      </p>

      <CalendarPicker
        startDate={form.travel_start_date}
        endDate={form.travel_end_date}
        minDate={today}
        onChange={(start, end) =>
          setForm((prev) => ({
            ...prev,
            travel_start_date: start,
            travel_end_date: end,
          }))
        }
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginTop: "32px",
          flexWrap: "wrap",
        }}
      >
        <BackBtn onClick={onBack} label="Back to Destinations" />

        <NextBtn
          onClick={onNext}
          disabled={!form.travel_end_date}
          label="Continue to Travellers"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3
// ─────────────────────────────────────────────────────────────────────────────

function Counter({ label, sub, value, min = 0, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 0",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div>
        <div
          style={{
            fontSize: "18px",
            color: C.dark,
            fontWeight: "600",
            fontFamily: "'Playfair Display', serif",
            marginBottom: "4px",
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontSize: "13px",
            color: C.muted,
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {sub}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          style={COUNT_BTN(value <= min)}
        >
          -
        </button>

        <span
          style={{
            fontSize: "18px",
            minWidth: "20px",
            textAlign: "center",
            color: C.dark,
            fontWeight: "700",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {value}
        </span>

        <button
          type="button"
          onClick={() => onChange(value + 1)}
          style={COUNT_BTN()}
        >
          +
        </button>
      </div>
    </div>
  );
}

function StepTravellers({ form, setForm, onBack, onNext }) {
  return (
    <div>
      <h1 style={PAGE_TITLE}>Who is Travelling?</h1>

      <p style={PAGE_DESC}>
        From intimate escapes to family adventures, your journey is crafted to
        fit your travel group perfectly.
      </p>

      <div
        style={{
          background: "#fff",
          border: `1px solid ${C.border}`,
          borderRadius: "18px",
          padding: "8px 24px",
          marginBottom: "32px",
        }}
      >
        <Counter
          label="Adults"
          sub="Ages 13+"
          value={form.adults}
          min={1}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              adults: value,
            }))
          }
        />

        <Counter
          label="Children"
          sub="Ages 3 - 12"
          value={form.children}
          min={0}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              children: value,
            }))
          }
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <BackBtn onClick={onBack} label="Back to Dates" />

        <NextBtn onClick={onNext} label="Continue to Final Details" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4
// ─────────────────────────────────────────────────────────────────────────────

function StepFinalDetails({ form, setForm, tours, loading, success, onBack }) {
  const selectedTour = tours?.find((tour) => tour.title === form.tour_package);

  const convertedPrice =
    Number(form.quoted_price || 0) * exchangeRates[form.currency];

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      <h1
        style={{
          margin: "0 0 28px",
          fontSize: "clamp(24px,4vw,38px)",
          color: C.brown,
          fontWeight: "700",
          textAlign: "center",
          fontFamily: "'Playfair Display', serif",
        }}
      >
        Confirm Your African Odyssey
      </h1>

      <div
        className="final-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "26px",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "24px",
            border: `1px solid ${C.border}`,
          }}
        >
          <label style={LABEL}>Guest Information</label>

          <div
            className="guest-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "14px",
            }}
          >
            <Input
              icon={<User size={16} />}
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  full_name: e.target.value,
                }))
              }
            />

            <Input
              icon={<Mail size={16} />}
              placeholder="Email Address"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <Input
              icon={<Phone size={16} />}
              placeholder="+254 700 000 000"
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <div style={LABEL_SMALL}>Payment Method</div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {["Bank Transfer", "M-Pesa", "Card"].map((method) => {
                const active = form.payment_method === method;

                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        payment_method: method,
                      }))
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "11px 16px",
                      borderRadius: "12px",
                      border: active
                        ? `1.5px solid ${C.brown}`
                        : `1.5px solid ${C.border}`,
                      background: active ? C.brown : "#fff",
                      color: active ? "#fff" : C.dark,
                      cursor: "pointer",
                      fontSize: "13px",
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: active ? "700" : "500",
                    }}
                  >
                    <CreditCard size={15} />
                    {method}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <div style={LABEL_SMALL}>Preferred Currency</div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {["KES", "USD", "EUR"].map((currency) => {
                const active = form.currency === currency;

                return (
                  <button
                    key={currency}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        currency,
                      }))
                    }
                    style={{
                      padding: "10px 16px",
                      borderRadius: "12px",
                      border: active
                        ? `1.5px solid ${C.brown}`
                        : `1.5px solid ${C.border}`,
                      background: active ? C.brown : "#fff",
                      color: active ? "#fff" : C.dark,
                      fontSize: "13px",
                      fontWeight: active ? "700" : "500",
                      cursor: "pointer",
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {currency}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={LABEL_SMALL}>Special Requests</div>

            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              placeholder="Dietary requirements, accessibility needs, special occasions..."
              style={{
                ...INPUT,
                minHeight: "120px",
                resize: "vertical",
                paddingTop: "14px",
                lineHeight: "1.7",
              }}
            />
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              cursor: "pointer",
              marginBottom: "24px",
            }}
          >
            <input
              type="checkbox"
              required
              style={{
                marginTop: "4px",
                accentColor: C.brown,
              }}
            />

            <span
              style={{
                fontSize: "12px",
                color: C.muted,
                lineHeight: "1.6",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              I agree to the Terms and Conditions and Privacy Policy of Lynvista
              Safaris.
            </span>
          </label>

          <BackBtn onClick={onBack} label="Back to Travellers" />
        </div>

        {/* RIGHT */}
        <div>
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              overflow: "hidden",
              border: `1px solid ${C.border}`,
              marginBottom: "18px",
            }}
          >
            <div
              style={{ position: "relative", width: "100%", height: "210px" }}
            >
              {selectedTour?.image ? (
                <Image
                  src={selectedTour.image}
                  alt={selectedTour.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.muted,
                    fontFamily: "'Playfair Display', serif",
                    background: "#f4ede6",
                  }}
                >
                  Refresh the page to fetch images.
                </div>
              )}
            </div>

            <div style={{ padding: "18px" }}>
              <div
                style={{
                  fontSize: "10px",
                  color: C.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "6px",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Your Travel Itinerary
              </div>

              <div
                style={{
                  fontSize: "20px",
                  color: C.dark,
                  fontWeight: "700",
                  marginBottom: "18px",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {form.tour_package}
              </div>

              <SummaryLine
                title="Travel Dates"
                value={`${formatDate(form.travel_start_date)} - ${formatDate(
                  form.travel_end_date,
                )}`}
              />

              <SummaryLine
                title="Travellers"
                value={`${form.adults} Adult${form.adults !== 1 ? "s" : ""}${
                  form.children
                    ? `, ${form.children} Child${form.children !== 1 ? "ren" : ""}`
                    : ""
                }`}
              />

              <SummaryLine
                title="Accommodation"
                value={form.accommodation_type}
              />

              <SummaryLine title="Payment Method" value={form.payment_method} />

              <SummaryLine title="Currency" value={form.currency} />
            </div>
          </div>

          <div
            style={{
              background: C.white,
              borderRadius: "18px",
              border: `1px solid ${C.border}`,
              padding: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  color: C.muted,
                  fontSize: "13px",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Total Amount
              </span>

              <span
                style={{
                  color: C.brown,
                  fontSize: "30px",
                  fontWeight: "700",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {form.currency}{" "}
                {convertedPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <p
              style={{
                fontSize: "12px",
                color: C.muted,
                lineHeight: "1.7",
                margin: "0 0 18px",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              A personalised quotation will be sent to your email within 24
              hours of submitting your request.
            </p>

            {success ? (
              <div
                style={{
                  background: "#eef7ef",
                  border: "1px solid #d0e7d2",
                  padding: "14px",
                  borderRadius: "12px",
                  textAlign: "center",
                  color: "#35623d",
                  fontWeight: "700",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Booking Submitted Successfully
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "12px",
                  background: loading ? "#9f8c7f" : C.brown,
                  color: "#fff",
                  padding: "15px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "700",
                  letterSpacing: "0.04em",
                  fontFamily: "'Playfair Display', serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Confirm & Request Booking
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function SummaryLine({ title, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "12px",
        padding: "10px 0",
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <span
        style={{
          fontSize: "13px",
          color: C.muted,
          fontFamily: "'Playfair Display', serif",
        }}
      >
        {title}
      </span>

      <span
        style={{
          fontSize: "13px",
          color: C.dark,
          fontWeight: "700",
          textAlign: "right",
          fontFamily: "'Playfair Display', serif",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Input({ icon, type = "text", placeholder, value, onChange }) {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "14px",
          transform: "translateY(-50%)",
          color: C.muted,
          pointerEvents: "none",
        }}
      >
        {icon}
      </div>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          ...INPUT,
          paddingLeft: "44px",
        }}
      />
    </div>
  );
}

const LABEL = {
  display: "block",
  marginBottom: "6px",
  fontSize: "13px",
  color: C.brown,
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontFamily: "'Playfair Display', serif",
};

const LABEL_SMALL = {
  marginBottom: "10px",
  fontSize: "11px",
  color: C.muted,
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontFamily: "'Playfair Display', serif",
};

const SUBTEXT = {
  margin: "0 0 18px",
  fontSize: "13px",
  color: C.muted,
  lineHeight: "1.7",
  fontFamily: "'Playfair Display', serif",
};

const PAGE_TITLE = {
  margin: "0 0 10px",
  fontSize: "clamp(28px,4vw,42px)",
  lineHeight: "1.1",
  color: C.brown,
  fontWeight: "700",
  fontFamily: "'Playfair Display', serif",
};

const PAGE_DESC = {
  margin: "0 0 28px",
  fontSize: "14px",
  lineHeight: "1.7",
  color: C.muted,
  fontFamily: "'Playfair Display', serif",
  maxWidth: "620px",
};

const INPUT = {
  width: "100%",
  height: "50px",
  borderRadius: "12px",
  border: `1px solid ${C.border}`,
  background: "#fff",
  outline: "none",
  padding: "0 16px",
  color: C.dark,
  fontSize: "14px",
  fontFamily: "'Playfair Display', serif",
  boxSizing: "border-box",
  transition: "0.2s ease",
};

function NextBtn({ onClick, disabled, label }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        border: "none",
        borderRadius: "10px",
        background: disabled ? "#c8b6a8" : C.brown,
        color: "#fff",
        padding: "14px 22px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "14px",
        fontWeight: "700",
        fontFamily: "'Playfair Display', serif",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        letterSpacing: "0.04em",
      }}
    >
      {label}
      <ChevronRight size={16} />
    </button>
  );
}

function BackBtn({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: "none",
        background: "transparent",
        color: C.muted,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: 0,
        fontSize: "13px",
        fontWeight: "600",
        fontFamily: "'Playfair Display', serif",
      }}
    >
      <ChevronLeft size={15} />
      {label}
    </button>
  );
}

const COUNT_BTN = (disabled = false) => ({
  width: "36px",
  height: "36px",
  borderRadius: "999px",
  border: `1px solid ${disabled ? "#e8ddd1" : C.brown}`,
  background: "#fff",
  color: disabled ? "#d0c2b5" : C.brown,
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: "18px",
  fontFamily: "'Playfair Display', serif",
});

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function MainBookingForm({ tours = [] }) {
  const router = useRouter();

  const { createBooking, loading } = useBook();

  const [step, setStep] = useState(0);

  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const exchangeRates = {
    USD: 1,
    KES: 129,
    EUR: 0.92,
  };

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    tour_package: "",
    flight_type: "None",
    departure_city: "",
    arrival_city: "",
    accommodation_type: "None",
    travel_start_date: today,
    travel_end_date: "",
    adults: 1,
    children: 0,
    currency: "USD",
    notes: "",
    payment_method: "Bank Transfer",
    payment_status: "Pending",
    managed_status: "Pending",
    quoted_price: 0,
    user_id: null,
  });

  const convertedPrice =
    Number(form.quoted_price || 0) * exchangeRates[form.currency];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toSQL = (date) => (date ? date.split("T")[0] : null);

    const finalConvertedPrice =
      Number(form.quoted_price || 0) * exchangeRates[form.currency];

    const payload = {
      ...form,
      quoted_price: finalConvertedPrice,

      travel_start_date: toSQL(form.travel_start_date),
      travel_end_date: toSQL(form.travel_end_date),

      adults: Number(form.adults),
      children: Number(form.children),

      notes: form.notes?.trim() || "",

      user_id: form.user_id || null,
    };

    const res = await createBooking(payload);
    console.log("Full response from API:", res);

    if (res) {
      setSuccess(true);

      const newBookingId = res.id || res.insertId; // Adjust this if your API returns it differently!

      if (!newBookingId) {
        console.error("The booking was created, but no ID was returned!");
        return;
      }

      setTimeout(() => {
        // 3. Now the ID will be a real number instead of 'undefined'
        router.push(`/book/confirmation?bookingId=${newBookingId}`);
      }, 3000);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

        *{
          box-sizing:border-box;
        }

        html{
          scroll-behavior:smooth;
        }

        body{
          background:${C.bg};
        }

        @media (max-width: 980px){
          .booking-layout{
            flex-direction:column;
          }

          .booking-sidebar{
            max-width:100% !important;
            width:100% !important;
            position:relative !important;
            top:auto !important;
          }

          .final-grid{
            grid-template-columns:1fr !important;
          }
        }

        @media (max-width: 768px){
          .booking-wrapper{
            padding:28px 18px !important;
          }

          .guest-grid{
            grid-template-columns:1fr !important;
          }
        }
      `}</style>

      <form
        onSubmit={handleSubmit}
        className="booking-wrapper"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 24px 70px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <ProgressBar step={step} />

        <div
          className="booking-layout"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "28px",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            {step === 0 && (
              <StepDestinations
                form={form}
                setForm={setForm}
                tours={tours}
                toursLoading={!tours.length}
                onNext={() => setStep(1)}
              />
            )}

            {step === 1 && (
              <StepDates
                form={form}
                setForm={setForm}
                onBack={() => setStep(0)}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <StepTravellers
                form={form}
                setForm={setForm}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <div className="final-grid">
                <StepFinalDetails
                  form={form}
                  setForm={setForm}
                  tours={tours}
                  loading={loading}
                  success={success}
                  convertedPrice={convertedPrice}
                  onBack={() => setStep(2)}
                />
              </div>
            )}
          </div>

          {step < 3 && (
            <div className="booking-sidebar">
              <TripSummary form={form} />
            </div>
          )}
        </div>
      </form>
    </>
  );
}
