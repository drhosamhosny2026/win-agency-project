import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Hero   from "./components/Hero";

// Below-fold sections: JS splits into separate chunks, HTML still pre-rendered (ssr:true default)
const Marquee  = dynamic(() => import("./components/Marquee"));
const Clients  = dynamic(() => import("./components/Clients"));
const Services = dynamic(() => import("./components/Services"));
const Works    = dynamic(() => import("./components/Works"));
const Award    = dynamic(() => import("./components/Award"));
const About    = dynamic(() => import("./components/About"));
const Vision   = dynamic(() => import("./components/Vision"));
const Contact  = dynamic(() => import("./components/Contact"));
const Footer   = dynamic(() => import("./components/Footer"));

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Clients />
      <Services />
      <Works />
      <Award />
      <About />
      <Vision />
      <Contact />
      <Footer />
    </>
  );
}
