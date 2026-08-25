import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 md:px-8 py-12 flex flex-col items-center justify-center">
        <h1 className="font-mono text-3xl font-bold">About</h1>
        <p className="mt-4 font-sans text-gray-600">This is the about page placeholder.</p>
      </main>
    </>
  );
}
