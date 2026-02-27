// app/conversations/layout.tsx
import React from "react";
import Sidebar from "../../components/Sidebar"; // adjust path if your Sidebar is elsewhere

export default function ConversationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-80 border-r bg-white">
          <Sidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </>
  );
}