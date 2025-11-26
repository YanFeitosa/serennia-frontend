// src/pages/Landing.tsx
import { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Benefits from '../components/landing/Benefits';
import Testimonials from '../components/landing/Testimonials';
import RegistrationForm from '../components/landing/RegistrationForm';
import Footer from '../components/landing/Footer';

const Landing = () => {
  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        
        {/* Registration Section */}
        <section id="register" className="py-24 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-4">
                Comece Agora
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Transforme seu salão hoje
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Crie sua conta gratuitamente e comece a gerenciar seu salão de forma profissional.
              </p>
            </div>
            <RegistrationForm />
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Landing;
