import { useState } from "react";
import { Mail, Phone, MapPin, Briefcase, Award, Edit2, Save, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Rahul Kumar",
    email: "rahul.kumar@example.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    title: "Senior Full Stack Developer",
    experience: "5 years",
    bio: "Passionate full-stack developer with expertise in modern web technologies. Love building scalable applications and solving complex problems.",
    skills: ["React", "Node.js", "MongoDB", "TypeScript", "AWS", "Docker"],
    education: "B.Tech in Computer Science",
    company: "Tech Solutions Inc",
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="page-title">
            My Profile
          </h1>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-[#0066ff] hover:bg-[#0052cc] text-white"
              data-testid="edit-profile-button"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-gray-300"
                data-testid="cancel-edit-button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#0066ff] hover:bg-[#0052cc] text-white"
                data-testid="save-profile-button"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-3xl">{profile.name.charAt(0)}</span>
                  </div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="text-center font-semibold"
                        data-testid="edit-name-input"
                      />
                      <Input
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        className="text-center text-sm"
                        data-testid="edit-title-input"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">{profile.name}</h2>
                      <p className="text-gray-600 mb-4">{profile.title}</p>
                    </>
                  )}
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Available for Work
                  </Badge>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {isEditing ? (
                      <Input
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="text-sm flex-1"
                        data-testid="edit-email-input"
                      />
                    ) : (
                      <span className="text-gray-700">{profile.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {isEditing ? (
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="text-sm flex-1"
                        data-testid="edit-phone-input"
                      />
                    ) : (
                      <span className="text-gray-700">{profile.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {isEditing ? (
                      <Input
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="text-sm flex-1"
                        data-testid="edit-location-input"
                      />
                    ) : (
                      <span className="text-gray-700">{profile.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    {isEditing ? (
                      <Input
                        value={profile.experience}
                        onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                        className="text-sm flex-1"
                        data-testid="edit-experience-input"
                      />
                    ) : (
                      <span className="text-gray-700">{profile.experience} experience</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="resize-none"
                    data-testid="edit-bio-input"
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-dashed border-gray-300"
                      data-testid="add-skill-button"
                    >
                      + Add Skill
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={profile.title}
                            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                            placeholder="Job Title"
                            data-testid="edit-job-title-input"
                          />
                          <Input
                            value={profile.company}
                            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                            placeholder="Company Name"
                            data-testid="edit-company-input"
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-gray-900">{profile.title}</h3>
                          <p className="text-sm text-gray-600">{profile.company}</p>
                          <p className="text-xs text-gray-500 mt-1">2020 - Present</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={profile.education}
                        onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                        placeholder="Education"
                        data-testid="edit-education-input"
                      />
                    ) : (
                      <>
                        <h3 className="font-semibold text-gray-900">{profile.education}</h3>
                        <p className="text-sm text-gray-600">ABC University</p>
                        <p className="text-xs text-gray-500 mt-1">2015 - 2019</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;