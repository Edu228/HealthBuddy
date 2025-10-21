import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Heart, Brain, Apple, Play, Clock, Zap, Target } from "lucide-react";
import { useState } from "react";

const workouts = [
  { title: "HIIT Cardio Blast", duration: "30 min", level: "Intermediate", calories: "350 cal", desc: "High-intensity interval training to boost metabolism" },
  { title: "Strength Training", duration: "45 min", level: "Advanced", calories: "400 cal", desc: "Build muscle with resistance exercises" },
  { title: "Yoga Flow", duration: "20 min", level: "Beginner", calories: "150 cal", desc: "Improve flexibility and balance" },
  { title: "Pilates Core", duration: "25 min", level: "Intermediate", calories: "200 cal", desc: "Strengthen your core muscles" },
  { title: "Running Cardio", duration: "35 min", level: "Intermediate", calories: "400 cal", desc: "Improve cardiovascular endurance" },
  { title: "Boxing Fitness", duration: "40 min", level: "Advanced", calories: "450 cal", desc: "Full-body workout with boxing techniques" },
  { title: "Stretching & Flexibility", duration: "15 min", level: "Beginner", calories: "80 cal", desc: "Improve flexibility and reduce muscle tension" },
  { title: "Dance Cardio", duration: "30 min", level: "Intermediate", calories: "300 cal", desc: "Fun cardio workout with dance moves" }
];

const meditations = [
  { title: "Morning Meditation", duration: "10 min", category: "Energy", desc: "Start your day with positive energy and focus" },
  { title: "Stress Relief", duration: "15 min", category: "Relaxation", desc: "Reduce anxiety and calm your mind" },
  { title: "Sleep Meditation", duration: "20 min", category: "Sleep", desc: "Prepare your mind for restful sleep" },
  { title: "Body Scan", duration: "12 min", category: "Awareness", desc: "Increase body awareness and relaxation" },
  { title: "Breathing Exercises", duration: "8 min", category: "Calm", desc: "Simple breathing techniques for stress relief" },
  { title: "Mindfulness", duration: "18 min", category: "Focus", desc: "Improve focus and present moment awareness" },
  { title: "Gratitude Meditation", duration: "10 min", category: "Positivity", desc: "Cultivate gratitude and positive emotions" },
  { title: "Anxiety Relief", duration: "15 min", category: "Mental Health", desc: "Techniques to manage anxiety and worry" }
];

const mealPlans = [
  { title: "Weight Loss Plan", meals: "3 meals/day", calories: "1800 cal", protein: "120g", desc: "Calorie-controlled plan for healthy weight loss" },
  { title: "Muscle Gain Plan", meals: "4 meals/day", calories: "2500 cal", protein: "180g", desc: "High-protein plan for muscle building" },
  { title: "Balanced Plan", meals: "3 meals/day", calories: "2000 cal", protein: "150g", desc: "Balanced nutrition for overall health" },
  { title: "Keto Plan", meals: "3 meals/day", calories: "1900 cal", protein: "140g", desc: "Low-carb, high-fat ketogenic diet" },
  { title: "Vegan Plan", meals: "3 meals/day", calories: "2000 cal", protein: "130g", desc: "Plant-based nutrition plan" },
  { title: "Mediterranean Plan", meals: "3 meals/day", calories: "2100 cal", protein: "130g", desc: "Heart-healthy Mediterranean diet" }
];

export default function Wellness() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("fitness");

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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Wellness & Fitness</h1>
          <Link href="/dashboard"><Button variant="outline">Back</Button></Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {["fitness", "meditation", "nutrition"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-4 font-semibold capitalize whitespace-nowrap ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Fitness Section */}
        {activeTab === "fitness" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Personalized Workouts</h2>
              <p className="text-gray-600">Choose from our extensive library of workouts tailored to your fitness level</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {workouts.map((w, i) => (
                <Card key={i} className="border-2 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden group flex flex-col">
                  <div className="relative h-40 bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                    <Play className="h-12 w-12 text-white opacity-80 group-hover:opacity-100" />
                  </div>
                  <CardContent className="pt-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-sm mb-2 text-gray-900">{w.title}</h3>
                    <p className="text-xs text-gray-600 mb-3 flex-1">{w.desc}</p>
                    <div className="space-y-2 text-xs text-gray-600 mb-4">
                      <div className="flex items-center gap-2"><Clock className="h-3 w-3" /> {w.duration}</div>
                      <div className="flex items-center gap-2"><Zap className="h-3 w-3" /> {w.calories}</div>
                      <div className="flex items-center gap-2"><Target className="h-3 w-3" /> {w.level}</div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs py-1">Start</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Meditation Section */}
        {activeTab === "meditation" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Guided Meditations</h2>
              <p className="text-gray-600">Improve mental health with our collection of guided meditations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {meditations.map((m, i) => (
                <Card key={i} className="border-2 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden group">
                  <div className="relative h-40 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Brain className="h-12 w-12 text-white opacity-80" />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold text-sm mb-2 text-gray-900">{m.title}</h3>
                    <p className="text-xs text-gray-600 mb-3">{m.desc}</p>
                    <div className="flex justify-between text-xs text-gray-600 mb-4">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {m.duration}</span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">{m.category}</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs py-1">Listen</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition Section */}
        {activeTab === "nutrition" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Meal Plans</h2>
              <p className="text-gray-600">Personalized nutrition plans designed by nutritionists</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mealPlans.map((p, i) => (
                <Card key={i} className="border-2 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden group">
                  <div className="relative h-40 bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Apple className="h-12 w-12 text-white opacity-80" />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold text-sm mb-2 text-gray-900">{p.title}</h3>
                    <p className="text-xs text-gray-600 mb-3">{p.desc}</p>
                    <div className="space-y-2 text-xs text-gray-600 mb-4">
                      <div>📅 {p.meals}</div>
                      <div>🔥 {p.calories}</div>
                      <div>💪 Protein: {p.protein}</div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs py-1">View Plan</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
