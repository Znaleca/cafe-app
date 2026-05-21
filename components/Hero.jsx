import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row w-full min-h-[80vh] md:min-h-[85vh] bg-white">
      {/* Image Side */}
      <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-full order-1 md:order-2">
        <Image 
          src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1600" 
          fill 
          className="object-cover" 
          alt="Delicious blue matcha latte" 
          sizes="(max-width: 768px) 100vw, 50vw" 
          priority 
        />
      </div>

      {/* Text Side */}
      <div className="w-full md:w-1/2 bg-sky-100 flex flex-col justify-center items-center p-12 md:p-24 text-center order-2 md:order-1">
        <div className="max-w-xl flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-800 tracking-tighter leading-[1.1] mb-6 uppercase">
            Taste the cloud
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 mb-10 font-medium">
            Handcrafted drinks and sparkling pastries made with love. Step into our sky-blue sanctuary today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/menu"
              className="inline-block px-8 py-3 rounded-full border-2 border-transparent bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
            >
              Explore Our Menu
            </Link>
            <Link
              href="/register"
              className="inline-block px-8 py-3 rounded-full border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-100 transition-colors"
            >
              Join the Club
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
