"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import TextPage from "./pages/TextPage";
import Page3 from "./pages/Page3";
import Page4 from "./pages/Page4";
import Hero from "./pages/HeroPage";
import Navbar from "@/components/NavBar";
import AboutText from "@/components/AboutText";
import About from "./pages/About";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const App = () => {
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateRaf);
    };
  }, []);

  return (
    <main>
      <Navbar />
      <Hero />
    <AboutText />
      <About />
      <TextPage />
        
      <Page3 />
      <Page4 />
    </main>
  );
};

export default App;