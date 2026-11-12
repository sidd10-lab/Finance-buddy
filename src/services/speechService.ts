import { LanguageCode } from '../types';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  private initAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
  }

  // Play pleasant rural chime for action feedback
  playSuccessSound() {
    try {
      this.initAudioContext();
      if (!this.audioContext) return;
      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // AudioContext may be restricted by browser policy before user gesture
    }
  }

  playCoinSound() {
    try {
      this.initAudioContext();
      if (!this.audioContext) return;
      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore audioContext errors
    }
  }

  speak(text: string, lang: LanguageCode, onEnd?: () => void) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    // Map language code to BCP-47
    const langMap: Record<LanguageCode, string> = {
      hi: 'hi-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
      kn: 'kn-IN',
      en: 'en-IN'
    };

    const targetLang = langMap[lang] || 'hi-IN';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = 0.95; // Slightly slower, clear tone for rural comprehension
    utterance.pitch = 1.05; // Friendly warm pitch

    // Try finding a matching voice
    const voices = this.synth.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(lang) || v.lang === targetLang);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  // Speech-to-Text Speech Recognition (Web Speech API)
  startListening(
    lang: LanguageCode,
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): { stop: () => void } | null {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError('Speech recognition not supported in this browser. Please type or use preset buttons.');
      return null;
    }

    const langMap: Record<LanguageCode, string> = {
      hi: 'hi-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
      kn: 'kn-IN',
      en: 'en-IN'
    };

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langMap[lang] || 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        onResult(text);
      };

      recognition.onerror = (event: any) => {
        onError(event.error || 'Error recognizing voice');
      };

      recognition.onend = () => {
        onEnd();
      };

      recognition.start();
      return {
        stop: () => {
          try {
            recognition.stop();
          } catch {
            // ignore
          }
        }
      };
    } catch (err: any) {
      onError(err.message || 'Microphone access failed');
      return null;
    }
  }
}

export const speechService = new SpeechService();
