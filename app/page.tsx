// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Welcome to StudyHub Chat</h1>
      <p className="mb-6">Open or create conversations from the left sidebar.</p>
      <Link href="/conversations/new" className="px-4 py-2 bg-blue-600 text-white rounded">
        New Conversation
      </Link>
    </div>
  );
}