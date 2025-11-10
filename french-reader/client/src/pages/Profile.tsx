import { Button } from '../components/Button';
import ReadingProgress from '../components/ReadingProgress';

const MOCK_STATS = {
  totalTexts: 25,
  completedTexts: 8,
  readingStreak: 5,
  lastRead: '2025-11-08',
  recentProgress: [
    { id: 1, title: 'Le Petit Prince', progress: 75 },
    { id: 2, title: 'Les Misérables', progress: 30 },
    { id: 3, title: 'Le Tour du Monde', progress: 50 },
  ],
};

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
        <Button variant="outline">Settings</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Total Texts</h2>
          <p className="text-3xl font-bold text-primary-600">
            {MOCK_STATS.completedTexts}/{MOCK_STATS.totalTexts}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Reading Streak</h2>
          <p className="text-3xl font-bold text-primary-600">
            {MOCK_STATS.readingStreak} days
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Last Read</h2>
          <p className="text-3xl font-bold text-primary-600">
            {new Date(MOCK_STATS.lastRead).toLocaleDateString()}
          </p>
        </div>
      </div>

      <section className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Progress</h2>
        <div className="space-y-6">
          {MOCK_STATS.recentProgress.map(text => (
            <div key={text.id}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900">{text.title}</h3>
                <span className="text-sm text-gray-500">{text.progress}%</span>
              </div>
              <ReadingProgress value={text.progress} max={100} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}