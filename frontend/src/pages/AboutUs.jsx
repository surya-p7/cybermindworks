import { Target, Users, Award, TrendingUp, Heart, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutUs = () => {
  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Jobs Posted", value: "10K+", icon: Target },
    { label: "Success Rate", value: "95%", icon: Award },
    { label: "Companies", value: "500+", icon: TrendingUp },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for People",
      description: "We believe in connecting the right talent with the right opportunities.",
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "Building a platform where trust and transparency are at the core of every interaction.",
    },
    {
      icon: Award,
      title: "Excellence in Service",
      description: "Committed to providing the best job search and recruitment experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="page-title">
            About Assignment
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are on a mission to connect talented professionals with their dream jobs and help companies find the perfect candidates.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-gray-200 text-center">
                <CardContent className="pt-6">
                  <Icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mission Section */}
        <Card className="mb-12 border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 text-lg max-w-4xl mx-auto">
              To revolutionize the job search and recruitment process by creating a platform that empowers both job seekers and employers. We strive to make finding the right opportunity or the perfect candidate as seamless and efficient as possible.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-gray-200 text-center hover:shadow-md transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Story Section */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-4xl mx-auto text-gray-600">
              <p className="mb-4">
                Founded in 2024, Assignment started with a simple vision: to make job searching and hiring easier for everyone. We noticed the challenges both job seekers and employers faced in the traditional recruitment process and decided to build a solution.
              </p>
              <p className="mb-4">
                Today, we've grown into a platform trusted by thousands of professionals and hundreds of companies across India. Our technology-driven approach combines intelligent matching algorithms with a user-friendly interface to create meaningful connections.
              </p>
              <p>
                We're constantly evolving, listening to our community, and improving our platform to better serve the needs of modern job seekers and forward-thinking employers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutUs;