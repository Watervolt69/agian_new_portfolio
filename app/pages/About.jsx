"use client";

const About = () => {
  return (
    <div className="w-full relative bg-black">
      <div className="w-full min-h-screen text-white px-10 py-32 flex flex-col md:flex-row justify-between items-start gap-12 z-10 relative">
        <div className="md:w-1/2">
          <h2 className="text-sm font-semibold tracking-[0.3em] text-zinc-500 uppercase mb-6">
            / MY PATH
          </h2>
          <p className="text-3xl md:text-5xl font-bold leading-tight tracking-tight max-w-xl">
            I craft seamless user interfaces and high-performance applications with absolute precision.
          </p>
        </div>
        <div className="md:w-1/2 flex flex-col gap-6 text-zinc-400 max-w-lg text-lg">
          <p>
            I specialize in bridging the gap between design and technology. My work is focused on creating responsive, performant, and interactive web applications that leave a lasting impression.
          </p>
          <p>
            By leveraging advanced tools like Next.js, TypeScript, and GSAP, I ensure every project is built to scale while maintaining high performance and smooth, fluid motion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;