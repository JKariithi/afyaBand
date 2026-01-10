import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { User } from "lucide-react";

const teamMembers = [
  {
    name: "Gakure Kihara Ernest",
    role: "Embedded Systems Engineer",
    description:
      "Responsible for the hardware and firmware for the AFYA BAND wristband",
  },
  {
    name: "Nyandiko Joseph",
    role: "Frontend Developer",
    description: "Responsible for design of mobile and web interfaces",
  },
  {
    name: "Kinuthia Njoki Marcia",
    role: "Backend Developer and UI/UX",
    description: "Responsible for backend development",
  },
  {
    name: "Shoka Ngumbao Sammy",
    role: "ML/Software Tester",
    description: "Responsible for ML algorithms and software testing",
  },
  {
    name: "Otieno Ramogi Samuel",
    role: "Backend Developer and Web Developer",
    description: "Responsible for backend systems and integration",
  },
  {
    name: "Wangui Kariithi Janice",
    role: "Machine Learning",
    description: "Responsible for ML algorithms, model design and analysis",
  },
];

export const TeamSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="team" className="py-20 md:py-28 bg-secondary" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The talented team behind AfyaBand dedicated to improving health
            outcomes
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 text-center group"
            >
              {/* Avatar */}
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <User size={36} className="text-primary" />
              </div>

              <h3 className="text-lg font-semibold text-card-foreground mb-1">
                {member.name}
              </h3>
              <h4 className="text-sm font-medium text-primary mb-3">
                {member.role}
              </h4>
              <p className="text-muted-foreground text-sm">
                {member.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
