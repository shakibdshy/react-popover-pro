import Link from "next/link";
import FloatingToggle from "@/components/floating-toggle";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">React Popover Pro</h1>
        <p className="text-sm text-gray-500">Accessible and customizable popover and tooltip components for React applications.</p>
        
        <div className="flex flex-col gap-4">
          <FloatingToggle />
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Examples</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/examples/popover-examples" className="text-blue-600 hover:underline">
                All Popover Examples
              </Link>
              <span className="ml-2 text-xs text-green-500 font-medium uppercase bg-green-100 px-2 py-0.5 rounded-full">New</span>
            </li>
            <li className="text-gray-400">
              <del>
                <Link href="/examples/popover-arrow" className="text-gray-400 hover:underline">
                  Popover with Arrows
                </Link>
              </del>
              <span className="ml-2 text-xs text-gray-500">(Now in consolidated examples)</span>
            </li>
            <li className="text-gray-400">
              <del>
                <Link href="/examples/popover-animations" className="text-gray-400 hover:underline">
                  Popover Animations
                </Link>
              </del>
              <span className="ml-2 text-xs text-gray-500">(Now in consolidated examples)</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
