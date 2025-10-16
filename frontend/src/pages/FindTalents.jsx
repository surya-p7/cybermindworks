import { Users, Search, MapPin, Award, Briefcase, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FindTalents = () => {
  const candidates = [
    {
      id: 1,
      name: "Rahul Sharma",
      title: "Full Stack Developer",
      experience: "5 years",
      location: "Bangalore",
      skills: ["React", "Node.js", "MongoDB", "TypeScript"],
      rating: 4.8,
    },
    {
      id: 2,
      name: "Priya Patel",
      title: "UI/UX Designer",
      experience: "4 years",
      location: "Mumbai",
      skills: ["Figma", "Adobe XD", "UI Design", "Prototyping"],
      rating: 4.9,
    },
    {
      id: 3,
      name: "Arjun Kumar",
      title: "DevOps Engineer",
      experience: "6 years",
      location: "Chennai",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      rating: 4.7,
    },
    {
      id: 4,
      name: "Sneha Reddy",
      title: "Data Scientist",
      experience: "3 years",
      location: "Delhi",
      skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
      rating: 4.6,
    },
    {
      id: 5,
      name: "Vikram Singh",
      title: "Backend Developer",
      experience: "4 years",
      location: "Remote",
      skills: ["Python", "Django", "PostgreSQL", "Redis"],
      rating: 4.8,
    },
    {
      id: 6,
      name: "Ananya Gupta",
      title: "Frontend Developer",
      experience: "3 years",
      location: "Bangalore",
      skills: ["React", "JavaScript", "CSS", "Redux"],
      rating: 4.7,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="page-title">
            Find Top Talents
          </h1>
          <p className="text-gray-600">Connect with skilled professionals ready to join your team</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{candidates.length}</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Profiles</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{candidates.length}</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">4.8</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by skills, title, or location..."
                  className="pl-10 border-gray-300"
                  data-testid="search-talents-input"
                />
              </div>
              <Button className="bg-[#0066ff] hover:bg-[#0052cc] text-white">
                Search Talents
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Candidate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="border-gray-200 hover:shadow-md transition-shadow" data-testid={`candidate-card-${candidate.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{candidate.name.charAt(0)}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                    <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                    <span className="text-sm font-semibold text-yellow-700">{candidate.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{candidate.name}</h3>
                <p className="text-gray-600 mb-3">{candidate.title}</p>
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {candidate.experience}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {candidate.location}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-[#0066ff] hover:bg-[#0052cc] text-white" data-testid={`view-profile-${candidate.id}`}>
                    View Profile
                  </Button>
                  <Button variant="outline" className="border-gray-300">
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindTalents;