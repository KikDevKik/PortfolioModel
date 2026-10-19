import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page page--flow page--first notfound">
      <p className="label">Error 404</p>
      <h1 className="section-title">
        This page<em> was never printed.</em>
      </h1>
      <Link href="/" className="label link-line">
        Back to the cover
      </Link>
    </main>
  );
}
