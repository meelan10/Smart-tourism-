import { useState, useEffect, useRef, useMemo } from "react";
import { destinations, hotels, guides, categories, testimonials } from "../data/mockData";
import { DestinationCard, HotelCard, GuideCard } from "../components/Cards";
import { useLang } from "../context/LangContext";
import { api } from "../api";

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

function Counter({ target, suffix = "" }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          let start = null;
          const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / 1800, 1);
            setN(Math.floor((1 - Math.pow(1 - p, 3)) * target));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

function RotatingWord() {
  const { t } = useLang();
  const words = [
    t("hero_word_1"),
    t("hero_word_2"),
    t("hero_word_3"),
    t("hero_word_4"),
    t("hero_word_5"),
    t("hero_word_6"),
  ];

  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setVis(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % words.length);
        setVis(true);
      }, 300);
    }, 2200);
    return () => clearInterval(iv);
  }, [words.length]);

  return (
    <span
      style={{
        display: "inline-block",
        background: "linear-gradient(135deg,#ffd166,#ff7b54,#ff4d6d)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(-10px)",
      }}
    >
      {words[idx]}
    </span>
  );
}

function TestimonialsSection() {
  const { t } = useLang();
  const [paused, setPaused] = useState(false);

  return (
    <section
      style={{
        background: "linear-gradient(135deg,#141e30,#243b55)",
        padding: "84px 0",
        overflow: "hidden",
      }}
    >
      <div className="container">
        <div className="text-center mb-48 reveal">
          <div
            className="section-badge"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              border: "2px solid rgba(255,255,255,0.12)",
            }}
          >
            💬 {t("testimonials_title")}
          </div>
          <h2 className="section-title" style={{ color: "#fff", marginTop: 10 }}>
            {t("testimonials_title")}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.62)", fontWeight: 600 }}>
            {t("testimonials_sub")}
          </p>
        </div>
      </div>

      <div
        style={{ overflow: "hidden" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          style={{
            display: "flex",
            gap: 24,
            width: "max-content",
            animation: "scrollX 36s linear infinite",
            animationPlayState: paused ? "paused" : "running",
            padding: "0 24px 10px",
          }}
        >
          {[...testimonials, ...testimonials].map((item, i) => (
            <div
              key={i}
              style={{
                width: 340,
                flexShrink: 0,
                background: "linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))",
                border: "2px solid rgba(255,255,255,0.1)",
                borderRadius: 24,
                padding: 28,
                backdropFilter: "blur(10px)",
                boxShadow: "10px 10px 0 rgba(0,0,0,0.18)",
              }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
                <img
                  src={item.avatar}
                  alt={item.name}
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid rgba(255,209,102,0.45)",
                  }}
                />
                <div>
                  <div style={{ color: "#fff", fontWeight: 800 }}>{item.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", fontWeight: 600 }}>
                    {item.country}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ color: "#ffd166", fontSize: "0.92rem" }}>★</span>
                ))}
              </div>

              <p
                style={{
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  fontWeight: 500,
                  marginBottom: 14,
                }}
              >
                “{item.text}”
              </p>

              <span
                style={{
                  fontSize: "0.72rem",
                  background: "rgba(255,209,102,0.12)",
                  color: "#ffd166",
                  padding: "4px 10px",
                  borderRadius: 99,
                  fontWeight: 800,
                  border: "1px solid rgba(255,209,102,0.22)",
                }}
              >
                📍 {item.destination}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await api.newsletter(email);
    } catch {}
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3500);
  };

  return (
    <section
      style={{
        background: "linear-gradient(135deg,#1f1c2c,#928dab)",
        padding: "84px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container">
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }} className="reveal">
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>📬</div>
          <div
            className="section-badge"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              border: "2px solid rgba(255,255,255,0.15)",
            }}
          >
            {t("newsletter_badge")}
          </div>

          <h2 style={{ color: "#fff", marginTop: 12, marginBottom: 12, fontSize: "2.2rem", fontWeight: 900 }}>
            {t("newsletter_title")}
          </h2>

          <p style={{ color: "rgba(255,255,255,0.65)", fontWeight: 600, lineHeight: 1.7, marginBottom: 30 }}>
            {t("newsletter_sub")}
          </p>

          {done ? (
            <div
              style={{
                padding: "16px 24px",
                background: "rgba(6,214,160,0.12)",
                border: "3px solid rgba(6,214,160,0.28)",
                borderRadius: 16,
                color: "#06d6a0",
                fontWeight: 800,
              }}
            >
              ✅ {t("newsletter_success")}
            </div>
          ) : (
            <form
              onSubmit={submit}
              style={{
                display: "flex",
                gap: 10,
                maxWidth: 520,
                margin: "0 auto",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("newsletter_placeholder")}
                required
                style={{
                  flex: 1,
                  minWidth: 260,
                  padding: "14px 18px",
                  borderRadius: 16,
                  border: "3px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
              <button type="submit" className="clay-btn clay-btn-gold" style={{ height: 52, padding: "0 26px" }}>
                <i className="fas fa-paper-plane"></i> {t("subscribe")}
              </button>
            </form>
          )}

          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", marginTop: 14, fontWeight: 600 }}>
            {t("newsletter_note")}
          </p>
        </div>
      </div>
    </section>
  );
}

function PlannerStrip({ navigate }) {
  const { t } = useLang();
  const [plan, setPlan] = useState({
    type: "",
    budget: "",
    duration: "",
  });

  const handlePlan = () => {
    navigate("search", {
      q: [plan.type, plan.budget, plan.duration].filter(Boolean).join(" "),
    });
  };

  return (
    <section style={{ padding: "28px 0", background: "var(--bg2)" }}>
      <div className="container">
        <div
          className="clay-card reveal"
          style={{
            padding: 22,
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr auto",
            gap: 12,
            alignItems: "end",
          }}
        >
          <div>
            <label className="form-lbl">Trip Type</label>
            <select className="clay-select" value={plan.type} onChange={(e) => setPlan({ ...plan, type: e.target.value })}>
              <option value="">Any</option>
              <option value="trekking">Trekking</option>
              <option value="culture">Culture</option>
              <option value="wildlife">Wildlife</option>
              <option value="city">City</option>
            </select>
          </div>

          <div>
            <label className="form-lbl">Budget</label>
            <select className="clay-select" value={plan.budget} onChange={(e) => setPlan({ ...plan, budget: e.target.value })}>
              <option value="">Any</option>
              <option value="budget">Budget</option>
              <option value="mid-range">Mid-range</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div>
            <label className="form-lbl">Duration</label>
            <select className="clay-select" value={plan.duration} onChange={(e) => setPlan({ ...plan, duration: e.target.value })}>
              <option value="">Any</option>
              <option value="2 days">2 days</option>
              <option value="1 week">1 week</option>
              <option value="2 weeks">2 weeks</option>
            </select>
          </div>

          <button className="clay-btn clay-btn-red" onClick={handlePlan}>
            <i className="fas fa-route"></i> Plan Trip
          </button>
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ navigate }) {
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [showSuggest, setShowSuggest] = useState(false);
  useReveal();

  const q = query.trim().toLowerCase();

  const heroSuggestions = useMemo(() => {
    if (!q) return [];
    return destinations
      .filter((d) => {
        const name = t(d.name_key || d.name).toLowerCase();
        const city = t(d.city_key || d.city).toLowerCase();
        const desc = t(d.short_description_key || d.short_description || "").toLowerCase();
        return name.includes(q) || city.includes(q) || desc.includes(q);
      })
      .slice(0, 5);
  }, [q, t]);

  const filtered =
    activeCat === "all"
      ? destinations
      : destinations.filter((d) => {
          const categoryValue = (d.category?.slug || d.category?.name_key || d.category?.name || "").toLowerCase();
          return categoryValue === activeCat.toLowerCase();
        });

  const featuredDestinations = [...filtered]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const featuredHotels = [...hotels]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const quickNav = [
    { icon: "fa-mountain", label: t("trekking"), page: "destinations" },
    { icon: "fa-om", label: t("temples"), page: "destinations" },
    { icon: "fa-water", label: t("lakes"), page: "destinations" },
    { icon: "fa-bus", label: t("transport"), page: "transport" },
    { icon: "fa-user-tie", label: t("guides"), page: "guides" },
  ];

  const whyCards = [
    { e: "🌍", t2: t("why_all_in_one"), d: t("why_all_in_one_desc"), bg: "linear-gradient(135deg,#667eea,#764ba2)" },
    { e: "🗺️", t2: t("why_maps"), d: t("why_maps_desc"), bg: "linear-gradient(135deg,#f7971e,#ffd200)" },
    { e: "🛡️", t2: t("why_safety"), d: t("why_safety_desc"), bg: "linear-gradient(135deg,#ff5f6d,#ffc371)" },
    { e: "🌐", t2: t("why_multilingual"), d: t("why_multilingual_desc"), bg: "linear-gradient(135deg,#11998e,#38ef7d)" },
    { e: "⭐", t2: t("why_reviews"), d: t("why_reviews_desc"), bg: "linear-gradient(135deg,#f6d365,#fda085)" },
    { e: "📱", t2: t("why_mobile"), d: t("why_mobile_desc"), bg: "linear-gradient(135deg,#36d1dc,#5b86e5)" },
  ];

  return (
    <div>
      <section
        style={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          background: "#0a0510",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.32,
            animation: "heroZoom 22s ease-in-out infinite alternate",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(160deg,#0f0c29 0%,#302b63 50%,#24243e 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(255,94,98,0.35),transparent 70%)",
            top: "-10%",
            right: "-5%",
            animation: "blobFloat 10s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(99,102,241,0.25),transparent 70%)",
            bottom: "-5%",
            left: "-5%",
            animation: "blobFloat 13s ease-in-out infinite reverse",
          }}
        />

        <div style={{ position: "relative", zIndex: 2, width: "100%", paddingTop: "8vh" }}>
          <div
            className="container hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 0.95fr",
              alignItems: "center",
              gap: 28,
              minHeight: "82vh",
            }}
          >
            <div>
              <div
                className="section-badge anim-fadeup stagger-1"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                  border: "2px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  marginBottom: 20,
                }}
              >
                🏔️ {t("hero_badge")}
              </div>

              <h1
                className="anim-fadeup stagger-2"
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "clamp(2.8rem,6.5vw,5.5rem)",
                  fontWeight: 900,
                  lineHeight: 1.08,
                  color: "#fff",
                  textShadow: "0 4px 40px rgba(0,0,0,0.6)",
                  marginBottom: 20,
                }}
              >
                {t("hero_title_1")}
                <br />
                <RotatingWord />
              </h1>

              <p
                className="anim-fadeup stagger-3"
                style={{
                  fontSize: "1.08rem",
                  color: "rgba(255,255,255,0.8)",
                  maxWidth: 560,
                  lineHeight: 1.75,
                  marginBottom: 28,
                  fontWeight: 500,
                }}
              >
                {t("hero_sub")}
              </p>

              <div style={{ position: "relative", maxWidth: 660 }}>
                <div className="hero-search anim-fadeup stagger-4" style={{ marginBottom: 16 }}>
                  <i
                    className="fas fa-search"
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      marginLeft: 8,
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  />
                  <input
                    type="text"
                    placeholder={t("search_placeholder")}
                    value={query}
                    onFocus={() => setShowSuggest(true)}
                    onBlur={() => setTimeout(() => setShowSuggest(false), 120)}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && query && navigate("search", { q: query })}
                  />
                  <button className="clay-btn clay-btn-gold" onClick={() => query && navigate("search", { q: query })}>
                    <i className="fas fa-search"></i> {t("hero_search_btn")}
                  </button>
                </div>

                {showSuggest && heroSuggestions.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 62,
                      left: 0,
                      right: 0,
                      background: "rgba(18,18,30,0.96)",
                      border: "2px solid rgba(255,255,255,0.12)",
                      borderRadius: 18,
                      overflow: "hidden",
                      backdropFilter: "blur(14px)",
                      zIndex: 20,
                      boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
                    }}
                  >
                    {heroSuggestions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => navigate("destination-detail", { id: item.id })}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "14px 16px",
                          background: "transparent",
                          border: "none",
                          color: "#fff",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontWeight: 800 }}>{t(item.name_key || item.name)}</div>
                        <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)" }}>
                          📍 {t(item.city_key || item.city)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="anim-fadeup stagger-5" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
                {quickNav.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.page)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 99,
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)",
                      border: "1.5px solid rgba(255,255,255,0.2)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <i className={`fas ${item.icon}`} style={{ fontSize: "0.75rem" }}></i>
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="stats-bar anim-fadeup stagger-5">
                {[
                  { t: 500, s: "+", k: "stat_destinations" },
                  { t: 1200, s: "+", k: "stat_hotels" },
                  { t: 300, s: "+", k: "stat_guides" },
                  { t: 50000, s: "+", k: "stat_travelers" },
                ].map((stat) => (
                  <div className="stat-item" key={stat.k}>
                    <div className="stat-num"><Counter target={stat.t} suffix={stat.s} /></div>
                    <div className="stat-lbl">{t(stat.k)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="hero-visual anim-fadeup stagger-4"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 520,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1678086029951-5154accbd21b?q=80&w=1170&auto=format&fit=crop"
                alt="Nepal Mountains"
                style={{
                  position: "relative",
                  zIndex: 2,
                  width: "100%",
                  maxWidth: 920,
                  maxHeight: 780,
                  objectFit: "cover",
                  borderRadius: 26,
                  filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.35))",
                  animation: "heroFloat 5s ease-in-out infinite",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: 36,
                  right: 26,
                  zIndex: 3,
                  background: "linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))",
                  backdropFilter: "blur(14px)",
                  border: "2px solid rgba(255,255,255,0.16)",
                  borderRadius: 20,
                  padding: "16px 18px",
                  color: "#fff",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
                }}
              >
                <div style={{ fontWeight: 900, fontSize: "1rem", marginBottom: 4 }}>🏔️ Nepal</div>
                <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
                  Himalayas • Culture • Adventure
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PlannerStrip navigate={navigate} />

      <section className="section">
        <div className="container">
          <div className="text-center mb-32 reveal">
            <div className="section-badge">{t("top_picks")}</div>
            <h2 className="section-title" style={{ marginTop: 8 }}>
              {t("featured_destinations")}
            </h2>
            <p className="section-sub">{t("featured_sub")}</p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 36 }} className="reveal">
            <button className={`cat-pill${activeCat === "all" ? " active" : ""}`} onClick={() => setActiveCat("all")}>
              🌍 {t("all")} ({destinations.length})
            </button>

            {categories.map((cat) => {
              const catValue = (cat.slug || cat.name_key || cat.name || "").toLowerCase();
              const catLabel = t(cat.name_key || cat.name || cat.slug);
              const count = destinations.filter((d) => (d.category?.slug || d.category?.name || "").toLowerCase() === catValue).length;

              return (
                <button
                  key={cat.slug || catValue}
                  className={`cat-pill${activeCat === catValue ? " active" : ""}`}
                  onClick={() => setActiveCat(catValue)}
                >
                  {cat.icon} {catLabel} ({count})
                </button>
              );
            })}
          </div>

          <div className="grid-3">
            {featuredDestinations.map((dest, i) => (
              <DestinationCard key={dest.id} dest={dest} navigate={navigate} delay={i * 0.05} />
            ))}
          </div>

          <div className="text-center mt-24 reveal">
            <button className="clay-btn clay-btn-red clay-btn-lg" onClick={() => navigate("destinations")}>
              <i className="fas fa-map-marked-alt"></i> {t("view_all_destinations")}
            </button>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg2)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }} className="reveal">
            <div>
              <div className="section-badge">{t("stay_in_style")}</div>
              <h2 className="section-title" style={{ marginTop: 8 }}>{t("top_hotels")}</h2>
            </div>
            <button className="clay-btn clay-btn-outline" onClick={() => navigate("hotels")}>
              {t("view_all_hotels")}
            </button>
          </div>

          <div className="grid-2">
            {featuredHotels.map((hotel, i) => (
              <HotelCard key={hotel.id} hotel={hotel} navigate={navigate} delay={i * 0.05} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container text-center">
          <div className="section-badge reveal">{t("why_us")}</div>
          <h2 className="section-title reveal" style={{ marginTop: 8, marginBottom: 16 }}>
            {t("why_choose")}
          </h2>

          <div className="grid-3 mt-24">
            {whyCards.map((card) => (
              <div key={card.t2} className="clay-card reveal" style={{ padding: 28 }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    background: card.bg,
                    border: "3px solid rgba(0,0,0,0.08)",
                    boxShadow: "5px 5px 0px rgba(0,0,0,0.1)",
                    fontSize: "1.8rem",
                  }}
                >
                  {card.e}
                </div>
                <h5 style={{ fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>{card.t2}</h5>
                <p style={{ color: "var(--text3)", fontSize: "0.875rem", margin: 0, fontWeight: 500, lineHeight: 1.6 }}>
                  {card.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <NewsletterSection />

      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scrollX{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes heroFloat{0%{transform:translateY(0px)}50%{transform:translateY(-14px)}100%{transform:translateY(0px)}}
        @keyframes heroZoom{0%{transform:scale(1)}100%{transform:scale(1.08)}}
        @keyframes blobFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}

        .reveal{opacity:0;transform:translateY(40px);transition:opacity .7s ease,transform .7s ease}
        .reveal.visible{opacity:1;transform:translateY(0)}

        @media (max-width: 992px){
          .hero-grid{grid-template-columns:1fr !important;min-height:auto !important;}
          .hero-visual{min-height:320px !important;margin-top:10px;}
          .hero-visual img{max-width:420px !important;max-height:360px !important;}
        }

        @media (max-width: 768px){
          .hero-visual{display:none !important;}
        }

        @media (max-width: 900px){
          .clay-card[style*="grid-template-columns: 1.2fr 1fr 1fr auto"]{
            grid-template-columns:1fr !important;
          }
        }
      `}</style>
    </div>
  );
}