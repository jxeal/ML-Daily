import { ReactNode } from "react";
import { TopBar } from "./top-bar";
import { BottomNav } from "./bottom-nav";
import { GlobalFooter } from "./global-footer";

export function AppLayout({ children, hideNav = false }: { children: ReactNode, hideNav?: boolean }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground pb-[100px]">
      <TopBar />
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col mb-6">
        {children}
      </main>
      {!hideNav && <GlobalFooter />}
      {!hideNav && <BottomNav />}
    </div>
  );
}
