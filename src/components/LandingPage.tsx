
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import GooeyBlob from './GooeyBlob';
import GooeyButton from './GooeyButton';
import AOS from 'aos';

interface LandingPageProps {
  onStartLearning: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartLearning }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out',
    });
  }, []);

  return (
    <section className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/95 to-background/90"></div>
      
      {/* Gooey blobs for visual interest */}
      <GooeyBlob 
        color="bg-primary/20" 
        size={500} 
        top="-10%" 
        left="-5%" 
        delay={0}
        blur="2xl"
      />
      <GooeyBlob 
        color="bg-secondary/20" 
        size={400} 
        bottom="-5%" 
        right="-5%" 
        delay={1.5}
        blur="2xl"
      />
      <GooeyBlob 
        color="bg-accent/20" 
        size={250} 
        top="30%" 
        right="10%" 
        delay={2.2}
        blur="2xl"
        opacity={0.5}
      />
      
      {/* Floating particles */}
      <div className="particle-container absolute inset-0 -z-5">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className="particle absolute bg-white/20 rounded-full"
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>
      
      {/* Content container */}
      <div className="container mx-auto px-4 z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Heading with futuristic style */}
          <h1 
            className="font-orbitron text-5xl md:text-7xl font-bold mb-4 tracking-tight"
            data-aos="fade-down"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary inline-block pb-2">
              Protein Synthesis
            </span>
          </h1>
          
          {/* Tagline */}
          <h2 
            className="text-xl md:text-2xl text-white/90 font-light"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            An immersive journey into the molecular machinery of life
          </h2>
          
          {/* Description paragraph */}
          <div 
            className="mt-8 bg-card/30 backdrop-blur-md border border-primary/10 rounded-xl p-6 shadow-lg max-w-2xl mx-auto"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <p className="text-lg text-white/80 leading-relaxed">
              Ever wondered how your cells transform genetic code into the proteins that power your body? 
              Join us on a fascinating adventure inside your cells where DNA becomes life! 
              With stunning visualizations and interactive models, you'll discover how the 
              molecular machinery reads DNA and assembles proteins—the building blocks of all living things.
            </p>
          </div>
          
          {/* CTA Button */}
          <div 
            className="mt-10"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <GooeyButton onClick={onStartLearning} className="px-8 py-4 text-lg">
              Start Learning
            </GooeyButton>
          </div>
          
          {/* Scroll indicator */}
          <div 
            className="mt-16 animate-bounce"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <div className="w-6 h-6 mx-auto border-2 border-white/50 border-b-transparent rounded-full animate-spin-slow"></div>
            <p className="text-white/50 mt-2 text-sm">Scroll to Explore</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingPage;
