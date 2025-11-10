import { useState } from 'react';
import { Button } from '../components/Button';
import ReadingProgress from '../components/ReadingProgress';

const MOCK_TEXTS = [
  {
    id: 1,
    title: 'Le Petit Prince',
    excerpt: "Lorsque j'avais six ans j'ai vu, une fois...",
    difficulty: 'beginner',
    progress: 0,
  },
  {
    id: 2,
    title: 'Les Misérables',
    excerpt: "En 1815, M. Charles-François-Bienvenu Myriel était évêque de Digne...",
    difficulty: 'intermediate',
    progress: 30,
  },
  // Add more mock texts as needed
];

export default function Library() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reading Library</h1>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'beginner' ? 'primary' : 'outline'}
            onClick={() => setFilter('beginner')}
          >
            Beginner
          </Button>
          <Button
            variant={filter === 'intermediate' ? 'primary' : 'outline'}
            onClick={() => setFilter('intermediate')}
          >
            Intermediate
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {MOCK_TEXTS
          .filter(text => filter === 'all' || text.difficulty === filter)
          .map(text => (
            <div key={text.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{text.title}</h2>
                  <p className="text-sm text-gray-500 capitalize">{text.difficulty}</p>
                </div>
                <Button onClick={() => window.location.href = `/read/${text.id}`}>
                  Continue Reading
                </Button>
              </div>
              <p className="text-gray-600 mb-4">{text.excerpt}</p>
              <ReadingProgress value={text.progress} max={100} />
            </div>
          ))}
      </div>
    </div>
  );
}