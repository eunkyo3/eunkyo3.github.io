import { LifecycleProvider } from "@/components/lifecycle/LifecycleProvider";
import { RequestRail } from "@/components/lifecycle/RequestRail";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <LifecycleProvider>
      <SiteHeader showProgress />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:grid lg:grid-cols-[168px_minmax(0,1fr)] lg:gap-12">
        <RequestRail />
        <main id="main" className="min-w-0">
          <Hero />
          <About />
          <Projects />
          <Stack />
          <Experience />
          <Contact />
        </main>
      </div>
      <SiteFooter />
    </LifecycleProvider>
  );
}
