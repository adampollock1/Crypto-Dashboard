import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0d1421] relative overflow-x-hidden">
      {/* Background gradient elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top-left gradient orb */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#00d4aa]/5 rounded-full blur-3xl" />
        {/* Top-right gradient orb */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3861fb]/5 rounded-full blur-3xl" />
        {/* Bottom gradient */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-80 bg-gradient-to-r from-[#00d4aa]/5 via-transparent to-[#3861fb]/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <Header />

      {/* Page content with transition */}
      <div key={location.pathname} className="animate-page-enter relative">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
