import React, { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   INLINE STYLES  (zero external deps beyond React)
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --indigo:  #4f46e5;
    --violet:  #7c3aed;
    --rose:    #e11d48;
    --sky:     #0ea5e9;
    --emerald: #10b981;
    --amber:   #f59e0b;
    --slate:   #64748b;
    --ink:     #0f0f1a;
    --paper:   #ffffff;
    --mist:    #f8f7ff;
    --border:  rgba(0,0,0,0.07);
    --font-body: 'DM Sans', sans-serif;
    --font-display: 'Fraunces', serif;
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: var(--paper); color: var(--ink); overflow-x: hidden; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: var(--indigo); border-radius: 99px; }

  /* ── Blobs ── */
  @keyframes blobDrift {
    0%,100% { transform: translate(0,0) scale(1); }cle  
    66%     { transform: translate(-16px,22px) scale(0.94); }
  }

  /* ── Page transitions ── */
  @keyframes pageIn  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes toastIn { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
  @keyframes bounce  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  @keyframes cardIn {
    from { opacity:0; transform:translateY(20px) scale(0.97); }
    to   { opacity:1; transform:translateY(0)   scale(1);    }
  }
  @keyframes navIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }

  .page-enter { animation: pageIn 0.5s cubic-bezier(.22,1,.36,1) both; }

  /* ── Auth Layout ── */
  .auth-shell {
    display: flex;
    min-height: 100vh;
  }

  /* LEFT panel */
  .auth-left {
    width: 46%;
    position: relative;
    overflow: hidden;
    background: linear-gradient(150deg, #312e81 0%, #4f46e5 40%, #7c3aed 75%, #be185d 100%);
    padding: 52px 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .left-noise {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.35;
  }
  .left-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
  }
  .lb1 { width:280px; height:280px; background:rgba(224,176,255,0.18); top:-80px; right:-60px; animation: blobDrift 18s ease-in-out infinite; }
  .lb2 { width:220px; height:220px; background:rgba(99,102,241,0.25);  bottom:40px; left:-40px; animation: blobDrift 22s 4s ease-in-out infinite; }
  .lb3 { width:140px; height:140px; background:rgba(236,72,153,0.18);  top:45%;    right:10%;  animation: blobDrift 15s 2s ease-in-out infinite; }

  .left-brand { display:flex; align-items:center; gap:12px; position:relative; z-index:2; }
  .left-brand-mark {
    width:42px; height:42px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius:12px;
    display:flex; align-items:center; justify-content:center;
    font-size:20px;
  }
  .left-brand-name { color:#fff; font-size:20px; font-weight:700; letter-spacing:-0.4px; }

  .left-body { position:relative; z-index:2; }
  .left-eyebrow {
    display: inline-block;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.85);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    padding: 5px 13px;
    border-radius: 99px;
    margin-bottom: 18px;
  }
  .left-headline {
    font-family: var(--font-display);
    color: #fff;
    font-size: 40px;
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -1.2px;
    margin-bottom: 14px;
  }
  .left-sub { color: rgba(255,255,255,0.68); font-size:14px; line-height:1.65; margin-bottom:32px; }

  .feat-list { display:flex; flex-direction:column; gap:10px; }
  .feat-item {
    display:flex; align-items:center; gap:12px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 12px;
    padding: 11px 14px;
    transition: background .2s;
  }
  .feat-item:hover { background: rgba(255,255,255,0.13); }
  .feat-em { font-size:19px; width:30px; text-align:center; }
  .feat-text { color:#fff; font-size:13px; font-weight:500; }

  .left-stats { display:flex; gap:12px; position:relative; z-index:2; }
  .stat-pill {
    flex:1;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius:14px;
    padding:14px;
    text-align:center;
  }
  .sp-num { color:#fff; font-size:21px; font-weight:800; letter-spacing:-0.5px; }
  .sp-lbl { color:rgba(255,255,255,0.58); font-size:10px; font-weight:700; letter-spacing:0.7px; text-transform:uppercase; margin-top:2px; }

  /* RIGHT panel */
  .auth-right {
    flex:1;
    background:#fff;
    padding:52px 52px;
    display:flex;
    flex-direction:column;
    justify-content:center;
  }
  .auth-inner { max-width:400px; width:100%; }

  .auth-greeting {
    font-family: var(--font-display);
    font-size:30px;
    font-weight:700;
    color: var(--ink);
    letter-spacing:-0.6px;
    margin-bottom:6px;
  }
  .auth-sub-line { font-size:14px; color: var(--slate); margin-bottom:28px; }

  .tab-bar {
    display:flex;
    background:#f1f1f6;
    border-radius:12px;
    padding:4px;
    gap:3px;
    margin-bottom:28px;
  }
  .tab-btn {
    flex:1;
    border:none;
    background:transparent;
    padding:10px;
    border-radius:9px;
    font-size:13px;
    font-weight:600;
    color:#8888a0;
    cursor:pointer;
    transition:all .22s;
    font-family: var(--font-body);
  }
  .tab-btn.active {
    background:#fff;
    color: var(--indigo);
    box-shadow: 0 2px 10px rgba(0,0,0,0.09);
  }

  .fg { margin-bottom:18px; }
  .flabel { display:block; font-size:11px; font-weight:700; color:#6b6b80; letter-spacing:0.6px; text-transform:uppercase; margin-bottom:7px; }
  .finp-wrap { position:relative; }
  .finp-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:16px; pointer-events:none; }
  .finp {
    width:100%;
    padding:13px 14px 13px 43px;
    border:2px solid #ededf5;
    border-radius:12px;
    font-size:14px;
    color: var(--ink);
    background:#fafafa;
    outline:none;
    transition:all .22s;
    font-family: var(--font-body);
  }
  .finp:focus { border-color: var(--indigo); background:#fff; box-shadow: 0 0 0 4px rgba(79,70,229,0.09); }
  .eye-btn {
    position:absolute; right:12px; top:50%; transform:translateY(-50%);
    background:none; border:none; cursor:pointer; font-size:15px; color:#bbb; padding:4px;
  }

  .submit-btn {
    width:100%;
    padding:14px;
    border:none;
    border-radius:13px;
    font-size:15px;
    font-weight:700;
    cursor:pointer;
    color:#fff;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:8px;
    margin-top:6px;
    transition:all .22s;
    font-family: var(--font-body);
    letter-spacing:0.1px;
  }
  .submit-btn.login-style  { background:linear-gradient(135deg, var(--indigo), var(--violet)); }
  .submit-btn.signup-style { background:linear-gradient(135deg, var(--rose), var(--violet)); }
  .submit-btn:hover { transform:translateY(-2px); filter:brightness(1.07); box-shadow:0 8px 22px rgba(79,70,229,0.3); }
  .submit-btn:active { transform:translateY(0); }

  .divrow { display:flex; align-items:center; gap:10px; margin:20px 0; color:#d0d0dc; font-size:12px; }
  .divrow::before,.divrow::after { content:''; flex:1; height:1px; background:#ededf5; }

  .social-row { display:flex; gap:10px; }
  .social-btn {
    flex:1; padding:11px; border:2px solid #ededf5;
    border-radius:11px; background:#fff; cursor:pointer; font-size:18px;
    transition:all .2s;
  }
  .social-btn:hover { border-color: var(--indigo); transform:translateY(-2px); }

  .switch-row { text-align:center; font-size:13px; color:#9090a8; margin-top:18px; }
  .switch-lnk { background:none; border:none; cursor:pointer; color:var(--indigo); font-weight:700; font-size:13px; font-family:var(--font-body); }

  /* ── Topbar ── */
  .topbar {
    position: sticky;
    top: 0;
    z-index: 200;
    height: 64px;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    animation: navIn .4s ease both;
  }
  .tb-left { display:flex; align-items:center; gap:14px; }
  .tb-logo {
    width:36px; height:36px;
    background:linear-gradient(135deg,var(--indigo),var(--violet));
    border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    font-size:17px; color:#fff;
  }
  .tb-wordmark { font-family:var(--font-display); font-size:19px; font-weight:700; color:var(--ink); letter-spacing:-0.4px; }
  .tb-right { display:flex; align-items:center; gap:6px; position:relative; }
  .tb-btn {
    width:38px; height:38px;
    border:none; border-radius:10px; background:transparent;
    cursor:pointer; font-size:18px;
    display:flex; align-items:center; justify-content:center;
    transition:all .2s; color:#555; position:relative;
  }
  .tb-btn:hover { background:#f0f0f8; }
  .tb-btn.danger:hover { background:#fff0f3; }
  .notif-pip {
    width:8px; height:8px; background:#ef4444;
    border-radius:50%; position:absolute; top:6px; right:6px;
    border:2px solid #fff;
  }

  /* Profile dropdown */
  .prof-dd {
    position:absolute;
    top:50px; right:0;
    width:290px;
    background:#fff;
    border:1px solid #ededf5;
    border-radius:16px;
    box-shadow:0 12px 40px rgba(0,0,0,0.13);
    z-index:300;
    animation: slideUp .22s ease both;
    overflow:hidden;
  }
  .dd-header { padding:18px; background:linear-gradient(135deg,#f8f7ff,#ede8ff); }
  .dd-avatar {
    width:46px; height:46px;
    background:linear-gradient(135deg,var(--indigo),var(--violet));
    border-radius:12px;
    display:flex; align-items:center; justify-content:center;
    font-size:19px; color:#fff; font-weight:800;
    margin-bottom:10px;
  }
  .dd-email { font-size:14px; font-weight:700; color:var(--ink); }
  .dd-role  { font-size:11px; color:var(--slate); margin-top:2px; }
  .dd-body  { padding:14px 16px; border-top:1px solid #f0f0f6; }
  .dd-pre {
    font-family:monospace; font-size:12px; color:#444;
    background:#f8f8fc; padding:12px; border-radius:10px;
    overflow:auto; max-height:130px; line-height:1.6;
  }
  .dd-hint { font-size:13px; color:#aaa; text-align:center; padding:8px 0; }
  .dd-foot { padding:10px; border-top:1px solid #f0f0f6; }
  .dd-signout {
    width:100%; padding:10px;
    background:#fff0f3; color:#e11d48;
    border:none; border-radius:10px;
    font-weight:700; font-size:13px; cursor:pointer;
    font-family:var(--font-body);
    transition:background .18s;
  }
  .dd-signout:hover { background:#ffe0e7; }

  /* ── Dashboard / Static page ── */
  .dash-wrap { background: var(--mist); min-height:100vh; }

  /* Hero */
  .db-hero {
    background: linear-gradient(130deg, #312e81 0%, var(--indigo) 40%, var(--violet) 75%, #be185d 100%);
    padding: 72px 80px 80px;
    position: relative;
    overflow: hidden;
  }
  .db-hero::after {
    content:'';
    position:absolute; inset:0;
    background:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
    opacity:0.3; pointer-events:none;
  }
  .hero-blob1 { position:absolute; width:400px; height:400px; background:rgba(167,139,250,0.15); border-radius:50%; filter:blur(70px); top:-100px; right:-80px; animation:blobDrift 20s ease-in-out infinite; }
  .hero-blob2 { position:absolute; width:260px; height:260px; background:rgba(236,72,153,0.12); border-radius:50%; filter:blur(60px); bottom:-60px; left:30%; animation:blobDrift 26s 5s ease-in-out infinite; }

  .hero-content { position:relative; z-index:2; max-width:700px; }
  .hero-eyebrow {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.22);
    color:rgba(255,255,255,0.9); font-size:11px; font-weight:700;
    letter-spacing:1.3px; text-transform:uppercase;
    padding:6px 14px; border-radius:99px; margin-bottom:22px;
  }
  .hero-title {
    font-family: var(--font-display);
    color:#fff; font-size:52px; font-weight:700;
    line-height:1.08; letter-spacing:-2px;
    margin-bottom:16px;
  }
  .hero-title em { font-style:italic; color:rgba(224,176,255,0.95); }
  .hero-desc { color:rgba(255,255,255,0.72); font-size:16px; line-height:1.65; max-width:520px; }

  .hero-chips { display:flex; flex-wrap:wrap; gap:10px; margin-top:28px; }
  .hero-chip {
    background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2);
    color:#fff; font-size:12px; font-weight:600;
    padding:7px 15px; border-radius:99px;
    display:flex; align-items:center; gap:7px;
  }

  /* Section */
  .db-section { padding:60px 80px; }
  .section-eyebrow {
    font-size:11px; font-weight:700; letter-spacing:1.2px;
    text-transform:uppercase; color:var(--indigo); margin-bottom:10px;
  }
  .section-title {
    font-family:var(--font-display);
    font-size:34px; font-weight:700; color:var(--ink);
    letter-spacing:-0.8px; margin-bottom:8px;
  }
  .section-sub { font-size:15px; color:var(--slate); line-height:1.6; max-width:560px; margin-bottom:40px; }

  /* NoSQL grid */
  .nosql-grid {
    display:grid;
    grid-template-columns: repeat(3, minmax(0,1fr));
    gap:20px;
    margin-bottom:60px;
  }
  .nosql-card {
    background:#fff;
    border-radius:20px;
    padding:26px;
    border:1px solid var(--border);
    transition:all .3s cubic-bezier(.22,1,.36,1);
    cursor:default;
  }
  .nosql-card:hover {
    transform:translateY(-6px);
    box-shadow:0 18px 48px rgba(0,0,0,0.1);
    border-color:rgba(79,70,229,0.15);
  }
  .nc-top { display:flex; align-items:center; gap:14px; margin-bottom:16px; }
  .nc-icon-wrap {
    width:52px; height:52px;
    border-radius:14px;
    display:flex; align-items:center; justify-content:center;
    font-size:26px;
    flex-shrink:0;
    animation: bounce 5s ease-in-out infinite;
  }
  .nc-name { font-size:17px; font-weight:700; color:var(--ink); }
  .nc-type-badge {
    display:inline-block;
    font-size:10px; font-weight:700;
    padding:3px 9px; border-radius:99px;
    letter-spacing:0.5px; text-transform:uppercase;
    margin-top:3px;
  }
  .nc-desc { font-size:13px; color:var(--slate); line-height:1.6; margin-bottom:14px; }
  .nc-tags { display:flex; flex-wrap:wrap; gap:6px; }
  .nc-tag {
    font-size:11px; font-weight:600;
    padding:4px 9px; border-radius:8px;
  }
  .nc-divider { height:1px; background:var(--border); margin:14px 0; }

  /* Concepts section */
  .concepts-grid {
    display:grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap:20px;
  }
  .concept-card {
    background:#fff;
    border-radius:18px;
    padding:24px;
    border:1px solid var(--border);
    display:flex; gap:16px;
    transition:all .28s;
  }
  .concept-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,0.08); }
  .cc-icon-wrap {
    width:46px; height:46px; flex-shrink:0;
    border-radius:12px;
    display:flex; align-items:center; justify-content:center;
    font-size:22px;
  }
  .cc-title { font-size:15px; font-weight:700; color:var(--ink); margin-bottom:5px; }
  .cc-desc  { font-size:13px; color:var(--slate); line-height:1.6; }

  /* Comparison table */
  .cmp-table-wrap {
    background:#fff;
    border-radius:18px;
    border:1px solid var(--border);
    overflow:hidden;
    margin-top:40px;
  }
  .cmp-table { width:100%; border-collapse:collapse; font-size:13px; }
  .cmp-table th {
    background:linear-gradient(135deg,var(--indigo),var(--violet));
    color:#fff; font-weight:700; padding:14px 18px; text-align:left;
    font-size:12px; letter-spacing:0.3px;
  }
  .cmp-table td { padding:13px 18px; border-bottom:1px solid var(--border); color:var(--ink); }
  .cmp-table tr:last-child td { border-bottom:none; }
  .cmp-table tr:hover td { background:#fafafa; }
  .cmp-check  { color:var(--emerald); font-weight:700; }
  .cmp-cross  { color:var(--rose);   font-weight:700; }
  .cmp-badge  {
    display:inline-block; font-size:10px; font-weight:700;
    padding:2px 8px; border-radius:6px;
  }

  /* Footer strip */
  .db-footer {
    background:linear-gradient(135deg,var(--indigo),var(--violet));
    padding:40px 80px;
    display:flex; align-items:center; justify-content:space-between;
  }
  .footer-tagline { font-family:var(--font-display); color:#fff; font-size:22px; font-weight:700; letter-spacing:-0.4px; }
  .footer-sub { color:rgba(255,255,255,0.65); font-size:13px; margin-top:4px; }
  .footer-icons { display:flex; gap:12px; }
  .footer-icon {
    width:44px; height:44px;
    background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2);
    border-radius:12px;
    display:flex; align-items:center; justify-content:center;
    font-size:20px;
    transition:background .18s;
    cursor:default;
  }
  .footer-icon:hover { background:rgba(255,255,255,0.22); }

  /* Toast */
  .toast-el {
    position:fixed; bottom:24px; right:24px; z-index:9999;
    padding:13px 18px;
    border-radius:13px;
    font-size:13px; font-weight:600;
    display:flex; align-items:center; gap:9px;
    animation:toastIn .35s ease;
    box-shadow:0 8px 28px rgba(0,0,0,0.13);
    max-width:340px;
    font-family:var(--font-body);
  }
  .toast-ok  { background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; }
  .toast-err { background:#fff1f2; color:#be123c; border:1px solid #fecdd3; }
  .toast-inf { background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; }
  .toast-close { margin-left:auto; background:none; border:none; cursor:pointer; font-size:15px; opacity:.6; font-family:var(--font-body); }

  /* Loading overlay */
  .overlay {
    position:fixed; inset:0;
    background:rgba(255,255,255,0.75);
    backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    z-index:9000;
  }
  .ov-box { background:#fff; border-radius:18px; padding:30px 40px; text-align:center; box-shadow:0 16px 48px rgba(0,0,0,0.13); }
  .ov-spin { width:40px; height:40px; border:3px solid #ededf5; border-top-color:var(--indigo); border-radius:50%; animation:spin .85s linear infinite; margin:0 auto 12px; }
  .ov-text { font-size:13px; color:var(--slate); font-weight:500; }

  /* Stagger helpers */
  .stagger-1 { animation:cardIn .5s .05s ease both; }
  .stagger-2 { animation:cardIn .5s .12s ease both; }
  .stagger-3 { animation:cardIn .5s .19s ease both; }
  .stagger-4 { animation:cardIn .5s .26s ease both; }
  .stagger-5 { animation:cardIn .5s .33s ease both; }
  .stagger-6 { animation:cardIn .5s .40s ease both; }
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const NOSQL_DBS = [
  {
    emoji:"🍃", name:"MongoDB", type:"Document",
    typeBg:"#e8f5e9", typeColor:"#1b5e20",
    iconBg:"#e8f5e9", animDelay:"0s",
    desc:"Stocke les données sous forme de documents BSON flexibles. Pas de schéma fixe : idéal pour les applications web modernes qui évoluent rapidement.",
    tags:[{label:"Schéma libre",bg:"#e8f5e9",color:"#2e7d32"},{label:"Aggregation",bg:"#e8f5e9",color:"#2e7d32"},{label:"Réplication",bg:"#e8f5e9",color:"#2e7d32"}],
    uses:"Catalogue produit, CMS, profils utilisateurs, IoT",
    perf:"★★★★☆",
  },
  {
    emoji:"🔴", name:"Redis", type:"Clé-valeur",
    typeBg:"#fff3e0", typeColor:"#e65100",
    iconBg:"#fff3e0", animDelay:"0.08s",
    desc:"Base de données en mémoire ultra-rapide. Utilisée comme cache, broker de messages (pub/sub) et gestionnaire de sessions grâce à ses latences sub-milliseconde.",
    tags:[{label:"In-memory",bg:"#fff3e0",color:"#ef6c00"},{label:"Pub/Sub",bg:"#fff3e0",color:"#ef6c00"},{label:"< 1ms",bg:"#fff3e0",color:"#ef6c00"}],
    uses:"Cache, sessions, files, classements temps réel",
    perf:"★★★★★",
  },
  {
    emoji:"🪨", name:"Cassandra", type:"Colonnes larges",
    typeBg:"#e3f2fd", typeColor:"#0d47a1",
    iconBg:"#e3f2fd", animDelay:"0.16s",
    desc:"Architecture distribuée peer-to-peer conçue pour des volumes massifs de données. Tolérance aux pannes intégrée et scalabilité horizontale sans point unique de défaillance.",
    tags:[{label:"Distribué",bg:"#e3f2fd",color:"#1565c0"},{label:"Scalable",bg:"#e3f2fd",color:"#1565c0"},{label:"Résilient",bg:"#e3f2fd",color:"#1565c0"}],
    uses:"Logs, IoT, séries temporelles, réseaux sociaux",
    perf:"★★★★☆",
  },
  {
    emoji:"🕸", name:"Neo4j", type:"Graphe",
    typeBg:"#fce4ec", typeColor:"#880e4f",
    iconBg:"#fce4ec", animDelay:"0.24s",
    desc:"Modélise et interroge des relations complexes entre entités sous forme de graphes de nœuds et d'arêtes. Le langage Cypher simplifie les traversées profondes.",
    tags:[{label:"Relations",bg:"#fce4ec",color:"#c2185b"},{label:"Traversal",bg:"#fce4ec",color:"#c2185b"},{label:"Cypher",bg:"#fce4ec",color:"#c2185b"}],
    uses:"Réseaux sociaux, recommandations, fraude, Knowledge Graph",
    perf:"★★★☆☆",
  },
  {
    emoji:"🔷", name:"DynamoDB", type:"Clé-valeur",
    typeBg:"#ede7f6", typeColor:"#4527a0",
    iconBg:"#ede7f6", animDelay:"0.32s",
    desc:"Service NoSQL managé d'AWS. Performances prédictibles à n'importe quelle échelle, avec provisionnement automatique et latences en millisecondes.",
    tags:[{label:"Serverless",bg:"#ede7f6",color:"#512da8"},{label:"AWS",bg:"#ede7f6",color:"#512da8"},{label:"Auto-scale",bg:"#ede7f6",color:"#512da8"}],
    uses:"Applications mobiles, jeux, e-commerce haute charge",
    perf:"★★★★★",
  },
  {
    emoji:"🫧", name:"CouchDB", type:"Document",
    typeBg:"#e8eaf6", typeColor:"#283593",
    iconBg:"#e8eaf6", animDelay:"0.40s",
    desc:"Synchronisation bidirectionnelle offline-first via HTTP/REST. Parfait pour les applications mobiles qui doivent fonctionner sans connexion et se synchroniser plus tard.",
    tags:[{label:"Offline-first",bg:"#e8eaf6",color:"#303f9f"},{label:"REST API",bg:"#e8eaf6",color:"#303f9f"},{label:"Sync",bg:"#e8eaf6",color:"#303f9f"}],
    uses:"Apps mobiles, réplication multi-maîtres, edge computing",
    perf:"★★★☆☆",
  },
];

const CONCEPTS = [
  { emoji:"📐", bg:"#ede9fe", title:"Théorème CAP", desc:"Consistance, Disponibilité, Tolérance aux partitions : un système distribué ne peut garantir simultanément que deux de ces trois propriétés." },
  { emoji:"🔄", bg:"#e0f2fe", title:"Réplication & Sharding", desc:"La réplication duplique les données sur plusieurs nœuds pour la haute disponibilité. Le sharding partitionne horizontalement pour répartir la charge." },
  { emoji:"⏳", bg:"#fef9c3", title:"Consistance éventuelle", desc:"Les écritures se propagent progressivement à tous les nœuds : disponibilité maximale au prix d'une cohérence différée, acceptable pour la plupart des usages web." },
  { emoji:"📦", bg:"#dcfce7", title:"Dénormalisation", desc:"Contrairement au SQL, les données sont intentionnellement dupliquées pour éviter les jointures coûteuses et optimiser les performances en lecture." },
  { emoji:"🗺", bg:"#fce7f3", title:"Map/Reduce", desc:"Paradigme de traitement distribué pour agréger de gros volumes de données en parallèle sur un cluster, popularisé par Hadoop et MongoDB." },
  { emoji:"🛡", bg:"#fff7ed", title:"Idempotence & ACID vs BASE", desc:"Les bases NoSQL privilégient BASE (Basically Available, Soft-state, Eventually consistent) à ACID pour gagner en scalabilité et disponibilité." },
];

const CMP_ROWS = [
  ["MongoDB",   "Document",     "Élevée",   "Élevée",  "✓", "Schéma libre, requêtes riches"],
  ["Redis",     "Clé-valeur",   "Très haute","Moyenne", "✓", "In-memory, latence < 1ms"],
  ["Cassandra", "Col. larges",  "Haute",     "Très haute","✓","Pas de SPOF, séries temporelles"],
  ["Neo4j",     "Graphe",       "Haute",     "Moyenne", "✗", "Relations complexes, Cypher"],
  ["DynamoDB",  "Clé-valeur",   "Très haute","Très haute","✓","AWS managé, serverless"],
  ["CouchDB",   "Document",     "Élevée",    "Moyenne", "✓", "Offline-first, sync REST"],
];

/* ─────────────────────────────────────────────
   TOAST HOOK
───────────────────────────────────────────── */
function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);
  const show = (type, text) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ type, text });
    timerRef.current = setTimeout(() => setToast(null), 3600);
  };
  return [toast, show, () => setToast(null)];
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [page, setPage]     = useState("auth");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail]   = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [profile, setProfile]   = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const [toast, showToast, closeToast] = useToast();
  const ddRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const h = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ── Handlers (ORIGINAL APIs preserved) ── */
  const handleSignup = async (e) => {
    e?.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      showToast(res.ok ? "ok" : "err", data.message);

      if (res.ok) setIsLogin(true);
    } catch (err) {
      showToast("err", "Erreur réseau (backend indisponible)");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      showToast(res.ok ? "ok" : "err", data.message);

      if (res.ok) {
        localStorage.setItem("sessionId", data.sessionId);
        setPage("dashboard");
      }
    } catch (err) {
      showToast("err", "Erreur réseau (backend indisponible)");
    } finally {
      setLoading(false);
    }
  };

  const handleProfile = async () => {
    if (profileLoaded) return;
    setLoading(true);

    try {
      const sessionId = localStorage.getItem("sessionId");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/profile`,
        {
          headers: { Authorization: sessionId },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setProfile(data);
        setProfileLoaded(true);
        showToast("ok", "Profil chargé avec succès !");
      } else {
        showToast("err", data.message);
      }
    } catch (err) {
      showToast("err", "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    setLoading(true);

    try {
      const sessionId = localStorage.getItem("sessionId");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/logout`,
        {
          method: "POST",
          headers: { Authorization: sessionId },
        }
      );

      const data = await res.json();

      localStorage.removeItem("sessionId");

      showToast("ok", data.message);

      setProfile(null);
      setProfileLoaded(false);
      setDdOpen(false);
      setPage("auth");
    } catch (err) {
      showToast("err", "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const openDD = () => {
    setDdOpen((v) => !v);
    if (!ddOpen && !profileLoaded) handleProfile();
  };

  /* ─── Render ─── */
  return (
    <>
      <style>{CSS}</style>

      {/* Loading overlay */}
      {loading && (
        <div className="overlay">
          <div className="ov-box">
            <div className="ov-spin" />
            <div className="ov-text">Chargement…</div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast-el toast-${toast.type}`}>
          <span>{toast.type === "ok" ? "✅" : toast.type === "err" ? "❌" : "ℹ️"}</span>
          <span>{toast.text}</span>
          <button className="toast-close" onClick={closeToast}>✕</button>
        </div>
      )}

      {/* ══════════ AUTH ══════════ */}
      {page === "auth" && (
        <div className="auth-shell page-enter">
          {/* LEFT */}
          <div className="auth-left">
            <div className="left-noise" />
            <div className="left-blob lb1" />
            <div className="left-blob lb2" />
            <div className="left-blob lb3" />

            <div className="left-brand">
              <div className="left-brand-mark">🗄</div>
              <div className="left-brand-name">NovaDB</div>
            </div>

            <div className="left-body">
              <div className="left-eyebrow">✦ Plateforme NoSQL</div>
              <h1 className="left-headline">
                {isLogin ? <>Gérez vos données<br />avec élégance.</> : <>Rejoignez<br />l&rsquo;écosystème.</> }
              </h1>
              <p className="left-sub">
                {isLogin
                  ? "Connectez-vous et explorez la puissance des bases de données MongoDB, Redis, Cassandra et Neo4j."
                  : "Créez votre compte et accédez à tous les outils de gestion NoSQL dès aujourd'hui."}
              </p>
              <div className="feat-list">
                {[["🍃","MongoDB — Documents JSON flexibles"],
                  ["🔴","Redis — Cache ultra-rapide clé-valeur"],
                  ["🪨","Cassandra — Colonnes distribuées"],
                  ["🕸","Neo4j — Graphes et relations"]]
                  .map(([em, txt]) => (
                  <div className="feat-item" key={txt}>
                    <span className="feat-em">{em}</span>
                    <span className="feat-text">{txt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="left-stats">
              {[["99.9%","UPTIME"],["4 types","NOSQL"],["24/7","SUPPORT"]].map(([n,l]) => (
                <div className="stat-pill" key={l}>
                  <div className="sp-num">{n}</div>
                  <div className="sp-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="auth-right">
            <div className="auth-inner">
              <div className="auth-greeting">{isLogin ? "Bonne journée 👋" : "Créer un compte ✨"}</div>
              <div className="auth-sub-line">
                {isLogin ? "Entrez vos identifiants pour continuer" : "Rejoignez des milliers de développeurs"}
              </div>

              <div className="tab-bar">
                <button className={`tab-btn${isLogin ? " active" : ""}`} onClick={() => setIsLogin(true)}>🔑 Connexion</button>
                <button className={`tab-btn${!isLogin ? " active" : ""}`} onClick={() => setIsLogin(false)}>✨ Inscription</button>
              </div>

              <form onSubmit={isLogin ? handleLogin : handleSignup}>
                <div className="fg">
                  <label className="flabel">Email</label>
                  <div className="finp-wrap">
                    <span className="finp-icon">📧</span>
                    <input className="finp" type="email" placeholder="vous@exemple.com"
                      value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="fg">
                  <label className="flabel">Mot de passe</label>
                  <div className="finp-wrap">
                    <span className="finp-icon">🔐</span>
                    <input className="finp" type={showPwd ? "text" : "password"} placeholder="••••••••"
                      value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="button" className="eye-btn" onClick={() => setShowPwd(v => !v)}>
                      {showPwd ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>
                <button type="submit" className={`submit-btn ${isLogin ? "login-style" : "signup-style"}`}>
                  {isLogin ? <><span>Se connecter</span><span>→</span></> : <><span>Créer mon compte</span><span>🎉</span></>}
                </button>
              </form>

              <div className="divrow">ou</div>
              <div className="social-row">
                {["🌐","🍎","🐙"].map(ic => (
                  <button key={ic} className="social-btn" onClick={() => showToast("inf","Bientôt disponible !")}>{ic}</button>
                ))}
              </div>
              <div className="switch-row">
                {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
                <button className="switch-lnk" onClick={() => setIsLogin(v => !v)}>
                  {isLogin ? "Créer un compte" : "Se connecter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ DASHBOARD / STATIC PAGE ══════════ */}
      {page === "dashboard" && (
        <div className="dash-wrap page-enter">

          {/* TOPBAR */}
          <nav className="topbar">
            <div className="tb-left">
              <div className="tb-logo">🗄</div>
              <div className="tb-wordmark">NovaDB</div>
            </div>
            <div className="tb-right" ref={ddRef}>
              <button className="tb-btn" onClick={() => showToast("inf","Aucune notification")}>
                🔔<span className="notif-pip" />
              </button>
              <button className="tb-btn" onClick={openDD}>👤</button>
              <button className="tb-btn danger" onClick={handleLogout}>🚪</button>

              {ddOpen && (
                <div className="prof-dd">
                  <div className="dd-header">
                    <div className="dd-avatar">
                      {profile?.email ? profile.email[0].toUpperCase() : email ? email[0].toUpperCase() : "?"}
                    </div>
                    <div className="dd-email">{profile?.email || email || "—"}</div>
                  </div>
                  <div className="dd-body">
                    {profile
                      ? <pre className="dd-pre">{JSON.stringify(profile, null, 2)}</pre>
                      : <div className="dd-hint">{loading ? "Chargement…" : "Cliquez sur 👤 pour charger"}</div>}
                  </div>
                  <div className="dd-foot">
                    <button className="dd-signout" onClick={handleLogout}>🚪 Se déconnecter</button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* HERO */}
          <div className="db-hero">
            <div className="hero-blob1" />
            <div className="hero-blob2" />
            <div className="hero-content">
              <div className="hero-eyebrow">⬡ Guide complet NoSQL</div>
              <h1 className="hero-title">Les bases de données<br /><em>NoSQL</em> expliquées.</h1>
              <p className="hero-desc">
                Découvrez les 4 grandes familles de bases NoSQL — leurs architectures,
                leurs cas d'usage, leurs forces et leurs limites — pour choisir la bonne
                technologie selon votre contexte.
              </p>
              <div className="hero-chips">
                {["🍃 Document","🔴 Clé-valeur","🪨 Colonnes","🕸 Graphe","⚡ Haute dispo"].map(c => (
                  <div className="hero-chip" key={c}>{c}</div>
                ))}
              </div>
            </div>
          </div>

          {/* NoSQL CARDS */}
          <div className="db-section">
            <div className="section-eyebrow">⬡ Technologies</div>
            <h2 className="section-title">Les 6 bases NoSQL incontournables</h2>
            <p className="section-sub">
              De la base orientée documents au graphe en passant par le cache mémoire,
              chaque famille répond à des besoins architecturaux précis.
            </p>
            <div className="nosql-grid">
              {NOSQL_DBS.map((db, i) => (
                <div key={db.name} className={`nosql-card stagger-${i + 1}`}>
                  <div className="nc-top">
                    <div className="nc-icon-wrap" style={{ background: db.iconBg, animationDelay: db.animDelay }}>
                      {db.emoji}
                    </div>
                    <div>
                      <div className="nc-name">{db.name}</div>
                      <span className="nc-type-badge" style={{ background: db.typeBg, color: db.typeColor }}>
                        {db.type}
                      </span>
                    </div>
                  </div>
                  <p className="nc-desc">{db.desc}</p>
                  <div className="nc-divider" />
                  <div style={{ fontSize:12, color:"#888", marginBottom:10 }}>
                    <strong style={{ color:"#555" }}>Cas d'usage : </strong>{db.uses}
                  </div>
                  <div style={{ fontSize:12, color:"#f59e0b", marginBottom:10 }}>
                    <strong style={{ color:"#555" }}>Performance : </strong>{db.perf}
                  </div>
                  <div className="nc-tags">
                    {db.tags.map(t => (
                      <span key={t.label} className="nc-tag" style={{ background: t.bg, color: t.color }}>{t.label}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CONCEPTS */}
            <div className="section-eyebrow">⬡ Fondamentaux</div>
            <h2 className="section-title">Concepts clés à maîtriser</h2>
            <p className="section-sub">
              Les principes théoriques derrière les choix d'architecture NoSQL.
            </p>
            <div className="concepts-grid">
              {CONCEPTS.map((c, i) => (
                <div key={c.title} className={`concept-card stagger-${(i % 4) + 1}`}>
                  <div className="cc-icon-wrap" style={{ background: c.bg }}>{c.emoji}</div>
                  <div>
                    <div className="cc-title">{c.title}</div>
                    <div className="cc-desc">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* COMPARISON TABLE */}
            <div className="section-eyebrow" style={{ marginTop:48 }}>⬡ Comparatif</div>
            <h2 className="section-title">Tableau comparatif</h2>
            <div className="cmp-table-wrap">
              <table className="cmp-table">
                <thead>
                  <tr>
                    {["Base","Type","Performance","Scalabilité","Open-source","Idéal pour"].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CMP_ROWS.map(([name, type, perf, scale, oss, ideal]) => (
                    <tr key={name}>
                      <td><strong>{name}</strong></td>
                      <td><span className="cmp-badge" style={{ background:"#ede9fe", color:"#4f46e5" }}>{type}</span></td>
                      <td>{perf}</td>
                      <td>{scale}</td>
                      <td className={oss === "✓" ? "cmp-check" : "cmp-cross"}>{oss}</td>
                      <td style={{ color:"#64748b", fontSize:12 }}>{ideal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FOOTER */}
          <div className="db-footer">
            <div>
              <div className="footer-tagline">NovaDB — Votre guide NoSQL</div>
              <div className="footer-sub">Choisissez la bonne base pour chaque défi.</div>
            </div>
            <div className="footer-icons">
              {["🍃","🔴","🪨","🕸","🔷","🫧"].map(ic => (
                <div key={ic} className="footer-icon">{ic}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}