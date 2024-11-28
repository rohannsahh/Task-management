/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { LayoutDashboard, ListTodo, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      toast({
        title: "Success",
        description: "Logged out successfully",
      });

      router.push('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold">TaskMaster</span>
            </Link>
            <nav className="flex gap-6">
              <Link href="/dashboard">
                <Button
                  variant={pathname === "/dashboard" ? "default" : "ghost"}
                  className="flex items-center"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/tasks">
                <Button
                  variant={pathname === "/tasks" ? "default" : "ghost"}
                  className="flex items-center"
                >
                  <ListTodo className="mr-2 h-4 w-4" />
                  Tasks
                </Button>
              </Link>
            </nav>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}