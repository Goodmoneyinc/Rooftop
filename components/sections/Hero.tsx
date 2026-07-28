'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

export default function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Shared rise-and-fade shape for the text stack. Each child overrides only
  // its `transition` (duration/delay), keeping the motion language identical
  // while matching the brief's staggered timing (0.1 / 0.25 / 0.4 / 0.5s).
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0 },
  };

  // The headline carries more visual weight than the rest of the stack, so it
  // rises slightly further to register as a distinct, heavier arrival.
  const fadeUpHeavy: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0 },
  };

  // The rule "draws" via scaleX — a transform, so it's disabled for reduced
  // motion in favor of a plain opacity fade at full width.
  const ruleVariants: Variants = {
    hidden: { opacity: 0, scaleX: prefersReducedMotion ? 1 : 0 },
    visible: { opacity: 1, scaleX: 1 },
  };

  return (
    <section
      aria-label="Introduction"
      className="flex min-h-screen w-full flex-col lg:flex-row"
    >
      {/* Text column — first in DOM so screen readers reach the headline
          immediately, regardless of the visual order set below for mobile. */}
      <div className="order-2 flex w-full flex-col justify-center bg-bone px-6 py-14 sm:px-10 sm:py-16 lg:order-1 lg:w-[38%] lg:py-0 lg:pl-20 lg:pr-12 xl:pl-28 xl:pr-16">
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          className="font-body text-xs font-medium uppercase tracking-[0.2em] text-stone sm:text-[13px]"
        >
          Residential &amp; Commercial Roofing
        </motion.p>

        <motion.span
          initial="hidden"
          animate="visible"
          variants={ruleVariants}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-4 block h-px w-10 origin-left bg-copper"
        />

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUpHeavy}
          transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
          className="mt-6 font-display font-medium text-ink"
          style={{
            fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
            lineHeight: 0.97,
          }}
        >
          Built to Outlast
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
          className="mt-6 max-w-[32ch] font-body text-base leading-relaxed text-stone sm:text-lg"
        >
          Precision roofing for homeowners and builders who don&apos;t
          compromise on materials or craft.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
          className="mt-10"
        >
          <Link
            href="#quote"
            className="inline-flex items-center justify-center rounded-sm bg-ink px-8 py-4 font-body text-sm font-medium tracking-wide text-bone transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-copper hover:shadow-lg hover:shadow-copper/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
          >
            Get a Quote
          </Link>
        </motion.div>
      </div>

      {/* Video column — a framed panel, not a background fill. Generous bone
          whitespace surrounds it (mirroring the text column's rhythm) and it
          never exceeds its 624px source resolution, so it's never upscaled. */}
      <div className="order-1 flex w-full items-center justify-center bg-bone px-6 py-10 sm:px-10 sm:py-14 lg:order-2 lg:w-[62%] lg:px-12 lg:py-16 xl:px-16 xl:py-20">
        <div className="relative aspect-square w-full max-w-[624px] overflow-hidden border border-copper">
          {prefersReducedMotion ? (
            <Image
              src="/hero/roofing-hero-poster.jpg"
              alt="Macro detail of interlocking shingles and copper flashing, showing the tight, weatherproof seams of a finished roof"
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 624px, 100vw"
              className="object-cover"
            />
          ) : (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/hero/roofing-hero-poster.jpg"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/hero/roofing-hero-ripple.webm" type="video/webm" />
              <source src="/hero/roofing-hero-ripple.mp4" type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </section>
  );
}
