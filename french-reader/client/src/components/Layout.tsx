import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="container mx-auto px-4 py-6 text-center text-gray-600">
        <p>© {new Date().getFullYear()} French Reader. All rights reserved.</p>
      </footer>
    </div>
  );
}