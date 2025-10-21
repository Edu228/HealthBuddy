import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Brain, Send, Lightbulb } from "lucide-react";
import { useState } from "react";

const suggestedQuestions = [
  "What workout should I do today?",
  "How can I improve my sleep?",
  "What should I eat for better energy?",
  "How to manage stress and anxiety?",
  "Tips for building muscle?",
  "How to track my progress?"
];

const chatHistory = [
  { type: "ai", text: "Hi! I'm your HealthBuddy AI. I'm here to help you with personalized health advice, fitness recommendations, nutrition guidance, and mental wellness support. How can I help you today?" },
  { type: "user", text: "What workout should I do today?" },
  { type: "ai", text: "Based on your profile, I see you prefer intermediate-level workouts. Since it's Monday and you had a rest day yesterday, I recommend a 30-minute HIIT Cardio Blast session. This will boost your metabolism and improve cardiovascular health. You can burn approximately 350 calories. Would you like me to start the workout?" },
  { type: "user", text: "What about nutrition?" },
  { type: "ai", text: "For today's nutrition, I recommend:\n\n🥗 Breakfast: Oatmeal with berries and almonds (350 cal)\n🥙 Lunch: Grilled chicken with quinoa and vegetables (450 cal)\n🍲 Dinner: Salmon with sweet potato and broccoli (500 cal)\n\nThis totals 1300 calories, leaving room for snacks. Would you like detailed recipes for any of these meals?" }
];

export default function AIChat() {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState(chatHistory);
  const [input, setInput] = useState("");

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

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { type: "user", text: input }]);
      setInput("");
      setTimeout(() => {
        setMessages(prev => [...prev, { type: "ai", text: "I'm processing your request. This is a demo response. In production, I would provide personalized AI recommendations based on your health data." }]);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Health Buddy</h1>
          <Link href="/dashboard"><Button variant="outline">Back</Button></Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-100 h-96 flex flex-col">
              <CardContent className="pt-6 flex-1 overflow-y-auto space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.type === "user" ? "justify-end" : ""}`}>
                    {msg.type === "ai" && (
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div className={`rounded-lg p-3 max-w-xs ${msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="border-t border-gray-200 p-4 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600 text-sm"
                />
                <Button onClick={handleSend} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"><Send className="h-4 w-4" /></Button>
              </div>
            </Card>
          </div>

          {/* Suggested Questions */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Suggested Questions
            </h3>
            <div className="space-y-3">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="w-full text-left p-3 bg-white border-2 border-gray-100 hover:border-blue-300 rounded-lg text-sm text-gray-700 hover:text-gray-900 transition-all hover:shadow-md"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
