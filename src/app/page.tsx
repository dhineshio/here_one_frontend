import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Welcome to HereOne
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-8">
          Your social media hub with beautiful theme switching
        </p>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Theme Toggle</h2>
            <p className="text-muted-foreground">
              Click the theme toggle in the top bar to cycle through light, dark, and system themes.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Notifications</h2>
            <p className="text-muted-foreground">
              Stay updated with the bell icon showing your latest announcements.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Profile</h2>
            <p className="text-muted-foreground">
              Access your profile settings through the avatar icon in the top bar.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg">Get Started</Button>
        </div>
      </div>
    </div>
  );
}
