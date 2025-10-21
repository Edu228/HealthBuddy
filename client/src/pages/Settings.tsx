import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Bell, Lock, Globe, Moon } from "lucide-react";

export default function Settings() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <div className="min-h-screen flex items-center justify-center"><Link href="/"><Button>Go Home</Button></Link></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Settings</h1>
          <Link href="/dashboard"><Button variant="outline">Back</Button></Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {[
            { icon: Bell, title: "Notifications", desc: "Manage your notification preferences" },
            { icon: Lock, title: "Privacy & Security", desc: "Control your data and security settings" },
            { icon: Globe, title: "Language & Region", desc: "Change language and regional settings" },
            { icon: Moon, title: "Theme", desc: "Choose dark or light theme" }
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="border-2 hover:border-blue-300 hover:shadow-lg transition-all">
                <CardContent className="pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{s.title}</h3>
                      <p className="text-sm text-gray-600">{s.desc}</p>
                    </div>
                  </div>
                  <Button variant="outline">Edit</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
