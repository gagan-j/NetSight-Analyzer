import { Logo } from '@/components/icons';
import NetSightAnalyzer from '@/components/netsight-analyzer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b border-b-white/10 bg-background/60 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-3 items-center">
            <Logo className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight font-headline">
              NetSight Analyzer
            </h1>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <NetSightAnalyzer />
      </main>
    </div>
  );
}
