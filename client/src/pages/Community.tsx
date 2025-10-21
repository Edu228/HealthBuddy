import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Users, Heart, MessageCircle, Share2, Award } from "lucide-react";
import { useState } from "react";

const communityPosts = [
  { author: "Sarah Johnson", avatar: "SJ", post: "Just completed my first 5K run! 🏃‍♀️ Feeling amazing!", likes: 234, comments: 12, time: "2 hours ago", badge: "Gold Member" },
  { author: "John Smith", avatar: "JS", post: "30-day meditation streak achieved! 🧘 My mental health has never been better.", likes: 156, comments: 8, time: "4 hours ago", badge: "Verified" },
  { author: "Emma Wilson", avatar: "EW", post: "New healthy recipe: Quinoa Buddha Bowl with roasted vegetables and tahini dressing", likes: 342, comments: 25, time: "6 hours ago", badge: "Chef" },
  { author: "Michael Brown", avatar: "MB", post: "Lost 10kg in 3 months with HealthBuddy! The AI recommendations are incredible.", likes: 512, comments: 45, time: "8 hours ago", badge: "Success Story" },
  { author: "Lisa Chen", avatar: "LC", post: "Starting my fitness journey today! Any tips for beginners?", likes: 89, comments: 34, time: "10 hours ago", badge: "Newcomer" },
  { author: "David Martinez", avatar: "DM", post: "Completed the 30-day challenge! 💪 Who's joining the next one?", likes: 267, comments: 19, time: "12 hours ago", badge: "Challenger" },
  { author: "Rachel Green", avatar: "RG", post: "The AI buddy helped me understand my menstrual cycle better. Highly recommend!", likes: 198, comments: 15, time: "14 hours ago", badge: "Wellness Expert" },
  { author: "Tom Anderson", avatar: "TA", post: "Yoga has changed my life. Flexibility improved 100% in 2 months!", likes: 145, comments: 11, time: "16 hours ago", badge: "Yogi" }
];

const challenges = [
  { name: "30-Day Fitness Challenge", participants: 1250, progress: 65, reward: "Gold Badge" },
  { name: "Meditation Streak", participants: 890, progress: 45, reward: "Zen Master Badge" },
  { name: "Healthy Eating Challenge", participants: 756, progress: 72, reward: "Nutrition Expert Badge" }
];

export default function Community() {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState<Record<number, boolean>>({});

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
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Community</h1>
          <Link href="/dashboard"><Button variant="outline">Back</Button></Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Active Challenges */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {challenges.map((c, i) => (
              <Card key={i} className="border-2 hover:border-orange-300 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="h-6 w-6 text-orange-600" />
                    <h3 className="font-bold text-gray-900">{c.name}</h3>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{c.participants} participants</span>
                      <span>{c.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{width: `${c.progress}%`}}></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-4">Reward: {c.reward}</p>
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs py-1">Join Challenge</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Create Post */}
        <Card className="border-2 border-gray-100 mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <textarea
                  placeholder="Share your health journey..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-600 resize-none"
                  rows={3}
                ></textarea>
                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="outline" className="text-xs py-1">Cancel</Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs py-1">Post</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Posts */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Feed</h2>
        <div className="space-y-6">
          {communityPosts.map((p, i) => (
            <Card key={i} className="border-2 hover:border-purple-300 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      {p.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{p.author}</p>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{p.badge}</span>
                      </div>
                      <p className="text-xs text-gray-600">{p.time}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{p.post}</p>
                <div className="flex gap-6 text-sm text-gray-600 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setLiked({...liked, [i]: !liked[i]})}
                    className={`flex items-center gap-2 hover:text-red-500 transition-colors ${liked[i] ? 'text-red-500' : ''}`}
                  >
                    <Heart className={`h-4 w-4 ${liked[i] ? 'fill-current' : ''}`} /> {p.likes}
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-500">
                    <MessageCircle className="h-4 w-4" /> {p.comments}
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-500">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
