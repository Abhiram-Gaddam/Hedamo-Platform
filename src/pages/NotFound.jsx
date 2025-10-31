import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6 text-center">
       <h1 className="text-[6rem] sm:text-[8rem] font-extrabold text-blue-600 tracking-widest drop-shadow-lg">
        404
      </h1>

       <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-800">
        Oops! Page Not Found
      </h2>
      <p className="mt-2 text-gray-500 max-w-md">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

       <div className="relative mt-10">
        <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-10 blur-3xl absolute inset-0 -z-10"></div>
        <div className="w-32 h-32 bg-white border-2 border-blue-100 rounded-full shadow-lg flex items-center justify-center">
          <Home className="w-12 h-12 text-blue-600" />
        </div>
      </div>

       <Link
        to="/"
        className="mt-10 inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-all duration-300"
      >
        <Home className="w-5 h-5" />
        Back to Dashboard
      </Link>
    </div>
  );
}
