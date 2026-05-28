import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Clients from "./components/Clients";
import Services from "./components/Services";
import Works from "./components/Works";
import Award from "./components/Award";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Clients />
      <Services />
      <Works />
      <Award />
      <Footer />
    </>
  );
}