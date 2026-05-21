import Link from 'next/link';

export default function CTA() {
  return (
    <section className="bg-sky-600 py-32 px-8 w-full border-t-[16px] border-sky-200">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-none">
          Ready to taste the magic?
        </h2>
        <p className="text-sky-100 text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-12">
          Join the Her&amp;Her community and start your journey into a world of sky-blue dreams today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/menu"
            className="inline-block px-12 py-4 bg-white text-sky-700 rounded-full font-bold text-lg hover:bg-sky-50 transition-colors"
          >
            Order Now
          </Link>
          <Link
            href="/register"
            className="inline-block px-12 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-sky-700 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}
