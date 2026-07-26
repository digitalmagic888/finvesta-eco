"use client";

import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const sessionKey = "finvesta-flash-lending-exit-intent-v1";

export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const closeButton = useRef(null);

  useEffect(() => {
    if (window.sessionStorage.getItem(sessionKey)) return;

    let armed = false;
    const armTimer = window.setTimeout(() => { armed = true; }, 4000);
    const handleExit = (event) => {
      if (!armed || event.clientY > 8 || event.relatedTarget) return;
      if (window.localStorage.getItem("finvesta-ecosystem-agreement-v1") !== "accepted") return;
      window.sessionStorage.setItem(sessionKey, "shown");
      setOpen(true);
    };

    document.addEventListener("mouseout", handleExit);
    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener("mouseout", handleExit);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const handleKeyDown = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="exit-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
      <section className="exit-dialog" role="dialog" aria-modal="true" aria-labelledby="flash-lending-title">
        <button ref={closeButton} className="exit-close" type="button" aria-label="Close flash lending guide" onClick={() => setOpen(false)}>
          <X size={22} />
        </button>

        <div className="exit-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="vault"><ShieldCheck size={52} /><span>USDC</span></div>
          <div className="flow-node"><Zap size={20} /> ATOMIC</div>
          <div className="flow-line" />
        </div>

        <div className="exit-content">
          <p className="exit-eyebrow"><span /> pNAS USDC FLASH LENDING</p>
          <h2 id="flash-lending-title">Before you go—see how liquidity moves <em>at atomic speed.</em></h2>
          <p className="exit-lead">Explore the architecture behind permissionless USDC flash loans, same-transaction repayment, and factory-launched satellite vaults.</p>
          <ul>
            <li><Check size={17} /> Follow the complete borrower loop</li>
            <li><Check size={17} /> Understand vault fees and safeguards</li>
            <li><Check size={17} /> Review satellite vault mechanics</li>
          </ul>
          <Link className="exit-primary" href="/flash-lending-docs/">
            EXPLORE FLASH LENDING DOCS <ArrowRight size={19} />
          </Link>
          <button className="exit-secondary" type="button" onClick={() => setOpen(false)}>No thanks, continue browsing</button>
        </div>
      </section>
    </div>
  );
}
