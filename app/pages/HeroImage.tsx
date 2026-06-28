import Image from "next/image";

/* HeroImage — in-flow portrait card that sits inside the center grid column.
   Width is fixed so it stays true portrait (not stretched to fill column).
   Animated by the parent Hero timeline via the .hero-img-wrap class.       */
const HeroImage = () => {
  return (
    <div className="hero-img-wrap relative w-[300px]">

      {/* Portrait card */}
      <div className="overflow-hidden rounded-sm border border-black/[0.07] bg-neutral-200 shadow-[0_16px_48px_rgba(0,0,0,.11)]">
        <Image
          src="https://i.pinimg.com/736x/66/ed/56/66ed56c4e3a14bf72a1d58ee0c1961a7.jpg"
          alt="Aryan"
          width={300}
          height={420}
          priority
          className="h-[420px] w-[300px] object-cover object-center grayscale"
        />
      </div>

      {/* Year — top-left */}
      <span className="absolute -left-9 top-0 text-[0.6rem] uppercase tracking-[0.46em] text-black/35">
        2026
      </span>

      {/* Rotated role label — left edge */}
      <div className="absolute -left-10 bottom-14 origin-left -rotate-90">
        <p className="text-[0.6rem] uppercase tracking-[0.46em] text-black/35">
          FULL STACK DEVELOPER
        </p>
      </div>

      {/* Name — bottom-right */}
      <div className="absolute -bottom-7 right-0">
        <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.38em] text-black">
          ARYAN
        </h3>
      </div>

    </div>
  );
};

export default HeroImage;