import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'keii.malwr.es',
    template: '%s · keii'
  },
  description: 'Security research, forensic analysis, and threat intelligence by a DFIR practitioner.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="page-header">
          <div className="grid">
            <div className="logo">
              <Link href="/">keii</Link>
            </div>
            <p className="tagline">security research &amp; dfir</p>
            <hr className="lifted" />
          </div>
          <nav>
            <input type="checkbox" id="drop" />
            <label htmlFor="drop" id="menu-toggle" />
            <ul className="menu nls">
              <li>
                <Link className="navlink" href="/">
                  <span className="navlink-text">home</span>
                </Link>
              </li>
              <li>
                <Link className="navlink" href="/posts/">
                  <span className="navlink-text">posts</span>
                </Link>
              </li>
              <li>
                <Link className="navlink" href="/about/">
                  <span className="navlink-text">about</span>
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>{children}</main>

        <footer>
          <p className="privacy">
            <a href="https://github.com/jonscafe" target="_blank" rel="noopener noreferrer">github</a>
            {' · '}
            <a href="https://www.linkedin.com/in/jomrbn/" target="_blank" rel="noopener noreferrer">linkedin</a>
            {' · '}
            <span>© 2026 keii</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
