// app/reservation/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useT } from "@/app/TranslationProvider";

/* JSON-LD ثابت برای صفحه رزرو */
const reservationJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "Garage Auto Tune-Up Kraainem",
  image: "https://autotuneup.be/images/hero/hero-1200.jpg",
  url: "https://autotuneup.be/reservation",
  telephone: "+32487659570",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tramlaan 7",
    addressLocality: "Kraainem",
    postalCode: "1950",
    addressCountry: "BE",
  },
};

const MAX_BOOKING_YEAR = 2026;
const MAX_BOOKING_MONTH = 11;
const MAX_BOOKING_DAY = 31;

/* API helper */
async function sendReservation(data) {
  const res = await fetch("/api/reserve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export default function ReservationPage() {
  const { t } = useT();

  /* STATES */
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(""); // ✅ بدون ایمیل تست
  const [phone, setPhone] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [message, setMessage] = useState("");

  const [reservedSlots, setReservedSlots] = useState({});
  const [loading, setLoading] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /* JSON-LD Inject */
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(reservationJsonLd);
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  /* Fetch reserved slots */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/reserve");
        const json = await res.json();
        const list = json?.reservations || [];

        const map = {};
        list.forEach((r) => {
          if (!map[r.date]) map[r.date] = [];
          if (!map[r.date].includes(r.time)) map[r.date].push(r.time);
        });

        setReservedSlots(map);
      } catch (e) {
        console.error("Error loading reservations:", e);
      }
    }
    load();
  }, []);

  /* LOCAL HELPERS */
  const monthNames = [
    t("month_jan"),
    t("month_feb"),
    t("month_mar"),
    t("month_apr"),
    t("month_may"),
    t("month_jun"),
    t("month_jul"),
    t("month_aug"),
    t("month_sep"),
    t("month_oct"),
    t("month_nov"),
    t("month_dec"),
  ];

  const weekdayLabels = [
    t("weekday_mon"),
    t("weekday_tue"),
    t("weekday_wed"),
    t("weekday_thu"),
    t("weekday_fri"),
    t("weekday_sat"),
    t("weekday_sun"),
  ];

  const openingHoursConfig = {
    0: null,
    1: ["08:00", "19:00"],
    2: ["08:00", "19:00"],
    3: ["08:00", "19:00"],
    4: ["08:00", "19:00"],
    5: ["09:00", "19:00"],
    6: ["09:00", "12:00"],
  };

  function formatDateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  }

  function generateHours(start, end) {
    let [h] = start.split(":").map(Number);
    const [endH] = end.split(":").map(Number);
    const list = [];

    while (h <= endH) {
      list.push(`${String(h).padStart(2, "0")}:00`);
      h++;
    }
    return list;
  }

  function isPast(day) {
    return (
      new Date(currentYear, currentMonth, day) <
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
  }

  function isAfterLimit(day) {
    return (
      new Date(currentYear, currentMonth, day) >
      new Date(MAX_BOOKING_YEAR, MAX_BOOKING_MONTH, MAX_BOOKING_DAY)
    );
  }

  function getDayStatus(day) {
    if (isPast(day)) return "past";
    if (isAfterLimit(day)) return "future";

    const weekday = new Date(currentYear, currentMonth, day).getDay();
    const hours = openingHoursConfig[weekday];
    if (!hours) return "closed";

    const key = formatDateKey(currentYear, currentMonth, day);
    const reserved = reservedSlots[key] || [];
    const total = generateHours(hours[0], hours[1]);

    return reserved.length >= total.length ? "full" : "available";
  }

  /* Days of month */
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const offset = (firstDay + 6) % 7;

  const selectedDateKey = selectedDate
    ? formatDateKey(currentYear, currentMonth, selectedDate)
    : null;

  const weekday =
    selectedDate !== null
      ? new Date(currentYear, currentMonth, selectedDate).getDay()
      : null;

  const todayHours = weekday !== null ? openingHoursConfig[weekday] : null;
  const hours =
    selectedDate && todayHours && !isAfterLimit(selectedDate)
      ? generateHours(todayHours[0], todayHours[1])
      : [];

  /* Change month */
  function nextMonth() {
    setSelectedDate(null);
    setSelectedHour(null);
    let m = currentMonth + 1;
    let y = currentYear;
    if (m > 11) {
      m = 0;
      y++;
    }
    setCurrentMonth(m);
    setCurrentYear(y);
  }

  function prevMonth() {
    setSelectedDate(null);
    setSelectedHour(null);
    let m = currentMonth - 1;
    let y = currentYear;
    if (m < 0) {
      m = 11;
      y--;
    }
    setCurrentMonth(m);
    setCurrentYear(y);
  }

  /* Submit */
  async function submit() {
    setErrorMsg("");
    setSuccessMsg("");

    if (!selectedDate || !selectedHour || !selectedService) {
      return setErrorMsg(t("reserve_error_missing"));
    }

    if (!fullName || !email || !phone) {
      return setErrorMsg(t("reserve_error_required_fields"));
    }

    if (isAfterLimit(selectedDate)) {
      return setErrorMsg(t("reserve_error_future_limit"));
    }

    setLoading(true);
    try {
      const result = await sendReservation({
        full_name: fullName,
        email,
        phone,
        license_plate: licensePlate,
        service_type: selectedService,
        date: selectedDateKey,
        time: selectedHour,
        message,
      });

      if (result.success) {
        setSuccessMsg(t("reserve_success"));
        setErrorMsg("");
      } else {
        setErrorMsg(result.error || t("reserve_error_server"));
      }
    } catch (e) {
      console.error("Reservation submit error:", e);
      setErrorMsg(t("reserve_error_server"));
    } finally {
      setLoading(false);
    }
  }

  /* Services */
  const servicesList = [
    t("srv_maintenance"),
    t("srv_oil"),
    t("srv_diag"),
    t("srv_repair"),
    t("srv_chain"),
    t("srv_ac"),
    t("srv_brake"),
  ];

  return (
    <div className="reservation-wrapper">
      <h1 className="reservation-title">{t("reserve_title")}</h1>
      <p className="reservation-subtitle">{t("reserve_subtitle")}</p>

      <div className="reservation-layout">
        {/* CALENDAR */}
        <div className="reservation-card calendar-card">
          <div className="calendar-header">
            <button onClick={prevMonth}>{"<"}</button>
            <h3>
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <button onClick={nextMonth}>{">"}</button>
          </div>

          <div className="calendar-weekdays">
            {weekdayLabels.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {Array.from({ length: offset }).map((_, i) => (
              <div key={i} className="calendar-day empty" />
            ))}

            {days.map((day) => {
              const status = getDayStatus(day);
              const cls =
                status === "past"
                  ? "calendar-day past"
                  : status !== "available"
                  ? "calendar-day unavailable"
                  : "calendar-day available";

              return (
                <div
                  key={day}
                  className={`${cls} ${
                    selectedDate === day ? "selected" : ""
                  }`}
                  onClick={() => {
                    if (!cls.includes("available")) return;
                    setSelectedDate(day);
                    setSelectedHour(null);
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <h4 className="hours-title">{t("reserve_select_hour")}</h4>

          {!selectedDate && <p>{t("reserve_select_date")}</p>}
          {selectedDate && isAfterLimit(selectedDate) && (
            <p>{t("reserve_future_limit")}</p>
          )}

          {selectedDate && todayHours && !isAfterLimit(selectedDate) && (
            <div className="hours-grid">
              {hours.map((h) => {
                const taken = reservedSlots[selectedDateKey]?.includes(h);
                const cls =
                  "hour-button " +
                  (selectedHour === h ? "hour-selected " : "") +
                  (taken ? "hour-booked" : "");

                return (
                  <div
                    key={h}
                    className={cls}
                    onClick={() => !taken && setSelectedHour(h)}
                  >
                    {h}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FORM */}
        <div className="reservation-card">
          <div className="service-card">
            <h3>{t("reserve_service_type")}</h3>

            <div className="services-grid">
              {servicesList.map((srv) => (
                <div
                  key={srv}
                  className={
                    "service-option " +
                    (selectedService === srv ? "service-option--selected" : "")
                  }
                  onClick={() => setSelectedService(srv)}
                >
                  {srv}
                </div>
              ))}
            </div>
          </div>

          <div className="reservation-form-grid">
            {/* FULL NAME */}
            <label className="form-label">
              <span className="form-label-title">
                {t("reserve_fullname")}
              </span>
              <input
                className="glass-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>

            {/* EMAIL */}
            <label className="form-label">
              <span className="form-label-title">Email</span>
              <input
                type="email"
                className="glass-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse e-mail"
                required
              />
            </label>

            {/* PHONE */}
            <label className="form-label">
              <span className="form-label-title">{t("reserve_phone")}</span>
              <input
                className="glass-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>

            {/* PLATE */}
            <label className="form-label">
  <span className="form-label-title">{t("reserve_plate")}</span>
  <input
    className="glass-input"
    value={licensePlate}
    onChange={(e) => setLicensePlate(e.target.value)}
    placeholder="ex: 1-ABC-123 ou 1ABC123"
  />
</label>


            {/* MESSAGE */}
            <label className="form-label full-row">
              <span className="form-label-title">{t("reserve_message")}</span>
              <textarea
                className="glass-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>

            <button disabled={loading} onClick={submit}>
              {loading ? t("reserve_sending") : t("reserve_confirm")}
            </button>

            {errorMsg && (
              <p style={{ color: "red", marginTop: 6 }}>{errorMsg}</p>
            )}
            {successMsg && (
              <p style={{ color: "lime", marginTop: 6 }}>{successMsg}</p>
            )}
          </div>
        </div>
      </div>

      <Link href="/" className="back-home-btn">
        <i className="fa-solid fa-wrench"></i> {t("reserve_back")}
      </Link>
    </div>
  );
}
