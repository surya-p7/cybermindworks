import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Software Engineer",
      company: "Tech Solutions Inc",
      rating: 5,
      text: "Assignment helped me land my dream job! The platform is incredibly user-friendly, and I received multiple job offers within weeks of signing up. Highly recommended!",
      avatar: "R",
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "HR Manager",
      company: "Digital Dynamics",
      rating: 5,
      text: "As a recruiter, this platform has been a game-changer. We found talented candidates quickly, and the filtering system is excellent. It's now our go-to platform for hiring.",
      avatar: "P",
    },
    {
      id: 3,
      name: "Arjun Patel",
      role: "UX Designer",
      company: "Creative Studios",
      rating: 5,
      text: "The job search experience on Assignment is seamless. I appreciated the detailed job descriptions and the ability to filter by my preferences. Found the perfect role!",
      avatar: "A",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      role: "Product Manager",
      company: "Innovation Hub",
      rating: 4,
      text: "Great platform with a wide variety of job listings. The application process is straightforward, and I loved the regular updates on my application status.",
      avatar: "S",
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "Founder & CEO",
      company: "StartUp Tech",
      rating: 5,
      text: "We've been using Assignment to recruit for our startup, and the quality of candidates has been outstanding. The platform makes it easy to manage applications and communicate with potential hires.",
      avatar: "V",
    },
    {
      id: 6,
      name: "Ananya Gupta",
      role: "Data Scientist",
      company: "Analytics Pro",
      rating: 5,
      text: "I was skeptical at first, but Assignment exceeded my expectations. The job recommendations were spot-on, and I found a role that perfectly matched my skills and career goals.",
      avatar: "A",
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="page-title">
            What Our Users Say
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it - hear from job seekers and employers who've found success with Assignment
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-gray-200 text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">4.8</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {renderStars(5)}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">5000+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="border-gray-200 hover:shadow-md transition-shadow"
              data-testid={`testimonial-card-${testimonial.id}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                  <Quote className="h-6 w-6 text-gray-300" />
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Thousands of Happy Users</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Start your journey to finding your dream job or the perfect candidate today.
              </p>
              <Badge className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-8 py-3 text-base">
                Get Started Now
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;