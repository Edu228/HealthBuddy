import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { User, Heart, Calendar, Trophy, Settings } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Profile</h1>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Card */}
        <Card className="border-2 border-gray-100 mb-8">
          <CardContent className="pt-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600 mt-1">{user?.email}</p>
                <div className="flex gap-4 mt-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">Edit Profile</Button>
                  <Link href="/settings">
                    <Button variant="outline">Settings</Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <Heart className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">Jan 2025</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <Trophy className="h-8 w-8 text-purple-600 mb-2" />
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">2,450</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                <Calendar className="h-8 w-8 text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Streak Days</p>
                <p className="text-2xl font-bold text-green-600 mt-2">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Information */}
        <Card className="border-2 border-gray-100 mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle>Health Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <p className="text-lg text-gray-900">28 years old</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <p className="text-lg text-gray-900">Female</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Level</label>
                <p className="text-lg text-gray-900">Intermediate</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
                <p className="text-lg text-gray-900">Weight Loss & Fitness</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <p className="text-lg text-gray-900">170 cm</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                <p className="text-lg text-gray-900">65 kg</p>
              </div>
            </div>
            <Button className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">Update Health Info</Button>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="border-2 border-gray-100">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Plan</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">Premium</p>
                <p className="text-sm text-gray-600 mt-2">£12/month - Renews on Feb 20, 2025</p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">Manage Subscription</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

