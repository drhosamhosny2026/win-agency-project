import Navbar   from "./components/Navbar";
import Hero     from "./components/Hero";
import Marquee  from "./components/Marquee";
import Clients  from "./components/Clients";
import Services from "./components/Services";
import Works    from "./components/Works";
import Award    from "./components/Award";
import About    from "./components/About";
import Vision   from "./components/Vision";
import Contact  from "./components/Contact";
import Footer   from "./components/Footer";

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
