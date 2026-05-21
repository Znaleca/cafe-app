import { FiStar } from 'react-icons/fi';

const testimonials = [
  { name: 'Sofia L.', text: 'The most beautiful café I\'ve ever visited. The Sky Cloud Latte is absolutely divine!', stars: 5 },
  { name: 'Mia R.', text: 'I come here every weekend. The Sparkle Croissant pairs perfectly with the Azure Matcha.', stars: 5 },
  { name: 'Clara K.', text: 'The aesthetic is unreal. It feels like stepping into a dream every single time.', stars: 5 },
];

export default function Reviews() {
  return (
    <section className="bg-white py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase text-center mb-20 tracking-tighter">
          What our guests say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {testimonials.map((t, idx) => (
            <div key={idx} className="flex flex-col text-center items-center">
              <div className="text-sky-500 mb-6 flex gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <FiStar key={i} className="w-6 h-6 fill-current" />
                ))}
              </div>
              <p className="text-xl md:text-2xl font-bold text-slate-800 leading-tight mb-8">
                "{t.text}"
              </p>
              <div className="w-12 h-1 bg-sky-200 mb-6"></div>
              <span className="text-sm uppercase tracking-widest font-bold text-slate-500">
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
