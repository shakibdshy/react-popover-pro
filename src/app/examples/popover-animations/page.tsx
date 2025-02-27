import PopoverAnimationExample from "@/components/examples/popover-animation-example";
import Link from "next/link";

export default function PopoverAnimationsPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
      <PopoverAnimationExample />
    </div>
  );
} 