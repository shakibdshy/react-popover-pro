import FloatingToggle from "@/components/floating-toggle";
import PopoverExamplesPage from "./examples/popover-examples/page";
import { TooltipExamples } from "@/components/examples/tooltip-examples";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">React Popover Pro</h1>
        <p className="text-sm text-gray-500">
          Accessible and customizable popover and tooltip components for React
          applications.
        </p>
        <FloatingToggle />

        <PopoverExamplesPage />
        <TooltipExamples />
      </main>
    </div>
  );
}
