import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to <span className="text-primary">TaskMaster</span>
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Your personal task management solution. Organize, track, and complete tasks efficiently.
          </p>
          <div className="flex gap-4">
            <Link href="/login">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">
                Create Account
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 mt-16">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Task Organization</h3>
              <p className="text-muted-foreground">
                Create, update, and organize tasks with priorities and deadlines.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor task completion and view detailed statistics.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Time Management</h3>
              <p className="text-muted-foreground">
                Track time spent on tasks and estimate completion times.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}