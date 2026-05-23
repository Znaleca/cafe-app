import Hero from '@/components/Hero';
import About from '@/components/About';
import Reviews from '@/components/Reviews';
import CTA from '@/components/CTA';
import PlasticCupJourney from '@/components/PlasticCupJourney';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <PlasticCupJourney />
      <Hero />
      <About />
      <Reviews />
      <CTA />
    </div>
  );
}
