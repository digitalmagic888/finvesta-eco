import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ArrowUpRight, BarChart3, Brain, Cpu, Eye, ShieldCheck, Timer, Zap } from "lucide-react";
import scrape from "../../scraped/pages.json" assert { type: "json" };
import MobileMenu from "../components/MobileMenu";

const byRoute = new Map(scrape.pages.map((page) => [page.route, page]));

const embeddedPages = {
  "/ecointent": {
    title: "ECO INTENTIONS",
    file: "ecointent-declaration.html",
  },
  "/braindsandbonds": {
    title: "BRAINS AND BONDS",
    file: "braindsandbonds.html",
  },
  "/systemloops": {
    title: "SYSTEM LOOPS",
    file: "systemloops.html",
  },
};

const assets = {
  logo: "/assets/d999b788a605.png",
  favicon: "/assets/087371ebd736.png",
  hero: "/assets/2ffeea2692b5.png",
  og: "/assets/8c21679f7d5e.png",
  gas: "/assets/dbcdb87ff249.png",
  pdai: "/assets/287a45faa452.png",
  remember: "/assets/22b80acb44d2.png",
  star: "/assets/3c84cacad662.png",
  companyHero: "/assets/e27471cb6be7.jpg",
  teamA: "/assets/6ebe3889db7e.jpg",
  teamB: "/assets/80b624181bed.jpg",
  teamC: "/assets/a038473b4bf1.jpg",
  productHero: "/assets/b3c35428b39e.png",
  productA: "/assets/dbba2876ed7b.jpg",
  productB: "/assets/0d3ce3216783.jpg",
  productC: "/assets/c7f2e8cc3dfc.jpg",
  productD: "/assets/4634b53f31ef.jpg",
};

const nav = [
  { label: "👀 Pulsewatch", href: "https://pulsewatch.app/" },
  { label: "📈 Tracker", href: "https://ogprinters.pulsewatch.app/" },
  { label: "WHITE PAPER", href: "/whitepaper" },
];

const disclaimer =
  "Everything on this website is provided for informational purposes only. All tokens and interfaces described here are experimental. Nothing on this website is a promise, guarantee, or expectation of value, performance, or distributions. Users are solely responsible for their own decisions and should independently review all contracts, permissions, and risks before interacting.";

const homeCopy = {
  intro:
    'Printer tokens like REMEMBER or "World\'s Greatest pDAI Printer" are PRC20 tokens used within the protocol’s contract-defined mechanics. Users may interact with printer tokens directly, or hold a TrifectaBond NFT to satisfy access conditions for certain protocol-defined functions. The "brains" which are contracts on Pulsechain run transactions when someone calls the "randomizeAll" function. These contracts execute predefined checks and contract interactions when randomizeAll() is called.',
  access:
    "Wallets holding a TrifectaBond NFT may satisfy the contract’s access conditions for certain public functions, including randomizeAll(), subject entirely to deployed contract rules.",
  balances:
    "Printer token contracts may hold token balances as part of their contract-defined mechanics. On-chain balances can be reviewed through public block explorers.",
  bonds:
    "Each TrifectaBond records the LP token units initially associated with the position, but these balances remain subject to contract mechanics and market conditions and may decrease or be lost.",
  trifecta:
    "A TrifectaBond is an NFT-based access credential that records protocol-specific eligibility and state under the contract’s rules.",
  mint:
    "The contract includes token mint functionality under its deployed rules. Users should review current permissions, supply mechanics, and associated risks before interacting.",
  market: "Protocol behavior may be influenced by PulseChain market structure and on-chain arbitrage activity.",
};

const simplePageCopy = {
  "/arbitrage": {
    title: "ARBITRAGE ON PULSE",
    eyebrow: "How Arbitrage Bots Work with Printer Tokens",
    body:
      "Arbitrage activity may affect token prices across PulseChain whenever a token trades across two or more liquidity pools with different relative pricing. Example: REMEMBER/PLS v2 and REMEMBER/pDAI v2 In general, arbitrage activity observes price differences between pools and may execute transactions that bring pricing closer together across available routes. These transactions may occur when price differences, fees, and available liquidity make the route executable. For example, assume three stable assets are each intended to track the same reference value. Example liquidity pools: 1 USDT / 1 USDC (1:1) 1 USDT / 0.5 eDAI (2:1) If one pool reflects a materially different price than another, arbitrage activity may interact with both pools in sequence. This can affect balances, ratios, and execution prices across the connected pools. HOW THIS RELATES TO PRINTER TOKENS Printer token contracts may hold token balances and execute contract-defined actions under specified conditions. When these contracts interact with liquidity pools, arbitrage activity may influence pricing, pool ratios, and transaction outcomes across connected markets.",
  },
  "/braindsandbonds": {
    title: "BRAINS AND BONDS",
    body: "",
  },
  "/ecointent": {
    title: "ECO INTENTIONS",
    body: "",
  },
  "/systemloops": {
    title: "SYSTEM LOOPS",
    body: "",
  },
  "/legal": {
    title: "Developer and Contributor Disclosure",
    eyebrow: "DISCLOSURE",
    body:
      "Certain contributors or related wallets may interact with the protocol, public smart contracts, or interfaces in disclosed ways. Any such activity should be evaluated based on on-chain records, current contract permissions, and publicly available documentation. Contributor-held assets, if any, may be used only in disclosed ways permitted by the deployed contracts and related interfaces. Users should rely on on-chain records and current contract permissions when evaluating any such activity. Any contributor activity intended to interact with the protocol should be publicly observable through on-chain records where applicable. Automated Bot Functionality Public smart contracts may be callable by network participants; no promise is made that any person will continue operating auxiliary tools or interfaces. Protocol Automation These contracts are intended to operate according to their deployed code and publicly observable transactions. Automated contract interactions may include liquidity-related actions or other contract-defined functions. Such interactions may affect price, liquidity, and execution outcomes. The protocol includes public smart-contract functions that may be accessible to eligible participants under the contract rules. Refer to the DApp and contract documentation for details. Developer and Associate Roles Contributors or related wallets may receive or hold tokens through ordinary contract interactions, disclosed allocations, or other contract-permitted activity. Contributor-held assets, if any, should be disclosed transparently. No statement on this site should be understood as a promise of market support, value support, maintained outcomes, or similar effects. Contributors or service providers may receive token distributions in connection with disclosed development, operational, or ecosystem-related work, where applicable. Any such distributions should be disclosed transparently and evaluated based on their stated purpose, on-chain record, and current contract structure. Tokens held by any wallet may be subject to the same contract-defined mechanics that apply generally, depending on the deployed code and token design. Any contract-defined outputs, if present, depend on the deployed code, network activity, and protocol mechanics. No outcome is guaranteed. Contract behavior and any outputs depend on deployed code, network activity, market conditions, and user interaction.",
  },
};

export function generateStaticParams() {
  return scrape.pages.map((page) => ({ slug: page.route === "/" ? [] : [page.route.slice(1)] }));
}

async function routeFromParams(params) {
  const resolved = await params;
  return resolved?.slug?.length ? `/${resolved.slug[0]}` : "/";
}

async function getEmbedHtml(file) {
  return readFile(path.join(process.cwd(), "public", "embeds", file), "utf8");
}

export async function generateMetadata({ params }) {
  const route = await routeFromParams(params);
  const page = byRoute.get(route);
  if (!page) return {};
  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: { canonical: route === "/" ? "/" : route },
    openGraph: {
      title: page.meta.ogTitle || page.meta.title,
      description: page.meta.ogDescription || page.meta.description,
      url: route,
      siteName: "Finvesta Ecosystem",
      type: "website",
      images: [{ url: assets.og, width: 1643, height: 890 }],
    },
    icons: {
      icon: assets.favicon,
      apple: assets.favicon,
    },
  };
}

function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <Image src={assets.logo} width={42} height={42} alt="image.png" priority />
        <span>FINVESTA.ECO</span>
      </Link>
      <nav className="nav-links" aria-label="Site">
        {nav.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="chart-button" href="https://dexscreener.com/pulsechain/0x615cfd552e98eb97e5557b03aa41d0e85e98167b" target="_blank" rel="noreferrer">
        FINVESTA CHART <ArrowUpRight size={18} />
      </a>
      <MobileMenu nav={nav} />
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>DISCLAIMER</strong>
        <p>{disclaimer}</p>
      </div>
    </footer>
  );
}

function Shell({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function HomePage() {
  return (
    <Shell>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">Autonomous contract systems and governance experiments</p>
          <h1>
            <span>FINVESTA ECOSYSTEM</span>
            PRINTER PROTOCOL
          </h1>
          <p>Explore the FINVESTA protocol ecosystem on PulseChain</p>
          <a className="primary" href="https://dao.finvesta.eco" target="_blank" rel="noreferrer">
            ENTER DAPP <ArrowUpRight size={19} />
          </a>
          <div className="pill-row">
            <span><Zap size={18} />VPS</span>
            <span><ShieldCheck size={18} />Exploit Prevention</span>
            <span><Cpu size={18} />Autonomous Strategy</span>
          </div>
        </div>
        <div className="hero-art">
          <Image src={assets.hero} width={1885} height={1043} alt="MMMMM.png" priority sizes="(max-width: 900px) 100vw, 55vw" />
        </div>
      </section>

      <section className="printer-intro">
        <p className="kicker">ACCESS NFTS & PRINTERS</p>
        <h2>PRINTER TOKENS... WHAT ARE THEY?</h2>
        <p>{homeCopy.intro}</p>
        <p>{homeCopy.access}</p>
        <div className="printer-intro-details">
          <p>{homeCopy.balances}</p>
          <p>{homeCopy.bonds}</p>
          <p>{homeCopy.trifecta}</p>
        </div>
      </section>

      <section className="featured-printers">
        <h2>FEATURED PRINTER TOKENS</h2>
        <div className="featured-warning">
          <h3>WARNING</h3>
          <p>Printer token mechanics may route tokens according to contract logic, including liquidity operations, burns, or other configured actions.</p>
          <p>No gain is guaranteed, and losses may occur.</p>
        </div>
        <div className="featured-token-row">
          {[
            ["GAS MONEY", assets.gas],
            ["PDAI PRINTER", assets.pdai],
            ["REMEMBER", assets.remember],
          ].map(([title, image]) => (
            <article className="featured-token" key={title}>
              <Image src={image} width={512} height={512} alt={title} sizes="(max-width: 760px) 30vw, 150px" />
              <h3>{title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="statement">
        <Brain />
        <p>Brains automate. Access NFTs satisfy eligibility conditions. Printers route contract-defined interactions.</p>
      </section>

      <section className="split-section dark">
        <div>
          <h2>TRANSPARENCY IS KEY</h2>
          <p>{homeCopy.mint}</p>
          <p>{homeCopy.market}</p>
        </div>
        <div className="warning">
          <h3>WARNING</h3>
          <p>Printer token mechanics may route tokens according to contract logic, including liquidity operations, burns, or other configured actions.</p>
          <strong>No gain is guaranteed, and losses may occur.</strong>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>WANT A FULL BREAKDOWN?</h2>
          <p>Review the whitepaper for a technical overview of contract mechanics and protocol interactions.</p>
        </div>
        <Link className="primary" href="/whitepaper">WHITEPAPER <ArrowUpRight size={19} /></Link>
      </section>

      <section className="grid-section">
        <article className="info-card">
          <Timer />
          <h3>Self-executing automation</h3>
          <p>Certain automated processes may interact with liquidity pools and token balances according to contract logic. These interactions can affect price, liquidity, and user outcomes.</p>
        </article>
        <article className="info-card">
          <BarChart3 />
          <h3>Swapback Function</h3>
          <p>This function may sell tokens held by the token contract itself, subject to contract conditions. This mechanism may affect price, liquidity, and execution outcomes. This is a risk.</p>
        </article>
      </section>
    </Shell>
  );
}

function WhitepaperPage() {
  const cards = [
    ["ECO INTENT", "This section outlines the protocol’s design goals and broader ecosystem context.", "INTENT", "/ecointent"],
    ["ARBITRAGE", "This section explains how arbitrage activity on PulseChain may affect and interact with printer tokens and related PRC20 contracts.", "ARBITRAGE", "/arbitrage"],
    ["BRAINS AND BONDS", "This section explains how brains, bonds, and related contract interactions operate, including liquidity-related actions and other protocol-defined mechanics observable on-chain.", "ON CHAIN LOGIC", "/braindsandbonds"],
    ["SYSTEM LOOPS", "This section explains recurring contract interactions involving Remember, Gas Money, liquidity brains, ALB-related mechanics, and other protocol-defined processes.", "HOW LOOPS WORK", "/systemloops"],
    ["DEVELOPER DISCLOSURE", "This section describes contributor roles, related wallet disclosures, and other public-facing operational context.", "DISCLOSURE", "/legal"],
  ];
  return (
    <Shell>
      <section className="page-hero compact">
        <p className="kicker">WHITE PAPER</p>
        <h1>PRINTER TOKENS</h1>
      </section>
      <section className="whitepaper-grid">
        {cards.map(([title, body, label, href]) => (
          <article className="paper-card" key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
            <Link className="paper-card-button" href={href}>
              {label} <ArrowUpRight />
            </Link>
          </article>
        ))}
      </section>
    </Shell>
  );
}

function SimplePage({ route }) {
  const page = simplePageCopy[route];
  return (
    <Shell>
      <section className={`page-hero ${page.body ? "" : "simple-empty"}`}>
        <Image src={assets.logo} width={120} height={120} alt="image.png" priority />
        {page.eyebrow && <p className="kicker">{page.eyebrow}</p>}
        <h1>{page.title}</h1>
      </section>
      {page.body && (
        <section className="legal-copy">
          <p>{page.body}</p>
        </section>
      )}
    </Shell>
  );
}

async function EmbeddedWhitepaperPage({ route }) {
  const page = embeddedPages[route];
  const html = await getEmbedHtml(page.file);
  return (
    <Shell>
      <section className="embedded-paper-hero">
        <span />
        <h1>{page.title}</h1>
        <span />
      </section>
      <section className="embedded-paper" dangerouslySetInnerHTML={{ __html: html }} />
    </Shell>
  );
}

function CompanyPage() {
  return (
    <Shell>
      <section className="visual-hero">
        <Image src={assets.companyHero} fill alt="Image (22).jpg" priority sizes="100vw" />
        <div>
          <p className="kicker">About us</p>
          <h1>WE'RE SIKURA</h1>
          <p>We’re on a mission to protect your business and end users so you can relax</p>
        </div>
      </section>
      <section className="split-section">
        <div>
          <p className="kicker">Our Mission</p>
          <h2>Exploit Prevention</h2>
          <p>This is the space to introduce visitors to the business or brand. Briefly explain who's behind it, what it does and what makes it unique. Share its core values and what this site has to offer.</p>
        </div>
        <div className="stats">
          {["150 employees", "+100 customers", "50 supported platforms", "1 million daily active users"].map((stat) => <strong key={stat}>{stat}</strong>)}
        </div>
      </section>
      <section className="team-grid">
        <div className="section-heading">
          <p className="kicker">Leaders</p>
          <h2>MEET THE TEAM</h2>
        </div>
        {[
          ["Agnes Mickelson", "CEO and Founder", assets.teamA],
          ["Gustavo de Silva", "VP Sales", assets.teamB],
          ["Halou Wang", "CTO and Founder", assets.teamC],
        ].map(([name, title, img]) => (
          <article key={name}>
            <Image src={img} width={320} height={300} alt={name} />
            <h3>{name}</h3>
            <p>{title}</p>
          </article>
        ))}
      </section>
      <section className="core-team">
        <p className="kicker">CORE TEAM</p>
        {[
          ["Bernie Black", "Product Manager"],
          ["Arlo Jenkins", "Partnerships Director"],
          ["Laurent DeAngelo", "UX"],
          ["Richard White", "Sales"],
          ["Danielle Marco", "Automation Engineer"],
          ["Artem Gurevich", "C++ Developer"],
        ].map(([name, title]) => (
          <span key={name}>
            <strong>{name}</strong>
            {title}
            <a href="mailto:Info@mysite.com">Info@mysite.com</a>
          </span>
        ))}
      </section>
    </Shell>
  );
}

function ProductPage() {
  return (
    <Shell>
      <section className="visual-hero">
        <Image src={assets.productHero} fill alt="Image (21).png" priority sizes="100vw" />
        <div>
          <p className="product-lead">We Protect Your Systems from Malware and Attacks</p>
          <h1>PRODUCT OVERVIEW</h1>
        </div>
      </section>
      <section className="split-section">
        <div>
          <p className="kicker">PRODUCT</p>
          <h2>Cloud Security</h2>
          <p>This is the space to introduce the Product section and showcase the types of products available.</p>
        </div>
        <div className="info-card"><ShieldCheck /><h3>Exploit Prevention</h3></div>
      </section>
      <section className="grid-section photo-grid">
        {[assets.productA, assets.productB, assets.productC, assets.productD].map((img, index) => (
          <article key={img}>
            <Image src={img} width={520} height={300} alt={`Image ${index + 1}`} />
          </article>
        ))}
      </section>
      <section className="cta-band">
        <div>
          <p className="kicker">LET SIKURA DO THE WORK</p>
          <h2>MONITOR, ASSES THREAT LEVEL AND TAKE ACTION</h2>
        </div>
        <a className="primary" href="https://www.wix.com/templateslp/studio-external-link">WATCH DEMO</a>
      </section>
      <section className="grid-section">
        {["Memory Security", "MONITORING ACROSS ALL NETWORK", "DETECTING & ASSESSING THREATS", "TAKING ACTION TO PROTECT", "POWERFFUL, VIGILANT AND EASY TO USE", "Sikura Keeps you protected", "Code to Cloud Security on All Channels"].map((text) => (
          <article className="info-card" key={text}><Eye /><h3>{text}</h3><p>Describe the service and how customers or clients can benefit from it.</p></article>
        ))}
      </section>
    </Shell>
  );
}

export default async function Page({ params }) {
  const route = await routeFromParams(params);
  if (!byRoute.has(route)) notFound();
  if (route === "/") return <HomePage />;
  if (route === "/whitepaper") return <WhitepaperPage />;
  if (embeddedPages[route]) return <EmbeddedWhitepaperPage route={route} />;
  if (route === "/company") return <CompanyPage />;
  if (route === "/product") return <ProductPage />;
  return <SimplePage route={route} />;
}
