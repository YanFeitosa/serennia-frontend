// src/pages/Landing.tsx
import { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Benefits from '../components/landing/Benefits';
import RegistrationForm from '../components/landing/RegistrationForm';
import Footer from '../components/landing/Footer';

const Landing = () => {
  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    // Add landing-theme class to prevent dark mode from affecting landing
    document.documentElement.classList.add('landing-theme');
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.documentElement.classList.remove('landing-theme');
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden [&_*]:!text-inherit [&_.text-white]:!text-white [&_.text-gray-300]:!text-gray-300 [&_.text-gray-400]:!text-gray-400 [&_.text-gray-500]:!text-gray-500"
      style={{ colorScheme: 'dark' }}
    >
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-purple-600/20 rounded-full blur-[60px] md:blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[150px] md:w-[400px] h-[150px] md:h-[400px] bg-blue-600/20 rounded-full blur-[50px] md:blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[100px] md:w-[300px] h-[100px] md:h-[300px] bg-pink-600/10 rounded-full blur-[40px] md:blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Benefits />
        
        {/* Registration Section */}
        <section id="register" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-8 md:mb-12">
              <span className="inline-block px-3 md:px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 text-xs md:text-sm font-medium mb-4">
                Crie sua Conta
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent px-2">
                Transforme seu salão hoje
              </h2>
              <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
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
