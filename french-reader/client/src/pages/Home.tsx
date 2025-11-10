import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Improve Your French Reading Skills
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Practice reading French texts with interactive tools and pronunciation help.
        </p>
        <Link to="/library">
          <Button size="lg">Start Reading</Button>
        </Link>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Extensive Library
          </h2>
          <p className="text-gray-600 mb-4">
            Access a diverse collection of French texts at different difficulty levels.
          </p>
          <Link to="/library">
            <Button variant="secondary">Browse Texts</Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Track Your Progress
          </h2>
          <p className="text-gray-600 mb-4">
            Monitor your reading achievements and vocabulary growth over time.
          </p>
          <Link to="/profile">
            <Button variant="secondary">View Profile</Button>
          </Link>
        </div>
      </div>

      <section className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-2">Text-to-Speech</h3>
            <p className="text-gray-600">Listen to correct pronunciations</p>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-2">Instant Translation</h3>
            <p className="text-gray-600">Get word meanings in context</p>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">Monitor your improvements</p>
          </div>
        </div>
      </section>
    </div>
  );
}