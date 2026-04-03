import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  MessageCircle,
  Clock,
  Star,
  ChevronRight,
  X,
  ArrowLeft,
  Check,
  AlertCircle,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Flag,
  Upload,
  Search,
} from "lucide-react";

// ─── CONSTANTS — FILL THESE IN ───────────────────────────────────────────────
const ADMIN_PASSWORD = "Kusu@Manku0430";
const ADMIN_WHATSAPP = "919354249942";
const CLOUDINARY_CLOUD_NAME = "dlzqb06u6";
const CLOUDINARY_UPLOAD_PRESET = "proxima_mentors";
const API_BASE = "https://proxima-backend-hdho.onrender.com/api";
// ─────────────────────────────────────────────────────────────────────────────

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function generateTimeSlots() {
  const slots = [];
  for (let h = 6; h < 23; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
    slots.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return slots;
}

function formatTime(t) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function generateSlotsFromRanges(ranges) {
  const all = [];
  ranges.forEach(({ from, to, day }) => {
    const times = generateTimeSlots();
    const fromIdx = times.indexOf(from);
    const toIdx = times.indexOf(to);
    if (fromIdx === -1 || toIdx === -1 || toIdx <= fromIdx) return;
    for (let i = fromIdx; i < toIdx; i++) {
      all.push({
        day,
        time: times[i],
        display: `${day} ${formatTime(times[i])}`,
        status: "available",
      });
    }
  });
  return all;
}

function wa(number, text) {
  window.open(
    `https://wa.me/${number}?text=${encodeURIComponent(text)}`,
    "_blank"
  );
}

// API helpers
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  return data.secure_url;
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  bg: "#111111",
  text: "#FFFFFF",
  accent: "#E93800",
  blue: "#0000AF",
  card: "#1C1C1C",
  border: "#2A2A2A",
  adminBg: "#0A0A0A",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${S.bg}; color: ${S.text}; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${S.bg}; } ::-webkit-scrollbar-thumb { background: ${S.border}; }
  .serif { font-family: 'Playfair Display', serif; }
  .grain::before { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events:none; z-index:9999; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
  .fade-up { animation: fadeUp 0.5s ease forwards; }
  .slide-in { animation: slideIn 0.4s ease forwards; }
  input, textarea, select { background: #222; border: 1px solid ${S.border}; color: ${S.text}; border-radius: 8px; padding: 12px 16px; width: 100%; font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; transition: border 0.2s; }
  input:focus, textarea:focus, select:focus { border-color: ${S.accent}; }
  button { cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .btn-primary { background: ${S.accent}; color: #fff; border: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; font-weight: 500; }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-secondary { background: transparent; color: ${S.text}; border: 1px solid ${S.border}; padding: 12px 28px; border-radius: 8px; font-size: 15px; }
  .btn-secondary:hover { border-color: ${S.accent}; color: ${S.accent}; }
  .btn-blue { background: ${S.blue}; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; }
  .mentor-card { background: ${S.card}; border: 1px solid ${S.border}; border-radius: 16px; padding: 24px; transition: all 0.3s; cursor: pointer; }
  .mentor-card:hover { border-color: ${S.accent}; transform: translateY(-4px); box-shadow: 0 20px 40px rgba(233,56,0,0.1); }
  .pill { padding: 6px 14px; border-radius: 20px; font-size: 13px; border: 1px solid ${S.border}; cursor: pointer; transition: all 0.2s; }
  .pill:hover { border-color: ${S.accent}; color: ${S.accent}; }
  .pill.booked { opacity: 0.3; cursor: not-allowed; text-decoration: line-through; }
  .pill.selected { background: ${S.accent}; border-color: ${S.accent}; color: #fff; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
  .modal { background: ${S.card}; border: 1px solid ${S.border}; border-radius: 20px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; padding: 32px; position: relative; }
  .tag { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; background: rgba(0,0,175,0.15); color: ${S.blue}; border: 1px solid rgba(0,0,175,0.3); }
  .star { color: #FFB800; }
  .progress-bar { height: 3px; background: ${S.border}; border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; background: ${S.accent}; border-radius: 2px; transition: width 0.4s ease; }
  .admin-panel { background: ${S.adminBg}; min-height: 100vh; }
  .admin-tab { padding: 10px 20px; border: none; background: transparent; color: #888; font-size: 14px; border-bottom: 2px solid transparent; transition: all 0.2s; }
  .admin-tab.active { color: ${S.accent}; border-bottom-color: ${S.accent}; }
  .stat-card { background: ${S.card}; border: 1px solid ${S.border}; border-radius: 12px; padding: 20px; }
  .badge-pending { background: rgba(233,56,0,0.15); color: ${S.accent}; padding: 3px 10px; border-radius: 20px; font-size: 12px; }
  .badge-approved { background: rgba(0,0,175,0.15); color: ${S.blue}; padding: 3px 10px; border-radius: 20px; font-size: 12px; }
`;

// ─── STARS ───────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="star"
          style={{ opacity: i <= Math.round(rating) ? 1 : 0.2 }}
        >
          ★
        </span>
      ))}
      <span style={{ color: "#888", fontSize: 13, marginLeft: 4 }}>
        {rating?.toFixed(1)}
      </span>
    </span>
  );
}

// ─── LANDING ─────────────────────────────────────────────────────────────────
function Landing({ onMentee, onMentor }) {
  return (
    <div
      className="grain"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        className="fade-up"
        style={{ textAlign: "center", marginBottom: 48 }}
      >
        <div
          style={{
            fontSize: 13,
            letterSpacing: 4,
            color: S.accent,
            marginBottom: 12,
            textTransform: "uppercase",
          }}
        >
          Welcome to
        </div>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(48px,8vw,96px)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          PROXIMA
        </h1>
        <p style={{ color: "#888", marginTop: 12, fontSize: 16 }}>
          Real answers from real college students
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 20,
          width: "100%",
          maxWidth: 680,
          marginBottom: 48,
        }}
      >
        {[
          {
            label: "I'm looking for a mentor",
            sub: "Find a senior from your dream college and get real answers",
            action: onMentee,
            icon: "🎓",
          },
          {
            label: "I want to become a mentor",
            sub: "Share your experience and earn from short sessions",
            action: onMentor,
            icon: "💡",
          },
        ].map((c, i) => (
          <button
            key={i}
            onClick={c.action}
            className="fade-up"
            style={{
              animationDelay: `${i * 0.1}s`,
              background: S.card,
              border: `1px solid ${S.border}`,
              borderRadius: 20,
              padding: "36px 28px",
              textAlign: "left",
              color: S.text,
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = S.accent;
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = S.border;
              e.currentTarget.style.transform = "";
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 16 }}>{c.icon}</div>
            <div
              className="serif"
              style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}
            >
              {c.label}
            </div>
            <div style={{ color: "#888", fontSize: 14, lineHeight: 1.6 }}>
              {c.sub}
            </div>
            <div
              style={{
                marginTop: 20,
                color: S.accent,
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 14,
              }}
            >
              Get started <ChevronRight size={16} />
            </div>
          </button>
        ))}
      </div>
      <div
        className="fade-up"
        style={{
          animationDelay: "0.3s",
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "28px 32px",
          background: S.card,
          border: `1px solid ${S.border}`,
          borderRadius: 16,
          width: "100%",
          maxWidth: 680,
        }}
      >
        {[
          {
            icon: <Shield size={18} color={S.accent} />,
            text: "Verified college seniors only",
          },
          {
            icon: <MessageCircle size={18} color={S.accent} />,
            text: "Honest answers, not brochures",
          },
          {
            icon: <Clock size={18} color={S.accent} />,
            text: "30-min paid sessions — mentors show up",
          },
        ].map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#ccc",
              fontSize: 14,
            }}
          >
            {t.icon}
            <span>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MENTOR CARD ─────────────────────────────────────────────────────────────
function MentorCard({ mentor, onClick, delay }) {
  return (
    <div
      className="mentor-card fade-up"
      style={{ animationDelay: `${delay}s` }}
      onClick={() => onClick(mentor)}
    >
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <img
          src={
            mentor.photo ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              mentor.name
            )}&background=1C1C1C&color=E93800&size=80`
          }
          alt={mentor.name}
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            objectFit: "cover",
            border: `2px solid ${S.border}`,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>
            {mentor.name}
          </div>
          <div style={{ color: S.accent, fontSize: 13, marginBottom: 4 }}>
            {mentor.college}
          </div>
          <div style={{ color: "#888", fontSize: 12 }}>
            {mentor.course} · {mentor.year}
          </div>
        </div>
      </div>
      <Stars rating={mentor.rating || 5} />
      <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
        {mentor.sessions || 0} sessions
      </div>
      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 600, color: S.accent }}>
          ₹{mentor.price || 250}
          <span style={{ color: "#888", fontWeight: 400, fontSize: 12 }}>
            /session
          </span>
        </div>
        <button
          className="btn-primary"
          style={{ padding: "8px 18px", fontSize: 13 }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

// ─── MENTOR DISCOVERY ────────────────────────────────────────────────────────
function MentorDiscovery({ onBook }) {
  const [mentors, setMentors] = useState([]);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch("/mentors");
      setMentors(data);
    } catch {
      setMentors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load]);

  const colleges = [...new Set(mentors.map((m) => m.college))];
  const filtered = filter
    ? mentors.filter((m) => m.college === filter)
    : mentors;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div className="fade-up" style={{ marginBottom: 40 }}>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(28px,5vw,48px)",
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          Talk to a real senior
          <br />
          before you choose your college
        </h1>
        <p style={{ color: "#888" }}>
          {mentors.length}+ mentors across Delhi University colleges
        </p>
      </div>
      <div
        style={{ marginBottom: 28, display: "flex", gap: 10, flexWrap: "wrap" }}
      >
        <button
          className="pill"
          style={{
            background: !filter ? S.accent : "transparent",
            borderColor: !filter ? S.accent : S.border,
            color: !filter ? "#fff" : S.text,
          }}
          onClick={() => setFilter("")}
        >
          All Colleges
        </button>
        {colleges.map((c) => (
          <button
            key={c}
            className="pill"
            style={{
              background: filter === c ? S.accent : "transparent",
              borderColor: filter === c ? S.accent : S.border,
              color: filter === c ? "#fff" : S.text,
            }}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      {loading ? (
        <div style={{ textAlign: "center", color: "#888", padding: 60 }}>
          Loading mentors...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", padding: 60 }}>
          No mentors found
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 20,
          }}
        >
          {filtered.map((m, i) => (
            <MentorCard
              key={m._id}
              mentor={m}
              onClick={setSelected}
              delay={i * 0.05}
            />
          ))}
        </div>
      )}
      {selected && (
        <MentorModal
          mentor={selected}
          onClose={() => setSelected(null)}
          onBook={(m, slot) => {
            setSelected(null);
            onBook(m, slot);
          }}
        />
      )}
    </div>
  );
}

// ─── MENTOR MODAL ────────────────────────────────────────────────────────────
function MentorModal({ mentor, onClose, onBook }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const slotsByDay = {};
  (mentor.slots || []).forEach((s) => {
    if (!slotsByDay[s.day]) slotsByDay[s.day] = [];
    slotsByDay[s.day].push(s);
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            color: "#888",
          }}
        >
          <X size={20} />
        </button>
        <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
          <img
            src={
              mentor.photo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                mentor.name
              )}&background=1C1C1C&color=E93800&size=120`
            }
            alt={mentor.name}
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${S.accent}`,
            }}
          />
          <div>
            <h2 className="serif" style={{ fontSize: 24, fontWeight: 700 }}>
              {mentor.name}
            </h2>
            <div style={{ color: S.accent, marginBottom: 4 }}>
              {mentor.college}
            </div>
            <div style={{ color: "#888", fontSize: 13 }}>
              {mentor.course} · Year {mentor.year}
            </div>
            <div style={{ marginTop: 6 }}>
              <Stars rating={mentor.rating || 5} />
              <span style={{ color: "#888", fontSize: 12, marginLeft: 4 }}>
                ({mentor.sessions || 0} sessions)
              </span>
            </div>
          </div>
        </div>
        <p
          style={{
            color: "#ccc",
            lineHeight: 1.7,
            marginBottom: 24,
            fontSize: 14,
          }}
        >
          {mentor.bio}
        </p>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>
            Available Slots
          </div>
          {Object.keys(slotsByDay).length === 0 ? (
            <div style={{ color: "#888", fontSize: 14 }}>
              No slots available currently
            </div>
          ) : (
            Object.entries(slotsByDay).map(([day, slots]) => (
              <div key={day} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    color: "#888",
                    fontSize: 12,
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {day}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {slots.map((s, i) => (
                    <button
                      key={i}
                      className={`pill ${
                        s.status === "booked" ? "booked" : ""
                      } ${selectedSlot === s.display ? "selected" : ""}`}
                      onClick={() =>
                        s.status !== "booked" && setSelectedSlot(s.display)
                      }
                      disabled={s.status === "booked"}
                    >
                      {formatTime(s.time)}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 20, color: S.accent }}>
            ₹{mentor.price || 250}
            <span style={{ color: "#888", fontWeight: 400, fontSize: 13 }}>
              /30 min
            </span>
          </div>
          <button
            className="btn-primary"
            disabled={!selectedSlot}
            onClick={() => selectedSlot && onBook(mentor, selectedSlot)}
            style={{ opacity: selectedSlot ? 1 : 0.4 }}
          >
            Book Session
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── BOOKING FLOW ────────────────────────────────────────────────────────────
function BookingFlow({ mentor, slot, onDone }) {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    code: "",
    message: "",
  });
  const [codeError, setCodeError] = useState("");
  const [loading, setLoading] = useState(false);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await apiFetch("/bookings", {
        method: "POST",
        body: {
          mentorId: mentor._id,
          mentorName: mentor.name,
          slot,
          studentName: form.name,
          studentEmail: form.email,
          studentPhone: form.phone,
          referralCode: form.code,
          message: form.message,
        },
      });
      const txt = `New Proxima Booking!\nStudent: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nMentor: ${mentor.name}\nSlot: ${slot}\nMessage: ${form.message}`;
      wa(ADMIN_WHATSAPP, txt);
      if (mentor.whatsapp)
        wa(
          mentor.whatsapp,
          `Hi ${mentor.name}, you have a new booking!\nStudent: ${form.name}\nPhone: ${form.phone}\nSlot: ${slot}\nMessage: ${form.message}`
        );
      setStep("done");
    } catch (e) {
      if (e.message.includes("code"))
        setCodeError("Code not recognised — you can leave this blank");
    } finally {
      setLoading(false);
    }
  };

  if (step === "done")
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div className="fade-up" style={{ textAlign: "center", maxWidth: 440 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(0,0,175,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <Check size={36} color={S.blue} />
          </div>
          <h2 className="serif" style={{ fontSize: 32, marginBottom: 12 }}>
            Booking Confirmed!
          </h2>
          <p style={{ color: "#888", lineHeight: 1.7, marginBottom: 24 }}>
            Your session with{" "}
            <strong style={{ color: S.text }}>{mentor.name}</strong> has been
            booked for <strong style={{ color: S.accent }}>{slot}</strong>.
            We've notified the mentor and will share the meet link shortly.
          </p>
          <button className="btn-primary" onClick={onDone}>
            Browse More Mentors
          </button>
        </div>
      </div>
    );

  if (step === "confirm")
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div className="modal slide-in" style={{ maxWidth: 500 }}>
          <h2 className="serif" style={{ fontSize: 24, marginBottom: 20 }}>
            Confirm Your Booking
          </h2>
          {[
            ["Mentor", mentor.name],
            ["Slot", slot],
            ["Your Name", form.name],
            ["Email", form.email],
            ["Phone", form.phone],
            ["Message", form.message],
          ].map(
            ([k, v]) =>
              v && (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: `1px solid ${S.border}`,
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: "#888" }}>{k}</span>
                  <span style={{ maxWidth: "60%", textAlign: "right" }}>
                    {v}
                  </span>
                </div>
              )
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={() => setStep("form")}
            >
              Go Back
            </button>
            <button
              className="btn-primary"
              style={{ flex: 1 }}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div className="modal slide-in" style={{ maxWidth: 500 }}>
        <button
          onClick={onDone}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 20,
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h2 className="serif" style={{ fontSize: 24, marginBottom: 4 }}>
          Book with {mentor.name}
        </h2>
        <p style={{ color: S.accent, marginBottom: 24, fontSize: 14 }}>
          {slot}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            placeholder="Your full name *"
            value={form.name}
            onChange={(e) => upd("name", e.target.value)}
          />
          <input
            placeholder="Email address *"
            type="email"
            value={form.email}
            onChange={(e) => upd("email", e.target.value)}
          />
          <input
            placeholder="Phone number *"
            type="tel"
            value={form.phone}
            onChange={(e) => upd("phone", e.target.value)}
          />
          <div>
            <input
              placeholder="Mentor referral code (optional)"
              value={form.code}
              onChange={(e) => {
                upd("code", e.target.value);
                setCodeError("");
              }}
            />
            {codeError && (
              <div
                style={{
                  color: S.accent,
                  fontSize: 12,
                  marginTop: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <AlertCircle size={12} />
                {codeError}
              </div>
            )}
          </div>
          <textarea
            placeholder="Short message to your mentor *"
            rows={3}
            value={form.message}
            onChange={(e) => upd("message", e.target.value)}
          />
        </div>
        <button
          className="btn-primary"
          style={{ width: "100%", marginTop: 20 }}
          onClick={() => setStep("confirm")}
          disabled={!form.name || !form.email || !form.phone || !form.message}
        >
          Review Booking →
        </button>
      </div>
    </div>
  );
}

// ─── MENTOR REGISTRATION ─────────────────────────────────────────────────────
function MentorRegistration({ onDone }) {
  const TOTAL = 6;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    college: "",
    course: "",
    year: "",
    email: "",
    whatsapp: "",
    bio: "",
    photo: "",
  });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      upd("photo", url);
      setPreview(url);
    } catch {
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await apiFetch("/registrations", { method: "POST", body: form });
      wa(
        ADMIN_WHATSAPP,
        `New Mentor Application!\nName: ${form.name}\nCollege: ${form.college}\nCourse: ${form.course}\nEmail: ${form.email}\nPhone: ${form.whatsapp}`
      );
      setStep(TOTAL);
    } catch {
      alert("Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    {
      label: "Name",
      content: (
        <div>
          <h2 className="serif" style={{ fontSize: 28, marginBottom: 8 }}>
            What's your full name?
          </h2>
          <p style={{ color: "#888", marginBottom: 24 }}>
            This will appear on your public profile
          </p>
          <input
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => upd("name", e.target.value)}
            autoFocus
          />
        </div>
      ),
      valid: form.name.trim(),
    },
    {
      label: "College",
      content: (
        <div>
          <h2 className="serif" style={{ fontSize: 28, marginBottom: 8 }}>
            Your college details
          </h2>
          <p style={{ color: "#888", marginBottom: 24 }}>
            Tell us where you study
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              placeholder="College name (e.g. SRCC)"
              value={form.college}
              onChange={(e) => upd("college", e.target.value)}
            />
            <input
              placeholder="Course / Programme"
              value={form.course}
              onChange={(e) => upd("course", e.target.value)}
            />
            <select
              value={form.year}
              onChange={(e) => upd("year", e.target.value)}
            >
              <option value="">Select year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
            </select>
          </div>
        </div>
      ),
      valid: form.college && form.course && form.year,
    },
    {
      label: "Contact",
      content: (
        <div>
          <h2 className="serif" style={{ fontSize: 28, marginBottom: 8 }}>
            Contact details
          </h2>
          <p style={{ color: "#888", marginBottom: 24 }}>
            Not shown publicly — for notifications only
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              placeholder="Email address"
              type="email"
              value={form.email}
              onChange={(e) => upd("email", e.target.value)}
            />
            <input
              placeholder="WhatsApp number"
              type="tel"
              value={form.whatsapp}
              onChange={(e) => upd("whatsapp", e.target.value)}
            />
          </div>
        </div>
      ),
      valid: form.email && form.whatsapp,
    },
    {
      label: "Bio",
      content: (
        <div>
          <h2 className="serif" style={{ fontSize: 28, marginBottom: 8 }}>
            Tell students about yourself
          </h2>
          <p style={{ color: "#888", marginBottom: 24 }}>
            Max 200 characters — write like you're talking to a student
          </p>
          <textarea
            placeholder="e.g. 2nd year BCom Hons at SRCC. Happy to talk about college life, societies, internships, and what academics are really like here."
            rows={4}
            maxLength={200}
            value={form.bio}
            onChange={(e) => upd("bio", e.target.value)}
          />
          <div
            style={{
              color: "#888",
              fontSize: 12,
              marginTop: 6,
              textAlign: "right",
            }}
          >
            {form.bio.length}/200
          </div>
        </div>
      ),
      valid: form.bio.trim().length >= 20,
    },
    {
      label: "Photo",
      content: (
        <div>
          <h2 className="serif" style={{ fontSize: 28, marginBottom: 8 }}>
            Add a profile photo
          </h2>
          <p style={{ color: "#888", marginBottom: 24 }}>
            Clear, well-lit, face visible. No group photos.
          </p>
          {preview ? (
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <img
                src={preview}
                alt="preview"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `3px solid ${S.accent}`,
                }}
              />
              <div style={{ color: "#888", fontSize: 13, marginTop: 8 }}>
                Photo uploaded ✓
              </div>
            </div>
          ) : null}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "14px 20px",
              border: `2px dashed ${S.border}`,
              borderRadius: 10,
              cursor: "pointer",
              color: "#888",
            }}
          >
            <Upload size={18} />
            {uploading ? "Uploading..." : "Click to upload photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              style={{ display: "none" }}
            />
          </label>
        </div>
      ),
      valid: form.photo || true,
    },
  ];

  if (step === TOTAL)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div className="fade-up" style={{ textAlign: "center", maxWidth: 440 }}>
          <div style={{ fontSize: 60, marginBottom: 24 }}>🎉</div>
          <h2 className="serif" style={{ fontSize: 32, marginBottom: 12 }}>
            Thanks {form.name}!
          </h2>
          <p style={{ color: "#888", lineHeight: 1.7, marginBottom: 24 }}>
            We'll review your profile and get back to you within 24 hours.
          </p>
          <button className="btn-primary" onClick={onDone}>
            Back to Home
          </button>
        </div>
      </div>
    );

  const current = steps[step - 1];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div className="progress-bar" style={{ marginBottom: 32 }}>
          <div
            className="progress-fill"
            style={{ width: `${((step - 1) / (TOTAL - 1)) * 100}%` }}
          />
        </div>
        <div style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>
          Step {step} of {TOTAL - 1}
        </div>
        <div className="slide-in" key={step}>
          {current.content}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          {step > 1 && (
            <button
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={() => setStep((s) => s - 1)}
            >
              ← Back
            </button>
          )}
          {step < TOTAL - 1 && (
            <button
              className="btn-primary"
              style={{ flex: 1 }}
              disabled={!current.valid}
              onClick={() => setStep((s) => s + 1)}
            >
              Continue →
            </button>
          )}
          {step === TOTAL - 1 && (
            <button
              className="btn-primary"
              style={{ flex: 1 }}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MENTOR DASHBOARD ────────────────────────────────────────────────────────
function MentorLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const handle = async () => {
    try {
      const data = await apiFetch("/mentor/login", {
        method: "POST",
        body: { email, pin },
      });
      onLogin(data);
    } catch {
      setErr("Invalid email or PIN");
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div className="modal fade-up" style={{ maxWidth: 400 }}>
        <h2 className="serif" style={{ fontSize: 28, marginBottom: 24 }}>
          Mentor Login
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            placeholder="Registered email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="4-digit PIN"
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          {err && <div style={{ color: S.accent, fontSize: 13 }}>{err}</div>}
          <button className="btn-primary" onClick={handle}>
            Login →
          </button>
        </div>
      </div>
    </div>
  );
}

function SlotManager({ mentor, onSave }) {
  const [days, setDays] = useState({});
  const times = generateTimeSlots();

  const toggleDay = (day) =>
    setDays((d) =>
      d[day]
        ? (({ [day]: _, ...rest }) => rest)(d)
        : { ...d, [day]: [{ from: "09:00", to: "11:00" }] }
    );
  const addRange = (day) =>
    setDays((d) => ({
      ...d,
      [day]: [...d[day], { from: "14:00", to: "16:00" }],
    }));
  const removeRange = (day, i) =>
    setDays((d) => {
      const ranges = d[day].filter((_, idx) => idx !== i);
      return ranges.length
        ? { ...d, [day]: ranges }
        : (({ [day]: _, ...rest }) => rest)(d);
    });
  const updateRange = (day, i, k, v) =>
    setDays((d) => {
      const ranges = [...d[day]];
      ranges[i] = { ...ranges[i], [k]: v };
      return { ...d, [day]: ranges };
    });

  const allSlots = Object.entries(days).flatMap(([day, ranges]) =>
    generateSlotsFromRanges(ranges.map((r) => ({ ...r, day })))
  );

  const handleSave = async () => {
    try {
      await apiFetch(`/mentors/${mentor._id}/slots`, {
        method: "PUT",
        body: { slots: allSlots },
      });
      alert("Your slots have been updated!");
      onSave();
    } catch {
      alert("Failed to save slots");
    }
  };

  return (
    <div>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
        Manage Your Slots
      </div>
      {DAYS.map((day) => (
        <div
          key={day}
          style={{
            marginBottom: 16,
            background: "#222",
            border: `1px solid ${S.border}`,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: days[day] ? 16 : 0,
            }}
          >
            <span style={{ fontWeight: 500 }}>{day}</span>
            <button
              onClick={() => toggleDay(day)}
              style={{
                background: days[day] ? S.accent : "transparent",
                border: `1px solid ${days[day] ? S.accent : S.border}`,
                color: days[day] ? "#fff" : "#888",
                padding: "4px 14px",
                borderRadius: 20,
                fontSize: 13,
              }}
            >
              {days[day] ? "Active" : "Off"}
            </button>
          </div>
          {days[day] &&
            days[day].map((range, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <select
                  value={range.from}
                  onChange={(e) => updateRange(day, i, "from", e.target.value)}
                  style={{ flex: 1 }}
                >
                  {times.map((t) => (
                    <option key={t} value={t}>
                      {formatTime(t)}
                    </option>
                  ))}
                </select>
                <span style={{ color: "#888" }}>to</span>
                <select
                  value={range.to}
                  onChange={(e) => updateRange(day, i, "to", e.target.value)}
                  style={{ flex: 1 }}
                >
                  {times.map((t) => (
                    <option key={t} value={t}>
                      {formatTime(t)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeRange(day, i)}
                  style={{ background: "none", border: "none", color: "#888" }}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          {days[day] && (
            <div>
              <div style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>
                {
                  generateSlotsFromRanges(days[day].map((r) => ({ ...r, day })))
                    .length
                }{" "}
                slots will be listed:{" "}
                {generateSlotsFromRanges(days[day].map((r) => ({ ...r, day })))
                  .map((s) => formatTime(s.time))
                  .join(", ")}
              </div>
              <button
                onClick={() => addRange(day)}
                style={{
                  background: "none",
                  border: `1px dashed ${S.border}`,
                  color: "#888",
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  width: "100%",
                }}
              >
                + Add another range
              </button>
            </div>
          )}
        </div>
      ))}
      {allSlots.length > 0 && (
        <div
          style={{
            background: "rgba(0,0,175,0.1)",
            border: `1px solid ${S.blue}`,
            borderRadius: 10,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ fontWeight: 500, marginBottom: 8, color: S.blue }}>
            Preview — {allSlots.length} total slots
          </div>
          {DAYS.filter((d) => days[d]).map((d) => (
            <div
              key={d}
              style={{ fontSize: 13, color: "#ccc", marginBottom: 4 }}
            >
              <strong>{d}:</strong>{" "}
              {generateSlotsFromRanges(days[d].map((r) => ({ ...r, day: d })))
                .map((s) => formatTime(s.time))
                .join(", ")}
            </div>
          ))}
        </div>
      )}
      <button
        className="btn-primary"
        onClick={handleSave}
        style={{ width: "100%" }}
      >
        Save Slots
      </button>
    </div>
  );
}

function MentorDashboard({ mentor, onLogout }) {
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    apiFetch(`/bookings?mentorId=${mentor._id}`)
      .then(setBookings)
      .catch(() => {});
  }, [mentor._id]);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px 20px",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <h1 className="serif" style={{ fontSize: 28 }}>
          Mentor Dashboard
        </h1>
        <button
          onClick={onLogout}
          style={{
            background: "none",
            border: `1px solid ${S.border}`,
            color: "#888",
            padding: "8px 16px",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          background: S.card,
          border: `1px solid ${S.border}`,
          borderRadius: 12,
          padding: 20,
        }}
      >
        <img
          src={
            mentor.photo ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              mentor.name
            )}&background=1C1C1C&color=E93800&size=80`
          }
          alt={mentor.name}
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div>
          <div style={{ fontWeight: 600, fontSize: 18 }}>{mentor.name}</div>
          <div style={{ color: S.accent, fontSize: 14 }}>{mentor.college}</div>
          <div style={{ color: "#888", fontSize: 13 }}>
            {mentor.course} · {mentor.year}
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: S.accent }}>
            {mentor.credits || 0}
          </div>
          <div style={{ color: "#888", fontSize: 13 }}>Credits</div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 24,
          borderBottom: `1px solid ${S.border}`,
        }}
      >
        {["bookings", "slots"].map((t) => (
          <button
            key={t}
            className={`admin-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
            style={{ textTransform: "capitalize" }}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "bookings" && (
        <div>
          {bookings.length === 0 ? (
            <div style={{ color: "#888", textAlign: "center", padding: 40 }}>
              No bookings yet
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b._id}
                style={{
                  background: S.card,
                  border: `1px solid ${S.border}`,
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 12,
                }}
              >
                <div style={{ fontWeight: 600 }}>{b.studentName}</div>
                <div style={{ color: "#888", fontSize: 13 }}>{b.slot}</div>
                <div style={{ color: S.accent, fontSize: 13, marginTop: 4 }}>
                  📞 {b.studentPhone}
                </div>
                <div style={{ color: "#ccc", fontSize: 13, marginTop: 4 }}>
                  {b.message}
                </div>
                {b.meetLink && (
                  <div style={{ marginTop: 8 }}>
                    <a
                      href={b.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: S.blue }}
                    >
                      Join Meet →
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
      {tab === "slots" && <SlotManager mentor={mentor} onSave={() => {}} />}
    </div>
  );
}

// ─── ADMIN PANEL ─────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const handle = () => {
    if (pw === ADMIN_PASSWORD) onLogin();
    else setErr("Incorrect password");
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div className="modal fade-up" style={{ maxWidth: 360 }}>
        <h2 className="serif" style={{ fontSize: 24, marginBottom: 20 }}>
          Admin Access
        </h2>
        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handle()}
        />
        {err && (
          <div style={{ color: S.accent, fontSize: 13, marginTop: 8 }}>
            {err}
          </div>
        )}
        <button
          className="btn-primary"
          style={{ width: "100%", marginTop: 14 }}
          onClick={handle}
        >
          Login
        </button>
      </div>
    </div>
  );
}

function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState("stats");
  const [mentors, setMentors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [regs, setRegs] = useState([]);
  const [stats, setStats] = useState({});
  const [editMentor, setEditMentor] = useState(null);
  const [showAddMentor, setShowAddMentor] = useState(false);
  const [newMentor, setNewMentor] = useState({
    name: "",
    college: "",
    course: "",
    year: "1st",
    bio: "",
    photo: "",
    email: "",
    whatsapp: "",
    price: 250,
    rating: 5,
    sessions: 0,
    referralCode: "",
    pin: "0000",
  });
  const [notes, setNotes] = useState({});
  const [meetLinks, setMeetLinks] = useState({});
  const [sentMeet, setSentMeet] = useState({});
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const [m, b, r, s] = await Promise.all([
      apiFetch("/mentors?all=true").catch(() => []),
      apiFetch("/bookings").catch(() => []),
      apiFetch("/registrations").catch(() => []),
      apiFetch("/stats").catch(() => ({})),
    ]);
    setMentors(m);
    setBookings(b);
    setRegs(r);
    setStats(s);
    const n = {};
    b.forEach((bk) => {
      if (bk.notes) n[bk._id] = bk.notes;
    });
    setNotes(n);
    const ml = {};
    const sm = {};
    b.forEach((bk) => {
      if (bk.meetLink) ml[bk._id] = bk.meetLink;
      if (bk.meetSent) sm[bk._id] = true;
    });
    setMeetLinks(ml);
    setSentMeet(sm);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleVisibility = async (m) => {
    await apiFetch(`/mentors/${m._id}`, {
      method: "PUT",
      body: { ...m, visible: !m.visible },
    });
    load();
  };
  const deleteMentor = async (id) => {
    if (window.confirm("Delete mentor?")) {
      await apiFetch(`/mentors/${id}`, { method: "DELETE" });
      load();
    }
  };
  const saveNote = async (id) => {
    await apiFetch(`/bookings/${id}/notes`, {
      method: "PUT",
      body: { notes: notes[id] },
    });
  };
  const sendMeet = (b) => {
    const link = meetLinks[b._id];
    if (!link) return;
    wa(
      b.studentPhone,
      `Hi ${b.studentName}, your Proxima session with ${b.mentorName} is confirmed!\nSlot: ${b.slot}\nMeet Link: ${link}`
    );
    const mentor = mentors.find(
      (m) => m._id === b.mentorId || m.name === b.mentorName
    );
    if (mentor?.whatsapp)
      wa(
        mentor.whatsapp,
        `Hi ${mentor.name}, your session with ${b.studentName} is confirmed!\nSlot: ${b.slot}\nMeet Link: ${link}`
      );
    apiFetch(`/bookings/${b._id}/meetlink`, {
      method: "PUT",
      body: { meetLink: link, meetSent: true },
    });
    setSentMeet((s) => ({ ...s, [b._id]: true }));
  };
  const approveReg = async (r) => {
    await apiFetch(`/registrations/${r._id}/approve`, { method: "PUT" });
    load();
  };
  const rejectReg = async (id) => {
    await apiFetch(`/registrations/${id}`, { method: "DELETE" });
    load();
  };
  const addMentor = async () => {
    await apiFetch("/mentors", {
      method: "POST",
      body: { ...newMentor, visible: true },
    });
    setShowAddMentor(false);
    load();
  };
  const saveMentor = async () => {
    await apiFetch(`/mentors/${editMentor._id}`, {
      method: "PUT",
      body: editMentor,
    });
    setEditMentor(null);
    load();
  };

  const handlePhotoUpload = async (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setter(url);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const MentorForm = ({ data, onChange, onSave, onCancel }) => (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 560 }}>
        <h3 className="serif" style={{ fontSize: 22, marginBottom: 20 }}>
          {data._id ? "Edit Mentor" : "Add Mentor"}
        </h3>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {[
            ["name", "Name"],
            ["college", "College"],
            ["course", "Course"],
            ["email", "Email"],
            ["whatsapp", "WhatsApp"],
            ["referralCode", "Referral Code (4-10 chars)"],
            ["pin", "PIN (4 digits)"],
          ].map(([k, l]) => (
            <input
              key={k}
              placeholder={l}
              value={data[k] || ""}
              onChange={(e) => onChange(k, e.target.value)}
            />
          ))}
          <select
            value={data.year || "1st"}
            onChange={(e) => onChange("year", e.target.value)}
          >
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
          </select>
          <input
            type="number"
            placeholder="Price (₹)"
            value={data.price || 250}
            onChange={(e) => onChange("price", Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Rating (1-5)"
            step="0.1"
            min="1"
            max="5"
            value={data.rating || 5}
            onChange={(e) => onChange("rating", Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Sessions done"
            value={data.sessions || 0}
            onChange={(e) => onChange("sessions", Number(e.target.value))}
          />
        </div>
        <textarea
          placeholder="Bio (max 200 chars)"
          maxLength={200}
          rows={3}
          style={{ marginTop: 12, width: "100%" }}
          value={data.bio || ""}
          onChange={(e) => onChange("bio", e.target.value)}
        />
        <div style={{ marginTop: 12 }}>
          {data.photo && (
            <img
              src={data.photo}
              alt=""
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: 8,
              }}
            />
          )}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              border: `1px dashed ${S.border}`,
              borderRadius: 8,
              cursor: "pointer",
              color: "#888",
              fontSize: 13,
            }}
          >
            <Upload size={14} />
            {uploading ? "Uploading..." : "Upload Photo"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handlePhotoUpload(e, (url) => onChange("photo", url))
              }
              style={{ display: "none" }}
            />
          </label>
          <input
            placeholder="Or paste image URL"
            value={data.photo || ""}
            onChange={(e) => onChange("photo", e.target.value)}
            style={{ marginTop: 8 }}
          />
          <div style={{ color: "#888", fontSize: 11, marginTop: 4 }}>
            Google Drive links are automatically converted — just paste the
            sharing link as-is
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            className="btn-secondary"
            style={{ flex: 1 }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-panel">
      <div
        style={{
          borderBottom: `1px solid ${S.border}`,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          className="serif"
          style={{ fontSize: 20, fontWeight: 700, color: S.accent }}
        >
          PROXIMA Admin
        </div>
        <button
          onClick={onLogout}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
      <div
        style={{
          borderBottom: `1px solid ${S.border}`,
          display: "flex",
          paddingLeft: 24,
        }}
      >
        {["stats", "mentors", "registrations", "bookings"].map((t) => (
          <button
            key={t}
            className={`admin-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
            style={{ textTransform: "capitalize" }}
          >
            {t}{" "}
            {t === "registrations" && regs.length > 0 && (
              <span className="badge-pending" style={{ marginLeft: 6 }}>
                {regs.length}
              </span>
            )}
          </button>
        ))}
      </div>
      <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
        {tab === "stats" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                gap: 16,
                marginBottom: 32,
              }}
            >
              {[
                ["Total Bookings", stats.totalBookings || 0],
                ["This Week", stats.weeklyBookings || 0],
                ["Active Mentors", stats.activeMentors || 0],
                ["Pending Applications", stats.pendingRegistrations || 0],
                ["Credits Issued", stats.totalCredits || 0],
              ].map(([l, v]) => (
                <div key={l} className="stat-card">
                  <div style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>
                    {l}
                  </div>
                  <div
                    style={{ fontSize: 32, fontWeight: 700, color: S.accent }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                background: S.card,
                border: `1px solid ${S.border}`,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 16 }}>
                Bookings per Mentor
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr>
                    {["Mentor", "College", "Bookings", "Credits"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          color: "#888",
                          padding: "8px 0",
                          borderBottom: `1px solid ${S.border}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mentors.map((m) => (
                    <tr key={m._id}>
                      <td style={{ padding: "10px 0" }}>{m.name}</td>
                      <td style={{ color: "#888" }}>{m.college}</td>
                      <td>{(stats.bookingsByMentor || {})[m._id] || 0}</td>
                      <td style={{ color: S.accent }}>{m.credits || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "mentors" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 600 }}>
                Mentors ({mentors.length})
              </h2>
              <button
                className="btn-primary"
                onClick={() => setShowAddMentor(true)}
              >
                <Plus size={16} style={{ marginRight: 6, display: "inline" }} />
                Add Mentor
              </button>
            </div>
            {mentors.map((m) => (
              <div
                key={m._id}
                style={{
                  background: S.card,
                  border: `1px solid ${S.border}`,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <img
                  src={
                    m.photo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      m.name
                    )}&background=1C1C1C&color=E93800&size=48`
                  }
                  alt={m.name}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>
                    {m.name}{" "}
                    {m.slots?.some((s) => s.outsideSchedule) && (
                      <Flag
                        size={14}
                        color={S.accent}
                        style={{ display: "inline" }}
                      />
                    )}
                  </div>
                  <div style={{ color: "#888", fontSize: 13 }}>
                    {m.college} · {m.course}
                  </div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                    Code: {m.referralCode || "—"} · Credits: {m.credits || 0} ·
                    Sessions: {m.sessions || 0}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => toggleVisibility(m)}
                    style={{
                      background: "none",
                      border: `1px solid ${S.border}`,
                      color: m.visible ? "#888" : S.accent,
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    {m.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => setEditMentor(m)}
                    style={{
                      background: "none",
                      border: `1px solid ${S.border}`,
                      color: "#888",
                      padding: "6px 12px",
                      borderRadius: 6,
                    }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteMentor(m._id)}
                    style={{
                      background: "none",
                      border: `1px solid ${S.border}`,
                      color: S.accent,
                      padding: "6px 12px",
                      borderRadius: 6,
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "registrations" && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
              Pending Applications ({regs.length})
            </h2>
            {regs.length === 0 ? (
              <div style={{ color: "#888", textAlign: "center", padding: 40 }}>
                No pending applications
              </div>
            ) : (
              regs.map((r) => (
                <div
                  key={r._id}
                  style={{
                    background: S.card,
                    border: `1px solid ${S.border}`,
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>
                        {r.name}
                      </div>
                      <div style={{ color: S.accent, fontSize: 14 }}>
                        {r.college} · {r.course} · {r.year}
                      </div>
                      <div
                        style={{ color: "#888", fontSize: 13, marginTop: 4 }}
                      >
                        {r.email} · {r.whatsapp}
                      </div>
                      <div
                        style={{
                          color: "#ccc",
                          fontSize: 13,
                          marginTop: 8,
                          lineHeight: 1.6,
                        }}
                      >
                        {r.bio}
                      </div>
                    </div>
                    {r.photo && (
                      <img
                        src={r.photo}
                        alt={r.name}
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                    <button className="btn-blue" onClick={() => approveReg(r)}>
                      Approve →
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: "8px 16px", fontSize: 13 }}
                      onClick={() => rejectReg(r._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "bookings" && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
              All Bookings ({bookings.length})
            </h2>
            {bookings.length === 0 ? (
              <div style={{ color: "#888", textAlign: "center", padding: 40 }}>
                No bookings yet
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b._id}
                  style={{
                    background: S.card,
                    border: `1px solid ${S.border}`,
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {b.studentName} → {b.mentorName}
                      </div>
                      <div style={{ color: S.accent, fontSize: 13 }}>
                        {b.slot}
                      </div>
                      <div
                        style={{ color: "#888", fontSize: 13, marginTop: 2 }}
                      >
                        📧 {b.studentEmail} · 📞 {b.studentPhone}
                      </div>
                      <div
                        style={{ color: "#ccc", fontSize: 13, marginTop: 4 }}
                      >
                        {b.message}
                      </div>
                    </div>
                    <div style={{ color: "#666", fontSize: 12 }}>
                      {new Date(b.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <textarea
                        placeholder="Private notes (only visible to admin)"
                        rows={2}
                        value={notes[b._id] || ""}
                        onChange={(e) =>
                          setNotes((n) => ({ ...n, [b._id]: e.target.value }))
                        }
                        style={{ fontSize: 13 }}
                      />
                      <button
                        onClick={() => saveNote(b._id)}
                        style={{
                          background: "none",
                          border: `1px solid ${S.border}`,
                          color: "#888",
                          padding: "4px 12px",
                          borderRadius: 6,
                          fontSize: 12,
                          marginTop: 4,
                        }}
                      >
                        Save Note
                      </button>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <input
                        placeholder="Paste Google Meet link"
                        value={meetLinks[b._id] || ""}
                        onChange={(e) =>
                          setMeetLinks((l) => ({
                            ...l,
                            [b._id]: e.target.value,
                          }))
                        }
                        style={{ fontSize: 13 }}
                      />
                      <button
                        onClick={() => sendMeet(b)}
                        className="btn-blue"
                        style={{
                          marginTop: 4,
                          fontSize: 12,
                          padding: "6px 14px",
                        }}
                      >
                        {sentMeet[b._id] ? "✓ Sent" : "Send Meet Link"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {showAddMentor && (
        <MentorForm
          data={newMentor}
          onChange={(k, v) => setNewMentor((m) => ({ ...m, [k]: v }))}
          onSave={addMentor}
          onCancel={() => setShowAddMentor(false)}
        />
      )}
      {editMentor && (
        <MentorForm
          data={editMentor}
          onChange={(k, v) => setEditMentor((m) => ({ ...m, [k]: v }))}
          onSave={saveMentor}
          onCancel={() => setEditMentor(null)}
        />
      )}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing");
  const [bookData, setBookData] = useState(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [mentorSession, setMentorSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("proxima_mentor") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#admin") setView("admin");
    if (hash === "#mentor-login") setView("mentor-login");
  }, []);

  const mentorLogin = (mentor) => {
    localStorage.setItem("proxima_mentor", JSON.stringify(mentor));
    setMentorSession(mentor);
    setView("mentor-dashboard");
  };
  const mentorLogout = () => {
    localStorage.removeItem("proxima_mentor");
    setMentorSession(null);
    setView("landing");
  };

  if (view === "admin")
    return adminLoggedIn ? (
      <AdminPanel
        onLogout={() => {
          setAdminLoggedIn(false);
          setView("landing");
        }}
      />
    ) : (
      <AdminLogin onLogin={() => setAdminLoggedIn(true)} />
    );
  if (view === "mentor-login") return <MentorLogin onLogin={mentorLogin} />;
  if (view === "mentor-dashboard" && mentorSession)
    return <MentorDashboard mentor={mentorSession} onLogout={mentorLogout} />;

  return (
    <>
      <style>{css}</style>
      {view === "landing" && (
        <Landing
          onMentee={() => setView("discovery")}
          onMentor={() => setView("register")}
        />
      )}
      {view === "discovery" && (
        <MentorDiscovery
          onBook={(m, s) => {
            setBookData({ mentor: m, slot: s });
            setView("booking");
          }}
        />
      )}
      {view === "booking" && bookData && (
        <BookingFlow
          mentor={bookData.mentor}
          slot={bookData.slot}
          onDone={() => {
            setBookData(null);
            setView("discovery");
          }}
        />
      )}
      {view === "register" && (
        <MentorRegistration onDone={() => setView("landing")} />
      )}
      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          borderTop: `1px solid ${S.border}`,
          color: "#555",
          fontSize: 12,
        }}
      >
        © 2025 Proxima &nbsp;·&nbsp;
        <a
          href="#mentor-login"
          onClick={() => setView("mentor-login")}
          style={{ color: "#555", textDecoration: "none" }}
        >
          Mentor Login
        </a>
        &nbsp;·&nbsp;
        <a
          href="#admin"
          onClick={() => setView("admin")}
          style={{ color: "#333", textDecoration: "none" }}
        >
          ·
        </a>
      </footer>
    </>
  );
}
