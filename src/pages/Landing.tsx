// src/pages/Landing.tsx
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Benefits from '../components/landing/Benefits';
import RegistrationForm from '../components/landing/RegistrationForm';
import Footer from '../components/landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Benefits />
      
      {/* Registration Section */}
      <section id="register" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-card to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-4">
              Comece agora mesmo
            </h2>
            <p className="text-xl text-text-muted">
              Crie sua conta gratuitamente e comece a gerenciar seu salão hoje mesmo.
            </p>
          </div>
          <RegistrationForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;

