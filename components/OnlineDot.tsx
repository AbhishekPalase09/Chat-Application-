// components/OnlineDot.tsx
export default function OnlineDot({ online }: { online?: boolean }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${online ? "bg-green-400" : "bg-gray-300"}`} aria-hidden />
  );
}