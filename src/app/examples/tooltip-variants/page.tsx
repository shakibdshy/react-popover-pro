import TooltipVariants from "@/components/examples/tooltip-variants";
import Link from "next/link";

export default function TooltipVariantsPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
      <TooltipVariants />
    </div>
  );
} 