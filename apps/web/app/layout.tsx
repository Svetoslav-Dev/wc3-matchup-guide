import type { Metadata } from "next";
import Link from "next/link";
import { SiteAuth } from "../components/site-auth";
import { SiteNav } from "../components/site-nav";
import { getSessionUser } from "../lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "WC3 Matchup Guide",
  description: "A dark fantasy Warcraft III strategy database for races, heroes, matchups, and build orders.",
};

const publicNavigation = [
  { href: "/", label: "Home" },
  { href: "/races", label: "Races" },
  { href: "/heroes", label: "Heroes" },
  { href: "/units", label: "Units" },
  { href: "/buildings", label: "Buildings" },
  { href: "/items", label: "Items" },
  { href: "/maps", label: "Maps" },
  { href: "/matchups", label: "Matchups" },
  { href: "/builds", label: "Builds" },
];

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();
  const navigationItems = [
    ...publicNavigation,
    ...(user?.role === "admin" ? [{ href: "/admin", label: "God Panel", god: true }] : []),
  ];

  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="page-shell site-header__top">
            <Link href="/" className="brand">
              <span className="brand__eyebrow">Warcraft III Matchup Platform</span>
              <span className="brand__name">WC3 Matchup Guide</span>
            </Link>
            <SiteAuth />
          </div>
          <div className="page-shell site-header__nav">
            <SiteNav items={navigationItems} />
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="page-shell footer-grid">
            <div>
              <p className="section-label">Built For Ladder Study</p>
              <p>
                A production-style scaffold for the course capstone: races, heroes, matchup plans,
                build orders, and admin workflows in one Warcraft-themed web app.
              </p>
            </div>
          </div>
          <div className="page-shell">
            <p className="footer-note">
              Unofficial fan project for educational purposes. Warcraft is a trademark of Blizzard
              Entertainment.
            </p>
            <p className="footer-note" style={{ marginTop: "0.35rem", fontSize: "0.8rem", opacity: 0.5 }}>
              © Svetoslav Dichkov {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
