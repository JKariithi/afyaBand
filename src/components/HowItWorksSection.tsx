import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Watch, Smartphone, BarChart2, Share2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const steps = [
  {
    number: "01",
    icon: Watch,
    title: "Wear the AFYA BAND",
    description:
      "Comfortable, lightweight wristband monitors your vitals throughout the day.",
  },
  {
    number: "02",
    icon: Smartphone,
    title: "Sync with App",
    description:
      "Connect to our mobile and web platform to view real-time health data.",
  },
  {
    number: "03",
    icon: BarChart2,
    title: "Track Your Progress",
    description:
      "Receive weekly statistics, expert tips, and personalized health insights.",
  },
  {
    number: "04",
    icon: Share2,
    title: "Share with Doctors",
    description:
      "Export and share accurate data with healthcare professionals for better care.",
  },
];

export const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 bg-muted"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, effective health monitoring in four easy steps
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="relative bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 text-center"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 right-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                {step.number}
              </div>

              {/* Icon */}
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <step.icon size={36} className="text-primary" />
              </div>

              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Health Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitor your vital signs with our intuitive interface
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Main Dashboard Card */}
          <div className="lg:col-span-2 bg-card rounded-xl p-6 md:p-8 shadow-card">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-card-foreground">
                Weekly Overview
              </span>
              <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                Normal Range
              </span>
            </div>

            {/* Blood Pressure */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📊</span>
                <span className="text-muted-foreground">Blood Pressure</span>
              </div>
              <div className="text-3xl font-bold text-card-foreground mb-2">
                120/80
              </div>
              <Progress value={70} className="h-2 mb-1" />
              <span className="text-sm text-muted-foreground">
                Average this week
              </span>
            </div>

            {/* Heart Rate */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl animate-heartbeat">❤️</span>
                <span className="text-muted-foreground">Heart Rate</span>
              </div>
              <div className="text-3xl font-bold text-card-foreground mb-2">
                72 bpm
              </div>
              <Progress value={60} className="h-2 mb-1 [&>div]:bg-health-pink" />
              <span className="text-sm text-muted-foreground">
                Resting heart rate
              </span>
            </div>

            <div className="text-sm text-muted-foreground flex items-center gap-2 pt-4 border-t border-border">
              <span>📅</span>
              Last updated: Today at 2:45 PM
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            <div className="bg-success/10 border border-success/20 rounded-xl p-6">
              <h4 className="font-semibold text-success flex items-center gap-2 mb-2">
                <span>📈</span> 7-Day Streak
              </h4>
              <p className="text-foreground/80 text-sm">
                Great job maintaining healthy readings this week!
              </p>
            </div>

            <div className="bg-secondary border border-primary/20 rounded-xl p-6">
              <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                <span>💡</span> Expert Tip
              </h4>
              <p className="text-foreground/80 text-sm">
                Regular exercise can help lower blood pressure by 5-10 mmHg.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
