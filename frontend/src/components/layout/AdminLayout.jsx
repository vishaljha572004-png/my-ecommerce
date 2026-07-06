import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

const AdminLayout = () => {
  const { user } = useAuthStore();
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar here */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 font-bold text-xl text-primary">Admin Panel</div>
        {/* Links */}
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
