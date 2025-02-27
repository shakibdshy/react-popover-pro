import Link from "next/link";
import PopoverExample from "@/components/examples/popover-example";
import FloatingToggle from "@/components/floating-toggle";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">React Popover Pro</h1>
        <p className="text-sm text-gray-500">Accessible and customizable popover and tooltip components for React applications.</p>
        
        <div className="flex flex-col gap-4">
          <PopoverExample />
          <FloatingToggle />
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Examples</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/examples/popover-arrow" className="text-blue-600 hover:underline">
                Popover with Arrows
              </Link>
            </li>
            <li>
              <Link href="/examples/popover-animations" className="text-blue-600 hover:underline">
                Popover Animations
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
