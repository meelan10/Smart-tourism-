import { useState } from "react";
import { destinations, hotels, guides, safetyAlerts, emergencyContacts, mockReviews } from "../data/mockData";
import { DestinationCard, HotelCard, GuideCard } from "../components/Cards";
import { api, saveToken, clearToken } from "../api";
import { useLang } from "../context/LangContext";


export function SearchPage({ navigate, pageParams }) {
  const { t } = useLang();
  const [query, setQuery] = useState(pageParams?.q || "");
  const [filter, setFilter] = useState("all");
  const [submitted, setSubmitted] = useState(!!pageParams?.q);

  const q = query.toLowerCase().trim();
  const results =
    submitted && q
      ? {
          destinations: destinations.filter(
            (d) =>
              d.name.toLowerCase().includes(q) ||
              d.city.toLowerCase().includes(q) ||
              d.short_description?.toLowerCase().includes(q)
          ),
          hotels: hotels.filter(
            (h) =>
              h.name.toLowerCase().includes(q) ||
              h.destination.city.toLowerCase().includes(q)
          ),
          guides: guides.filter(
            (g) =>
              g.name.toLowerCase().includes(q) ||
              g.specialties?.toLowerCase().includes(q) ||
              g.languages?.toLowerCase().includes(q)
          ),
        }
      : null;

  const total = results
    ? results.destinations.length + results.hotels.length + results.guides.length
    : 0;

  const show = (k) => filter === "all" || filter === k;

  return (
    <div>
      <div className="search-hero">
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <h1
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: "2.5rem",
              marginBottom: 24,
              fontFamily: "'Playfair Display',serif",
            }}
          >
            🔍 {t("search_discover")}
          </h1>

          <div className="hero-search" style={{ maxWidth: 800 }}>
            <i
              className="fas fa-search"
              style={{
                color: "rgba(255,255,255,0.7)",
                marginLeft: 8,
                fontSize: "1.1rem",
                flexShrink: 0,
              }}
            ></i>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSubmitted(true)}
              placeholder={t("search_placeholder_full")}
              autoFocus
            />

            <button className="clay-btn clay-btn-gold" onClick={() => setSubmitted(true)}>
              <i className="fas fa-search"></i> {t("search")}
            </button>
          </div>

          {submitted && q && (
            <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 12, fontWeight: 600 }}>
              {t("showing_results_for")}{" "}
              <strong style={{ color: "#fff" }}>{query}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: "60px 24px" }}>
        {submitted && results ? (
          <>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
              {[
                { k: "all", l: t("all_results"), n: total },
                { k: "destinations", l: t("destinations"), n: results.destinations.length },
                { k: "hotels", l: t("hotels"), n: results.hotels.length },
                { k: "guides", l: t("guides"), n: results.guides.length },
              ].map((f) => (
                <button
                  key={f.k}
                  className={`filter-chip${filter === f.k ? " active" : ""}`}
                  onClick={() => setFilter(f.k)}
                >
                  {f.l} ({f.n})
                </button>
              ))}
            </div>

            {total === 0 ? (
              <div className="clay-card text-center" style={{ padding: 80 }}>
                <div style={{ fontSize: "5rem", marginBottom: 20 }}>😔</div>
                <h4 style={{ fontWeight: 800, marginBottom: 12, color: "var(--text)" }}>
                  {t("no_results_found")}
                </h4>
                <p style={{ color: "var(--text3)", fontWeight: 600, marginBottom: 24 }}>
                  {t("try_different_keywords")}
                </p>

                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="clay-btn clay-btn-blue" onClick={() => navigate("destinations")}>
                    📍 {t("browse_destinations")}
                  </button>
                  <button className="clay-btn clay-btn-gold" onClick={() => navigate("hotels")}>
                    🏨 {t("browse_hotels")}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {show("destinations") && results.destinations.length > 0 && (
                  <div style={{ marginBottom: 48 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 24,
                      }}
                    >
                      <h4 style={{ fontWeight: 800, color: "var(--text)", margin: 0 }}>
                        📍 {t("destinations")}
                      </h4>
                      <span
                        style={{
                          background: "linear-gradient(135deg,var(--clay-red),var(--clay-gold))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontWeight: 800,
                        }}
                      >
                        {results.destinations.length} {t("found")}
                      </span>
                    </div>

                    <div className="grid-3">
                      {results.destinations.map((d, i) => (
                        <DestinationCard key={d.id} dest={d} navigate={navigate} delay={i * 0.04} />
                      ))}
                    </div>
                  </div>
                )}

                {show("hotels") && results.hotels.length > 0 && (
                  <div style={{ marginBottom: 48 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 24,
                      }}
                    >
                      <h4 style={{ fontWeight: 800, color: "var(--text)", margin: 0 }}>
                        🏨 {t("hotels")}
                      </h4>
                      <span
                        style={{
                          background: "linear-gradient(135deg,var(--clay-red),var(--clay-gold))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontWeight: 800,
                        }}
                      >
                        {results.hotels.length} {t("found")}
                      </span>
                    </div>

                    <div className="grid-3">
                      {results.hotels.map((h, i) => (
                        <HotelCard key={h.id} hotel={h} navigate={navigate} delay={i * 0.04} />
                      ))}
                    </div>
                  </div>
                )}

                {show("guides") && results.guides.length > 0 && (
                  <div style={{ marginBottom: 48 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 24,
                      }}
                    >
                      <h4 style={{ fontWeight: 800, color: "var(--text)", margin: 0 }}>
                        👨‍💼 {t("guides")}
                      </h4>
                      <span
                        style={{
                          background: "linear-gradient(135deg,var(--clay-red),var(--clay-gold))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontWeight: 800,
                        }}
                      >
                        {results.guides.length} {t("found")}
                      </span>
                    </div>

                    <div className="grid-4">
                      {results.guides.map((g, i) => (
                        <GuideCard key={g.id} guide={g} navigate={navigate} delay={i * 0.05} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="clay-card text-center" style={{ padding: 80 }}>
            <div style={{ fontSize: "5rem", marginBottom: 20 }}>🔍</div>
            <h4 style={{ fontWeight: 800, marginBottom: 12, color: "var(--text)" }}>
              {t("start_your_search")}
            </h4>
            <p style={{ color: "var(--text3)", fontWeight: 600 }}>{t("search_page_sub")}</p>
          </div>
        )}
      </div>
    </div>
  );
}


const generalTips = [
  { icon: "fa-mountain", title_key: "safety_tip_altitude", content_key: "safety_tip_altitude_desc" },
  { icon: "fa-id-card", title_key: "safety_tip_documents", content_key: "safety_tip_documents_desc" },
  { icon: "fa-first-aid", title_key: "safety_tip_medical", content_key: "safety_tip_medical_desc" },
  { icon: "fa-wifi", title_key: "safety_tip_connected", content_key: "safety_tip_connected_desc" },
  { icon: "fa-tint", title_key: "safety_tip_water", content_key: "safety_tip_water_desc" },
  { icon: "fa-paw", title_key: "safety_tip_wildlife", content_key: "safety_tip_wildlife_desc" },
];

const ecClass = {
  police: "ec-police",
  tourist_police: "ec-tourist_police",
  ambulance: "ec-ambulance",
  fire: "ec-fire",
  hospital: "ec-hospital",
};

const ecIcon = {
  police: "fa-shield-alt",
  tourist_police: "fa-user-shield",
  ambulance: "fa-ambulance",
  fire: "fa-fire-extinguisher",
  hospital: "fa-hospital",
};

export function SafetyPage({ navigate }) {
  const { t } = useLang();
  const [selDest, setSelDest] = useState("");

  const destAlerts = safetyAlerts.filter((a) => !selDest || String(a.destination?.id) === selDest);
  const globalAlerts = safetyAlerts.filter(() => !selDest);

  return (
    <div>
      <div className="page-header">
        <div className="inner container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a onClick={() => navigate("home")}>{t("home")}</a>
            </li>
            <li className="breadcrumb-item">{t("safety")}</li>
          </ol>

          <h1>🛡️ {t("safety_information")}</h1>
          <p>{t("safety_page_sub")}</p>
        </div>
      </div>

      <div className="container section">
        <div className="clay-card mb-48" style={{ padding: 32 }}>
          <h5 style={{ fontWeight: 800, marginBottom: 20, color: "var(--text)" }}>
            🔍 {t("find_safety_info")}
          </h5>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <select
              className="clay-select"
              style={{ flex: 1, minWidth: 280, marginBottom: 0 }}
              value={selDest}
              onChange={(e) => setSelDest(e.target.value)}
            >
              <option value="">{t("select_destination")}</option>
              {destinations.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name} — {d.city}
                </option>
              ))}
            </select>

            {selDest && (
              <button className="clay-btn clay-btn-outline" onClick={() => setSelDest("")}>
                ✕ {t("clear")}
              </button>
            )}
          </div>
        </div>

        {(!selDest ? globalAlerts : destAlerts).length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h4 style={{ fontWeight: 800, marginBottom: 24, color: "var(--text)" }}>
              ⚠️ {t("active_travel_alerts")}
            </h4>

            <div className="grid-2">
              {(!selDest ? globalAlerts : destAlerts).map((alert) => (
                <div key={alert.id} className={`alert-strip alert-${alert.level}`}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background:
                        alert.level === "critical"
                          ? "#dc2626"
                          : alert.level === "high"
                          ? "#f59e0b"
                          : alert.level === "medium"
                          ? "#3b82f6"
                          : "#10b981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      border: "2px solid rgba(255,255,255,0.3)",
                      boxShadow: "3px 3px 0px rgba(0,0,0,0.1)",
                    }}
                  >
                    <i
                      className={`fas fa-${
                        alert.level === "critical"
                          ? "skull"
                          : alert.level === "high"
                          ? "exclamation"
                          : alert.level === "medium"
                          ? "info"
                          : "check"
                      }`}
                      style={{ color: "#fff", fontSize: "0.85rem" }}
                    ></i>
                  </div>

                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                      <strong style={{ color: "var(--text)", fontWeight: 800 }}>{alert.title}</strong>
                      <span
                        className={`badge badge-${alert.level === "critical" || alert.level === "high" ? "red" : "blue"}`}
                        style={{ fontSize: "0.65rem" }}
                      >
                        {alert.level.toUpperCase()}
                      </span>
                    </div>

                    <p style={{ margin: "0 0 4px", fontSize: "0.875rem", color: "var(--text2)", fontWeight: 500 }}>
                      {alert.description}
                    </p>

                    <small style={{ color: "var(--text3)", fontWeight: 600 }}>
                      📍 {alert.destination?.city}, {alert.destination?.country}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 48 }}>
          <h4 style={{ fontWeight: 800, marginBottom: 24, color: "var(--text)" }}>
            📞 {t("emergency_contacts")}
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
            {emergencyContacts.map((c) => (
              <div key={c.id} className={`emergency-card ${ecClass[c.service_type] || "ec-default"}`}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <i className={`fas ${ecIcon[c.service_type] || "fa-phone"}`} style={{ fontSize: "1.4rem" }}></i>
                  <div>
                    <div style={{ fontWeight: 800 }}>{c.name}</div>
                    <small style={{ opacity: 0.75 }}>{t(`service_${c.service_type}`)}</small>
                  </div>
                </div>

                <div style={{ fontSize: "1.9rem", fontWeight: 900, marginBottom: 4, fontFamily: "'Playfair Display',serif" }}>
                  {c.phone}
                </div>

                {c.address && <small style={{ opacity: 0.75 }}>📍 {c.address}</small>}

                {c.available_24h && (
                  <div style={{ marginTop: 10 }}>
                    <span
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        padding: "3px 12px",
                        borderRadius: 99,
                        fontSize: "0.75rem",
                        fontWeight: 800,
                      }}
                    >
                      ⏰ {t("available_24_7")}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h4 style={{ fontWeight: 800, marginBottom: 24, color: "var(--text)" }}>
            💡 {t("general_travel_safety_tips")}
          </h4>

          <div className="grid-3">
            {generalTips.map((tip) => (
              <div key={tip.title_key} className="clay-card" style={{ padding: 22 }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: "linear-gradient(135deg,var(--clay-blue),var(--clay-purple))",
                      borderRadius: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      border: "2px solid rgba(0,0,0,0.08)",
                      boxShadow: "3px 3px 0px rgba(0,0,0,0.1)",
                    }}
                  >
                    <i className={`fas ${tip.icon}`} style={{ color: "#fff", fontSize: "0.9rem" }}></i>
                  </div>

                  <div>
                    <strong style={{ display: "block", marginBottom: 4, color: "var(--text)", fontWeight: 800 }}>
                      {t(tip.title_key)}
                    </strong>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.875rem",
                        color: "var(--text3)",
                        fontWeight: 500,
                        lineHeight: 1.6,
                      }}
                    >
                      {t(tip.content_key)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg,#dc2626,#991b1b)",
            borderRadius: 24,
            padding: 48,
            textAlign: "center",
            border: "3px solid rgba(0,0,0,0.08)",
            boxShadow: "var(--clay-shadow-lg)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>📞</div>
          <h4
            style={{
              color: "#fff",
              fontWeight: 900,
              marginBottom: 8,
              fontFamily: "'Playfair Display',serif",
            }}
          >
            {t("international_emergency")}
          </h4>

          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 28, fontWeight: 600 }}>
            {t("international_emergency_sub")}
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
            {[
              ["112", t("region_europe_global")],
              ["911", t("region_usa_canada")],
              ["999", t("region_uk_australia")],
            ].map(([n, l]) => (
              <div key={n} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "2.2rem",
                    fontWeight: 900,
                    color: "#fff",
                    fontFamily: "'Playfair Display',serif",
                  }}
                >
                  {n}
                </div>
                <small style={{ color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>{l}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ ABOUT ═══ */
export function AboutPage({ navigate }) {
  const { t } = useLang();

  return (
    <div>
      <div className="page-header">
        <div className="inner container">
          <h1>🏔️ {t("about_us")}</h1>
          <p>{t("your_smart_travel_companion")}</p>
        </div>
      </div>

      <div className="container section">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginBottom: 64 }}>
          <div>
            <div className="section-badge">{t("our_mission")}</div>
            <h2 className="section-title" style={{ marginTop: 8, marginBottom: 20 }}>
              {t("mission_title")}
            </h2>

            <p style={{ color: "var(--text2)", lineHeight: 1.8, marginBottom: 16, fontWeight: 500 }}>
              {t("about_para_1")}
            </p>
            <p style={{ color: "var(--text2)", lineHeight: 1.8, fontWeight: 500 }}>
              {t("about_para_2")}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { g: "linear-gradient(135deg,#4361ee,#7c3aed)", icon: "fa-map-marked-alt", l: t("stat_500_destinations") },
              { g: "linear-gradient(135deg,#f59e0b,#ef4444)", icon: "fa-hotel", l: t("stat_1200_hotels") },
              { g: "linear-gradient(135deg,#06d6a0,#059669)", icon: "fa-user-tie", l: t("stat_300_guides") },
              { g: "linear-gradient(135deg,#e84855,#991b1b)", icon: "fa-shield-alt", l: t("stat_24_7_safety") },
            ].map((item) => (
              <div
                key={item.l}
                style={{
                  background: item.g,
                  borderRadius: 20,
                  padding: 24,
                  textAlign: "center",
                  border: "3px solid rgba(0,0,0,0.08)",
                  boxShadow: "var(--clay-shadow)",
                }}
              >
                <i className={`fas ${item.icon}`} style={{ color: "#fff", fontSize: "2rem", marginBottom: 8, display: "block" }}></i>
                <div style={{ color: "#fff", fontWeight: 800 }}>{item.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-32">
          <div className="section-badge">{t("why_choose_us")}</div>
          <h2 className="section-title" style={{ marginTop: 8 }}>
            {t("features_title")}
          </h2>
        </div>

        <div className="grid-3">
          {[
            { e: "🌍", tkey: "why_all_in_one", dkey: "why_all_in_one_desc" },
            { e: "🗺️", tkey: "why_maps", dkey: "why_maps_desc" },
            { e: "🌐", tkey: "why_multilingual", dkey: "why_multilingual_desc" },
            { e: "🛡️", tkey: "why_safety", dkey: "why_safety_desc" },
            { e: "⭐", tkey: "why_reviews", dkey: "why_reviews_desc" },
            { e: "📱", tkey: "why_mobile", dkey: "why_mobile_desc" },
          ].map((f) => (
            <div key={f.tkey} className="clay-card" style={{ padding: 28 }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>{f.e}</div>
              <h5 style={{ fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>{t(f.tkey)}</h5>
              <p style={{ color: "var(--text3)", fontSize: "0.875rem", margin: 0, fontWeight: 500, lineHeight: 1.6 }}>
                {t(f.dkey)}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "linear-gradient(135deg,#1a0533,#1a0505)",
            borderRadius: 28,
            padding: 56,
            textAlign: "center",
            marginTop: 60,
            border: "3px solid rgba(255,255,255,0.08)",
            boxShadow: "var(--clay-shadow-lg)",
          }}
        >
          <h3
            style={{
              color: "#fff",
              fontWeight: 900,
              marginBottom: 12,
              fontFamily: "'Playfair Display',serif",
              fontSize: "2rem",
            }}
          >
            {t("ready_explore")}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 28, fontWeight: 600 }}>{t("ready_sub")}</p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="clay-btn clay-btn-gold clay-btn-lg" onClick={() => navigate("destinations")}>
              🗺️ {t("explore_destinations")}
            </button>
            <button
              className="clay-btn clay-btn-outline clay-btn-lg"
              style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              onClick={() => navigate("contact")}
            >
              ✉️ {t("contact_us")}
            </button>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){.container.section>div:first-child{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

/* ═══ CONTACT ═══ */
export function ContactPage() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.contact(form);
    } catch {}
    setSent(true);
    setLoading(false);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div>
      <div className="page-header">
        <div className="inner container">
          <h1>📬 {t("contact_us")}</h1>
          <p>{t("contact_sub")}</p>
        </div>
      </div>

      <div className="container section">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 48, maxWidth: 960, margin: "0 auto" }}>
          <div>
            <h4 style={{ fontWeight: 800, marginBottom: 24, color: "var(--text)" }}>{t("get_in_touch")}</h4>

            {[
              { icon: "fa-envelope", label: t("email"), value: "support@nepal.com", g: "linear-gradient(135deg,#4361ee,#7209b7)" },
              { icon: "fa-phone", label: t("phone"), value: "+977-1-4256909", g: "linear-gradient(135deg,#f59e0b,#ef4444)" },
              { icon: "fa-clock", label: t("support_hours"), value: t("support_hours_value"), g: "linear-gradient(135deg,#06d6a0,#059669)" },
              { icon: "fa-map-marker-alt", label: t("address"), value: t("address_value"), g: "linear-gradient(135deg,#e84855,#991b1b)" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: item.g,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    border: "3px solid rgba(0,0,0,0.08)",
                    boxShadow: "4px 4px 0px rgba(0,0,0,0.1)",
                  }}
                >
                  <i className={`fas ${item.icon}`} style={{ color: "#fff" }}></i>
                </div>
                <div>
                  <strong style={{ display: "block", color: "var(--text)", fontWeight: 800 }}>{item.label}</strong>
                  <span style={{ color: "var(--text3)", fontWeight: 600 }}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="clay-card" style={{ padding: 40 }}>
            <h5 style={{ fontWeight: 800, marginBottom: 24, color: "var(--text)" }}>{t("send_message")}</h5>

            {sent && (
              <div
                style={{
                  padding: 14,
                  background: "rgba(6,214,160,0.12)",
                  border: "3px solid rgba(6,214,160,0.25)",
                  borderRadius: 14,
                  marginBottom: 20,
                  color: "var(--clay-green)",
                  fontWeight: 800,
                }}
              >
                ✓ {t("sent_success")}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 0 }}>
                <div>
                  <label className="form-lbl">{t("your_name")}</label>
                  <input
                    className="clay-input"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-lbl">{t("email")}</label>
                  <input
                    className="clay-input"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <label className="form-lbl">{t("subject")}</label>
              <input
                className="clay-input"
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />

              <label className="form-lbl">{t("message")}</label>
              <textarea
                className="clay-input"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                style={{ resize: "vertical" }}
              />

              <button type="submit" className="clay-btn clay-btn-red clay-btn-full clay-btn-lg mt-8" disabled={loading}>
                <i className={`fas ${loading ? "fa-spinner fa-spin" : "fa-paper-plane"}`}></i> {t("send")}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){.container.section>div{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

/* ═══ LOGIN ═══ */
export function LoginPage({ navigate, setUser }) {
  const { t } = useLang();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await api.login(form);

    if (res.access && res.refresh) {
      saveToken(res.access, res.refresh);

      const profile = await api.profile();

      setUser({
        id: profile.id,
        username: profile.username,
        firstName: profile.first_name || profile.username,
        lastName: profile.last_name || "",
        email: profile.email || "",
        is_staff: profile.is_staff,
        is_superuser: profile.is_superuser,
        isAdmin: profile.is_staff || profile.is_superuser,
      });

      navigate("home");
    } else {
      setError(t("invalid_username_password"));
      clearToken();
      setUser(null);
    }
  } catch (err) {
    const msg =
      typeof err === "object" && err !== null
        ? Object.values(err).flat().join(" ")
        : "";

    setError(msg || t("invalid_username_password"));
    clearToken();
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page">
      <div className="auth-bg"></div>
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 460, margin: "0 auto" }}>
        <div className="nepal-strip"></div>
        <div className="auth-card">
          <div className="auth-logo">🏔️</div>
          <h2 className="auth-title">{t("welcome_back")}</h2>
          <p className="auth-sub">{t("sign_in_continue")}</p>

          {error && (
            <div
              style={{
                padding: 12,
                background: "rgba(232,72,85,0.1)",
                border: "3px solid rgba(232,72,85,0.25)",
                borderRadius: 14,
                marginBottom: 16,
                color: "var(--clay-red)",
                fontWeight: 700,
                fontSize: "0.875rem",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { f: "username", l: t("username"), type: "text", i: "fa-user" },
              { f: "password", l: t("password"), type: "password", i: "fa-lock" },
            ].map(({ f, l, type, i }) => (
              <div key={f} className="auth-input-wrap">
                <label>{l}</label>
                <div style={{ position: "relative" }}>
                  <i className={`fas ${i} auth-input-icon`}></i>
                  <input
                    type={type}
                    className="clay-input"
                    placeholder={`${t("enter")} ${l.toLowerCase()}`}
                    value={form[f]}
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                    style={{ paddingLeft: 40, height: 50, marginBottom: 0 }}
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="clay-btn clay-btn-red clay-btn-full clay-btn-lg mt-8"
              style={{ height: 52 }}
              disabled={loading}
            >
              <i className={`fas ${loading ? "fa-spinner fa-spin" : "fa-sign-in-alt"}`}></i>{" "}
              {loading ? t("signing_in") : t("sign_in")}
            </button>
          </form>

          <div className="auth-divider">{t("or")}</div>

          <p style={{ textAlign: "center", color: "var(--text3)", fontSize: "0.9rem", fontWeight: 600 }}>
            {t("dont_have_account")}{" "}
            <span className="auth-link" onClick={() => navigate("register")}>
              {t("sign_up_free")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══ REGISTER ═══ */
export function RegisterPage({ navigate, setUser }) {
  const { t } = useLang();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.password2) {
    setError(t("passwords_not_match"));
    return;
  }

  if (form.password.length < 8) {
    setError(t("password_min_8"));
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await api.register({
      username: form.username,
      email: form.email,
      password: form.password,
      password2: form.password2,
      first_name: form.firstName,
      last_name: form.lastName,
    });

    if (res.access || res.user) {
      clearToken();
      setUser(null);
      alert("Account created successfully. Please sign in.");
      navigate("login");
    } else {
      const msg = typeof res === "object" && res !== null
        ? Object.values(res).flat().join(" ")
        : "";
      setError(msg || t("registration_failed"));
    }
  } catch (err) {
    const msg =
      typeof err === "object" && err !== null
        ? Object.values(err).flat().join(" ")
        : "";
    setError(msg || t("registration_failed"));
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page">
      <div className="auth-bg"></div>
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 520, margin: "0 auto" }}>
        <div className="nepal-strip"></div>
        <div className="auth-card">
          <div className="auth-logo">🏔️</div>
          <h2 className="auth-title">{t("join_tourtech")}</h2>
          <p className="auth-sub">{t("create_free_account")}</p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
            {[t("free_forever"), t("save_favorites"), t("write_reviews")].map((p) => (
              <span key={p} style={{ fontSize: "0.78rem", color: "var(--clay-green)", fontWeight: 800 }}>
                {p}
              </span>
            ))}
          </div>

          {error && (
            <div
              style={{
                padding: 12,
                background: "rgba(232,72,85,0.1)",
                border: "3px solid rgba(232,72,85,0.25)",
                borderRadius: 14,
                marginBottom: 16,
                color: "var(--clay-red)",
                fontWeight: 700,
                fontSize: "0.875rem",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { f: "firstName", l: t("first_name") },
                { f: "lastName", l: t("last_name") },
              ].map(({ f, l }) => (
                <div key={f} className="auth-input-wrap">
                  <label>{l}</label>
                  <div style={{ position: "relative" }}>
                    <i className="fas fa-user auth-input-icon"></i>
                    <input
                      className="clay-input"
                      placeholder={l}
                      value={form[f]}
                      onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                      style={{ paddingLeft: 40, height: 50, marginBottom: 0 }}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            {[
              { f: "username", l: t("username"), type: "text", i: "fa-user" },
              { f: "email", l: t("email"), type: "email", i: "fa-envelope" },
              { f: "password", l: t("password"), type: "password", i: "fa-lock" },
              { f: "password2", l: t("confirm_password"), type: "password", i: "fa-lock" },
            ].map(({ f, l, type, i }) => (
              <div key={f} className="auth-input-wrap">
                <label>{l}</label>
                <div style={{ position: "relative" }}>
                  <i className={`fas ${i} auth-input-icon`}></i>
                  <input
                    type={type}
                    className="clay-input"
                    placeholder={l}
                    value={form[f]}
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                    style={{ paddingLeft: 40, height: 50, marginBottom: 0 }}
                    required
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="clay-btn clay-btn-red clay-btn-full clay-btn-lg mt-8"
              style={{ height: 52 }}
              disabled={loading}
            >
              <i className={`fas ${loading ? "fa-spinner fa-spin" : "fa-user-plus"}`}></i>{" "}
              {loading ? t("creating") : t("create_account")}
            </button>
          </form>

          <div className="auth-divider">{t("or")}</div>

          <p style={{ textAlign: "center", color: "var(--text3)", fontSize: "0.9rem", fontWeight: 600 }}>
            {t("already_have_account")}{" "}
            <span className="auth-link" onClick={() => navigate("login")}>
              {t("sign_in")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

