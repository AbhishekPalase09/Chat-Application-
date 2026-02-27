"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";

export default function MobileNav({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden flex items-center justify-between p-3 border-b border-gray-800 bg-gray-900">
        <button onClick={() => setOpen(true)} className="px-3 py-2 bg-gray-800 rounded">
          ☰
        </button>
        <div className="font-semibold text-white">Chat</div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-40">
          <div className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-gray-900 z-50 shadow-lg">
            <div className="p-3 border-b border-gray-800 flex items-center justify-between">
              <div className="font-semibold text-white">Conversations</div>
              <button onClick={() => setOpen(false)} className="px-2">✕</button>
            </div>
            <div className="h-full">
              <Sidebar
                selectedId={selected}
                onSelect={(id) => {
                  onSelect(id);
                  setOpen(false); // close after select for instant switch UX
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}