import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import bandImage from "@/assets/band.jpeg";

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center bg-hero-gradient pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Take Control of Your Health with{" "}
              <span className="text-accent">AFYA BAND</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-8 max-w-xl">
              An affordable wristband that continuously monitors your blood
              pressure and heart rate, providing real-time health insights to
              help prevent serious complications.
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="text-lg px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              asChild
            >
              <a href="#about">Learn More</a>
            </Button>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <img
                  src={bandImage}
                  alt="Afya Band Wristband - Health monitoring device"
                  className="w-full max-w-sm lg:max-w-md rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/20 to-transparent" />
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/30 rounded-full blur-xl animate-pulse-slow" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-success/20 rounded-full blur-2xl animate-pulse-slow" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
