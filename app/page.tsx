import Hero from '@/components/Hero';
import Features from '@/components/Features';
import NewCollections from '@/components/NewCollections';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <NewCollections />
    </div>
  );
}