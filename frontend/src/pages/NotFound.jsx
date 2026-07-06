import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-section px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Page Not Found</h2>
        <Link to="/" className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-green-700 transition">
          Return Home
        </Link>
      </div>
    </div>
  );
};
export default NotFound;
