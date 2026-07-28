'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

// "ease-out-expo" — a slow, decelerating settle rather than a bouncy spring.
const CAMERA_EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Safari (iOS in particular) can fail to honor the `muted` JSX attribute on
  // initial render/hydration, which silently blocks autoplay — setting it
  // imperatively here is the documented workaround. Runs again whenever the
  // reduced-motion query flips, since the <video> unmounts/remounts then.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay was blocked (e.g. iOS Low Power Mode) — the poster frame
        // stays visible in place of a stalled video, which is an acceptable
        // fallback rather than something to retry aggressively.
      });
    }
  }, [prefersReducedMotion]);

  // Progress 0 -> 1 across exactly one hero-section-height of scroll (the
  // section is offset-start-to-offset-start of its own height, since it's
  // min-h-screen): scrolling one viewport-height completes the effect.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Continues the mount "camera push-in": very subtle, transform-only.
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  // Text fades out faster than the video keeps scaling, so it's gone before
  // the next section arrives rather than lingering into the handoff.
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Shared rise-and-fade shape for the text stack. Each child overrides only
  // its `transition` (duration/delay); the whole stack starts ~0.4s into the
  // video's mount scale so text arrives while the "camera" is still
  // settling, not after it's already stopped.
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeUpHeavy: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0 },
  };

  const ruleVariants: Variants = {
    hidden: { opacity: 0, scaleX: prefersReducedMotion ? 1 : 0 },
    visible: { opacity: 1, scaleX: 1 },
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-ink"
    >
      {/* Video layer. Two independent transform layers instead of one motion
          value fighting itself: the outer div carries the scroll-linked
          scale, the inner div carries the one-time mount "settle" scale. */}
      <motion.div
        className="absolute inset-0"
        style={prefersReducedMotion ? undefined : { scale: scrollScale }}
      >
        <motion.div
          className="absolute inset-0"
          initial={prefersReducedMotion ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 1.8, ease: CAMERA_EASE }
          }
        >
          {prefersReducedMotion ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Image
                src="/hero/roofing-hero-poster.jpg"
                alt="Macro detail of interlocking shingles and copper flashing, showing the tight, weatherproof seams of a finished roof"
                fill
                priority
                fetchPriority="high"
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          ) : (
            <video
              ref={videoRef}
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
        </motion.div>
      </motion.div>

      {/* Scrim: darkest where the centered text sits, transparent toward the
          edges so the video reads clearly outside the text block. Stops are
          tuned from real measurement, not guessed: the eyebrow/CTA sit well
          off the exact center (the text stack spans a good chunk of the
          viewport vertically), and sampling the actual composited pixels
          behind them against a brighter sky frame showed the naive
          "0.62 center -> 0.2 at 60%" falloff was too weak there (~3.6-3.8:1,
          below AA). These stops keep >=0.58 alpha out to ~50% of the
          ellipse, which measured 9-11:1 at the subhead/CTA (over roofline)
          and ~5.3-5.9:1 at the eyebrow (over sky) with margin to spare. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(26,24,21,0.72) 0%, rgba(26,24,21,0.58) 50%, rgba(26,24,21,0.28) 78%, transparent 100%)',
        }}
      />

      {/* Text stack — centered, overlaid on the video. The scroll-driven
          fade/rise wraps the mount-staggered children the same way the video
          layers compose: parent transform for scroll, child transform for
          the entrance. */}
      <motion.div
        className="relative z-10 flex w-full flex-col items-center px-6 text-center sm:px-10"
        style={prefersReducedMotion ? undefined : { opacity: textOpacity, y: textY }}
      >
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
          className="font-body text-xs font-medium uppercase tracking-[0.2em] text-haze sm:text-[13px]"
        >
          Residential &amp; Commercial Roofing
        </motion.p>

        <motion.span
          initial="hidden"
          animate="visible"
          variants={ruleVariants}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="mt-4 block h-px w-10 origin-center bg-copper"
        />

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUpHeavy}
          transition={{ duration: 0.5, delay: 0.65, ease: 'easeOut' }}
          className="mt-6 font-display font-extrabold text-bone"
          style={{
            fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
            lineHeight: 0.97,
            // SOFT 0 sharpens the terminals (Fraunces' default has some
            // roundness), opsz 144 pulls in the display-tuned optical size
            // (higher-contrast strokes, built for exactly this scale) — both
            // read bolder even independent of the 800 font-weight above.
            // wght is deliberately left out of this list so the Tailwind
            // class above keeps controlling it instead of being overridden.
            fontVariationSettings: "'SOFT' 0, 'WONK' 0, 'opsz' 144",
          }}
        >
          Built to Outlast
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.4, delay: 0.8, ease: 'easeOut' }}
          className="mt-6 max-w-[36ch] font-body text-base leading-relaxed text-haze sm:text-lg"
        >
          Precision roofing for homeowners and builders who don&apos;t
          compromise on materials or craft.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.4, delay: 0.9, ease: 'easeOut' }}
          className="mt-10"
        >
          <Link
            href="#quote"
            className="inline-flex items-center justify-center rounded-sm border-2 border-copper bg-bone px-10 py-4 font-body text-base font-semibold tracking-[0.02em] text-ink transition-all duration-200 ease-out hover:scale-[1.03] hover:bg-copper hover:shadow-lg hover:shadow-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
          >
            Get a Quote
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
