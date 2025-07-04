
import type { Metadata } from 'next';
import { LandingHeader, LandingFooter } from '@/app/page';

export const metadata: Metadata = {
  title: 'SwiftShip',
  description: 'Information pages for SwiftShip.',
};

export default function StaticPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 bg-background text-foreground min-h-screen">
      <LandingHeader />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
