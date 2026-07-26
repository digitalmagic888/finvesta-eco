"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function MobileMenu({ nav }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="menu-button" type="button" aria-label={open ? "Close" : "Menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      {open && (
        <div className="mobile-menu" role="dialog" aria-label="Site menu">
          <nav aria-label="Site">
            {nav.map((item) => (
              item.href.startsWith("/") ? (
                <Link key={item.label} className={item.cta ? "mobile-nav-cta" : undefined} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              )
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
