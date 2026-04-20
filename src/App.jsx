import { useState, useEffect, useCallback, useRef } from "react";
import { ShieldCheck, MessageSquare, Users, Wallet, Target, Zap } from "https://esm.sh/lucide-react@0.383.0";
const Shield = () => <span>✓</span>;
const MessageCircle = () => <span>💬</span>;
const Clock = () => <span>⏱</span>;
const ChevronRight = () => <span>→</span>;
const X = ({ onClick }) => <span onClick={onClick} style={{cursor:'pointer'}}>✕</span>;
const ArrowLeft = () => <span>←</span>;
const Check = () => <span>✓</span>;
const AlertCircle = () => <span>⚠</span>;
const LogOut = () => <span>↩</span>;
const Plus = () => <span>+</span>;
const Trash2 = () => <span>🗑</span>;
const Edit2 = () => <span>✏</span>;
const Eye = () => <span>👁</span>;
const EyeOff = () => <span>🚫</span>;
const Flag = () => <span>🚩</span>;
const Upload = () => <span>↑</span>;
const Search = () => <span>🔍</span>;
const Star = () => <span>★</span>;

const ADMIN_PASSWORD = "Kusu@Manku0430";
const ADMIN_WHATSAPP = "919354249942";
const CLOUDINARY_CLOUD_NAME = "dlzqb06u6";
const CLOUDINARY_UPLOAD_PRESET = "proxima_mentors";
const API_BASE = "https://proxima-backend-hdho.onrender.com/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function generateTimeSlots() {
  const slots = [];
  for (let h = 6; h < 23; h++) {
    slots.push(`${h.toString().padStart(2,"0")}:00`);
    slots.push(`${h.toString().padStart(2,"0")}:30`);
  }
  return slots;
}


function formatTime(t) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${m.toString().padStart(2,"0")} ${ampm}`;
}

function generateSlotsFromRanges(ranges) {
  const all = [];
  ranges.forEach(({ from, to, day }) => {
    const times = generateTimeSlots();
    const fromIdx = times.indexOf(from);
    const toIdx = times.indexOf(to);
    if (fromIdx === -1 || toIdx === -1 || toIdx <= fromIdx) return;
    for (let i = fromIdx; i < toIdx; i++) {
      all.push({ day, time: times[i], display: `${day} ${formatTime(times[i])}`, status: "available" });
    }
  });
  return all;
}

function wa(number, text) {
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, "_blank");
}

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
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
  const data = await res.json();
  return data.secure_url;
}

const S = {
  bg: "#111111", text: "#FFFFFF", accent: "#E93800", accentLight: "#FF6B35", blue: "#3B82F6",
  card: "#1A1A1A", border: "#2A2A2A", adminBg: "#050505", adminSurface: "#0D0D0D",
  textMuted: "#A0A0A0", textDim: "#6B6B6B", success: "#10B981",
  // Landing page light theme colors
  landingBg: "#FEFBF7", landingText: "#1A1A1A", landingCard: "#FFFFFF", landingBorder: "#E8E4DF",
  landingMuted: "#6B6B6B", landingSubtle: "#9CA3AF",
};

const css = `
  @font-face {
    font-family: 'Gilroy';
    src: url('/fonts/Gilroy-Light.woff2') format('woff2'),
         url('/fonts/Gilroy-Light.woff') format('woff');
    font-weight: 300;
    font-style: normal;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('/fonts/Gilroy-Regular.woff2') format('woff2'),
         url('/fonts/Gilroy-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('/fonts/Gilroy-Medium.woff2') format('woff2'),
         url('/fonts/Gilroy-Medium.woff') format('woff');
    font-weight: 500;
    font-style: normal;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('/fonts/Gilroy-Semibold.woff2') format('woff2'),
         url('/fonts/Gilroy-Semibold.woff') format('woff');
    font-weight: 600;
    font-style: normal;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('/fonts/Gilroy-Bold.woff2') format('woff2'),
         url('/fonts/Gilroy-Bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('/fonts/Gilroy-LightItalic.woff2') format('woff2'),
         url('/fonts/Gilroy-LightItalic.woff') format('woff');
    font-weight: 300;
    font-style: italic;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('/fonts/Gilroy-RegularItalic.woff2') format('woff2'),
         url('/fonts/Gilroy-RegularItalic.woff') format('woff');
    font-weight: 400;
    font-style: italic;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('/fonts/Gilroy-MediumItalic.woff2') format('woff2'),
         url('/fonts/Gilroy-MediumItalic.woff') format('woff');
    font-weight: 500;
    font-style: italic;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('/fonts/Gilroy-SemiboldItalic.woff2') format('woff2'),
         url('/fonts/Gilroy-SemiboldItalic.woff') format('woff');
    font-weight: 600;
    font-style: italic;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url('/fonts/Gilroy-BoldItalic.woff2') format('woff2'),
         url('/fonts/Gilroy-BoldItalic.woff') format('woff');
    font-weight: 700;
    font-style: italic;
  }
  html, body { margin: 0; padding: 0; width: 100%; overflow-x: hidden; background: #FAF7F2; }
  body { background: ${S.bg}; color: ${S.text}; font-family: 'Gilroy', sans-serif; } body.landing { background: #FAF7F2 !important; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${S.bg}; } ::-webkit-scrollbar-thumb { background: ${S.border}; }
  .serif { font-family: 'Gilroy', serif; font-weight: 700; }
  .grain::before { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events:none; z-index:9999; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
  .fade-up { animation: fadeUp 0.5s ease forwards; }
  .slide-in { animation: slideIn 0.4s ease forwards; }
  input, textarea, select { background: #222; border: 1px solid ${S.border}; color: ${S.text}; border-radius: 8px; padding: 12px 16px; width: 100%; font-family: 'Gilroy', sans-serif; font-size: 15px; outline: none; transition: border 0.2s; box-sizing: border-box; }
  input:focus, textarea:focus, select:focus { border-color: ${S.accent}; }
  button { cursor: pointer; font-family: 'Gilroy', sans-serif; transition: all 0.2s; }
  .btn-primary { background: ${S.accent}; color: #fff; border: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; font-weight: 500; }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-secondary { background: transparent; color: ${S.text}; border: 1px solid ${S.border}; padding: 12px 28px; border-radius: 8px; font-size: 15px; }
  .btn-secondary:hover { border-color: ${S.accent}; color: ${S.accent}; }
  .btn-blue { background: ${S.blue}; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; }
  .mentor-card { background: #fff; border: 1px solid #E8E2D9; border-radius: 16px; padding: 24px; transition: all 0.3s; cursor: pointer; color: #111; }
  .mentor-card:hover { border-color: #E93800; transform: translateY(-4px); box-shadow: 0 20px 40px rgba(233,56,0,0.08); }
  .pill { padding: 6px 14px; border-radius: 20px; font-size: 13px; border: 1px solid ${S.border}; cursor: pointer; transition: all 0.2s; }
  .pill:hover { border-color: ${S.accent}; color: ${S.accent}; }
  .pill.booked { opacity: 0.3; cursor: not-allowed; text-decoration: line-through; }
  .pill.selected { background: ${S.accent}; border-color: ${S.accent}; color: #fff; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
.modal { background: #fff; border: 1px solid #E8E2D9; border-radius: 20px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; padding: 32px; position: relative; color: #111; }  .modal { background: ${S.card}; border: 1px solid ${S.border}; border-radius: 20px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; padding: 32px; position: relative; }
  .star { color: #FFB800; }
  .progress-bar { height: 3px; background: ${S.border}; border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; background: ${S.accent}; border-radius: 2px; transition: width 0.4s ease; }
  .admin-panel { background: linear-gradient(180deg, ${S.adminBg} 0%, ${S.adminSurface} 100%); min-height: 100vh; }
  .admin-header { background: linear-gradient(135deg, ${S.card} 0%, ${S.adminSurface} 100%); border-bottom: 1px solid ${S.border}; backdrop-filter: blur(10px); }
  .admin-tab { padding: 16px 28px; border: none; background: transparent; color: ${S.textMuted}; font-size: 14px; border-bottom: 2px solid transparent; transition: all 0.3s; font-weight: 500; letter-spacing: 0.3px; position: relative; }
  .admin-tab:hover { color: ${S.text}; background: rgba(255,255,255,0.02); }
  .admin-tab.active { color: ${S.accent}; }
  .admin-tab.active::after { content:''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, ${S.accent}, ${S.accentLight}); }
  .stat-card { background: linear-gradient(145deg, ${S.card} 0%, ${S.adminSurface} 100%); border: 1px solid ${S.border}; border-radius: 16px; padding: 28px; transition: all 0.3s; position: relative; overflow: hidden; }
  .stat-card::before { content:''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, ${S.accent}, ${S.accentLight}); opacity: 0; transition: opacity 0.3s; }
  .stat-card:hover { transform: translateY(-4px); border-color: ${S.accent}; box-shadow: 0 20px 40px rgba(233,56,0,0.15); }
  .stat-card:hover::before { opacity: 1; }
  .badge-pending { background: linear-gradient(135deg, rgba(233,56,0,0.25), rgba(255,107,53,0.15)); color: ${S.accentLight}; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; border: 1px solid rgba(233,56,0,0.3); }
  .admin-section-title { font-size: 26px; font-weight: 700; margin-bottom: 28px; color: ${S.text}; letter-spacing: -0.5px; }
  .admin-card { background: linear-gradient(145deg, ${S.card} 0%, rgba(26,26,26,0.8) 100%); border: 1px solid ${S.border}; border-radius: 16px; padding: 24px; margin-bottom: 16px; transition: all 0.3s; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
  .admin-card:hover { border-color: ${S.accent}; transform: translateY(-3px); box-shadow: 0 12px 40px rgba(233,56,0,0.12); }
  .admin-label { color: ${S.textMuted}; font-size: 11px; margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 6px; }
  .admin-value { color: ${S.text}; font-size: 14px; }
  .admin-value-secondary { color: ${S.textDim}; font-size: 13px; }
  .glow-text { text-shadow: 0 0 20px rgba(233,56,0,0.5); }
  .card-glow { box-shadow: 0 0 30px rgba(233,56,0,0.1); }
`;

function Stars({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} className="star" style={{ opacity: i <= Math.round(rating) ? 1 : 0.2 }}>★</span>
      ))}
      <span style={{ color: "#888", fontSize: 13, marginLeft: 4 }}>{rating?.toFixed(1)}</span>
    </span>
  );
}

function Landing({ onMentee, onMentor }) {
  const LIGHT_LOGO = "https://res.cloudinary.com/dlzqb06u6/image/upload/v1775389312/wbzrczuoo9swrhfvxhrx.png";
  const STUDENT_PHOTO = "https://res.cloudinary.com/dlzqb06u6/image/upload/v1775809175/shauryachaur_ddobkh.png";
  const [mentorCount, setMentorCount] = useState(0);
  const [collegeCount, setCollegeCount] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

useEffect(() => {
    apiFetch("/mentors").then(data => {
      setMentorCount(data.length);
      setCollegeCount(new Set(data.map(m => m.college)).size);
    }).catch(() => {});
    document.body.style.background = "#FAF7F2";
    document.body.style.margin = "0";
    return () => { document.body.style.background = ""; };
  }, []);

  const questions = [
    "What is the curriculum at SRCC?", "Is attendance strict in Delhi University colleges?",
    "Is the coursework practical or theory-heavy?", "What is hostel life like at NMIMS?",
    "Are societies actually worth joining?", "How did you prepare for CUET/IPMAT/NMAT to get into your college?",
    "What mistakes should I avoid during preparation?", "Should I prioritise brand name or course?",
  ];

  const whyCards = [
    { icon: <ShieldCheck size={28} color="#E93800" />, title: "Verified College Seniors", desc: "Only interact with verified college seniors from top colleges and courses." },
    { icon: <MessageSquare size={28} color="#E93800" />, title: "Real Conversations", desc: "Get honest, unfiltered insights about college life instead of relying on websites, rankings, or promotional content." },
    { icon: <Users size={28} color="#E93800" />, title: "Diverse Perspectives", desc: "Talk to students from different colleges, courses, cities, and backgrounds to get a well-rounded view." },
    { icon: <Wallet size={28} color="#E93800" />, title: "Affordable & Accessible", desc: "High-value guidance at a student-friendly price, making clarity accessible to everyone." },
    { icon: <Target size={28} color="#E93800" />, title: "Clarity On What Matters", desc: "Understand academics, college life, internships, placements, and opportunities before making your decision." },
    { icon: <Zap size={28} color="#E93800" />, title: "Quick & Direct Answers", desc: "Skip hours of research and get your doubts resolved in a single focused conversation." },
  ];

  const faqs = [
    { q: "How do I book a session with a mentor?", a: "You can browse mentors based on college and course, select a suitable time slot, and book a 30-minute 1:1 session directly through the website." },
    { q: "Are the mentors verified?", a: "Yes, all mentors go through a verification process before being listed on Proxima." },
    { q: "What topics can I discuss in a session?", a: "Admissions, academics, campus life, societies, placements, internships � anything related to your target college." },
    { q: "How much does a session cost?", a: "Sessions start at Rs.250 for 30 minutes. Prices may vary by mentor." },
    { q: "Can I choose which mentor I speak to?", a: "Yes, you can browse all available mentors, filter by college, and book with whoever fits your needs." },
  ];

  return (
    <div style={{ background: "#FAF7F2", minHeight: "100vh", fontFamily: "'Gilroy', sans-serif", color: "#111" }}>
      <style>{`
.l-nav { display:flex !important; flex-direction:row !important; align-items:center !important; justify-content:space-between !important; padding:16px 40px !important; border-bottom:1px solid #E8E2D9; background:#ffffff; position:sticky; top:0; z-index:100; width:100%; box-sizing:border-box; }       
 .btn-dark { background:#111 !important; color:#fff !important; border:1.5px solid #111 !important; padding:11px 22px; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; font-family:'Gilroy',sans-serif; transition:opacity 0.2s; }
.btn-dark:hover { opacity:0.82; }
.btn-out { background:transparent !important; color:#111 !important; border:1.5px solid #111 !important; padding:11px 22px; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; font-family:'Gilroy',sans-serif; transition:all 0.2s; }
.btn-out:hover { background:#111 !important; color:#fff !important; }
        .l-hero { display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:center; padding:64px 48px 48px; max-width:1200px; margin:0 auto; background:#FFF0EB; }
        .bubble { position:absolute; background:#fff; border-radius:12px; padding:11px 15px; font-size:12.5px; color:#111; box-shadow:0 4px 20px rgba(0,0,0,0.10); max-width:210px; line-height:1.5; font-weight:500; }
        .ticker-wrap { background:#111; color:#fff; padding:18px 0; overflow:hidden; }
        .why-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; max-width:1000px; margin:0 auto; }
        .why-card { padding:28px; border:1px solid #E8E2D9; border-radius:16px; background:#fff; }
        .service-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; max-width:900px; margin:0 auto; }
        .service-card { display:flex; gap:20px; align-items:flex-start; padding:28px; border:1px solid #E8E2D9; border-radius:16px; background:#fff; }
        .numbers-section { background:#111; color:#fff; border-radius:20px; padding:48px; max-width:1000px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr 1fr; gap:32px; align-items:center; }
        .faq-section { display:grid; grid-template-columns:1fr 2fr; gap:48px; max-width:1000px; margin:0 auto; align-items:start; }
        .faq-item { border-bottom:1px solid #E8E2D9; padding:18px 0; cursor:pointer; }
        .faq-q { display:flex; justify-content:space-between; align-items:center; font-size:15px; font-weight:500; }
        .faq-a { color:#666; font-size:14px; line-height:1.7; margin-top:12px; }
        .cta-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; max-width:900px; margin:0 auto; }
        .cta-card { padding:32px; border:1px solid #E8E2D9; border-radius:16px; background:#FAF7F2; }
        .l-footer { background:#111; color:#fff; padding:32px 48px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; }
        @media(max-width:768px){ .l-nav { padding:12px 16px !important; } .l-nav .btn-out { display:none; }
          .l-hero { grid-template-columns:1fr; padding:28px 20px; } .l-right { order:-1; }
          .why-grid { grid-template-columns:1fr; } .service-grid { grid-template-columns:1fr; }
          .numbers-section { grid-template-columns:1fr; padding:32px 24px; }
          .faq-section { grid-template-columns:1fr; } .cta-grid { grid-template-columns:1fr; }
          .l-footer { padding:24px 20px; flex-direction:column; text-align:center; }
          .bubble-2 { display:none !important; }
        }
      `}</style>

     <nav style={{ display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", padding:"16px 40px", borderBottom:"1px solid #E8E2D9", background:"#ffffff", position:"sticky", top:0, zIndex:100, width:"100%", boxSizing:"border-box" }}>
        <img src={LIGHT_LOGO} alt="Proxima" style={{ height: 28, width: "auto", objectFit: "contain", flexShrink: 0 }} />
        <div style={{ display:"flex", flexDirection:"row", gap:12, alignItems:"center", flexShrink:0 }}>
          <button className="btn-dark" onClick={onMentee}>Get Real College Guidance</button>
          <button className="btn-out" onClick={onMentor}>Join As A Guide</button>
        </div>
      </nav>

      <div className="l-hero">
        <div className="fade-up">
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, color: "#888", textTransform: "uppercase", marginBottom: 20 }}>Built by students, for students</div>
          <h1 style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Make informed<br />college decisions with<br />
            <span style={{ color: "#E93800", fontStyle: "italic" }}>real student guidance</span>
          </h1>
          <p style={{ color: "#666", fontSize: 15, lineHeight: 1.75, maxWidth: 420, marginBottom: 32 }}>
            Connect with current college students through 30 minute 1:1 calls to understand admissions, academics, campus life, and make the right choice.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
            <button className="btn-dark" style={{ padding: "13px 28px", fontSize: 15 }} onClick={onMentee}>Get Real College Guidance</button>
            <button className="btn-out" style={{ padding: "13px 28px", fontSize: 15 }} onClick={onMentor}>Join As A Guide</button>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>In partnership with mentors from top colleges</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              
{[
  { name: "logo1", url: "https://res.cloudinary.com/dlzqb06u6/image/upload/v1776108712/logo1_qumizn.png" },
  { name: "logo2", url: "https://res.cloudinary.com/dlzqb06u6/image/upload/v1776108713/logo2_kbemdj.png" },
  { name: "logo3", url: "https://res.cloudinary.com/dlzqb06u6/image/upload/v1776108714/logo3_oxri4g.png" },
].map(p => (
  <img key={p.name} src={p.url} alt={p.name} style={{ height: 48, objectFit: "contain" }} />
))}
<span style={{ fontSize: 13, color: "#888" }}>+13 more</span>
            </div>
          </div>
        </div>
        <div className="l-right fade-up" style={{ position: "relative", display: "flex", justifyContent: "center", animationDelay: "0.15s" }}>
          <img src={STUDENT_PHOTO} alt="Student" style={{ width: "100%", maxWidth: 420, height: 440, objectFit: "cover", objectPosition: "top", borderRadius: 24 }} />
          <div className="bubble" style={{ top: 32, right: -10, fontSize: 14 }}>Are societies actually worth joining?</div>
<div className="bubble bubble-2" style={{ top: "42%", left: -30, fontSize: 14 }}>Should I prioritise brand name or course?</div>
<div className="bubble" style={{ bottom: 48, right: -10, fontSize: 14 }}>Is attendance strict in Delhi University colleges?</div>
        </div>
      </div>

      <div className="ticker-wrap">
        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", textAlign: "center", marginBottom: 14, letterSpacing: 2, textTransform: "uppercase" }}>Questions Asked By Students</div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 16, animation: "ticker 30s linear infinite" }}>
            {[...questions, ...questions].map((q, i) => (
              <div key={i} style={{ fontSize: 13, color: "#ccc", padding: "6px 20px", border: "1px solid #333", borderRadius: 20, whiteSpace: "nowrap" }}>{q}</div>
            ))}
          </div>
        </div>
        <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      <div style={{ padding: "80px 48px", background: "#FAF7F2" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, marginBottom: 48 }}>Why Choose Us?</h2>
        <div className="why-grid">
          {whyCards.map((c, i) => (
            <div key={i} className="why-card">
              <div style={{ marginBottom: 14 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{c.title}</div>
              <div style={{ color: "#666", fontSize: 14, lineHeight: 1.7 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 48px 80px", background: "#FAF7F2" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, marginBottom: 40 }}>Services We Offer</h2>
        <div className="service-grid">
          {[
            { title: "Get Real College Guidance", color: "#E93800", bg: "#FFF0EB", desc: "Talk to current students and understand academics, campus life, placements, and everything that actually matters before you decide.", action: onMentee, img: "https://res.cloudinary.com/dlzqb06u6/image/upload/v1776108563/leftservices_uvt4sc.png" },
            { title: "Join As A Guide", color: "#0000AF", bg: "#EEEEFF", desc: "Help juniors make better decisions, earn on your own schedule, and build a strong CV with real mentoring experience.", action: onMentor, img: "https://res.cloudinary.com/dlzqb06u6/image/upload/v1776108563/right_services_yetwgu.png" },
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, borderRadius: 20, overflow: "hidden", border: `1px solid ${i===0?"#F0D5CB":"#D5D5F0"}` }}>
              <img src={s.img} alt={s.title} style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }} />
              <div style={{ padding: "24px 28px 28px" }}>
                <div style={{ color: s.color, fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{s.title}</div>
                <div style={{ color: "#555", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</div>
                <button onClick={s.action} style={{ background: "#111", color: "#fff", border: "none", width: 40, height: 40, borderRadius: "50%", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>↗</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 48px 80px", background: "#FAF7F2" }}>
        <div className="numbers-section">
          <div>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Numbers</div>
            <div style={{ color: "#aaa", fontSize: 14, lineHeight: 1.7 }}>Mentors onboarded from top colleges spanning across University of Delhi, IIM, etc.</div>
          </div>
          <div style={{ borderLeft: "1px solid #333", paddingLeft: 32 }}>
            <div style={{ fontSize: 56, fontWeight: 800 }}>{mentorCount}+</div>
            <div style={{ color: "#aaa", fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>College seniors onboarded from top colleges spanning across University of Delhi, IIM, etc.</div>
          </div>
          <div style={{ borderLeft: "1px solid #333", paddingLeft: 32 }}>
            <div style={{ fontSize: 56, fontWeight: 800 }}>{collegeCount}+</div>
            <div style={{ color: "#aaa", fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>Colleges represented by mentors spanning across University of Delhi, IIM, etc.</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 48px 80px", background: "#FAF7F2" }}>
        <div className="faq-section">
          <div>
            <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, lineHeight: 1.2, marginBottom: 24 }}>Frequently<br />Asked Questions</h2>
            <div style={{ background: "#F0EDE8", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Can't Find What You Are Looking For?</div>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>Reach out to us at</div>
              <div style={{ fontSize: 13, color: "#444", marginBottom: 4 }}>📞 +91 9354249942</div>
              <div style={{ fontSize: 13, color: "#444", marginBottom: 4 }}>📞 +91 8130900858</div>
              <div style={{ fontSize: 13, color: "#444" }}>✉ proxima.info1@gmail.com</div>
            </div>
          </div>
          <div>
            {faqs.map((f, i) => (
              <div key={i} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                <div className="faq-q">
                  <span>{f.q}</span>
                  <span style={{ fontSize: 20, color: "#888", fontWeight: 300 }}>{openFaq === i ? "-" : "+"}</span>
                </div>
                {openFaq === i && <div className="faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 48px 80px", background: "#FAF7F2" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, marginBottom: 40 }}>Ready to get the guidance you need?</h2>
        <div className="cta-grid">
          {[
            { title: "Verified Student Mentors", desc: "Only interact with verified college seniors from specific colleges and courses.", btn: "Find A Mentor", action: onMentee, dark: true },
            { title: "Real Conversations", desc: "Get honest, unfiltered insights about college life instead of relying on websites, rankings, or promotional content.", btn: "Become A Mentor", action: onMentor, dark: false },
          ].map((c, i) => (
            <div key={i} className="cta-card">
              <div style={{ background: "#E8E2D9", borderRadius: 10, width: 48, height: 48, marginBottom: 16 }} />
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{c.title}</div>
              <div style={{ color: "#666", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>{c.desc}</div>
              <button onClick={c.action} className={c.dark ? "btn-dark" : "btn-out"} style={{ padding: "11px 24px" }}>{c.btn}</button>
            </div>
          ))}
        </div>
      </div>

      <div className="l-footer">
        <img src="https://res.cloudinary.com/dlzqb06u6/image/upload/v1775449181/Logo_Dark_Mode_hhg8xt.png" alt="Proxima" style={{ height: 28, objectFit: "contain" }} />
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#aaa" }}>📞 +91 9354249942</span>
          <span style={{ fontSize: 13, color: "#aaa" }}>📞 +91 8130900858</span>
          <span style={{ fontSize: 13, color: "#aaa" }}>✉ proxima.info1@gmail.com</span>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: "#aaa", fontSize: 13, textDecoration: "none", border: "1px solid #444", borderRadius: 6, padding: "4px 10px" }}>in</a>
        </div>
      </div>
    </div>
  );
}

function MentorCard({ mentor, onClick, onBook }) {
  const today = new Date();
  const dayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][today.getDay()];
  const hasToday = (mentor.slots || []).some(s => s.day === dayName && s.status !== "booked");

  const collegeLocation = {
    "SRCC": "New Delhi, India",
    "Hindu College": "New Delhi, India",
    "LSR": "New Delhi, India",
    "Hansraj": "New Delhi, India",
    "NMIMS": "Mumbai, India",
    "KMC": "Manipal, India",
  };
  const location = collegeLocation[mentor.college] || "New Delhi, India";

  return (
    <div style={{ background: "#fff", border: "1px solid #E8E2D9", borderRadius: 16, padding: "20px 24px", display: "flex", gap: 20, alignItems: "flex-start", transition: "all 0.2s", cursor: "pointer", marginBottom: 12, fontFamily: "'Gilroy', sans-serif" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#E93800"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(233,56,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E2D9"; e.currentTarget.style.boxShadow = "none"; }}>
      <img src={mentor.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=F0EDE8&color=888&size=120`}
        alt={mentor.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", flexShrink: 0, background: "#F0EDE8" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginBottom: 8 }}>{mentor.name}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#555" }}>
            <span>🎓</span><span>{mentor.college}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#555" }}>
            <span>📖</span><span>{mentor.course} · {mentor.year}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#555" }}>
            <span>📍</span><span>{location}</span>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #F0EDE8", paddingTop: 10, display: "flex", alignItems: "center", gap: 16, fontSize: 13 }}>
          <span style={{ fontWeight: 700, color: "#111" }}>₹{mentor.price || 250}<span style={{ fontWeight: 400, color: "#888" }}> / 30 min</span></span>
          <span style={{ color: "#888" }}>|</span>
          <span style={{ color: "#888" }}>{mentor.sessions || 0} sessions taken</span>
          <span style={{ color: "#888" }}>|</span>
          <span style={{ color: "#F59E0B" }}>★</span>
          <span style={{ color: "#555" }}>{(mentor.rating || 5).toFixed(1)} ({mentor.sessions || 0})</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
        <div style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: hasToday ? "#22C55E" : "#E8E2D9", display: "inline-block" }} />
          {hasToday ? "Available Today" : "No slots today"}
        </div>
        <button onClick={e => { e.stopPropagation(); onClick({ mentor, screen: "slots" }); }}
          style={{ background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Gilroy', sans-serif", whiteSpace: "nowrap" }}>
          Book A Session
        </button>
        <button onClick={e => { e.stopPropagation(); onClick({ mentor, screen: "profile" }); }}
          style={{ background: "transparent", color: "#111", border: "1.5px solid #E8E2D9", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Gilroy', sans-serif", whiteSpace: "nowrap" }}>
          View Profile
        </button>
      </div>
    </div>
  );
}

function MentorDiscovery({ onBook }) {
  const [mentors, setMentors] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try { const data = await apiFetch("/mentors"); setMentors(data); }
    catch { setMentors([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);

  const colleges = [...new Set(mentors.map(m => m.college))];
  const filtered = mentors.filter(m => {
    const matchCollege = !filter || m.college === filter;
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.college.toLowerCase().includes(search.toLowerCase()) || (m.course || "").toLowerCase().includes(search.toLowerCase());
    return matchCollege && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Gilroy', sans-serif", color: "#111" }}>
      {/* Header */}
      <div style={{ background: "#FFF0EB", padding: "40px 48px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, color: "#888", textTransform: "uppercase", marginBottom: 16 }}>Find Your Mentor</div>
          <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 12 }}>
            Talk to a <span style={{ color: "#E93800", fontStyle: "italic" }}>real senior</span><br />before you choose your college
          </h1>
          <p style={{ color: "#666", fontSize: 15, marginBottom: 0 }}>Connect with current college students through 30 minute 1:1 calls to understand admissions, academics, campus life, and make the right choice.</p>
        </div>
      </div>

      {/* Filters + Search */}
<div style={{ background: "#fff", padding: "14px 48px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
<div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setFilter("")} style={{ background: !filter ? "#E93800" : "transparent", color: !filter ? "#fff" : "#111", border: `1.5px solid ${!filter ? "#E93800" : "#E8E2D9"}`, padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Gilroy', sans-serif" }}>All</button>
          {colleges.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{ background: filter === c ? "#E93800" : "transparent", color: filter === c ? "#fff" : "#111", border: `1.5px solid ${filter === c ? "#E93800" : "#E8E2D9"}`, padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Gilroy', sans-serif" }}>{c}</button>
            ))}
          </div>
          <input placeholder="Search for course, college, etc." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: "#FAF7F2", border: "1.5px solid #E8E2D9", borderRadius: 20, padding: "8px 18px", fontSize: 13, outline: "none", fontFamily: "'Gilroy', sans-serif", color: "#111", minWidth: 240 }}
            onFocus={e => e.target.style.borderColor="#E93800"} onBlur={e => e.target.style.borderColor="#E8E2D9"} />
        </div>
      </div>

      {/* Mentor List */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 48px" }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: "#111", marginBottom: 20 }}>{filtered.length} Mentor{filtered.length !== 1 ? "s" : ""} Available</div>
        {loading ? <div style={{ textAlign: "center", color: "#888", padding: 60 }}>Loading mentors...</div> :
          filtered.length === 0 ? <div style={{ textAlign: "center", color: "#888", padding: 60 }}>No mentors found</div> :
          filtered.map((m, i) => (
            <MentorCard key={m._id} mentor={m}
              onClick={setSelected}
              onBook={(mentor) => { setSelected(null); onBook(mentor, null); }} />
          ))}
      </div>
      {selected && <MentorModal mentor={selected.mentor} initialScreen={selected.screen} onClose={() => setSelected(null)} onBook={(m, slot, form) => { setSelected(null); onBook(m, slot, form); }} />}
      <div style={{ background: "#111", color: "#fff", padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginTop: 40 }}>
        <img src="https://res.cloudinary.com/dlzqb06u6/image/upload/v1775449181/Logo_Dark_Mode_hhg8xt.png" alt="Proxima" style={{ height: 28, objectFit: "contain" }} />
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#aaa" }}>+91 9354249942</span>
          <span style={{ fontSize: 13, color: "#aaa" }}>+91 8130900858</span>
          <span style={{ fontSize: 13, color: "#aaa" }}>proxima.info1@gmail.com</span>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: "#aaa", fontSize: 13, textDecoration: "none", border: "1px solid #444", borderRadius: 6, padding: "4px 10px" }}>in</a>
        </div>
      </div>
    </div>
  );
}

function MentorModal({ mentor, onClose, onBook, initialScreen = "profile" }) {
  const [screen, setScreen] = useState(initialScreen);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", code: "", message: "" });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const shortDays = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const next7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    const dayName = days[d.getDay()];
    const slots = (mentor.slots || []).filter(s => s.day === dayName);
    return { label: i === 0 ? "TODAY" : shortDays[d.getDay()], num: d.getDate(), dayName, date: d, slots, dateStr: `${dayName}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` };
  });

  const computeEnd = (slot) => {
    if (!slot) return "";
    const [time, period] = slot.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    m += 30; if (m >= 60) { m -= 60; h += 1; }
    const ep = h >= 12 ? "PM" : "AM";
    const eh = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    return `${eh.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")} ${ep}`;
  };

  const categorize = (slots) => {
    const morning=[], afternoon=[], evening=[];
    slots.forEach(s => {
      const t = formatTime(s.time);
      const [time, period] = t.split(" ");
      const [h] = time.split(":").map(Number);
      const h24 = period === "PM" && h !== 12 ? h+12 : (period === "AM" && h === 12 ? 0 : h);
      if (h24 < 12) morning.push(s);
      else if (h24 < 17) afternoon.push(s);
      else evening.push(s);
    });
    return { morning, afternoon, evening };
  };

  const SlotGroup = ({ label, slots }) => slots.length === 0 ? null : (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, color: "#888", fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {slots.map((s, i) => {
          const t = formatTime(s.time);
          const isBooked = s.status === "booked";
          const isSelected = selectedSlot === t;
          return (
            <button key={i} disabled={isBooked} onClick={() => !isBooked && setSelectedSlot(t)}
              style={{ border: `1.5px solid ${isSelected ? "#E93800" : "#ddd"}`, background: isBooked ? "#f5f5f5" : "#fff", borderRadius: 6, padding: "7px 12px", fontSize: 13, cursor: isBooked ? "not-allowed" : "pointer", color: isBooked ? "#bbb" : isSelected ? "#E93800" : "#111", fontWeight: isSelected ? 600 : 400, textDecoration: isBooked ? "line-through" : "none", fontFamily: "'Gilroy', sans-serif" }}>
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );

  const LS = { background: "#FFF0EB", padding: "28px 24px", width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 };
  const RS = { flex: 1, padding: "28px 24px", overflowY: "auto", minWidth: 0, maxWidth: "calc(100% - 220px)", boxSizing: "border-box" };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: screen === "invoice" ? 560 : 680, position: "relative", fontFamily: "'Gilroy', sans-serif", color: "#111", overflow: "hidden", marginBottom: 0 }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 20, zIndex: 10 }}>✕</button>

        {/* PROFILE SCREEN */}
        {screen === "profile" && (
          <div style={{ padding: "28px 28px 20px" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 20 }}>
              <img src={mentor.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=FFF0EB&color=E93800&size=120`}
                alt={mentor.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", marginBottom: 8 }}>{mentor.name}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13, marginBottom: 4 }}>📍 {mentor.college}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13, marginBottom: 4 }}>🎓 {mentor.course} · {mentor.year}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 8 }}>
                  <Stars rating={mentor.rating || 5} />
                  <span style={{ color: "#888" }}>({mentor.sessions || 0} sessions)</span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["DU", "Admissions", "Campus Life", "Academics"].map(t => (
                    <span key={t} style={{ background: "#f5f5f5", borderRadius: 20, padding: "3px 10px", fontSize: 12, color: "#555" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>About</div>
              <p style={{ color: "#555", fontSize: 14, lineHeight: 1.7 }}>{mentor.bio}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: "#111" }}>₹{mentor.price || 250}<span style={{ color: "#888", fontWeight: 400, fontSize: 13 }}>/30 min</span></div>
              <button onClick={() => setScreen("slots")} style={{ background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Gilroy', sans-serif" }}>Book a Session →</button>
            </div>
          </div>
        )}

        {/* SLOTS SCREEN */}
        {screen === "slots" && (
          <div style={{ display: "flex", background: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 0 }}>
            <div style={LS}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Booking a session with</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#111" }}>{mentor.name}</div>
              <div style={{ borderBottom: "1px solid #f0d5cb", margin: "10px 0" }} />
              <div style={{ fontSize: 13, color: "#555" }}>30 min · ₹{mentor.price || 250}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 8 }}>Asia/Kolkata (IST)</div>
            </div>
            <div style={RS}>
              <button onClick={() => setScreen("profile")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#555", display: "flex", alignItems: "center", gap: 5, padding: 0, fontFamily: "'Gilroy', sans-serif", marginBottom: 18 }}>← Back To Profile</button>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#111", marginBottom: 14 }}>Choose Availability</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                {next7.map((d, i) => (
                  <button key={i} disabled={d.slots.length === 0} onClick={() => { setSelectedDay(d); setSelectedSlot(null); }}
                    style={{ border: `1.5px solid ${selectedDay?.dayName === d.dayName ? "#E93800" : "#ddd"}`, background: selectedDay?.dayName === d.dayName ? "#E93800" : "#fff", borderRadius: 8, padding: "8px 10px", textAlign: "center", cursor: d.slots.length === 0 ? "not-allowed" : "pointer", minWidth: 54, opacity: d.slots.length === 0 ? 0.4 : 1, fontFamily: "'Gilroy', sans-serif" }}>
                    <span style={{ fontSize: 11, color: selectedDay?.dayName === d.dayName ? "#fff" : "#888", display: "block" }}>{d.label}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: selectedDay?.dayName === d.dayName ? "#fff" : "#111", display: "block" }}>{d.num}</span>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>IST (Asia/Kolkata)</div>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#111", marginBottom: 14 }}>Choose Time Slot</div>
              {!selectedDay && <div style={{ color: "#888", fontSize: 14, padding: "20px 0" }}>Select a day to see available slots.</div>}
              {selectedDay && (() => { const { morning, afternoon, evening } = categorize(selectedDay.slots); return (<><SlotGroup label="Morning" slots={morning} /><SlotGroup label="Afternoon" slots={afternoon} /><SlotGroup label="Evening" slots={evening} /></>); })()}
              <div style={{ marginTop: 20, textAlign: "right" }}>
                <button onClick={() => selectedSlot && setScreen("form")} disabled={!selectedSlot}
                  style={{ background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: selectedSlot ? "pointer" : "not-allowed", opacity: selectedSlot ? 1 : 0.4, fontFamily: "'Gilroy', sans-serif" }}>
                  Confirm My Slot
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FORM SCREEN */}
        {screen === "form" && (
          <div style={{ display: "flex", background: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 0 }}>
            <div style={LS}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>You are booking a 1:1 call with</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#111" }}>{mentor.name}</div>
              <div style={{ borderBottom: "1px solid #f0d5cb", margin: "10px 0" }} />
              <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Asia/Kolkata</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#111", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>📅 {selectedDay?.dateStr}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#111", fontSize: 13, marginBottom: 8 }}>🕐 {selectedSlot} - {computeEnd(selectedSlot)}</div>
              <button onClick={() => setScreen("slots")} style={{ background: "none", border: "none", cursor: "pointer", color: "#E93800", fontSize: 12, padding: 0, fontFamily: "'Gilroy', sans-serif" }}>✏ Edit Schedule</button>
              <div style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", fontSize: 11.5, color: "#555", display: "flex", gap: 8, alignItems: "flex-start", marginTop: "auto" }}>
                ✓ We offer a complete spam-free service, and would never contact you without your consent
              </div>
            </div>
            <div style={RS}>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#111", marginBottom: 18 }}>Please fill your details to confirm booking</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12, width: "100%" }}>
                {[["Enter Full Name*","name","text","ABC DEF"],["Enter Email*","email","email","abc@gmail.com"]].map(([label,key,type,ph]) => (
                  <div key={key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <label style={{ fontSize: 12, color: "#555", fontWeight: 500 }}>{label}</label>
                    <input type={type} placeholder={ph} value={form[key]} onChange={e => upd(key, e.target.value)}
                      style={{ border: "1.5px solid #ddd", borderRadius: 8, padding: "10px 12px", fontSize: 13, outline: "none", fontFamily: "'Gilroy', sans-serif", color: "#111" ,background: "#fff"}}
                      onFocus={e => e.target.style.borderColor="#E93800"} onBlur={e => e.target.style.borderColor="#ddd"} />
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12, width: "100%" }}>
                {[["Enter Phone Number*","phone","tel","9582269787"],["Referral Code (optional)","code","text","ABCDE12345"]].map(([label,key,type,ph]) => (
                  <div key={key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <label style={{ fontSize: 12, color: "#555", fontWeight: 500 }}>{label}</label>
                    <input type={type} placeholder={ph} value={form[key]} onChange={e => upd(key, e.target.value)}
                      style={{ border: "1.5px solid #ddd", borderRadius: 8, padding: "10px 12px", fontSize: 13, outline: "none", fontFamily: "'Gilroy', sans-serif", color: "#111" , background: "#fff"}}
                      onFocus={e => e.target.style.borderColor="#E93800"} onBlur={e => e.target.style.borderColor="#ddd"} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "#555", fontWeight: 500 }}>Please briefly describe your query*</label>
                <textarea rows={4} placeholder="e.g. I want to know about admissions and campus life..." value={form.message} onChange={e => upd("message", e.target.value)}
                  style={{ border: "1.5px solid #ddd", borderRadius: 8, padding: "10px 12px", fontSize: 13, outline: "none", fontFamily: "'Gilroy', sans-serif", color: "#111", resize: "none", background: "#fff", width: "100%", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor="#E93800"} onBlur={e => e.target.style.borderColor="#ddd"} />
              </div>
              <div style={{ textAlign: "right" }}>
                <button onClick={() => { if (!form.name||!form.email||!form.phone||!form.message) { alert("Please fill all required fields."); return; } setScreen("invoice"); }}
                  style={{ background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Gilroy', sans-serif" }}>
                  Review Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* INVOICE SCREEN */}
        {screen === "invoice" && (
          <div style={{ padding: 28 }}>
            <button onClick={() => setScreen("form")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#555", display: "flex", alignItems: "center", gap: 5, padding: 0, fontFamily: "'Gilroy', sans-serif", marginBottom: 18 }}>← Back</button>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#111", marginBottom: 20 }}>Your 30 minute 1:1 call booking summary</div>
            {[["Mentor", mentor.name],["College", mentor.college],["Course", mentor.course],["Date & Time", `${selectedDay?.dateStr} | ${selectedSlot}`],["Your Name", form.name],["Your Email", form.email],["Your Phone", form.phone]].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0", fontSize: 14 }}>
                <span style={{ color: "#888" }}>{label}</span>
                <span style={{ fontWeight: 500 }}>{val}</span>
              </div>
            ))}
            <div style={{ background: "#FFF5F2", borderRadius: 10, padding: "16px 18px", margin: "16px 0" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#888", marginBottom: 10 }}>INVOICE DETAILS</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "6px 0" }}><span>Appointment Cost</span><span>₹{mentor.price || 250}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, borderTop: "1px solid #f0c8b8", marginTop: 4, paddingTop: 10 }}><span>To Pay</span><span>₹{mentor.price || 250}</span></div>
            </div>
            <div style={{ textAlign: "right" }}>
              <button onClick={() => onBook(mentor, `${selectedDay?.dayName} ${selectedSlot}`, form)}
                style={{ background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Gilroy', sans-serif" }}>
                Secure Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingFlow({ mentor, slot, onDone }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("proxima_booking_form") || "{}"); } catch { return {}; }
  });

  const RAZORPAY_KEY = "rzp_test_SeX3eqFxJgWXIh";

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handlePay = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay failed to load");
      const { orderId, amount } = await apiFetch("/payment/create-order", {
        method: "POST",
        body: { amount: mentor.price || 250, mentorId: mentor._id, slot, studentName: form.name },
      });
      const options = {
        key: RAZORPAY_KEY,
        amount,
        currency: "INR",
        name: "Proxima",
        description: `Session with ${mentor.name} — ${slot}`,
        image: "https://res.cloudinary.com/dlzqb06u6/image/upload/v1775389312/wbzrczuoo9swrhfvxhrx.png",
        order_id: orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#E93800" },
        handler: async (response) => {
          const verified = await apiFetch("/payment/verify", {
            method: "POST",
            body: { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature },
          });
          if (!verified.success) throw new Error("Payment verification failed");
          await apiFetch("/bookings", {
            method: "POST",
            body: { mentorId: mentor._id, mentorName: mentor.name, slot, studentName: form.name, studentEmail: form.email, studentPhone: form.phone, message: form.message, referralCode: form.code, paymentId: response.razorpay_payment_id },
          });
          wa(mentor.whatsapp, `New booking! Student: ${form.name}, Slot: ${slot}`);
          setDone(true);
        },
      };
      new window.Razorpay(options).open();
    } catch (e) { alert("Payment failed: " + e.message); }
    finally { setLoading(false); }
  };

  if (done) return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: 440 }}>
        <div style={{ fontSize: 60, marginBottom: 24 }}>🎉</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 12, fontFamily: "'Gilroy', sans-serif" }}>Booking Confirmed!</h2>
        <p style={{ color: "#666", lineHeight: 1.7, marginBottom: 24 }}>Your session with {mentor.name} is booked for {slot}. You'll receive a confirmation shortly.</p>
        <button onClick={onDone} style={{ background: "#111", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Gilroy', sans-serif" }}>Back to Home</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 480, width: "100%", border: "1px solid #E8E2D9" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111", marginBottom: 8, fontFamily: "'Gilroy', sans-serif" }}>Complete Your Booking</h2>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Session with {mentor.name} · {slot}</p>
        <div style={{ background: "#FFF5F2", borderRadius: 10, padding: "16px 18px", marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#888", marginBottom: 10 }}>INVOICE</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "6px 0" }}><span>Session Cost</span><span>₹{mentor.price || 250}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, borderTop: "1px solid #f0c8b8", marginTop: 4, paddingTop: 10 }}><span>Total</span><span>₹{mentor.price || 250}</span></div>
        </div>
        <button onClick={handlePay} disabled={loading}
          style={{ width: "100%", background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Gilroy', sans-serif", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Processing..." : "Secure Checkout →"}
        </button>
      </div>
    </div>
  );
}

function MentorLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!email || !pin) return;
    setLoading(true);
    try {
      const data = await apiFetch("/mentor/login", { method: "POST", body: { email, pin } });
      onLogin(data);
    } catch { setErr("Invalid email or PIN. Please check with Proxima team."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>

      {/* Background decoration */}
      <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(233,56,0,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,0,175,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>

        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <img src="https://res.cloudinary.com/dlzqb06u6/image/upload/v1775389312/wbzrczuoo9swrhfvxhrx.png" alt="Proxima" style={{ height: 40, objectFit: "contain", marginBottom: 8 }} />
          <div style={{ color: "#555", fontSize: 13, marginTop: 8, letterSpacing: 2, textTransform: "uppercase" }}>Mentor Portal</div>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", border: "1px solid #E8E2D9", borderRadius: 20, padding: 40 }}>
          <h2 style={{ fontFamily: "'Gilroy', sans-serif", fontSize: 26, fontWeight: 800, color: "#111", marginBottom: 6 }}>Welcome back</h2>
          <p style={{ color: "#666", fontSize: 14, marginBottom: 32 }}>Sign in to manage your sessions and slots</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Email Address</label>
              <input
                placeholder="your@email.com"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && handle()}
                style={{ background: "#FAF7F2", border: "1px solid #E8E2D9", color: "#111", borderRadius: 10, padding: "13px 16px", width: "100%", fontFamily: "'Gilroy', sans-serif", fontSize: 15, outline: "none", transition: "border 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#E93800"}
                onBlur={e => e.target.style.borderColor = "#E8E2D9"}
              />
            </div>
            <div>
              <label style={{ color: "#888", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>4-Digit PIN</label>
              <input
                placeholder="••••"
                type="password"
                maxLength={4}
                value={pin}
                onChange={e => { setPin(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && handle()}
                style={{ background: "#222", border: `1px solid ${S.border}`, color: S.text, borderRadius: 10, padding: "13px 16px", width: "100%", fontFamily: "'DM Sans', sans-serif", fontSize: 20, letterSpacing: 8, outline: "none", transition: "border 0.2s" }}
                onFocus={e => e.target.style.borderColor = S.accent}
                onBlur={e => e.target.style.borderColor = S.border}
              />
            </div>
            {err && (
              <div style={{ background: "rgba(233,56,0,0.08)", border: `1px solid rgba(233,56,0,0.2)`, borderRadius: 8, padding: "10px 14px", color: S.accent, fontSize: 13 }}>
                ⚠ {err}
              </div>
            )}
            <button
              onClick={handle}
              disabled={loading || !email || !pin}
              style={{ background: loading || !email || !pin ? "#333" : S.accent, color: loading || !email || !pin ? "#666" : "#fff", border: "none", padding: "14px 28px", borderRadius: 10, fontSize: 15, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: loading || !email || !pin ? "not-allowed" : "pointer", transition: "all 0.2s", marginTop: 4 }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, color: "#444", fontSize: 13 }}>
          Don't have your PIN? Contact the Proxima team.
        </div>
      </div>
    </div>
  );
}

function SlotManager({ mentor, onSave }) {
  const [days, setDays] = useState({});
  const times = generateTimeSlots();
  const toggleDay = (day) => setDays(d => d[day] ? (({ [day]: _, ...rest }) => rest)(d) : { ...d, [day]: [{ from: "09:00", to: "11:00" }] });
  const addRange = (day) => setDays(d => ({ ...d, [day]: [...d[day], { from: "14:00", to: "16:00" }] }));
  const removeRange = (day, i) => setDays(d => { const ranges = d[day].filter((_, idx) => idx !== i); return ranges.length ? { ...d, [day]: ranges } : (({ [day]: _, ...rest }) => rest)(d); });
  const updateRange = (day, i, k, v) => setDays(d => { const ranges = [...d[day]]; ranges[i] = { ...ranges[i], [k]: v }; return { ...d, [day]: ranges }; });
  const allSlots = Object.entries(days).flatMap(([day, ranges]) => generateSlotsFromRanges(ranges.map(r => ({ ...r, day }))));

  const handleSave = async () => {
    try { await apiFetch(`/mentors/${mentor._id}/slots`, { method: "PUT", body: { slots: allSlots } }); alert("Your slots have been updated!"); onSave(); }
    catch { alert("Failed to save slots"); }
  };

  return (
    <div>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 20 }}>Manage Your Slots</div>
      {DAYS.map(day => (
        <div key={day} style={{ marginBottom: 16, background: "#fff", border: "1px solid #E8E2D9", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: days[day] ? 16 : 0 }}>
            <span style={{ fontWeight: 500 }}>{day}</span>
            <button onClick={() => toggleDay(day)} style={{ background: days[day] ? "#E93800" : "transparent", border: `1px solid ${days[day] ? "#E93800" : "#E8E2D9"}`, color: days[day] ? "#fff" : "#888", padding: "4px 14px", borderRadius: 20, fontSize: 13, fontFamily: "'Gilroy', sans-serif", cursor: "pointer" }}>{days[day] ? "Active" : "Off"}</button>
          </div>
          {days[day] && days[day].map((range, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <select value={range.from} onChange={e => updateRange(day, i, "from", e.target.value)} style={{ flex: 1 }}>{times.map(t => <option key={t} value={t}>{formatTime(t)}</option>)}</select>
              <span style={{ color: "#888" }}>to</span>
              <select value={range.to} onChange={e => updateRange(day, i, "to", e.target.value)} style={{ flex: 1 }}>{times.map(t => <option key={t} value={t}>{formatTime(t)}</option>)}</select>
              <button onClick={() => removeRange(day, i)} style={{ background: "none", border: "none", color: "#888" }}><X /></button>
            </div>
          ))}
          {days[day] && (
            <div>
              <div style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>{generateSlotsFromRanges(days[day].map(r => ({ ...r, day }))).length} slots: {generateSlotsFromRanges(days[day].map(r => ({ ...r, day }))).map(s => formatTime(s.time)).join(", ")}</div>
              <button onClick={() => addRange(day)} style={{ background: "none", border: "1px dashed #E8E2D9", color: "#888", padding: "6px 14px", borderRadius: 8, fontSize: 13, width: "100%", fontFamily: "'Gilroy', sans-serif", cursor: "pointer" }}>+ Add another range</button>
            </div>
          )}
        </div>
      ))}
      {allSlots.length > 0 && (
        <div style={{ background: "#FFF0EB", border: "1px solid #F0D5CB", borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <div style={{ fontWeight: 500, marginBottom: 8, color: "#E93800" }}>Preview — {allSlots.length} total slots</div>
          {DAYS.filter(d => days[d]).map(d => <div key={d} style={{ fontSize: 13, color: "#555", marginBottom: 4 }}><strong>{d}:</strong> {generateSlotsFromRanges(days[d].map(r => ({ ...r, day: d }))).map(s => formatTime(s.time)).join(", ")}</div>)}
        </div>
      )}
      <button className="btn-primary" onClick={handleSave} style={{ width: "100%" }}>Save Slots</button>
    </div>
  );
}

function MentorDashboard({ mentor, onLogout }) {
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(mentor.bio || "");
  const [savingBio, setSavingBio] = useState(false);

  useEffect(() => {
    apiFetch(`/bookings?mentorId=${mentor._id}`).then(setBookings).catch(() => {});
  }, [mentor._id]);

  const saveBio = async () => {
    setSavingBio(true);
    try {
      await apiFetch(`/mentors/${mentor._id}`, { method: "PUT", body: { ...mentor, bio } });
      setEditingBio(false);
      alert("Bio updated!");
    } catch { alert("Failed to update bio"); } finally { setSavingBio(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", fontFamily: "'Gilroy', sans-serif", color: "#111" }}>
      <style>{`
        .dash-card { background: #fff; border: 1px solid #E8E2D9; border-radius: 16px; padding: 24px; margin-bottom: 16px; transition: border 0.2s; }
        .dash-card:hover { border-color: #E93800; }
        .dash-tab { padding: 10px 24px; border: none; background: transparent; color: #888; font-size: 14px; font-family: 'Gilroy', sans-serif; border-bottom: 2px solid transparent; cursor: pointer; transition: all 0.2s; }
        .dash-tab.active { color: #E93800; border-bottom-color: #E93800; }
        .booking-card { background: #fff; border: 1px solid #E8E2D9; border-radius: 16px; padding: 24px; margin-bottom: 14px; transition: all 0.3s; }
        .booking-card:hover { border-color: #E93800; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(233,56,0,0.06); }
      `}</style>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E8E2D9", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
<img src="https://res.cloudinary.com/dlzqb06u6/image/upload/v1775389312/wbzrczuoo9swrhfvxhrx.png" alt="Proxima" style={{ height: 36, objectFit: "contain", filter: "none" }} />        <button onClick={onLogout} style={{ background: "none", border: "1.5px solid #111", color: "#111", padding: "8px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Gilroy', sans-serif" }}>
          <LogOut /> Sign out
        </button>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px" }}>

        {/* Profile Card */}
        <div style={{ background: "#FFF0EB", border: "1px solid #F0D5CB", borderRadius: 20, padding: 32, marginBottom: 32, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, rgba(233,56,0,0.08) 0%, transparent 70%)` }} />
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <img
                src={mentor.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=1C1C1C&color=E93800&size=120`}
                alt={mentor.name}
                style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: `3px solid ${S.accent}`, display: "block" }}
              />
              <div style={{ position: "absolute", bottom: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: "#22C55E", border: `2px solid ${S.card}` }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Gilroy', sans-serif", fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 4 }}>{mentor.name}</div>
                <div style={{ color: S.accent, fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{mentor.college}</div>
                <div style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>{mentor.course} · {mentor.year} Year</div>
                {editingBio ? (
                  <div>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      maxLength={200}
                      rows={3}
                      style={{ background: "#fff", border: "1px solid #E93800", color: "#111", borderRadius: 8, padding: "10px 14px", width: "100%", fontSize: 13, fontFamily: "'Gilroy', sans-serif", outline: "none", resize: "none" }}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button onClick={saveBio} disabled={savingBio} style={{ background: S.accent, color: "#fff", border: "none", padding: "7px 18px", borderRadius: 7, fontSize: 13, cursor: "pointer" }}>{savingBio ? "Saving..." : "Save Bio"}</button>
                      <button onClick={() => setEditingBio(false)} style={{ background: "transparent", color: "#888", border: `1px solid ${S.border}`, padding: "7px 18px", borderRadius: 7, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.7, flex: 1 }}>{bio || "No bio added yet."}</p>
                    <button onClick={() => setEditingBio(true)} style={{ background: "none", border: `1px solid ${S.border}`, color: "#888", padding: "5px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>✏ Edit Bio</button>
                  </div>
                )}
              </div>
              <div style={{ textAlign: "center", background: "rgba(233,56,0,0.08)", border: `1px solid rgba(233,56,0,0.2)`, borderRadius: 14, padding: "16px 24px" }}>
                <div style={{ fontSize: 40, fontWeight: 700, color: "#E93800", fontFamily: "'Gilroy', sans-serif" }}>{mentor.credits || 0}</div>
                <div style={{ color: "#888", fontSize: 12, marginTop: 2, textTransform: "uppercase", letterSpacing: 1 }}>Credits</div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14, marginBottom: 32 }}>
            {[
              ["Sessions", mentor.sessions || 0, "📞"],
              ["Bookings", bookings.length, "📅"],
              ["Rating", `${mentor.rating || 5}⭐`, ""],
              ["Price", `₹${mentor.price || 250}`, "💰"],
            ].map(([l, v, icon]) => (
              <div key={l} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: S.text }}>{v}</div>
                <div style={{ color: "#888", fontSize: 12, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: `1px solid ${S.border}`, display: "flex", marginBottom: 28 }}>
            {["bookings", "slots"].map(t => (
              <button key={t} className={`dash-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize", fontFamily: "'DM Sans', sans-serif" }}>{t === "bookings" ? `Bookings (${bookings.length})` : "Manage Slots"}</button>
            ))}
          </div>

          {/* Bookings */}
          {tab === "bookings" && (
            <div>
              {bookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                  <div style={{ fontSize: 16, color: "#888" }}>No bookings yet</div>
                  <div style={{ fontSize: 13, color: "#555", marginTop: 8 }}>Students will appear here once they book a session with you</div>
                </div>
              ) : bookings.map(b => (
                <div key={b._id} className="booking-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16, color: S.text }}>{b.studentName}</div>
                      <div style={{ color: S.accent, fontSize: 13, marginTop: 2 }}>📅 {b.slot}</div>
                    </div>
                    <div style={{ background: "rgba(233,56,0,0.1)", border: `1px solid rgba(233,56,0,0.2)`, color: S.accent, padding: "4px 12px", borderRadius: 20, fontSize: 12 }}>Confirmed</div>
                  </div>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    <div style={{ color: "#aaa", fontSize: 13 }}>📞 {b.studentPhone}</div>
                  </div>
                  {b.message && (
                    <div style={{ marginTop: 12, background: "#222", border: `1px solid ${S.border}`, borderRadius: 8, padding: "10px 14px", color: "#ccc", fontSize: 13, lineHeight: 1.6 }}>
                      💬 {b.message}
                    </div>
                  )}
                <div style={{ marginTop: 12 }}>
    {b.meetLink ? (
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <a href={b.meetLink} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: S.blue, color: "#fff", padding: "8px 18px", borderRadius: 8, fontSize: 13, textDecoration: "none" }}>🎥 Join Meet →</a>
        <span style={{ color: "#888", fontSize: 12 }}>Link shared with admin</span>
      </div>
    ) : (
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <input
          placeholder="Paste your Google Meet link here"
          id={`meet-${b._id}`}
          style={{ background: "#2A2A2A", border: `1px solid ${S.border}`, color: S.text, borderRadius: 8, padding: "8px 14px", fontSize: 13, outline: "none", flex: 1, minWidth: 200, fontFamily: "'DM Sans', sans-serif" }}
        />
        <button onClick={async () => {
          const link = document.getElementById(`meet-${b._id}`)?.value;
          if (!link) return;
          await apiFetch(`/bookings/${b._id}/meetlink`, { method: "PUT", body: { meetLink: link, meetSent: false } });
          wa(ADMIN_WHATSAPP, `Meet link from mentor ${mentor.name} for student ${b.studentName} (Slot: ${b.slot}):\n${link}\n\nPlease forward this to the student.`);
          alert("Meet link sent to admin!");
          window.location.reload();
        }} style={{ background: S.accent, color: "#fff", border: "none", padding: "8px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
          Send to Admin
        </button>
      </div>
    )}
  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "slots" && <SlotManager mentor={mentor} onSave={() => {}} />}
        </div>
      </div>
    );
  }

  function MentorRegistration({ onDone }) {
  const TOTAL = 6;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", college: "", course: "", year: "", email: "", whatsapp: "", bio: "", photo: "" });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try { const url = await uploadToCloudinary(file); upd("photo", url); setPreview(url); }
    catch { alert("Upload failed. Try again."); } finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await apiFetch("/registrations", { method: "POST", body: form });
      wa(ADMIN_WHATSAPP, `New Mentor Application!\nName: ${form.name}\nCollege: ${form.college}\nCourse: ${form.course}\nEmail: ${form.email}\nPhone: ${form.whatsapp}`);
      setStep(TOTAL);
    } catch { alert("Submission failed. Try again."); } finally { setSubmitting(false); }
  };

  const steps = [
    { label: "Name", content: <div><h2 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 8 }}>What's your full name?</h2><p style={{ color: "#888", marginBottom: 24 }}>This will appear on your public profile</p><input placeholder="Your full name" value={form.name} onChange={e => upd("name", e.target.value)} autoFocus /></div>, valid: form.name.trim() },
    { label: "College", content: <div><h2 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 8 }}>Your college details</h2><p style={{ color: "#888", marginBottom: 24 }}>Tell us where you study</p><div style={{ display: "flex", flexDirection: "column", gap: 14 }}><input placeholder="College name (e.g. SRCC)" value={form.college} onChange={e => upd("college", e.target.value)} /><input placeholder="Course / Programme" value={form.course} onChange={e => upd("course", e.target.value)} /><select value={form.year} onChange={e => upd("year", e.target.value)}><option value="">Select year</option><option value="1st">1st Year</option><option value="2nd">2nd Year</option><option value="3rd">3rd Year</option></select></div></div>, valid: form.college && form.course && form.year },
    { label: "Contact", content: <div><h2 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 8 }}>Contact details</h2><p style={{ color: "#888", marginBottom: 24 }}>Not shown publicly</p><div style={{ display: "flex", flexDirection: "column", gap: 14 }}><input placeholder="Email address" type="email" value={form.email} onChange={e => upd("email", e.target.value)} /><input placeholder="WhatsApp number" type="tel" value={form.whatsapp} onChange={e => upd("whatsapp", e.target.value)} /></div></div>, valid: form.email && form.whatsapp },
    { label: "Bio", content: <div><h2 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 8 }}>Tell students about yourself</h2><p style={{ color: "#888", marginBottom: 24 }}>Max 200 characters</p><textarea placeholder="e.g. 2nd year BCom Hons at SRCC. Happy to talk about college life..." rows={4} maxLength={200} value={form.bio} onChange={e => upd("bio", e.target.value)} /><div style={{ color: "#888", fontSize: 12, marginTop: 6, textAlign: "right" }}>{form.bio.length}/200</div></div>, valid: form.bio.trim().length >= 20 },
    { label: "Photo", content: <div><h2 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 8 }}>Add a profile photo</h2><p style={{ color: "#888", marginBottom: 24 }}>Clear, well-lit, face visible.</p>{preview && <div style={{ textAlign: "center", marginBottom: 20 }}><img src={preview} alt="preview" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "3px solid #E93800" }} /><div style={{ color: "#888", fontSize: 13, marginTop: 8 }}>Photo uploaded ✓</div></div>}<label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "14px 20px", border: "2px dashed #E8E2D9", borderRadius: 10, cursor: "pointer", color: "#888" }}>↑ {uploading ? "Uploading..." : "Click to upload photo"}<input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} /></label></div>, valid: true },
  ];

  if (step === TOTAL) return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, color: "#111" }}>
      <div style={{ textAlign: "center", maxWidth: 440 }}>
        <div style={{ fontSize: 60, marginBottom: 24 }}>🎉</div>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, fontFamily: "'Gilroy', sans-serif" }}>Thanks {form.name}!</h2>
        <p style={{ color: "#888", lineHeight: 1.7, marginBottom: 24 }}>We'll review your profile and get back to you within 24 hours.</p>
        <button onClick={onDone} style={{ background: "#111", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Gilroy', sans-serif" }}>Back to Home</button>
      </div>
    </div>
  );

  const current = steps[step - 1];
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FAF7F2", color: "#111", fontFamily: "'Gilroy', sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E8E2D9", padding: "14px 32px", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onDone} style={{ background: "none", border: "none", color: "#111", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Gilroy', sans-serif" }}>← Back to Home</button>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 520 }}>
          <div style={{ height: 3, background: "#E8E2D9", borderRadius: 2, marginBottom: 32, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#E93800", borderRadius: 2, width: `${((step - 1) / (TOTAL - 1)) * 100}%`, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Step {step} of {TOTAL - 1}</div>
          <div key={step}>{current.content}</div>
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            {step > 1 && <button style={{ flex: 1, background: "transparent", color: "#111", border: "1.5px solid #111", padding: "12px", borderRadius: 8, fontSize: 15, cursor: "pointer", fontFamily: "'Gilroy', sans-serif" }} onClick={() => setStep(s => s - 1)}>← Back</button>}
            {step < TOTAL - 1 && <button style={{ flex: 1, background: current.valid ? "#111" : "#ccc", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontSize: 15, cursor: current.valid ? "pointer" : "not-allowed", fontFamily: "'Gilroy', sans-serif" }} disabled={!current.valid} onClick={() => setStep(s => s + 1)}>Continue →</button>}
            {step === TOTAL - 1 && <button style={{ flex: 1, background: "#111", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontSize: 15, cursor: "pointer", fontFamily: "'Gilroy', sans-serif" }} onClick={handleSubmit} disabled={submitting}>{submitting ? "Submitting..." : "Submit Application"}</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState("");
  const handle = () => { if (pw === ADMIN_PASSWORD) onLogin(); else setErr("Incorrect password"); };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="modal fade-up" style={{ maxWidth: 360 }}>
        <h2 className="serif" style={{ fontSize: 24, marginBottom: 20 }}>Admin Access</h2>
        <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} />
        {err && <div style={{ color: S.accent, fontSize: 13, marginTop: 8 }}>{err}</div>}
        <button className="btn-primary" style={{ width: "100%", marginTop: 14 }} onClick={handle}>Login</button>
      </div>
    </div>
  );
}

function MentorForm({ data, onChange, onSave, onCancel }) {
  const refs = {
    name: useRef(null), college: useRef(null), course: useRef(null),
    email: useRef(null), whatsapp: useRef(null), referralCode: useRef(null),
    pin: useRef(null), bio: useRef(null), photo: useRef(null),
    price: useRef(null), rating: useRef(null), sessions: useRef(null), year: useRef(null),
  };

  const handleSave = () => {
    const updated = {};
    Object.entries(refs).forEach(([k, ref]) => {
      if (ref.current) updated[k] = ref.current.value;
    });
    updated.price = Number(updated.price || data.price || 250);
    updated.rating = Number(updated.rating || data.rating || 5);
    updated.sessions = Number(updated.sessions || data.sessions || 0);
    Object.entries(updated).forEach(([k, v]) => onChange(k, v));
    onSave();
  };

  const inp = { background: "#222", border: "1px solid #2A2A2A", color: "#fff", borderRadius: 8, padding: "12px 16px", width: "100%", fontFamily: "DM Sans, sans-serif", fontSize: 14, outline: "none" };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 560 }}>
        <h3 className="serif" style={{ fontSize: 22, marginBottom: 20 }}>{data._id ? "Edit Mentor" : "Add Mentor"}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input ref={refs.name} placeholder="Name" defaultValue={data.name || ""} style={inp} />
          <input ref={refs.college} placeholder="College" defaultValue={data.college || ""} style={inp} />
          <input ref={refs.course} placeholder="Course" defaultValue={data.course || ""} style={inp} />
          <input ref={refs.email} placeholder="Email" defaultValue={data.email || ""} style={inp} />
          <input ref={refs.whatsapp} placeholder="WhatsApp" defaultValue={data.whatsapp || ""} style={inp} />
          <input ref={refs.referralCode} placeholder="Referral Code" defaultValue={data.referralCode || ""} style={inp} />
          <input ref={refs.pin} placeholder="PIN (4 digits)" defaultValue={data.pin || "0000"} style={inp} />
          <select ref={refs.year} defaultValue={data.year || "1st"} style={inp}>
            <option value="1st">1st Year</option><option value="2nd">2nd Year</option><option value="3rd">3rd Year</option>
          </select>
          <input ref={refs.price} type="number" placeholder="Price (₹)" defaultValue={data.price || 250} style={inp} />
          <input ref={refs.rating} type="number" placeholder="Rating" step="0.1" min="1" max="5" defaultValue={data.rating || 5} style={inp} />
          <input ref={refs.sessions} type="number" placeholder="Sessions done" defaultValue={data.sessions || 0} style={inp} />
        </div>
        <textarea ref={refs.bio} placeholder="Bio (max 200 chars)" maxLength={200} rows={3} defaultValue={data.bio || ""} style={{ ...inp, marginTop: 12 }} />
        <div style={{ marginTop: 12 }}>
          {data.photo && <img src={data.photo} alt="" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", marginBottom: 8 }} />}
          <input ref={refs.photo} placeholder="Paste image URL" defaultValue={data.photo || ""} style={{ ...inp, marginTop: 4 }} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save</button>
        </div>
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
  const [notes, setNotes] = useState({});
  const [meetLinks, setMeetLinks] = useState({});
  const [sentMeet, setSentMeet] = useState({});

  const newMentorData = useRef({ name: "", college: "", course: "", year: "1st", bio: "", photo: "", email: "", whatsapp: "", price: 250, rating: 5, sessions: 0, referralCode: "", pin: "0000" });
  const editMentorData = useRef({});

  const load = useCallback(async () => {
    const [m, b, r, s] = await Promise.all([
      apiFetch("/mentors?all=true").catch(() => []),
      apiFetch("/bookings").catch(() => []),
      apiFetch("/registrations").catch(() => []),
      apiFetch("/stats").catch(() => ({})),
    ]);
    setMentors(m); setBookings(b); setRegs(r); setStats(s);
    const n = {}; b.forEach(bk => { if (bk.notes) n[bk._id] = bk.notes; });
    setNotes(n);
    const ml = {}; const sm = {};
    b.forEach(bk => { if (bk.meetLink) ml[bk._id] = bk.meetLink; if (bk.meetSent) sm[bk._id] = true; });
    setMeetLinks(ml); setSentMeet(sm);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleNewMentorChange = useCallback((k, v) => { newMentorData.current[k] = v; }, []);
  const handleEditMentorChange = useCallback((k, v) => { editMentorData.current[k] = v; }, []);

  const toggleVisibility = async (m) => { await apiFetch(`/mentors/${m._id}`, { method: "PUT", body: { ...m, visible: !m.visible } }); load(); };
  const deleteMentor = async (id) => { if (window.confirm("Delete mentor?")) { await apiFetch(`/mentors/${id}`, { method: "DELETE" }); load(); } };
  const saveNote = async (id) => { await apiFetch(`/bookings/${id}/notes`, { method: "PUT", body: { notes: notes[id] } }); };
  const sendMeet = (b) => {
    const link = meetLinks[b._id]; if (!link) return;
    wa(b.studentPhone, `Hi ${b.studentName}, your Proxima session with ${b.mentorName} is confirmed!\nSlot: ${b.slot}\nMeet Link: ${link}`);
    const mentor = mentors.find(m => m._id === b.mentorId || m.name === b.mentorName);
    if (mentor?.whatsapp) wa(mentor.whatsapp, `Hi ${mentor.name}, session with ${b.studentName}.\nSlot: ${b.slot}\nMeet Link: ${link}`);
    apiFetch(`/bookings/${b._id}/meetlink`, { method: "PUT", body: { meetLink: link, meetSent: true } });
    setSentMeet(s => ({ ...s, [b._id]: true }));
  };
  const approveReg = async (r) => { await apiFetch(`/registrations/${r._id}/approve`, { method: "PUT" }); load(); };
  const deleteBooking = async (id) => {
  if (window.confirm("Delete this booking?")) {
    await apiFetch(`/bookings/${id}`, { method: "DELETE" });
    load();
  }
};
  const rejectReg = async (id) => { await apiFetch(`/registrations/${id}`, { method: "DELETE" }); load(); };
  const addMentor = async () => {
    await apiFetch("/mentors", { method: "POST", body: { ...newMentorData.current, visible: true } });
    setShowAddMentor(false);
    newMentorData.current = { name: "", college: "", course: "", year: "1st", bio: "", photo: "", email: "", whatsapp: "", price: 250, rating: 5, sessions: 0, referralCode: "", pin: "0000" };
    load();
  };
  const saveMentor = async () => {
    await apiFetch(`/mentors/${editMentor._id}`, { method: "PUT", body: { ...editMentor, ...editMentorData.current } });
    setEditMentor(null); load();
  };

  return (
    <div className="admin-panel">
      <div className="admin-header" style={{ padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="https://res.cloudinary.com/dlzqb06u6/image/upload/v1775449181/Logo_Dark_Mode_hhg8xt.png" alt="Proxima" style={{ height: 48, objectFit: "contain" }} />
          <span style={{ color: S.textMuted, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", marginLeft: 8 }}>Admin Panel</span>
        </div>
        <button onClick={onLogout} style={{ background: `linear-gradient(135deg, rgba(233,56,0,0.15), rgba(233,56,0,0.05))`, border: `1px solid rgba(233,56,0,0.3)`, color: S.accentLight, padding: "10px 18px", borderRadius: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, transition: "all 0.3s", cursor: "pointer" }} onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, rgba(233,56,0,0.25), rgba(233,56,0,0.1))`; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, rgba(233,56,0,0.15), rgba(233,56,0,0.05))`; e.currentTarget.style.transform = "translateY(0)"; }}><LogOut /> Logout</button>
      </div>
      <div style={{ borderBottom: `1px solid ${S.border}`, display: "flex", paddingLeft: 32, background: "transparent", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(10px)" }}>
        {["stats","mentors","registrations","bookings"].map(t => (
          <button key={t} className={`admin-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>
            {t}{t === "registrations" && regs.length > 0 && <span className="badge-pending" style={{ marginLeft: 6 }}>{regs.length}</span>}
          </button>
        ))}
      </div>
      <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
        {tab === "stats" && (
          <div>
            <div style={{ marginBottom: 8, color: S.textMuted, fontSize: 14 }}>Dashboard Overview</div>
            <h2 className="admin-section-title">Analytics</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24, marginBottom: 40 }}>
              {[["Total Bookings", stats.totalBookings||0],["This Week", stats.weeklyBookings||0],["Active Mentors", stats.activeMentors||0],["Pending", stats.pendingRegistrations||0],["Credits Issued", stats.totalCredits||0]].map(([l,v]) => (
                <div key={l} className="stat-card">
                  <div style={{ color: S.textMuted, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>{l}</div>
                  <div className="glow-text" style={{ fontSize: 42, fontWeight: 800, background: `linear-gradient(135deg, ${S.accent}, ${S.accentLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background: `linear-gradient(145deg, ${S.card} 0%, ${S.adminSurface} 100%)`, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
              <div style={{ fontWeight: 600, marginBottom: 20, color: S.text, fontSize: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 4, height: 20, background: `linear-gradient(180deg, ${S.accent}, ${S.accentLight})`, borderRadius: 2 }}></span>
                Bookings per Mentor
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr>{["Mentor","College","Bookings","Credits"].map(h => <th key={h} style={{ textAlign: "left", color: S.textMuted, padding: "14px 16px", borderBottom: `1px solid ${S.border}`, fontWeight: 600, textTransform: "uppercase", fontSize: 11, letterSpacing: "1px" }}>{h}</th>)}</tr></thead>
                <tbody>{mentors.map(m => <tr key={m._id} style={{ transition: "background 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(233,56,0,0.08)"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}><td style={{ padding: "16px", fontWeight: 600, color: S.text }}>{m.name}</td><td style={{ color: S.textMuted }}>{m.college}</td><td style={{ color: S.text, fontWeight: 500 }}>{(stats.bookingsByMentor||{})[m._id]||0}</td><td style={{ color: S.accentLight, fontWeight: 700 }}>{m.credits||0}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        )}
        {tab === "mentors" && (
          <div>
            <div style={{ marginBottom: 8, color: S.textMuted, fontSize: 14 }}>Manage your team</div>
            <h2 className="admin-section-title">Mentors ({mentors.length})</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <button className="btn-primary" onClick={() => setShowAddMentor(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, background: `linear-gradient(135deg, ${S.accent}, ${S.accentLight})` }}><Plus /> Add Mentor</button>
            </div>
            {mentors.map(m => (
              <div key={m._id} className="admin-card" style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <img src={m.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=1C1C1C&color=E93800&size=56`} alt={m.name} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: `3px solid ${S.border}`, boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: S.text }}>{m.name}</div>
                  <div style={{ color: S.accentLight, fontSize: 14, fontWeight: 500, marginTop: 4 }}>{m.college}</div>
                  <div style={{ color: S.textMuted, fontSize: 13, marginTop: 2 }}>{m.course} · {m.year}</div>
                  <div style={{ fontSize: 12, color: S.textDim, marginTop: 6, display: "flex", gap: 16 }}>
                    <span>Code: <span style={{ color: S.accentLight, fontWeight: 600 }}>{m.referralCode||"—"}</span></span>
                    <span>Credits: <span style={{ color: S.success, fontWeight: 700 }}>{m.credits||0}</span></span>
                    <span>Sessions: <span style={{ color: S.textMuted }}>{m.sessions||0}</span></span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => toggleVisibility(m)} title={m.visible ? "Hide" : "Show"} style={{ background: m.visible ? `rgba(16,185,129,0.1)` : `rgba(233,56,0,0.1)`, border: `1px solid ${m.visible ? "rgba(16,185,129,0.3)" : `rgba(233,56,0,0.3)`}`, color: m.visible ? S.success : S.accentLight, padding: "10px 14px", borderRadius: 10, transition: "all 0.3s", display: "flex", alignItems: "center", gap: 6, fontWeight: 500, fontSize: 12 }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 4px 12px ${m.visible ? "rgba(16,185,129,0.2)" : "rgba(233,56,0,0.2)"}`; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>{m.visible ? <><Check /> Visible</> : <><EyeOff /> Hidden</>}</button>
                  <button onClick={() => { editMentorData.current={...m}; setEditMentor(m); }} title="Edit" style={{ background: `rgba(59,130,246,0.1)`, border: `1px solid rgba(59,130,246,0.3)`, color: S.blue, padding: "10px 14px", borderRadius: 10, transition: "all 0.3s", display: "flex", alignItems: "center", gap: 6, fontWeight: 500, fontSize: 12 }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,130,246,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}><Edit2 /> Edit</button>
                  <button onClick={() => deleteMentor(m._id)} title="Delete" style={{ background: `rgba(239,68,68,0.1)`, border: `1px solid rgba(239,68,68,0.3)`, color: "#EF4444", padding: "10px 14px", borderRadius: 10, transition: "all 0.3s", display: "flex", alignItems: "center", gap: 6, fontWeight: 500, fontSize: 12 }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(239,68,68,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}><Trash2 /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "registrations" && (
          <div>
            <div style={{ marginBottom: 8, color: S.textMuted, fontSize: 14 }}>Review and approve new mentors</div>
            <h2 className="admin-section-title">Pending Applications ({regs.length})</h2>
            {regs.length === 0 ? <div style={{ color: S.textMuted, textAlign: "center", padding: 80, background: `linear-gradient(145deg, ${S.card}, ${S.adminSurface})`, borderRadius: 16, border: `2px dashed ${S.border}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 48, opacity: 0.3 }}>📋</span>
              <div style={{ fontSize: 16, fontWeight: 600 }}>No pending applications</div>
              <div style={{ fontSize: 13, color: S.textDim }}>All caught up!</div>
            </div> :
              regs.map(r => (
                <div key={r._id} className="admin-card" style={{ position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: `linear-gradient(180deg, ${S.accent}, ${S.accentLight})`, borderRadius: "16px 0 0 16px" }}></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingLeft: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 18, color: S.text }}>{r.name}</div>
                      <div style={{ color: S.accentLight, fontSize: 14, fontWeight: 600, marginTop: 6 }}>{r.college} · {r.course}</div>
                      <div style={{ color: S.textMuted, fontSize: 13, marginTop: 8, display: "flex", gap: 16 }}>
                        <span>📧 {r.email}</span>
                        <span>📱 {r.whatsapp}</span>
                      </div>
                      <div style={{ color: S.textDim, fontSize: 14, marginTop: 12, lineHeight: 1.6, background: "#151515", padding: 14, borderRadius: 10 }}>{r.bio}</div>
                      <div style={{ fontSize: 12, color: S.textMuted, marginTop: 8 }}>Year: <span style={{ color: S.text }}>{r.year}</span></div>
                    </div>
                    {r.photo && <img src={r.photo} alt={r.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `3px solid ${S.accent}`, marginLeft: 20, boxShadow: "0 4px 20px rgba(233,56,0,0.3)" }} />}
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 24, paddingTop: 20, borderTop: `1px solid ${S.border}`, paddingLeft: 16 }}>
                    <button className="btn-blue" onClick={() => approveReg(r)} style={{ padding: "12px 24px", fontSize: 14, display: "flex", alignItems: "center", gap: 8, borderRadius: 10, background: `linear-gradient(135deg, ${S.success}, #059669)`, boxShadow: "0 4px 15px rgba(16,185,129,0.3)" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(16,185,129,0.4)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(16,185,129,0.3)"; }}><Check /> Approve Application</button>
                    <button onClick={() => rejectReg(r._id)} style={{ padding: "12px 24px", fontSize: 14, borderRadius: 10, background: "transparent", border: `1px solid rgba(239,68,68,0.3)`, color: "#EF4444", fontWeight: 500, transition: "all 0.3s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}>Reject</button>
                  </div>
                </div>
              ))}
          </div>
        )}
        {tab === "bookings" && (
          <div>
            <div style={{ marginBottom: 8, color: S.textMuted, fontSize: 14 }}>Track and manage all sessions</div>
            <h2 className="admin-section-title">All Bookings ({bookings.length})</h2>
            {bookings.length === 0 ? <div style={{ color: S.textMuted, textAlign: "center", padding: 80, background: `linear-gradient(145deg, ${S.card}, ${S.adminSurface})`, borderRadius: 16, border: `2px dashed ${S.border}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 48, opacity: 0.3 }}>📅</span>
              <div style={{ fontSize: 16, fontWeight: 600 }}>No bookings yet</div>
              <div style={{ fontSize: 13, color: S.textDim }}>Bookings will appear here</div>
            </div> :
              bookings.map(b => (
                <div key={b._id} className="admin-card" style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: `linear-gradient(180deg, ${S.blue}, #1D4ED8)`, borderRadius: "16px 0 0 16px" }}></div>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, paddingBottom: 16, borderBottom: `1px solid ${S.border}`, paddingLeft: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: 18, color: S.text }}>{b.studentName}</div>
                        <span style={{ color: S.accentLight, fontSize: 20 }}>→</span>
                        <div style={{ fontWeight: 600, fontSize: 16, color: S.textMuted }}>{b.mentorName}</div>
                      </div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `linear-gradient(135deg, rgba(233,56,0,0.2), rgba(255,107,53,0.1))`, border: `1px solid rgba(233,56,0,0.3)`, color: S.accentLight, fontSize: 13, fontWeight: 700, padding: "6px 14px", borderRadius: 8, marginTop: 6 }}>
                        <span style={{ width: 6, height: 6, background: S.success, borderRadius: "50%", display: "inline-block" }}></span>
                        {b.slot}
                      </div>
                      <div style={{ color: S.textMuted, fontSize: 13, marginTop: 12, display: "flex", gap: 20, flexWrap: "wrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>📧 {b.studentEmail}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>📞 {b.studentPhone}</span>
                      </div>
                      {b.message && <div style={{ color: S.textDim, fontSize: 14, marginTop: 12, lineHeight: 1.6, background: "#151515", padding: 14, borderRadius: 10, border: `1px solid ${S.border}` }}>{b.message}</div>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                      <div style={{ color: S.textMuted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", background: "#151515", padding: "6px 12px", borderRadius: 6, border: `1px solid ${S.border}` }}>{new Date(b.createdAt).toLocaleDateString()}</div>
                      <button onClick={() => deleteBooking(b._id)} style={{ background: `linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))`, border: `1px solid rgba(239,68,68,0.3)`, color: "#EF4444", padding: "10px 16px", borderRadius: 10, fontSize: 12, cursor: "pointer", transition: "all 0.3s", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(239,68,68,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>🗑 Delete</button>
                    </div>
                  </div>
                  <div style={{ marginTop: 16, display: "flex", gap: 24, flexWrap: "wrap", paddingLeft: 16 }}>
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <label className="admin-label"><span style={{ fontSize: 14 }}>📝</span> Private Notes</label>
                      <textarea placeholder="Add private notes..." rows={2} value={notes[b._id]||""} onChange={e => setNotes(n => ({...n,[b._id]:e.target.value}))} style={{ fontSize: 13, background: "#151515", border: `1px solid ${S.border}`, padding: 14, borderRadius: 10, resize: "vertical", minHeight: 75, color: S.text, transition: "border-color 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = S.accent; }} onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; }} />
                      <button onClick={() => saveNote(b._id)} style={{ background: `linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))`, border: `1px solid rgba(59,130,246,0.3)`, color: S.blue, padding: "8px 16px", borderRadius: 8, fontSize: 12, marginTop: 10, transition: "all 0.3s", fontWeight: 600, cursor: "pointer" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,130,246,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>💾 Save Note</button>
                    </div>
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <label className="admin-label"><span style={{ fontSize: 14 }}>🔗</span> Meet Link</label>
                      {b.meetLink ? (
                        <div>
                          <div style={{ color: S.blue, fontSize: 13, marginBottom: 12, wordBreak: "break-all", background: `linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.08))`, padding: 14, borderRadius: 10, border: `1px solid rgba(59,130,246,0.3)`, lineHeight: 1.5, boxShadow: "0 2px 10px rgba(59,130,246,0.1)" }}>{b.meetLink}</div>
                          <button onClick={() => {
                            wa(b.studentPhone, `Hi ${b.studentName}, your Proxima session is confirmed!\nSlot: ${b.slot}\nMeet Link: ${b.meetLink}\n\nSee you soon!`);
                            apiFetch(`/bookings/${b._id}/meetlink`, { method: "PUT", body: { meetLink: b.meetLink, meetSent: true } });
                            setSentMeet(s => ({ ...s, [b._id]: true }));
                          }} className="btn-blue" style={{ fontSize: 13, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8, borderRadius: 10, background: `linear-gradient(135deg, ${S.blue}, #1D4ED8)`, boxShadow: "0 4px 15px rgba(59,130,246,0.3)", fontWeight: 600 }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,130,246,0.4)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(59,130,246,0.3)"; }}>
                            {sentMeet[b._id] ? <><Check /> Forwarded to Student</> : <>📤 Forward to Student</>}
                          </button>
                        </div>
                      ) : (
                        <div style={{ color: S.textDim, fontSize: 13, padding: "18px", background: "#151515", borderRadius: 10, border: `2px dashed ${S.border}`, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span style={{ fontSize: 18 }}>⏳</span> Waiting for mentor to share meet link</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      {showAddMentor && <MentorForm data={newMentorData.current} onChange={handleNewMentorChange} onSave={addMentor} onCancel={() => setShowAddMentor(false)} />}
      {editMentor && <MentorForm data={editMentor} onChange={handleEditMentorChange} onSave={saveMentor} onCancel={() => setEditMentor(null)} />}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("landing");
  const [bookData, setBookData] = useState(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [mentorSession, setMentorSession] = useState(() => { try { return JSON.parse(localStorage.getItem("proxima_mentor")||"null"); } catch { return null; } });

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) setView(hash);
    const handlePop = () => {
      const h = window.location.hash.replace("#", "") || "landing";
      setView(h);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigate = (v) => { window.history.pushState({ view: v }, "", `#${v}`); setView(v); };
  const mentorLogin = (mentor) => { localStorage.setItem("proxima_mentor", JSON.stringify(mentor)); setMentorSession(mentor); navigate("mentor-dashboard"); };
  const mentorLogout = () => { localStorage.removeItem("proxima_mentor"); setMentorSession(null); navigate("landing"); };

  if (view === "admin") return adminLoggedIn ? <AdminPanel onLogout={() => { setAdminLoggedIn(false); navigate("landing"); }} /> : <AdminLogin onLogin={() => setAdminLoggedIn(true)} />;
  if (view === "mentor-login") return <MentorLogin onLogin={mentorLogin} />;
  if (view === "mentor-dashboard" && mentorSession) return <MentorDashboard mentor={mentorSession} onLogout={mentorLogout} />;

  return (
    <>
      <style>{css}</style>
      {view === "landing" && <Landing onMentee={() => navigate("discovery")} onMentor={() => navigate("register")} />}
      {view === "discovery" && <MentorDiscovery onBook={(m,s) => { setBookData({mentor:m,slot:s}); navigate("booking"); }} />}
      {view === "booking" && bookData && <BookingFlow mentor={bookData.mentor} slot={bookData.slot} onDone={() => { setBookData(null); navigate("discovery"); }} />}
      {view === "register" && <MentorRegistration onDone={() => navigate("landing")} />}
      <footer style={{ textAlign: "center", padding: "20px", borderTop: `1px solid ${S.border}`, color: "#555", fontSize: 12 }}>
        © 2025 Proxima &nbsp;·&nbsp;
        <a href="#mentor-login" onClick={() => setView("mentor-login")} style={{ color: "#555", textDecoration: "none" }}>Mentor Login</a>
        &nbsp;·&nbsp;
        <a href="#admin" onClick={() => setView("admin")} style={{ color: "#333", textDecoration: "none" }}>·</a>
      </footer>
    </>
  );
}










