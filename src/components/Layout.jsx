import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#0d1421]">
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
