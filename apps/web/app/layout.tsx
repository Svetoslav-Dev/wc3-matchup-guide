import type { Metadata } from "next";
import Link from "next/link";
import { SiteAuth } from "../components/site-auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "WC3 Matchup Guide",
  description: "A dark fantasy Warcraft III strategy database for races, heroes, matchups, and build orders.",
};

const navigation = [
  { href: "/", label: "Home" },
  { href: "/races", label: "Races" },
  { href: "/units", label: "Units" },
  { href: "/maps", label: "Maps" },
  { href: "/matchups", label: "Matchups" },
  { href: "/builds", label: "Builds" },
  { href: "/heroes", label: "Heroes" },
  { href: "/favorites", label: "Favorites" },
  { href: "/admin", label: "Admin" },
];

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="page-shell site-header__inner">
            <Link href="/" className="brand">
              <span className="brand__eyebrow">Warcraft III Matchup Platform</span>
              <span className="brand__name">WC3 Matchup Guide</span>
            </Link>
            <nav className="nav" aria-label="Main">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <SiteAuth />
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
            <div>
              <p className="section-label">Next Step</p>
              <p>
                Wire this UI to Next.js route handlers, Drizzle models, authentication, and the Expo
                client described in <span className="accent">AGENTS.md</span>.
              </p>
            </div>
          </div>
          <div className="page-shell">
            <p className="footer-note">
              Unofficial fan project for educational purposes. Warcraft is a trademark of Blizzard
              Entertainment.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
