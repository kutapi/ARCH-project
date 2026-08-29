import Image from "next/image";
import Navbar from "@/components/Navbar";
import CTASection from "@/components/CTASection";
import ProjectGrid from "@/components/ProjectGrid";
import { getCmsData } from "@/lib/cms-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { heroImage, projects } = getCmsData();

  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 md:px-8 overflow-y-auto">
        {/* Hero Image */}
        {heroImage && (
          <div
            className="w-full max-w-7xl mx-auto mb-8 overflow-hidden"
            style={{ aspectRatio: "16/7" }}
          >
            <Image
              src={heroImage}
              alt="END Design Lab"
              width={1400}
              height={612}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}

        <ProjectGrid projects={projects} />
      </main>
      <CTASection />
    </>
  );
}
