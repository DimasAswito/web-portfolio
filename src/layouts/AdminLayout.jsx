import React from 'react';

export default function AdminLayout({ children }) {
  return (
    <div>
      {/* Bisa tambahkan Sidebar, Header Admin, dll */}
      {children}
    </div>
  );
}
