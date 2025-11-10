import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../components/Button';
import ReadingProgress from '../components/ReadingProgress';

const MOCK_TEXT = {
  id: 1,
  title: 'Le Petit Prince',
  content: `Lorsque j'avais six ans j'ai vu, une fois, une magnifique image, dans un livre sur la Forêt Vierge qui s'appelait "Histoires Vécues". Ça représentait un serpent boa qui avalait un fauve. Voilà la copie du dessin.`,
  translation: `When I was six years old, I once saw a magnificent picture in a book about the Virgin Forest called "True Stories". It showed a boa constrictor swallowing a wild animal. Here is a copy of the drawing.`,
  progress: 30,
};

export default function Reader() {
  const { textId } = useParams();
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
      } else {
        const utterance = new SpeechSynthesisUtterance(MOCK_TEXT.content);
        utterance.lang = 'fr-FR';
        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{MOCK_TEXT.title}</h1>
        <ReadingProgress value={MOCK_TEXT.progress} max={100} />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-end gap-2 mb-4">
          <Button
            onClick={toggleSpeech}
            variant="outline"
          >
            {isPlaying ? 'Stop' : 'Listen'}
          </Button>
          <Button
            onClick={() => setShowTranslation(!showTranslation)}
            variant="outline"
          >
            {showTranslation ? 'Hide' : 'Show'} Translation
          </Button>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed mb-4">{MOCK_TEXT.content}</p>
          {showTranslation && (
            <p className="text-gray-600 italic">{MOCK_TEXT.translation}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline">Previous</Button>
        <Button>Next</Button>
      </div>
    </div>
  );
}