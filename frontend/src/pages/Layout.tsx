import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

const Layout = () => {
  return (
    <section className="min-h-screen bg-[#070604] text-[#e8dcc0]">
      <Navbar />
      <main className="min-h-[calc(100vh-80px)] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Toast />
    </section>
  );
};

export default Layout;
