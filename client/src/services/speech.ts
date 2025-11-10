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
   * Nettoie le texte avant la lecture vocale
   * - Supprime les emojis et symboles
   * - Supprime la ponctuation excessive
   * - Normalise les espaces
   */
  private cleanTextForSpeech(text: string): string {
    return text
      // Supprimer tous les emojis et symboles Unicode
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Emojis divers
      .replace(/[\u{2600}-\u{26FF}]/gu, '') // Symboles divers
      .replace(/[\u{2700}-\u{27BF}]/gu, '') // Dingbats
      .replace(/[\u{1F000}-\u{1F02F}]/gu, '') // Mahjong
      .replace(/[\u{1F0A0}-\u{1F0FF}]/gu, '') // Cartes
      .replace(/[\u{1F100}-\u{1F64F}]/gu, '') // Symboles
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Suppléments
      .replace(/[\u{FE00}-\u{FE0F}]/gu, '') // Variation selectors
      .replace(/[\u{E0000}-\u{E007F}]/gu, '') // Tags
      // Supprimer caractères spéciaux et ponctuation excessive
      .replace(/[★☆⭐]/g, 'étoile')
      .replace(/[🎉🎊]/g, '')
      .replace(/[!]{2,}/g, '!') // Limite les ! multiples
      .replace(/[?]{2,}/g, '?') // Limite les ? multiples
      .replace(/[\.]{2,}/g, '.') // Limite les . multiples
      // Nettoyer les espaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Charge la voix française préférée avec priorité sur les voix de qualité
   */
  private loadVoice() {
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      if (voices.length === 0) return;
      
      // Liste de priorité des meilleures voix françaises
      const preferredVoices = [
        'Microsoft Hortense - French (France)',
        'Google français',
        'Thomas',
        'Amelie',
        'French Female',
        'fr-FR-Standard-A',
        'fr-FR-Wavenet-A',
      ];

      // Chercher les voix dans l'ordre de préférence
      for (const preferred of preferredVoices) {
        const found = voices.find((v) => 
          v.name.includes(preferred) || v.name === preferred
        );
        if (found) {
          this.voice = found;
          this.voicesLoaded = true;
          console.log('🎤 Voix chargée:', this.voice.name, '(', this.voice.lang, ')');
          return;
        }
      }

      // Sinon, chercher une voix française féminine
      this.voice =
        voices.find((v) => v.lang.startsWith('fr-') && v.name.toLowerCase().includes('female')) ||
        voices.find((v) => v.lang.startsWith('fr-') && v.name.toLowerCase().includes('femme')) ||
        voices.find((v) => v.lang.startsWith('fr-')) ||
        voices[0];
      
      this.voicesLoaded = true;
      console.log('🎤 Voix par défaut:', this.voice?.name, '(', this.voice?.lang, ')');
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
    
    // Nettoyer le texte avant de le lire
    const cleanText = this.cleanTextForSpeech(text);
    
    // Ne rien lire si le texte est vide après nettoyage
    if (!cleanText || cleanText.trim().length === 0) {
      console.log('⚠️ Texte vide après nettoyage, lecture annulée');
      options?.onEnd?.();
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      // Annuler toute lecture en cours
      if (this.synth.speaking) {
        this.synth.cancel();
      }

      // Petit délai pour s'assurer que la synthèse est bien arrêtée
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'fr-FR';
        utterance.pitch = options?.pitch ?? 1.0; // Voix naturelle
        utterance.rate = options?.rate ?? 0.85; // Légèrement plus lent pour les enfants
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

        console.log('🔊 Lecture:', cleanText, '| Voix:', this.voice?.name);
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
   * Récupère uniquement les voix françaises
   */
  getFrenchVoices(): SpeechSynthesisVoice[] {
    return this.getAvailableVoices().filter(v => v.lang.startsWith('fr'));
  }

  /**
   * Change la voix utilisée
   */
  setVoice(voiceIndex: number) {
    const voices = this.getAvailableVoices();
    if (voices[voiceIndex]) {
      this.voice = voices[voiceIndex];
      console.log('🎤 Voix changée:', this.voice.name);
    }
  }

  /**
   * Change la voix par son nom
   */
  setVoiceByName(voiceName: string) {
    const voice = this.getAvailableVoices().find(v => v.name === voiceName);
    if (voice) {
      this.voice = voice;
      console.log('🎤 Voix changée:', this.voice.name);
    }
  }

  /**
   * Récupère la voix actuelle
   */
  getCurrentVoice(): SpeechSynthesisVoice | null {
    return this.voice;
  }
}

// Instance singleton
export const speechService = new SpeechService();

export default speechService;
