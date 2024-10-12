'use client';

import { usePathname } from 'next/navigation';
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      {!isHomePage && <Sidebar />}
      <main className={`w-full ${isHomePage ? '' : 'ml-16'}`}>
        <div className="flex items-start justify-center min-h-screen w-full">
          <div className={`w-full ${isHomePage ? '' : 'mt-20'}`}>{children}</div>
        </div>
      </main>
    </>
  );
}
