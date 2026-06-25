"use client";

import { useEffect, useState } from "react";

const agreementKey = "finvesta-ecosystem-agreement-v1";

export default function AgreementDisclaimer() {
  const [accepted, setAccepted] = useState(null);

  useEffect(() => {
    setAccepted(window.localStorage.getItem(agreementKey) === "accepted");
  }, []);

  useEffect(() => {
    if (accepted === false) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [accepted]);

  if (accepted !== false) return null;

  function acceptAgreement() {
    window.localStorage.setItem(agreementKey, "accepted");
    setAccepted(true);
  }

  return (
    <div className="agreement-overlay" role="presentation">
      <section className="agreement-dialog" role="dialog" aria-modal="true" aria-labelledby="agreement-title">
        <div className="agreement-scroll">
          <h2 id="agreement-title">Mandatory Agreement Disclaimer</h2>

          <div className="agreement-copy">
            <h3>Risk Disclosure</h3>
            <p>
              This website, the FINVESTA Ecosystem, printer tokens, NFTs, smart contracts, and any related interfaces are experimental and involve substantial risk.
              Nothing on this website is financial, legal, tax, or investment advice.
            </p>
            <p>
              You are solely responsible for reviewing all contracts, permissions, transaction details, and risks before interacting. You may lose some or all
              of any value used in connection with the protocol.
            </p>
            <p>
              This includes, but is not limited to, market volatility, gas fees, software exploits, or user error. The system is provided "as is" and
              "as available" with no warranties or guarantees. Blockchain transactions are final and irreversible.
            </p>

            <h3>Regulatory Statement</h3>
            <p>
              The FINVESTA Ecosystem is a decentralized experimental project, not a regulated financial product. Use may be restricted in certain jurisdictions.
              Users are solely responsible for compliance with local laws and tax obligations. Nothing herein constitutes a solicitation, financial service, or
              investment offer.
            </p>

            <h3>User Acknowledgment</h3>
            <p>By continuing, you confirm that you:</p>
            <ul>
              <li>Fully understand the risks involved and accept potential total loss of value.</li>
              <li>Acknowledge that FINVESTA and its contributors make no guarantees or warranties.</li>
              <li>Assume full responsibility for your actions, taxes, and reporting obligations.</li>
            </ul>
            <p>If you do not agree, you must exit this website immediately and refrain from interacting with the token or its contracts.</p>
          </div>

          <button className="agreement-button" type="button" onClick={acceptAgreement}>
            I AGREE
          </button>
        </div>
      </section>
    </div>
  );
}
