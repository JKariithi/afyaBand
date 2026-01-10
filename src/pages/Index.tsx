import { Helmet } from "react-helmet-async";
import { Navbar, Footer } from "@/shared/components";
import { 
  HeroSection, 
  AboutSection, 
  HowItWorksSection, 
  TeamSection, 
  ContactSection 
} from "@/features/landing";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Afya Band - Smart Health Monitoring Wristband</title>
        <meta
          name="description"
          content="Afya Band is an affordable wristband that continuously monitors your blood pressure and heart rate, providing real-time health insights to help prevent serious complications."
        />
        <meta
          name="keywords"
          content="health monitoring, wristband, blood pressure, heart rate, health tracker, Nairobi, Kenya, affordable healthcare"
        />
        <link rel="canonical" href="https://afyaband.com" />
      </Helmet>

      <main className="min-h-screen">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <HowItWorksSection />
        <TeamSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
