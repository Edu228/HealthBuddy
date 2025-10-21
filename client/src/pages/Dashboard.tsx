import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Heart, Brain, Apple, Users, Zap, MessageCircle, TrendingUp, Calendar, Award, Target, Flame } from "lucide-react";

const achievements = [
  { icon: "🏃", title: "First Steps", desc: "Complete your first workout" },
  { icon: "🔥", title: "On Fire", desc: "7-day workout streak" },
  { icon: "🧘", title: "Zen Master", desc: "30 meditations completed" },
  { icon: "💪", title: "Iron Will", desc: "50 workouts completed" },
  { icon: "🥗", title: "Nutrition Pro", desc: "Log 30 meals" },
  { icon: "⭐", title: "Community Star", desc: "100 likes on posts" }
];

const recentActivities = [
  { icon: Heart, title: "Completed 30-min HIIT Workout", time: "Today at 7:30 AM", points: 150, color: "red" },
  { icon: Brain, title: "Completed 10-min Meditation", time: "Yesterday at 9:00 PM", points: 50, color: "purple" },
  { icon: Apple, title: "Logged 3 Healthy Meals", time: "2 days ago", points: 75, color: "green" },
  { icon: Users, title: "Posted in Community", time: "3 days ago", points: 25, color: "blue" },
  { icon: Target, title: "Reached Daily Goal", time: "4 days ago", points: 100, color: "orange" },
  { icon: Flame, title: "7-Day Streak Achieved", time: "5 days ago", points: 200, color: "red" }
];

const weeklyStats = [
  { day: "Mon", workouts: 2, meditation: 1, meals: 3 },
  { day: "Tue", workouts: 1, meditation: 2, meals: 3 },
  { day: "Wed", workouts: 2, meditation: 1, meals: 3 },
  { day: "Thu", workouts: 1, meditation: 1, meals: 3 },
  { day: "Fri", workouts: 3, meditation: 2, meals: 3 },
  { day: "Sat", workouts: 2, meditation: 3, meals: 3 },
  { day: "Sun", workouts: 1, meditation: 2, meals: 3 }
];

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome, {user?.name}! 👋</h1>
              <p className="text-gray-600 mt-1">Your health journey starts here</p>
            </div>
            <div className="flex gap-3">
              <Link href="/profile">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">My Profile</Button>
              </Link>
              <Button variant="ghost" onClick={logout}>Logout</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-2 border-transparent hover:border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Workouts This Week</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
                  <p className="text-xs text-gray-600 mt-1">↑ 20% from last week</p>
                </div>
                <Heart className="h-12 w-12 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Meditation Streak</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">12 days</p>
                  <p className="text-xs text-gray-600 mt-1">Keep it up! 🔥</p>
                </div>
                <Brain className="h-12 w-12 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Meals Logged</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">63</p>
                  <p className="text-xs text-gray-600 mt-1">This month</p>
                </div>
                <Apple className="h-12 w-12 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Points Earned</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">2,450</p>
                  <p className="text-xs text-gray-600 mt-1">Gold Member 🏆</p>
                </div>
                <Zap className="h-12 w-12 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Stats */}
        <Card className="border-2 border-gray-100 mb-12">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-7 gap-4">
              {weeklyStats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-bold text-gray-900 mb-3">{stat.day}</p>
                  <div className="space-y-2">
                    <div className="h-8 bg-gradient-to-t from-red-500 to-red-300 rounded flex items-end justify-center text-xs text-white font-bold" style={{height: `${stat.workouts * 15}px`}}>
                      {stat.workouts > 0 && stat.workouts}
                    </div>
                    <div className="h-6 bg-gradient-to-t from-purple-500 to-purple-300 rounded flex items-end justify-center text-xs text-white font-bold" style={{height: `${stat.meditation * 12}px`}}>
                      {stat.meditation > 0 && stat.meditation}
                    </div>
                    <div className="h-6 bg-gradient-to-t from-green-500 to-green-300 rounded flex items-end justify-center text-xs text-white font-bold" style={{height: `${stat.meals * 8}px`}}>
                      {stat.meals > 0 && stat.meals}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded"></div> Workouts</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded"></div> Meditation</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded"></div> Meals</div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/wellness">
              <Card className="border-2 border-transparent hover:border-red-300 hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Start Workout</h3>
                      <p className="text-sm text-gray-600">Get personalized recommendations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/ai-chat">
              <Card className="border-2 border-transparent hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Chat with AI</h3>
                      <p className="text-sm text-gray-600">Get health advice instantly</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/wellness">
              <Card className="border-2 border-transparent hover:border-green-300 hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Apple className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Meal Plan</h3>
                      <p className="text-sm text-gray-600">View personalized nutrition</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((a, i) => (
              <Card key={i} className="border-2 hover:border-yellow-300 hover:shadow-lg transition-all cursor-pointer text-center">
                <CardContent className="pt-6">
                  <p className="text-4xl mb-2">{a.icon}</p>
                  <p className="font-bold text-sm text-gray-900 mb-1">{a.title}</p>
                  <p className="text-xs text-gray-600">{a.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <Card className="border-2 border-gray-100">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentActivities.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 bg-gradient-to-br from-${a.color}-500 to-${a.color}-400 rounded-full flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{a.title}</p>
                          <p className="text-sm text-gray-600">{a.time}</p>
                        </div>
                      </div>
                      <span className={`text-${a.color}-600 font-bold`}>+{a.points} pts</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
