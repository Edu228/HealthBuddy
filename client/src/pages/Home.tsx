import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Heart, Brain, Apple, Users, Zap, Shield, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HB</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{APP_TITLE}</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">Welcome, {user?.name}!</span>
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
              </>
            ) : (
              <Button onClick={() => window.location.href = getLoginUrl()} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">Sign In</Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Background */}
      <section className="relative overflow-hidden py-20" style={{
        backgroundImage: 'url(/healthy-habits-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-black/40"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Your Personal Health & Wellness <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">AI Companion</span>
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            HealthBuddy is your best friend in health. Get personalized fitness recommendations, mental wellness guidance, and nutrition plans powered by advanced AI. Transform your life today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {!isAuthenticated && (
              <>
                <Button size="lg" onClick={() => window.location.href = getLoginUrl()} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-lg border-2 border-gray-300 hover:border-gray-400">
                  Learn More
                </Button>
              </>
            )}
            {isAuthenticated && (
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section with Images */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Powerful Features for Your Health Journey</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Fitness Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 z-10"></div>
              <img src="/fitness-bg.jpg" alt="Fitness" className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-20 flex flex-col justify-end p-6">
                <Heart className="h-8 w-8 text-red-400 mb-3" />
                <h3 className="text-2xl font-bold text-white mb-2">Personalized Fitness</h3>
                <p className="text-gray-200">AI-powered workout recommendations tailored to your age, fitness level, and goals</p>
              </div>
            </div>

            {/* Wellness Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 z-10"></div>
              <img src="/wellness-bg.jpg" alt="Wellness" className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-20 flex flex-col justify-end p-6">
                <Brain className="h-8 w-8 text-purple-400 mb-3" />
                <h3 className="text-2xl font-bold text-white mb-2">Mental Wellness</h3>
                <p className="text-gray-200">Guided meditations, breathing exercises, and stress management techniques</p>
              </div>
            </div>

            {/* Meditation Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-teal-500/20 z-10"></div>
              <img src="/meditation-bg.jpg" alt="Meditation" className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-20 flex flex-col justify-end p-6">
                <Zap className="h-8 w-8 text-blue-400 mb-3" />
                <h3 className="text-2xl font-bold text-white mb-2">Mindfulness & Meditation</h3>
                <p className="text-gray-200">Relax and recharge with our collection of guided meditation sessions</p>
              </div>
            </div>

            {/* Nutrition Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 z-10"></div>
              <img src="/nutrition-bg.jpg" alt="Nutrition" className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-20 flex flex-col justify-end p-6">
                <Apple className="h-8 w-8 text-green-400 mb-3" />
                <h3 className="text-2xl font-bold text-white mb-2">Nutrition Planning</h3>
                <p className="text-gray-200">Customized meal plans and recipes adapted to your dietary preferences</p>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
              <CardHeader>
                <Users className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Connect with others, share progress, and participate in challenges</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all">
              <CardHeader>
                <Zap className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Gamification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Earn points, unlock badges, and climb the ranks to stay motivated</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-green-200 hover:shadow-lg transition-all">
              <CardHeader>
                <Shield className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Your health data is encrypted and protected with enterprise-grade security</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Trial */}
            <Card className="border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6">
                <CardTitle className="text-2xl">Free Trial</CardTitle>
                <CardDescription>7 days of full access</CardDescription>
              </div>
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-gray-900 mb-2">£0</p>
                <p className="text-sm text-gray-600 mb-6">Full access to all premium features for 7 days</p>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg py-6">Start Trial</Button>
              </CardContent>
            </Card>

            {/* Basic Plan */}
            <Card className="border-4 border-blue-600 hover:shadow-2xl transition-all rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-bl-lg text-sm font-bold">POPULAR</div>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <CardTitle className="text-2xl text-white">Basic</CardTitle>
                <CardDescription className="text-blue-100">For individuals</CardDescription>
              </div>
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-gray-900 mb-2">£5<span className="text-lg text-gray-600">/month</span></p>
                <ul className="text-sm text-gray-600 mb-6 space-y-3">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Personalized recommendations</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Workout library access</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Community features</li>
                  <li className="flex items-center"><span className="text-gray-400 mr-2">✗</span> Premium video classes</li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg py-6">Subscribe Now</Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <CardTitle className="text-2xl text-white">Premium</CardTitle>
                <CardDescription className="text-purple-100">Everything included</CardDescription>
              </div>
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-gray-900 mb-2">£12<span className="text-lg text-gray-600">/month</span></p>
                <ul className="text-sm text-gray-600 mb-6 space-y-3">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> All Basic features</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Unlimited video classes</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Advanced nutrition planning</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Priority AI support</li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg py-6">Subscribe Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Health?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of users who are already achieving their health goals with HealthBuddy</p>
          {!isAuthenticated && (
            <Button size="lg" onClick={() => window.location.href = getLoginUrl()} className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all font-bold">
              Start Your Free Trial Today <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">HB</span>
                </div>
                <h3 className="text-white font-bold">HealthBuddy</h3>
              </div>
              <p className="text-sm">Your best friend in health and wellness</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 HealthBuddy. All rights reserved. | Transforming Health with AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

