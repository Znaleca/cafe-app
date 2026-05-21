import Link from 'next/link';
import Image from 'next/image';

const sections = [
  {
    title: 'Signature Brews',
    desc: 'From velvety lattes to bold cold brews, every cup is crafted with care and sky-blue magic.',
    img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=1200',
    imgAlt: 'Signature cold brew',
    bg: 'bg-[#e0f2fe]', // sky-100
    textColor: 'text-slate-900',
    reverse: false,
  },
  {
    title: 'Artisan Pastries',
    desc: 'Flaky croissants, dreamy cakes, and shimmering treats baked fresh every morning.',
    img: 'https://images.unsplash.com/photo-1549903072-7e6e0efeb2fa?auto=format&fit=crop&q=80&w=1200',
    imgAlt: 'Flaky pastry',
    bg: 'bg-white',
    textColor: 'text-slate-900',
    reverse: true,
  },
  {
    title: 'Premium Teas',
    desc: 'Butterfly pea flower, matcha, and seasonal blends steeped to perfection for every mood.',
    img: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&q=80&w=1200',
    imgAlt: 'Premium matcha tea',
    bg: 'bg-[#bae6fd]', // sky-200
    textColor: 'text-slate-900',
    reverse: false,
  },
  {
    title: 'A Sanctuary of Calm',
    desc: 'We believe every visit should feel special. Our cozy, aesthetically curated space is perfect for good conversations and peaceful moments.',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1200',
    imgAlt: 'Cozy cafe interior',
    bg: 'bg-slate-900',
    textColor: 'text-white',
    reverse: true,
  }
];

export default function About() {
  return (
    <div className="w-full flex flex-col">
      {sections.map((sec, idx) => (
        <section key={idx} className="flex flex-col md:flex-row w-full min-h-[60vh]">
          {/* Image Side */}
          <div className={`w-full md:w-1/2 relative min-h-[50vh] md:min-h-full ${sec.reverse ? 'order-1 md:order-2' : 'order-1 md:order-1'}`}>
            <Image 
              src={sec.img} 
              alt={sec.imgAlt} 
              fill 
              className="object-cover" 
              sizes="(max-width: 768px) 100vw, 50vw" 
            />
          </div>

          {/* Text Side */}
          <div className={`w-full md:w-1/2 ${sec.bg} flex flex-col justify-center items-center p-12 md:p-20 text-center ${sec.reverse ? 'order-2 md:order-1' : 'order-2 md:order-2'}`}>
            <div className="max-w-md flex flex-col items-center">
              <h2 className={`text-3xl md:text-5xl font-black tracking-tight mb-6 uppercase ${sec.textColor}`}>
                {sec.title}
              </h2>
              <p className={`text-lg md:text-xl font-medium mb-8 leading-relaxed ${sec.textColor === 'text-white' ? 'text-slate-300' : 'text-slate-700'}`}>
                {sec.desc}
              </p>
              <Link
                href="/menu"
                className={`inline-block px-8 py-2.5 rounded-full border-2 font-bold transition-colors ${
                  sec.textColor === 'text-white' 
                    ? 'border-white text-white hover:bg-white hover:text-slate-900' 
                    : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
                }`}
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
