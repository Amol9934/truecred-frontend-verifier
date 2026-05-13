import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#F9FAFB' }}
    >
      <Navbar />
      <main className="flex-1 pt-[60px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
