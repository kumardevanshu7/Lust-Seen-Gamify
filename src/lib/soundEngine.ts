// Web Audio API Sound Generator & HTML5 Audio Track Engine
// Plays crisp UI sound effects & manages Game MP3 Audio Tracks (Arena, Other, Premium & Landing)

import { GAME_AUDIO_TRACKS, AudioTrack } from "./audioTracks";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private hapticsEnabled: boolean = true;

  // HTML5 Audio Elements for MP3 Streaming
  private bgmAudio: HTMLAudioElement | null = null;
  private landingAudio: HTMLAudioElement | null = null;
  private currentBgmTrackId: string = "arena_japanese_girl_whisper";
  private isBgmPlaying: boolean = false;
  private musicVolume: number = 0.5;
  private previewTimer: ReturnType<typeof setInterval> | null = null;

  private initContext() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setSoundSettings(enabled: boolean, volume: number, haptics: boolean) {
    this.isMuted = !enabled;
    this.volume = Math.max(0, Math.min(1, volume));
    this.hapticsEnabled = haptics;
  }

  public triggerHaptic(pattern: number | number[] = 30) {
    if (!this.hapticsEnabled || typeof window === "undefined") return;
    try {
      if ("vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore vibration errors if blocked by browser policy
    }
  }

  // Playful pop on button click
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
      this.triggerHaptic(15);
    } catch {}
  }

  // Distinct crisp metallic tick for navigation tabs (Bottom nav bar, sub tabs)
  public playNavClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(720, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(this.volume * 0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
      this.triggerHaptic(35);
    } catch {}
  }

  // Distinct resonant ethereal whoosh / chord sweep for page/view transitions
  public playPageTransition() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const chord = [293.66, 440.0, 587.33]; // D4, A4, D5
      chord.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + i * 0.03;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, start + 0.16);

        gain.gain.setValueAtTime(this.volume * 0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.22);
      });
      this.triggerHaptic([20, 35]);
    } catch {}
  }

  // Toggle switch sound
  public playToggle(isOn: boolean) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freqStart = isOn ? 350 : 550;
      const freqEnd = isOn ? 650 : 250;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freqStart, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, this.ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(this.volume * 0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
      this.triggerHaptic(20);
    } catch {}
  }

  // Positive Win / Clean habit check-in chime
  public playWin() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.07;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.25, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
      this.triggerHaptic([30, 40, 50]);
    } catch {}
  }

  // Damage Hit / Slip audio effect
  public playDamage() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(65, this.ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(this.volume * 0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
      this.triggerHaptic([70, 40, 70]);
    } catch {}
  }

  // Dynamic Elemental Skill Activation Audio
  public playSkillActivate(element: string = "fire") {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      switch (element) {
        case "fire":
        case "dragon":
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(660, now + 0.18);
          break;
        case "aqua":
        case "wind":
          osc.type = "sine";
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(740, now + 0.22);
          break;
        case "lightning":
          osc.type = "square";
          osc.frequency.setValueAtTime(550, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);
          break;
        case "frost":
        case "light":
          osc.type = "triangle";
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(1320, now + 0.16);
          break;
        case "shadow":
        case "earth":
          osc.type = "triangle";
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.25);
          break;
        default:
          osc.type = "sine";
          osc.frequency.setValueAtTime(523, now);
          osc.frequency.exponentialRampToValueAtTime(1046, now + 0.2);
      }

      gain.gain.setValueAtTime(this.volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
      this.triggerHaptic([25, 35, 45]);
    } catch {}
  }

  // Glorious Level Up Fanfare!
  public playLevelUp() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const melody = [
        { f: 523.25, d: 0.1 },
        { f: 587.33, d: 0.1 },
        { f: 659.25, d: 0.1 },
        { f: 783.99, d: 0.15 },
        { f: 880.0, d: 0.15 },
        { f: 1046.5, d: 0.4 },
      ];

      let accumulatedTime = this.ctx.currentTime;
      melody.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(note.f, accumulatedTime);

        gain.gain.setValueAtTime(0, accumulatedTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.35, accumulatedTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, accumulatedTime + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(accumulatedTime);
        osc.stop(accumulatedTime + note.d);
        accumulatedTime += note.d * 0.9;
      });
      this.triggerHaptic([50, 50, 100, 50, 150]);
    } catch {}
  }

  // Melancholy Game Over chord
  public playGameOver() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const chords = [392.0, 311.13, 261.63, 196.0];
      chords.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(freq * 0.9, this.ctx.currentTime + 1.2);

        gain.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.3);
      });
      this.triggerHaptic([100, 100, 200]);
    } catch {}
  }

  // =========================================================================
  // MP3 BACKGROUND MUSIC ENGINE (Arena, Other, Premium Tracks & 20s Audition)
  // =========================================================================

  private clearAuditionTimer() {
    if (this.previewTimer) {
      clearInterval(this.previewTimer);
      this.previewTimer = null;
    }
  }

  public playBgmTrack(
    trackId: string,
    isUnlocked: boolean = false,
    onPreviewExpired?: () => void
  ) {
    if (typeof window === "undefined") return;

    const track =
      GAME_AUDIO_TRACKS.find((t) => t.id === trackId) ||
      GAME_AUDIO_TRACKS.find((t) => t.id === "arena_japanese_girl_whisper") ||
      GAME_AUDIO_TRACKS[0];

    this.currentBgmTrackId = track.id;
    this.clearAuditionTimer();
    this.stopLandingTheme(); // Never allow landing theme and arena BGM to play simultaneously

    if (!this.bgmAudio) {
      this.bgmAudio = new Audio();
    }

    const audio = this.bgmAudio;
    audio.src = track.src;
    audio.volume = this.musicVolume;

    // Check if this track is a preview-restricted track (i.e., 'other' category and not unlocked)
    const isRestrictedPreview = track.category === "other" && !isUnlocked;

    if (isRestrictedPreview) {
      audio.loop = false;
      const previewLimit = track.previewLimitSeconds || 20;

      // Watch playback time
      this.previewTimer = setInterval(() => {
        if (!audio) return;
        if (audio.currentTime >= previewLimit) {
          audio.pause();
          audio.currentTime = 0;
          this.clearAuditionTimer();
          this.isBgmPlaying = false;
          if (onPreviewExpired) {
            onPreviewExpired();
          }
        }
      }, 500);
    } else {
      audio.loop = true;
    }

    audio
      .play()
      .then(() => {
        this.isBgmPlaying = true;
      })
      .catch((err) => {
        console.warn("Audio autoplay prevented by browser:", err);
      });
  }

  public stopBGM() {
    this.clearAuditionTimer();
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      } catch {}
    }
    this.isBgmPlaying = false;
  }

  public toggleBGM(
    enable: boolean,
    trackId?: string,
    isUnlocked: boolean = false,
    onPreviewExpired?: () => void
  ) {
    if (typeof window === "undefined") return;

    if (!enable) {
      this.stopBGM();
      return;
    }

    const targetId = trackId || this.currentBgmTrackId || "arena_japanese_girl_whisper";
    this.playBgmTrack(targetId, isUnlocked, onPreviewExpired);
  }

  public setBgmTrack(
    trackId: string,
    isUnlocked: boolean = false,
    onPreviewExpired?: () => void
  ) {
    this.currentBgmTrackId = trackId;
    if (this.isBgmPlaying) {
      this.playBgmTrack(trackId, isUnlocked, onPreviewExpired);
    }
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.musicVolume;
    }
    if (this.landingAudio) {
      this.landingAudio.volume = this.musicVolume;
    }
  }

  public getCurrentTrackId(): string {
    return this.currentBgmTrackId;
  }

  public isMusicPlaying(): boolean {
    return this.isBgmPlaying;
  }

  // =========================================================================
  // LANDING PAGE BACKGROUND MUSIC (Control the Desire.mp3 for Video-2)
  // =========================================================================

  public playLandingTheme() {
    if (typeof window === "undefined") return;
    try {
      // NOTE: No initContext() here - landing audio uses HTML5 Audio, not Web Audio API.
      // initContext() triggers AudioContext which is blocked before user gesture.
      this.stopBGM(); // Ensure arena BGM is stopped when landing theme plays
      if (!this.landingAudio) {
        this.landingAudio = new Audio(encodeURI("/musics/landing_page/Control the Desire.mp3"));
        this.landingAudio.loop = true;
        this.landingAudio.preload = "auto";
      }
      this.landingAudio.volume = this.musicVolume > 0 ? this.musicVolume : 0.6;
      this.landingAudio.muted = false;
      if (!this.landingAudio.paused) {
        return; // Already playing, no need to re-call play()
      }
      const playPromise = this.landingAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Silently suppressed - browser requires user gesture before first play.
          // The universal gesture unlock listener in AestheticGameLanding will trigger this.
        });
      }
    } catch {
      // Silently ignore - audio play fails gracefully until user gesture occurs
    }
  }

  public stopLandingTheme() {
    if (this.landingAudio) {
      try {
        this.landingAudio.pause();
      } catch {}
    }
  }

  public stopAllAudio() {
    this.stopLandingTheme();
    this.stopBGM();
  }
}

export const soundEngine = new SoundEngine();
