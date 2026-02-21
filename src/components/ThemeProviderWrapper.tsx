import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { ThemeProvider, type PastelColor } from "./ThemeProvider";

export default async function ThemeProviderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  try {
    const user = await requireUser();
    
    const userSettings = await prisma.user.findUnique({
      where: { id: user.id },
      select: { 
        theme: true, 
      },
    });

    const userWithColor = await prisma.user.findUnique({
      where: { id: user.id },
    });

    return (
      <ThemeProvider
        initialTheme={userSettings?.theme as 'light' | 'dark' | 'system' || 'dark'}
        initialPrimaryColor={(userWithColor?.primaryColor as PastelColor) || 'blue'}
      >
        {children}
      </ThemeProvider>
    );
  } catch {
    // If user is not authenticated or there's an error, use defaults
    return (
      <ThemeProvider initialTheme="dark" initialPrimaryColor="blue">
        {children}
      </ThemeProvider>
    );
  }
}