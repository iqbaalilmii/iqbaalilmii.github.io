import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <h1 className="h1">Not found</h1>
      <p className="meta">The page you&apos;re looking for doesn&apos;t exist.</p>
      <p>
        <Link href="/">Back to home</Link>
      </p>
    </>
  );
}
