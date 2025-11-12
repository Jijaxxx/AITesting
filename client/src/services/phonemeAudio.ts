/**
 * Service de prononciation phonétique pour l'apprentissage de la lecture
 * Utilise SSML (Speech Synthesis Markup Language) pour forcer la bonne prononciation
 */

// Mapping phonème → mot exemple pour contexte
const PHONEME_EXAMPLES: Record<string, string> = {
  // Voyelles
  'a': 'chat',
  'e': 'le',
  'é': 'été',
  'è': 'mère',
  'i': 'lit',
  'o': 'beau',
  'u': 'lune',
  
  // Consonnes
  'f': 'famille',
  's': 'soleil',
  'm': 'maman',
  'l': 'lune',
  'r': 'rouge',
  'n': 'nez',
  'p': 'papa',
  't': 'table',
  'b': 'bébé',
  'd': 'dodo',
  'v': 'vache',
  'z': 'zéro',
  'j': 'joue',
  'g': 'gâteau',
  'k': 'kiwi',
  
  // Digraphes et sons complexes
  'ch': 'chat',     // Important: /ʃ/ prononcé correctement
  'ph': 'photo',
  'ou': 'loup',
  'on': 'bon',
  'an': 'dans',
  'in': 'pain',
  'oi': 'roi',
  'au': 'auto',
  'eau': 'beau',
  'ai': 'maison',
  'ei': 'neige',
  'eu': 'peu',
  'gn': 'agneau',
};

/**
 * Service de prononciation phonétique
 */
export class PhonemeAudioService {
  private synth: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadBestVoice();
  }

  /**
   * Charge la meilleure voix française pour enfants
   */
  private async loadBestVoice() {
    await new Promise(resolve => {
      if (this.synth.getVoices().length) {
        resolve(true);
      } else {
        this.synth.onvoiceschanged = () => resolve(true);
      }
    });

    const voices = this.synth.getVoices();
    
    // Priorité: voix françaises claires et naturelles
    const preferredVoices = [
      'Google français',           // Très claire
      'Microsoft Hortense',        // Déjà utilisée
      'Thomas',                    // Voix masculine, parfois plus claire
      'French Female',
      'French Male',
    ];

    for (const preferred of preferredVoices) {
      const found = voices.find(v => 
        v.name.includes(preferred) && v.lang.startsWith('fr')
      );
      if (found) {
        this.voice = found;
        console.log('🎤 Voix phonétique sélectionnée:', found.name);
        break;
      }
    }

    // Fallback: n'importe quelle voix française
    if (!this.voice) {
      this.voice = voices.find(v => v.lang.startsWith('fr')) || voices[0];
    }
  }

  /**
   * Prononce un phonème avec la bonne prononciation
   * Utilise différentes stratégies selon le phonème
   */
  async speakPhoneme(phoneme: string): Promise<void> {
    const lowerPhoneme = phoneme.toLowerCase();
    
    // Stratégie 1: Utiliser un mot exemple pour les sons complexes
    if (this.shouldUseExample(lowerPhoneme)) {
      await this.speakWithExample(lowerPhoneme);
      return;
    }

    // Stratégie 2: Prononciation directe avec paramètres optimisés
    await this.speakDirect(lowerPhoneme);
  }

  /**
   * Détermine si on doit utiliser un mot exemple
   */
  private shouldUseExample(phoneme: string): boolean {
    // Sons complexes qui ont besoin de contexte (digraphes, trigraphes, sons nasaux)
    const complexSounds = [
      'ch', 'ph', 'gn',           // Digraphes de consonnes
      'ou', 'on', 'an', 'in',     // Sons nasaux et composés
      'oi', 'au', 'eau', 'ai',    // Diphtongues et trigraphes
      'ei', 'eu', 'œu'            // Autres sons composés
    ];
    return complexSounds.includes(phoneme);
  }

  /**
   * Prononce via un mot exemple (ex: "le son CH comme dans CHat")
   */
  private async speakWithExample(phoneme: string): Promise<void> {
    const example = PHONEME_EXAMPLES[phoneme];
    
    if (!example) {
      await this.speakDirect(phoneme);
      return;
    }

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance();
      
      // Stratégie: Prononcer le mot exemple en isolant le son
      // Ex: pour "ch" → "CHa" (juste le début de "chat")
      const isolatedSound = this.extractSound(phoneme, example);
      utterance.text = isolatedSound;
      
      if (this.voice) {
        utterance.voice = this.voice;
      }
      
      // Paramètres pour clarté maximale
      utterance.rate = 0.7;  // Plus lent pour les enfants
      utterance.pitch = 1.1;  // Légèrement plus aigu (voix enfantine)
      utterance.volume = 1.0;
      
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      
      this.synth.cancel(); // Annuler toute lecture en cours
      this.synth.speak(utterance);
      
      console.log(`🔊 Phonème: ${phoneme} → "${isolatedSound}"`);
    });
  }

  /**
   * Extrait le son d'un mot exemple
   * Ex: "ch" + "chat" → "cha" (juste le son initial)
   */
  private extractSound(phoneme: string, example: string): string {
    // Pour les digraphes, prendre le début du mot + une voyelle
    if (phoneme.length > 1) {
      return example.substring(0, Math.min(3, example.length));
    }
    
    // Pour les consonnes simples, ajouter "a" pour faciliter la prononciation
    if (!'aeiouy'.includes(phoneme)) {
      return phoneme + 'a';
    }
    
    return phoneme;
  }

  /**
   * Prononciation directe d'un phonème
   */
  private async speakDirect(phoneme: string): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance();
      
      // Pour les consonnes seules, ajouter une voyelle neutre
      let textToSpeak = phoneme;
      if (phoneme.length === 1 && !'aeiouyéèê'.includes(phoneme)) {
        textToSpeak = phoneme + 'e'; // "be", "ce", "de" etc.
      }
      
      utterance.text = textToSpeak;
      
      if (this.voice) {
        utterance.voice = this.voice;
      }
      
      utterance.rate = 0.7;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      
      this.synth.cancel();
      this.synth.speak(utterance);
      
      console.log(`🔊 Phonème direct: ${phoneme} → "${textToSpeak}"`);
    });
  }

  /**
   * Arrête toute lecture en cours
   */
  stop() {
    this.synth.cancel();
  }
}

// Instance singleton
let phonemeService: PhonemeAudioService | null = null;

export function getPhonemeAudioService(): PhonemeAudioService {
  if (!phonemeService) {
    phonemeService = new PhonemeAudioService();
  }
  return phonemeService;
}

/**
 * Hook React pour utiliser le service phonétique
 */
export function usePhonemeAudio() {
  const service = getPhonemeAudioService();
  
  return {
    speakPhoneme: (phoneme: string) => service.speakPhoneme(phoneme),
    stop: () => service.stop(),
  };
}
