/**
 * Service Text-to-Speech utilisant Web Speech API
 * Permet de lire du texte en français pour les enfants
 */

class SpeechService {
  private synth: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private voicesLoaded: boolean = false;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoice();
  }

  /**
   * Charge la voix française préférée
   */
  private loadVoice() {
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      if (voices.length === 0) return;
      
      // Préférence: voix française, puis voix féminine par défaut
      this.voice =
        voices.find((v) => v.lang.startsWith('fr-') && v.name.includes('Female')) ||
        voices.find((v) => v.lang.startsWith('fr-')) ||
        voices[0];
      
      this.voicesLoaded = true;
      console.log('Voice loaded:', this.voice?.name, this.voice?.lang);
    };

    // Charger les voix (peut être asynchrone selon les navigateurs)
    if (this.synth.getVoices().length > 0) {
      loadVoices();
    }
    
    this.synth.addEventListener('voiceschanged', loadVoices);
  }

  /**
   * Attendre que les voix soient chargées
   */
  private async waitForVoices(): Promise<void> {
    if (this.voicesLoaded) return;
    
    return new Promise((resolve) => {
      const checkVoices = () => {
        if (this.synth.getVoices().length > 0) {
          this.voicesLoaded = true;
          resolve();
        }
      };
      
      // Vérifier immédiatement
      checkVoices();
      
      // Sinon attendre l'événement
      if (!this.voicesLoaded) {
        this.synth.addEventListener('voiceschanged', () => {
          checkVoices();
        }, { once: true });
      }
      
      // Timeout de sécurité
      setTimeout(() => resolve(), 1000);
    });
  }

  /**
   * Lit un texte à voix haute
   * @param text Texte à lire
   * @param options Options de lecture (pitch, rate, volume)
   */
  async speak(
    text: string,
    options?: {
      pitch?: number; // 0-2, défaut 1
      rate?: number; // 0.1-10, défaut 1
      volume?: number; // 0-1, défaut 1
      onEnd?: () => void;
      onError?: (error: Error) => void;
    }
  ): Promise<void> {
    // Attendre que les voix soient chargées
    await this.waitForVoices();
    
    return new Promise((resolve, reject) => {
      // Annuler toute lecture en cours
      if (this.synth.speaking) {
        this.synth.cancel();
      }

      // Petit délai pour s'assurer que la synthèse est bien arrêtée
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.pitch = options?.pitch ?? 1;
        utterance.rate = options?.rate ?? 0.9; // Légèrement plus lent pour les enfants
        utterance.volume = options?.volume ?? 1;

        if (this.voice) {
          utterance.voice = this.voice;
        }

        utterance.onend = () => {
          options?.onEnd?.();
          resolve();
        };

        utterance.onerror = (event) => {
          // Ignorer les erreurs "interrupted" car elles sont normales lors de l'annulation
          if (event.error === 'interrupted') {
            resolve();
            return;
          }
          const error = new Error(`Speech error: ${event.error}`);
          console.error('Speech synthesis error:', error);
          options?.onError?.(error);
          reject(error);
        };

        console.log('Speaking:', text, 'with voice:', this.voice?.name);
        this.synth.speak(utterance);
      }, 100);
    });
  }

  /**
   * Arrête la lecture en cours
   */
  stop() {
    this.synth.cancel();
  }

  /**
   * Met en pause la lecture
   */
  pause() {
    this.synth.pause();
  }

  /**
   * Reprend la lecture
   */
  resume() {
    this.synth.resume();
  }

  /**
   * Vérifie si une lecture est en cours
   */
  isSpeaking(): boolean {
    return this.synth.speaking;
  }

  /**
   * Vérifie si la lecture est en pause
   */
  isPaused(): boolean {
    return this.synth.pending;
  }

  /**
   * Récupère toutes les voix disponibles
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }

  /**
   * Change la voix utilisée
   */
  setVoice(voiceIndex: number) {
    const voices = this.getAvailableVoices();
    if (voices[voiceIndex]) {
      this.voice = voices[voiceIndex];
    }
  }
}

// Instance singleton
export const speechService = new SpeechService();

export default speechService;
