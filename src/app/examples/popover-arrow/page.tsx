import PopoverArrowExample from "@/components/examples/popover-arrow-example";
import Link from "next/link";

export default function PopoverArrowPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
      <PopoverArrowExample />
    </div>
  );
} 