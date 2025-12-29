import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import ThemeToggle from './components/ThemeToggle';

export const metadata: Metadata = {
  title: {
    default: 'keii.codes',
    template: '%s · keii.codes'
  },
  description: 'Static blog for my writeups.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-theme', t);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  } catch {}
})();`
          }}
        />
      </head>
      <body>
        <div className="container">
          <header className="header">
            <Link className="brand" href="/">
              keii.codes
            </Link>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/posts/">Posts</Link>
              <Link href="/about/">About</Link>
              <ThemeToggle />
            </nav>
          </header>
          <main>{children}</main>
          <footer className="footer">
            <div>© 2025 keii · Built with Next.js</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
