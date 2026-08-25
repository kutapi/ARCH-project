import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 md:px-8 py-12 flex flex-col items-center justify-center">
        <h1 className="font-mono text-3xl font-bold">Contact</h1>
        <p className="mt-4 font-sans text-gray-600">This is the contact page placeholder.</p>
      </main>
    </>
  );
}
