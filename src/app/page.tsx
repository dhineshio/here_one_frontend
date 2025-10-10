import { Button } from "@/components/ui/button";
import { BarChart3, Users, BookOpen, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">2,847</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+8% from last month</span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">87.4%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+3.2% from last month</span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Events Today</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-600">6 upcoming</span>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New student enrolled in React Course</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Assignment submitted for JavaScript Basics</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Course "Advanced CSS" published</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Create New Course
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Add Student
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Event
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </div>
        </div>
      </div>

      {/* Long content to test scrolling */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Layout Testing</h3>
        <p className="text-muted-foreground mb-4">
          This content demonstrates the layout structure:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Fixed topbar at the top</li>
          <li>• Collapsible sidebar on the left</li>
          <li>• Scrollable main content area</li>
          <li>• Responsive design that works on all screen sizes</li>
        </ul>
        <div className="mt-8 space-y-4">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="p-4 border rounded bg-muted/50">
              <h4 className="font-medium">Sample Content Block {i + 1}</h4>
              <p className="text-sm text-muted-foreground">
                This is sample content to demonstrate scrolling behavior. 
                The topbar should remain fixed while the sidebar and main content scroll independently.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
