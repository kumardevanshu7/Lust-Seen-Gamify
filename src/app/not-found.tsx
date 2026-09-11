import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-serif font-black text-rose-500 mb-4">404</h1>
      <h2 className="text-xl font-bold uppercase tracking-wider mb-2">Locus Disrupted</h2>
      <p className="text-stone-400 text-sm max-w-md mb-6">
        The realm you are seeking has dissolved into the shadows. Reconnect to the primary arena.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm tracking-wider uppercase transition-colors"
      >
        Return to Arena
      </Link>
    </div>
  );
}
