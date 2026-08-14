import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import CinematicLayer from './CinematicLayer';
import styles from './VideoIntro.module.css';

/**
 * VideoIntro
 * ----------
 * Fullscreen cinematic hero. Layer stack (back to front):
 *   1. Blurred ambient duplicate of the video (desktop/tablet only — see below)
 *   2. Dark gradient overlays for text contrast
 *   3. Sharp foreground video (talking head)
 *   4. CinematicLayer — Three.js bokeh particles
 *   5. Text content + controls
 *
 * Why the blurred duplicate is conditional:
 * A second <video> element decoding the same source roughly doubles decode
 * cost. That's an acceptable trade on desktop for the atmosphere it buys,
 * but not on phones where it competes with the particle layer and GSAP
 * timeline for the same frame budget. Below 640px we skip it and fall back
 * to a static gradient wash instead.
 *
 * Loop handling:
 * True crossfade looping would mean running a second full video decode
 * permanently just to mask a cut — expensive for a background element.
 * Instead we detect the approach to the clip's end and apply a brief
 * opacity dip (via GSAP) that hides the cut without the extra decode cost.
 */

const LOOP_FADE_WINDOW = 0.4; // seconds before/after loop point to dip opacity

export default function VideoIntro({
  videoSrc,
  eyebrow = 'Full-Stack Java Engineer',
  firstName = 'Swapnil',
  lastName = 'Tole',
  subtitle = 'Building resilient Spring Boot systems — from JWT-secured REST APIs to real-time WebSocket pipelines.',
  onScrollNext,
}) {
  const sectionRef = useRef(null);
  const fgVideoRef = useRef(null);
  const bgVideoRef = useRef(null);
  const badgeRef = useRef(null);
  const contentRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showBlurLayer, setShowBlurLayer] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(true);

  // Decide once on mount whether the viewport can afford the blurred dupe layer.
  useEffect(() => {
    setShowBlurLayer(window.innerWidth >= 640);
  }, []);

  // ---- Entrance animation --------------------------------------------
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.set(sectionRef.current, { opacity: 0 })
        .to(sectionRef.current, { opacity: 1, duration: 1.1 })
        .from(
          `.${styles.eyebrow}`,
          { y: 16, opacity: 0, duration: 0.7 },
          '-=0.5'
        )
        .from(
          `.${styles.nameLine}`,
          { y: 40, opacity: 0, duration: 0.9, stagger: 0.12 },
          '-=0.35'
        )
        .from(`.${styles.subtitle}`, { y: 16, opacity: 0, duration: 0.7 }, '-=0.5')
        .from(
          `.${styles.controls}`,
          { y: 12, opacity: 0, duration: 0.6 },
          '-=0.4'
        )
        .from(
          `.${styles.scrollIndicator}`,
          { opacity: 0, duration: 0.8 },
          '-=0.3'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ---- Auto-hide sound badge -------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.to(badgeRef.current, {
        opacity: 0,
        y: 8,
        duration: 0.5,
        onComplete: () => setBadgeVisible(false),
      });
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // ---- Seamless-feeling loop: dip opacity around the loop point --------
  useEffect(() => {
    const video = fgVideoRef.current;
    if (!video) return;

    let hasDipped = false;

    function handleTimeUpdate() {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= LOOP_FADE_WINDOW && !hasDipped) {
        hasDipped = true;
        gsap.to([fgVideoRef.current, bgVideoRef.current].filter(Boolean), {
          opacity: 0.15,
          duration: LOOP_FADE_WINDOW * 0.9,
          ease: 'power1.in',
        });
      }
    }

    function handleLoop() {
      hasDipped = false;
      gsap.to([fgVideoRef.current, bgVideoRef.current].filter(Boolean), {
        opacity: 1,
        duration: LOOP_FADE_WINDOW,
        ease: 'power1.out',
      });
    }

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handleLoop); // loop restarts fire 'play' again in most browsers
    video.addEventListener('seeked', handleLoop);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handleLoop);
      video.removeEventListener('seeked', handleLoop);
    };
  }, []);

  // ---- Pause video when scrolled out of view --------------------------
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const fg = fgVideoRef.current;
        const bg = bgVideoRef.current;
        
        if (!fg) return;

        if (entry.isIntersecting) {
          if (isPlaying) {
            fg.play().catch(() => {});
            bg?.play().catch(() => {});
          }
        } else {
          fg.pause();
          bg?.pause();
        }
      },
      { threshold: 0 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [isPlaying]);

  // ---- Controls ----------------------------------------------------
  const togglePlay = useCallback(() => {
    const fg = fgVideoRef.current;
    const bg = bgVideoRef.current;
    if (!fg) return;
    if (isPlaying) {
      fg.pause();
      bg?.pause();
    } else {
      fg.play();
      bg?.play();
    }
    setIsPlaying((p) => !p);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const fg = fgVideoRef.current;
    if (!fg) return;
    fg.muted = !fg.muted;
    setIsMuted(fg.muted);
    setBadgeVisible(false);
  }, []);

  const handleScrollClick = useCallback(() => {
    if (onScrollNext) {
      onScrollNext();
    } else {
      const next = sectionRef.current?.nextElementSibling;
      next?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [onScrollNext]);

  return (
    <section ref={sectionRef} className={styles.hero} aria-label="Intro">
      {/* Ambient blurred background — desktop/tablet only, see component note above */}
      {showBlurLayer && (
        <video
          ref={bgVideoRef}
          className={styles.bgVideo}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      {/* Cinematic gradient overlays for text legibility */}
      <div className={styles.gradientOverlay} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      {/* Foreground talking-head video */}
      <video
        ref={fgVideoRef}
        className={styles.fgVideo}
        src={videoSrc}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="auto"
      />

      {/* Three.js bokeh particle layer */}
      <CinematicLayer className={styles.cinematicLayer} />

      {/* Content */}
      <div ref={contentRef} className={styles.content}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.name}>
          <span className={styles.nameLine}>{firstName}</span>
          <span className={styles.nameLine}>{lastName}</span>
        </h1>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            className={styles.iconButton}
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? <MuteIcon /> : <UnmuteIcon />}
          </button>
        </div>
      </div>

      {badgeVisible && (
        <button
          ref={badgeRef}
          type="button"
          className={styles.soundBadge}
          onClick={toggleMute}
        >
          <span className={styles.soundBadgeDot} />
          Tap for sound
        </button>
      )}

      <button
        type="button"
        className={styles.scrollIndicator}
        onClick={handleScrollClick}
        aria-label="Scroll to next section"
      >
        <span className={styles.scrollLine} />
        <span className={styles.scrollLabel}>Scroll</span>
      </button>
    </section>
  );
}

// ---- Inline icons (no external icon dependency) -------------------------

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12z" />
    </svg>
  );
}

function UnmuteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12zM19 12a7 7 0 0 1-3 5.74v-2.31a4.98 4.98 0 0 0 0-6.86V6.26A7 7 0 0 1 19 12z" />
    </svg>
  );
}
