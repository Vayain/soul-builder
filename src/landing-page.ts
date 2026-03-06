export function renderLandingPage(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Soul Builder | Give Your Agent a Soul</title>
  <meta name="description" content="Soul Builder helps you define your AI agent identity in six precise questions and generate a production-ready SOUL.md." />
  <meta property="og:title" content="Soul Builder | ag3nt.id" />
  <meta property="og:description" content="A premium workflow to turn your agent into a consistent, memorable identity." />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg-0: #07090f;
      --bg-1: #0d1426;
      --bg-2: #12203b;
      --ink: #f0f4ff;
      --muted: #9eadcc;
      --line: rgba(168, 188, 229, 0.18);
      --glass: rgba(12, 21, 39, 0.62);
      --accent: #79c7ff;
      --accent-2: #9b82ff;
      --accent-3: #30e1cb;
      --shadow: 0 20px 70px rgba(8, 16, 35, 0.5);
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      font-family: 'Manrope', 'Segoe UI', sans-serif;
      background: radial-gradient(1200px 700px at 85% -10%, rgba(121, 199, 255, 0.12), transparent 55%),
        radial-gradient(1000px 650px at -10% 10%, rgba(155, 130, 255, 0.14), transparent 52%),
        linear-gradient(180deg, var(--bg-1), var(--bg-0) 38%, #06070b 100%);
      color: var(--ink);
      min-height: 100%;
      scroll-behavior: smooth;
    }

    body::before {
      content: '';
      position: fixed;
      inset: -20% -10% auto -10%;
      height: 70vh;
      background: radial-gradient(circle at 50% 50%, rgba(48, 225, 203, 0.18), transparent 62%);
      filter: blur(70px);
      pointer-events: none;
      animation: drift 12s ease-in-out infinite alternate;
      z-index: 0;
    }

    body::after {
      content: '';
      position: fixed;
      inset: 0;
      background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
      background-size: 3px 3px;
      opacity: 0.08;
      pointer-events: none;
      z-index: 0;
    }

    @keyframes drift {
      from { transform: translate3d(-2%, -1%, 0) scale(1); }
      to { transform: translate3d(2%, 3%, 0) scale(1.06); }
    }

    .shell {
      position: relative;
      z-index: 1;
      max-width: 1120px;
      margin: 0 auto;
      padding: 20px 20px 72px;
    }

    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid var(--line);
      background: rgba(9, 15, 28, 0.66);
      backdrop-filter: blur(8px);
      border-radius: 999px;
      padding: 12px 18px;
      margin-top: 10px;
      box-shadow: var(--shadow);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }

    .brand-mark {
      width: 12px;
      height: 12px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      box-shadow: 0 0 20px rgba(121, 199, 255, 0.8);
    }

    .nav-links {
      display: flex;
      gap: 16px;
      color: var(--muted);
      font-size: 14px;
    }

    .nav-links a {
      color: inherit;
      text-decoration: none;
    }

    .hero {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 22px;
      margin-top: 44px;
    }

    .card {
      border: 1px solid var(--line);
      background: var(--glass);
      border-radius: 24px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(8px);
    }

    .hero-main {
      padding: 48px;
    }

    .eyebrow {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: var(--accent);
      text-transform: uppercase;
      margin-bottom: 18px;
    }

    h1,
    h2,
    h3 {
      font-family: 'Syne', 'Manrope', sans-serif;
      margin: 0;
    }

    h1 {
      font-size: clamp(34px, 5vw, 62px);
      line-height: 0.98;
      letter-spacing: -0.03em;
      max-width: 14ch;
    }

    .hero-copy {
      margin-top: 18px;
      color: var(--muted);
      font-size: 18px;
      line-height: 1.65;
      max-width: 42ch;
    }

    .cta-row {
      display: flex;
      gap: 12px;
      margin-top: 30px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      font-weight: 700;
      text-decoration: none;
      padding: 12px 20px;
      transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    }

    .btn:hover {
      transform: translateY(-1px);
    }

    .btn-primary {
      color: #051122;
      background: linear-gradient(120deg, var(--accent), var(--accent-3));
      box-shadow: 0 10px 35px rgba(76, 204, 255, 0.4);
    }

    .btn-secondary {
      color: var(--ink);
      border: 1px solid var(--line);
      background: rgba(255, 255, 255, 0.02);
    }

    .hero-side {
      padding: 24px;
      position: relative;
      overflow: hidden;
    }

    .stack {
      display: grid;
      gap: 12px;
      margin-top: 16px;
    }

    .stack-item {
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 14px;
      background: rgba(7, 14, 28, 0.55);
    }

    .stack-item b {
      display: block;
      font-size: 13px;
      letter-spacing: 0.08em;
      color: var(--muted);
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .stack-item span {
      font-size: 15px;
      line-height: 1.4;
    }

    section {
      margin-top: 56px;
    }

    .section-head {
      max-width: 64ch;
      margin-bottom: 18px;
    }

    .section-head h2 {
      font-size: clamp(28px, 3.4vw, 44px);
      letter-spacing: -0.025em;
      margin-bottom: 12px;
    }

    .section-head p {
      margin: 0;
      color: var(--muted);
      line-height: 1.75;
    }

    .grid-3 {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .feature {
      padding: 20px;
    }

    .feature h3 {
      font-size: 22px;
      margin-bottom: 12px;
    }

    .feature p {
      margin: 0;
      color: var(--muted);
      line-height: 1.65;
    }

    .flow {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .flow .card {
      padding: 18px;
    }

    .flow-step {
      color: var(--muted);
      font-size: 13px;
      margin-bottom: 8px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .flow-title {
      font-weight: 700;
      margin-bottom: 8px;
      font-size: 18px;
    }

    .flow p {
      margin: 0;
      color: var(--muted);
      line-height: 1.6;
    }

    .trust {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 14px;
    }

    .trust-list {
      padding: 22px;
    }

    .trust-list ul {
      margin: 12px 0 0;
      padding-left: 18px;
      color: var(--muted);
      line-height: 1.8;
    }

    .cta {
      text-align: center;
      padding: 44px 24px;
      margin-top: 64px;
    }

    .cta p {
      margin: 14px auto 0;
      color: var(--muted);
      max-width: 52ch;
      line-height: 1.7;
    }

    footer {
      margin-top: 24px;
      text-align: center;
      color: #7d8daf;
      font-size: 13px;
    }

    @media (max-width: 980px) {
      .hero,
      .trust {
        grid-template-columns: 1fr;
      }

      .hero-main {
        padding: 34px;
      }

      .grid-3 {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 720px) {
      .shell {
        padding: 14px 14px 60px;
      }

      .nav-links {
        display: none;
      }

      .hero-main {
        padding: 28px 22px;
      }

      .hero-copy {
        font-size: 16px;
      }

      .flow,
      .grid-3 {
        grid-template-columns: 1fr;
      }

      section {
        margin-top: 44px;
      }
    }
  </style>
</head>
<body>
  <main class="shell">
    <nav class="nav">
      <div class="brand">
        <span class="brand-mark"></span>
        <span>SOUL BUILDER</span>
      </div>
      <div class="nav-links">
        <a href="#how">How It Works</a>
        <a href="#value">Value</a>
        <a href="#trust">Technical</a>
      </div>
    </nav>

    <section class="hero">
      <article class="card hero-main">
        <div class="eyebrow">ag3nt.id workflow</div>
        <h1>Give your AI agent a coherent, memorable soul.</h1>
        <p class="hero-copy">
          Soul Builder captures your agent identity in six focused prompts and returns a clean, reusable <code>SOUL.md</code> that keeps behavior, tone, and values consistent across sessions.
        </p>
        <div class="cta-row">
          <a class="btn btn-primary" href="/mcp">Open MCP Endpoint</a>
          <a class="btn btn-secondary" href="/health">View Health Status</a>
        </div>
      </article>

      <aside class="card hero-side">
        <div class="eyebrow">Output quality</div>
        <h3>From intent to operational identity</h3>
        <div class="stack">
          <div class="stack-item">
            <b>Identity</b>
            <span>Name, personality, core values, communication style.</span>
          </div>
          <div class="stack-item">
            <b>Narrative</b>
            <span>Backstory and signature lines that shape consistent responses.</span>
          </div>
          <div class="stack-item">
            <b>Portable</b>
            <span>One generated <code>SOUL.md</code> for system prompts and team handoff.</span>
          </div>
        </div>
      </aside>
    </section>

    <section id="how">
      <div class="section-head">
        <h2>How it works: 6 questions to SOUL.md</h2>
        <p>
          The flow is intentionally constrained. Each question adds a structural layer to your agent identity, then the final document is generated in markdown for immediate use.
        </p>
      </div>
      <div class="flow">
        <article class="card">
          <div class="flow-step">Questions 1-3</div>
          <div class="flow-title">Define identity fundamentals</div>
          <p>Name your agent, shape personality, and set core values.</p>
        </article>
        <article class="card">
          <div class="flow-step">Questions 4-6</div>
          <div class="flow-title">Set expression and narrative</div>
          <p>Specify tone, write a compact backstory, and optional signature line.</p>
        </article>
        <article class="card">
          <div class="flow-step">Generate</div>
          <div class="flow-title">Compile a clean SOUL.md</div>
          <p>Get a complete identity file with stable sections and consistent wording.</p>
        </article>
        <article class="card">
          <div class="flow-step">Deploy</div>
          <div class="flow-title">Use across agent runtime</div>
          <p>Reuse the file in prompts, orchestrators, and team documentation.</p>
        </article>
      </div>
    </section>

    <section id="value">
      <div class="section-head">
        <h2>Why teams use Soul Builder</h2>
      </div>
      <div class="grid-3">
        <article class="card feature">
          <h3>Consistency</h3>
          <p>Reduce persona drift and keep responses aligned with defined values and tone.</p>
        </article>
        <article class="card feature">
          <h3>Speed</h3>
          <p>Capture identity in minutes instead of ad hoc prompt drafting and rewrites.</p>
        </article>
        <article class="card feature">
          <h3>Clarity</h3>
          <p>Ship one structured source of truth for anyone building on your agent.</p>
        </article>
      </div>
    </section>

    <section id="trust" class="trust">
      <article class="card trust-list">
        <div class="eyebrow">Technical details</div>
        <h3>Built for MCP integration</h3>
        <ul>
          <li>Remote MCP endpoint at <code>POST /mcp</code> using Streamable HTTP transport.</li>
          <li>Health and uptime visibility at <code>GET /health</code>.</li>
          <li>OpenAI domain verification path remains available.</li>
          <li>In-memory session handling with automatic expiry cleanup.</li>
        </ul>
      </article>
      <article class="card trust-list">
        <div class="eyebrow">Core routes</div>
        <ul>
          <li><code>GET /</code> Premium landing page</li>
          <li><code>GET /mcp</code> Endpoint info for debugging</li>
          <li><code>POST /mcp</code> MCP tool transport</li>
          <li><code>GET /.well-known/openai-apps-challenge</code></li>
          <li><code>GET /health</code></li>
        </ul>
      </article>
    </section>

    <section class="card cta">
      <h2>Turn your next agent into a product-grade identity.</h2>
      <p>
        Soul Builder gives you a repeatable ritual for agent design: focused questions in, production-ready <code>SOUL.md</code> out.
      </p>
      <div class="cta-row" style="justify-content: center;">
        <a class="btn btn-primary" href="/mcp">Start with MCP</a>
      </div>
    </section>

    <footer>
      Soul Builder by ag3nt.id
    </footer>
  </main>
</body>
</html>`;
}
