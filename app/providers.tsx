'use client';

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ReactNode } from "react";
import { ConfigProvider } from "@/lib/use-config";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ConfigProvider>
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </ConfigProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
