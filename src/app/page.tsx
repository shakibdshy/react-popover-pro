import PopoverExample from "@/components/examples/popover-example";
import FloatingToggle from "@/components/floating-toggle";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Popover Example</h1>
        <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        <div className="flex flex-col gap-4">
          <PopoverExample />
          <FloatingToggle />
        </div>
      </main>
    </div>
  );
}
