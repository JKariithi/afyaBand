import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Activity,
  Heart,
  BarChart3,
  Bell,
  Smartphone,
  Users,
} from "lucide-react";

const problems = [
  "Urban residents struggle to balance demanding work schedules and stress",
  "Many remain unaware of their blood pressure until complications arise",
  "Late medical interventions lead to higher healthcare costs",
];

const solutions = [
  "Affordable wristband for continuous health monitoring",
  "Real-time blood pressure and heart rate tracking",
  "Weekly health statistics and expert tips",
  "Early warnings enable preventive action and timely medical advice",
];

const features = [
  {
    icon: Activity,
    title: "Continuous Monitoring",
    description:
      "24/7 blood pressure and heart rate tracking to keep you informed about your health status.",
    color: "bg-secondary text-primary",
  },
  {
    icon: Heart,
    title: "Real-time Insights",
    description:
      "Instant health data displayed on your connected mobile and web platform.",
    color: "bg-health-pink/10 text-health-pink",
  },
  {
    icon: BarChart3,
    title: "Weekly Statistics",
    description:
      "Comprehensive weekly health reports to help you track your progress over time.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Bell,
    title: "Early Warnings",
    description:
      "Smart alerts notify you of abnormal readings before serious complications develop.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Smartphone,
    title: "Mobile & Web Access",
    description:
      "Access your health data anywhere through our user-friendly apps and web platform.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Users,
    title: "Share with Doctors",
    description:
      "Easily share accurate health data with your healthcare providers for better consultations.",
    color: "bg-sky-100 text-sky-600",
  },
];

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-20 md:py-28 bg-secondary" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Why AFYA BAND?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Addressing the critical health challenges faced by urban residents
            in Nairobi
          </p>
        </motion.div>

        {/* Problem & Solution Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-20">
          {/* Problem Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-problem-gradient rounded-2xl p-6 md:p-8 border-2 border-health-pink/30 shadow-card"
          >
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">
              The Problem
            </h3>
            <ul className="space-y-4">
              {problems.map((problem, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-foreground/90"
                >
                  <span className="text-health-pink text-xl font-bold mt-0.5">
                    •
                  </span>
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solution Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-solution-gradient rounded-2xl p-6 md:p-8 border-2 border-success/30 shadow-card"
          >
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">
              Our Solution
            </h3>
            <ul className="space-y-4">
              {solutions.map((solution, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-foreground/90"
                >
                  <span className="text-success text-xl font-bold mt-0.5">
                    ✓
                  </span>
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to take control of your health in one affordable
            device
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
              >
                <feature.icon size={32} />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
