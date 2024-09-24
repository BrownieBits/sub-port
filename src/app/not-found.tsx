import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </main>
  );
}
