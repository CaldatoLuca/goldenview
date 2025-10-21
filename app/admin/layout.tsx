import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-h-screen bg-orange-200 p-4">
        <SidebarTrigger />
        <div className="container mx-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
