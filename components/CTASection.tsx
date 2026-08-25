export default function CTASection() {
  return (
    <div className="bg-black text-white p-8 md:p-12 lg:p-24 flex flex-col items-start gap-8 mt-12 w-full flex-grow">
      {/* Heading */}
      <h3 className="font-mono text-3xl md:text-5xl leading-tight max-w-xl">
        Let&apos;s talk<br />
        about your<br />
        next project
      </h3>

      {/* Button */}
      <button className="bg-white text-black font-mono font-bold text-sm md:text-base px-6 py-4 hover:bg-gray-200 transition-colors mt-4 w-full md:w-auto min-h-[44px]">
        Get Personal offer
      </button>
    </div>
  );
}
