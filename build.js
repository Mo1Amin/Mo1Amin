// Generates the animated SVG assets for the GitHub profile README.
// Everything is self-contained (no external fonts or services), so it renders the same through GitHub's image proxy.
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, 'assets');
fs.mkdirSync(out, { recursive: true });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const SANS = "'Segoe UI', Ubuntu, 'Helvetica Neue', Arial, sans-serif";
const MONO = "'Cascadia Code', Consolas, 'SFMono-Regular', Menlo, monospace";

// Deterministic pseudo-random so the files do not change on every build.
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// ---------------------------------------------------------------- header
function header(theme) {
  const dark = theme === 'dark';
  const W = 1200, H = 340;
  const c = dark
    ? { bg1: '#0b1220', bg2: '#0f2a4a', ink: '#f1f5f9', soft: '#94a3b8', brand: '#38bdf8', dot: '#38bdf8', chip: 'rgba(56,189,248,.12)', chipLine: 'rgba(56,189,248,.35)' }
    : { bg1: '#f4f7fb', bg2: '#dbeafe', ink: '#0f172a', soft: '#475569', brand: '#1866ad', dot: '#1d5fb8', chip: 'rgba(24,102,173,.08)', chipLine: 'rgba(24,102,173,.3)' };

  // Particle sphere: points on a sphere, projected, drawn as dots that twinkle; the group turns slowly.
  seed = 7;
  const cx = 960, cy = 170, R = 125;
  let dots = '';
  for (let i = 0; i < 420; i++) {
    const th = rnd() * Math.PI * 2, ph = Math.acos(2 * rnd() - 1);
    const x = R * Math.sin(ph) * Math.cos(th), y = R * Math.sin(ph) * Math.sin(th), z = R * Math.cos(ph);
    const depth = (z + R) / (2 * R);
    const r = (0.8 + depth * 1.6).toFixed(2);
    const o = (0.18 + depth * 0.75).toFixed(2);
    const d = (rnd() * 4).toFixed(2);
    dots += `<circle cx="${(x).toFixed(1)}" cy="${(y).toFixed(1)}" r="${r}" fill="${c.dot}" opacity="${o}" style="animation-delay:-${d}s"/>`;
  }
  let stars = '';
  for (let i = 0; i < 70; i++) {
    stars += `<circle cx="${(rnd() * W).toFixed(0)}" cy="${(rnd() * H).toFixed(0)}" r="${(rnd() * 1.2 + .3).toFixed(2)}" fill="${c.soft}" opacity="${(rnd() * .4 + .1).toFixed(2)}" class="tw" style="animation-delay:-${(rnd() * 5).toFixed(2)}s"/>`;
  }

  const roles = ['Full-stack web apps with Node.js &amp; React', 'Desktop apps with Tauri (Rust) &amp; Electron', 'Co-founder · Sinai University ACM Chapter'];
  const roleText = roles.map((r, i) => `<text class="role r${i}" x="70" y="236" font-family="${MONO}" font-size="21" fill="${c.brand}">${r}<tspan class="caret" fill="${c.brand}">▍</tspan></text>`).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mohamed Amin — Software Engineer">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.bg1}"/><stop offset="1" stop-color="${c.bg2}"/></linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${c.brand}" stop-opacity="${dark ? .28 : .18}"/><stop offset="1" stop-color="${c.brand}" stop-opacity="0"/></radialGradient>
  <linearGradient id="name" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.ink}"/><stop offset=".55" stop-color="${c.ink}"/><stop offset="1" stop-color="${c.brand}"/></linearGradient>
  <clipPath id="round"><rect width="${W}" height="${H}" rx="22"/></clipPath>
</defs>
<style>
  .tw { animation: tw 5s ease-in-out infinite; }
  @keyframes tw { 50% { opacity: .05; } }
  .sphere { animation: spin 60s linear infinite; transform-origin: ${cx}px ${cy}px; }
  .sphere circle { animation: pulse 4s ease-in-out infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 50% { opacity: .15; } }
  /* The first line is visible even where animations do not run; the others only appear while animating. */
  .role { opacity: 0; animation: type 12s steps(40) infinite; }
  .r0 { opacity: 1; }
  .r1 { animation-delay: 4s; } .r2 { animation-delay: 8s; }
  @keyframes type { 0% { opacity: 1; clip-path: inset(0 100% 0 0); } 12% { clip-path: inset(0 0 0 0); } 28% { opacity: 1; clip-path: inset(0 0 0 0); } 33%, 100% { opacity: 0; clip-path: inset(0 0 0 0); } }
  .caret { animation: blink 1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  .wave { animation: wave 2.4s ease-in-out infinite; transform-origin: 70% 80%; transform-box: fill-box; }
  @keyframes wave { 0%, 60%, 100% { transform: rotate(0); } 10% { transform: rotate(16deg); } 20% { transform: rotate(-8deg); } 30% { transform: rotate(14deg); } 40% { transform: rotate(-4deg); } }
</style>
<g clip-path="url(#round)">
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${stars}
  <circle cx="${cx}" cy="${cy}" r="210" fill="url(#glow)"/>
  <g transform="translate(${cx} ${cy})"><g class="sphere" style="transform-origin:0 0">${dots}</g></g>
  <g class="in">
    <text x="70" y="84" font-size="30" class="wave">👋</text>
    <text x="112" y="82" font-family="${SANS}" font-size="22" font-weight="600" fill="${c.soft}">Hi there, I'm</text>
    <rect x="262" y="60" width="222" height="32" rx="16" fill="${c.chip}" stroke="${c.chipLine}"/>
    <text x="280" y="82" font-family="${MONO}" font-size="14" fill="${c.brand}">&lt;/&gt; software engineer</text>
  </g>
  <g class="in d1">
    <text x="70" y="168" font-family="${SANS}" font-size="72" font-weight="800" fill="url(#name)">Mohamed Amin</text>
  </g>
  <g class="in d2">${roleText}</g>
  <g class="in d3">
    <text x="70" y="290" font-family="${SANS}" font-size="17" fill="${c.soft}">Sinai University · Faculty of Computers &amp; IT · Egypt</text>
  </g>
</g>
</svg>`;
}

// ---------------------------------------------------------------- project cards
function wrap(text, max) {
  const words = text.split(' ');
  const lines = [''];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    if ((cur + ' ' + w).trim().length > max) lines.push(w); else lines[lines.length - 1] = (cur + ' ' + w).trim();
  }
  return lines;
}

function card({ file, icon, title, badge, desc, stack, accent, accent2, footer }) {
  const W = 600, H = 300;
  const lines = wrap(desc, 60);
  if (lines.length > 3) throw new Error(`${title}: description is ${lines.length} lines`);
  let x = 36;
  const chips = stack.map((s) => {
    const w = s.length * 8.4 + 26;
    const g = `<g transform="translate(${x} 214)"><rect width="${w.toFixed(0)}" height="30" rx="15" fill="${accent}" fill-opacity=".13" stroke="${accent}" stroke-opacity=".45"/><text x="${(w / 2).toFixed(1)}" y="20" text-anchor="middle" font-family="${MONO}" font-size="13" fill="#e2e8f0">${esc(s)}</text></g>`;
    x += w + 8;
    return g;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f172a"/><stop offset="1" stop-color="#111c33"/></linearGradient>
  <linearGradient id="ac" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${accent2}"/></linearGradient>
  <radialGradient id="gl" cx="1" cy="0" r="1"><stop offset="0" stop-color="${accent}" stop-opacity=".28"/><stop offset=".6" stop-color="${accent}" stop-opacity="0"/></radialGradient>
  <clipPath id="c"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="20"/></clipPath>
</defs>
<style>
  .sheen { animation: sheen 6s ease-in-out infinite; }
  @keyframes sheen { 0%, 70% { transform: translateX(-260px) skewX(-20deg); } 100% { transform: translateX(${W + 200}px) skewX(-20deg); } }
  .bar { animation: grow 1.2s cubic-bezier(.2,.7,.2,1) both; transform-origin: 0 0; }
  @keyframes grow { from { transform: scaleX(0); } }
  .pulse { animation: p 2s ease-in-out infinite; }
  @keyframes p { 50% { opacity: .35; } }
</style>
<g clip-path="url(#c)">
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#gl)"/>
  <rect class="bar" width="${W}" height="5" fill="url(#ac)"/>
  <rect class="sheen" x="0" y="0" width="120" height="${H}" fill="#fff" opacity=".045"/>
</g>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="20" fill="none" stroke="#ffffff" stroke-opacity=".08"/>
<rect x="36" y="36" width="56" height="56" rx="16" fill="url(#ac)"/>
<text x="64" y="74" text-anchor="middle" font-size="28">${icon}</text>
<text x="110" y="62" font-family="${SANS}" font-size="26" font-weight="800" fill="#f8fafc">${esc(title)}</text>
<g transform="translate(110 74)"><circle class="pulse" cx="6" cy="9" r="4.5" fill="${badge.color}"/><text x="18" y="14" font-family="${MONO}" font-size="13" fill="#94a3b8">${esc(badge.text)}</text></g>
${lines.map((l, i) => `<text x="36" y="${136 + i * 24}" font-family="${SANS}" font-size="16.5" fill="#cbd5e1">${esc(l)}</text>`).join('')}
${chips}
<text x="${W - 36}" y="274" text-anchor="end" font-family="${MONO}" font-size="13" fill="${accent}">${esc(footer)}</text>
</svg>`;
  fs.writeFileSync(path.join(out, file), svg);
}

fs.writeFileSync(path.join(out, 'header-dark.svg'), header('dark'));
fs.writeFileSync(path.join(out, 'header-light.svg'), header('light'));

card({
  file: 'card-acm.svg', icon: '🏔️', title: 'ACM Sinai Platform', accent: '#38bdf8', accent2: '#1866ad',
  badge: { text: 'live · su.acm.org', color: '#22c55e' },
  desc: 'Website and admin dashboard of the Sinai University ACM chapter: tracks, events, gallery, winners board, analytics, 2FA and roles.',
  stack: ['Node.js', 'Express', 'MariaDB', 'Tailwind', 'three.js'], footer: 'su.acm.org  ↗',
});
card({
  file: 'card-mednotes.svg', icon: '🩺', title: 'MED-NOTES', accent: '#a78bfa', accent2: '#6d28d9',
  badge: { text: 'private · production app', color: '#a78bfa' },
  desc: 'Secure study platform for medical students: PDFs with handwriting, a bookstore with payments, offline sync on web, Windows and Android.',
  stack: ['React', 'TypeScript', 'Supabase', 'Electron', 'Capacitor'], footer: 'case study on request',
});
card({
  file: 'card-meqat.svg', icon: '🕋', title: 'Meqat Widget', accent: '#34d399', accent2: '#0f766e',
  badge: { text: 'open source · Windows', color: '#22c55e' },
  desc: 'Glassmorphism prayer-times widget for the Windows desktop. Works offline, plays the Azan, lives in the system tray and is fully customisable.',
  stack: ['Tauri', 'Rust', 'React', 'TypeScript'], footer: 'download the release  ↗',
});
card({
  file: 'card-shifa.svg', icon: '🏥', title: 'Al-Shifa Hospital', accent: '#f472b6', accent2: '#be185d',
  badge: { text: 'live demo', color: '#22c55e' },
  desc: 'Responsive hospital website: services, doctors, news, and sign-in and registration pages and a custom cursor.',
  stack: ['HTML', 'CSS', 'JavaScript'], footer: 'live demo  ↗',
});

// Section divider
fs.writeFileSync(path.join(out, 'divider.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="14" viewBox="0 0 1200 14"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#38bdf8" stop-opacity="0"/><stop offset=".5" stop-color="#38bdf8"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></linearGradient></defs><style>.m{animation:m 4s ease-in-out infinite}@keyframes m{0%,100%{transform:translateX(-300px)}50%{transform:translateX(300px)}}</style><rect y="6" width="1200" height="2" fill="url(#g)" opacity=".35"/><rect class="m" x="500" y="5" width="200" height="4" rx="2" fill="url(#g)"/></svg>`);
console.log('built', fs.readdirSync(out));
