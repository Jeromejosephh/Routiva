import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { ThemeProvider } from "./ThemeProvider";

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

    // Get the full user with primaryColor using separate query
    const userWithColor = await prisma.user.findUnique({
      where: { id: user.id },
    });

    return (
      <ThemeProvider 
        initialTheme={userSettings?.theme as 'light' | 'dark' | 'system' || 'dark'}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        initialPrimaryColor={(userWithColor as any)?.primaryColor || 'blue'}
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