import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Briefcase, Award, Edit2, Save, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    fetchProfile();
    if (user?.role === 'jobseeker') {
      fetchApplications();
    } else if (user?.role === 'employer') {
      fetchMyJobsWithApplicants();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/profile');
      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchMyJobsWithApplicants = async () => {
    try {
      const jobsResponse = await api.get('/jobs/my-jobs');
      const jobs = jobsResponse.data;
      
      // Fetch applicants for each job
      const jobsWithApplicants = await Promise.all(
        jobs.map(async (job) => {
          try {
            const applicantsResponse = await api.get(`/applications/job/${job.id}`);
            return { ...job, applicants: applicantsResponse.data };
          } catch (error) {
            console.error(`Error fetching applicants for job ${job.id}:`, error);
            return { ...job, applicants: [] };
          }
        })
      );
      
      setMyJobs(jobsWithApplicants);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, { status: newStatus });
      toast.success(`Application ${newStatus}!`);
      // Refresh the jobs with applicants
      fetchMyJobsWithApplicants();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  const handleSave = async () => {
    try {
      await api.patch('/users/profile', editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0066ff]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center">
        <p className="text-gray-600">Failed to load profile</p>
      </div>
    );
  }

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
                    <span className="text-white font-bold text-3xl">{profile.name?.charAt(0) || 'U'}</span>
                  </div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={editedProfile.name || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="text-center font-semibold"
                        data-testid="edit-name-input"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">{profile.name}</h2>
                      <p className="text-gray-600 mb-4">{profile.role === 'employer' ? 'Employer' : 'Job Seeker'}</p>
                    </>
                  )}
                  <Badge className={profile.role === 'employer' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-green-100 text-green-800 border-green-200'}>
                    {profile.role === 'employer' ? 'Employer' : 'Available for Work'}
                  </Badge>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {isEditing ? (
                        <Input
                          value={editedProfile.phone || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                          className="text-sm flex-1"
                          data-testid="edit-phone-input"
                        />
                      ) : (
                        <span className="text-gray-700">{profile.phone}</span>
                      )}
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {isEditing ? (
                        <Input
                          value={editedProfile.location || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                          className="text-sm flex-1"
                          data-testid="edit-location-input"
                        />
                      ) : (
                        <span className="text-gray-700">{profile.location}</span>
                      )}
                    </div>
                  )}
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
                    value={editedProfile.bio || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    rows={4}
                    className="resize-none"
                    placeholder="Tell us about yourself..."
                    data-testid="edit-bio-input"
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed">{profile.bio || 'No bio added yet.'}</p>
                )}
              </CardContent>
            </Card>

            {/* Applications (for Job Seekers) */}
            {profile.role === 'jobseeker' && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>My Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <p className="text-gray-500 text-sm">No applications yet</p>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{app.job?.title}</h3>
                            <Badge className={`
                              ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                              ${app.status === 'reviewed' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                              ${app.status === 'accepted' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                              ${app.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                            `}>
                              {app.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{app.job?.company}</p>
                          <p className="text-xs text-gray-500">
                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Job Applicants (for Employers) */}
            {profile.role === 'employer' && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>My Job Postings & Applicants</CardTitle>
                </CardHeader>
                <CardContent>
                  {myJobs.length === 0 ? (
                    <p className="text-gray-500 text-sm">No jobs posted yet</p>
                  ) : (
                    <div className="space-y-6">
                      {myJobs.map((job) => (
                        <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="mb-4">
                            <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                            <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                                {job.applicants?.length || 0} Applicants
                              </Badge>
                            </div>
                          </div>
                          
                          {job.applicants && job.applicants.length > 0 ? (
                            <div className="space-y-3 mt-4">
                              <p className="text-sm font-medium text-gray-700">Applicants:</p>
                              {job.applicants.map((applicant) => (
                                <div key={applicant.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="font-medium text-gray-900">{applicant.applicant?.name}</p>
                                      <p className="text-sm text-gray-600">{applicant.applicant?.email}</p>
                                      {applicant.applicant?.phone && (
                                        <p className="text-sm text-gray-600">{applicant.applicant.phone}</p>
                                      )}
                                    </div>
                                    <Badge className={`
                                      ${applicant.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                                      ${applicant.status === 'reviewed' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                                      ${applicant.status === 'accepted' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                                      ${applicant.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                                    `}>
                                      {applicant.status}
                                    </Badge>
                                  </div>
                                  
                                  <div className="mb-3">
                                    <p className="text-xs text-gray-500 mb-1">Cover Letter:</p>
                                    <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                                      {applicant.coverLetter}
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-500">
                                      Applied on {new Date(applicant.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="flex gap-2">
                                      {applicant.status !== 'accepted' && (
                                        <Button
                                          size="sm"
                                          onClick={() => handleStatusUpdate(applicant.id, 'accepted')}
                                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                        >
                                          Accept
                                        </Button>
                                      )}
                                      {applicant.status !== 'rejected' && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleStatusUpdate(applicant.id, 'rejected')}
                                          className="border-red-300 text-red-600 hover:bg-red-50 text-xs"
                                        >
                                          Reject
                                        </Button>
                                      )}
                                      {applicant.status === 'pending' && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleStatusUpdate(applicant.id, 'reviewed')}
                                          className="text-xs"
                                        >
                                          Mark Reviewed
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 mt-2">No applicants yet</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Account Info */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">Account Type</Label>
                    <p className="font-medium text-gray-900 capitalize">{profile.role}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Member Since</Label>
                    <p className="font-medium text-gray-900">
                      {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  {profile.role === 'jobseeker' && (
                    <div>
                      <Label className="text-sm text-gray-600">Total Applications</Label>
                      <p className="font-medium text-gray-900">{applications.length}</p>
                    </div>
                  )}
                  {profile.role === 'employer' && (
                    <div>
                      <Label className="text-sm text-gray-600">Total Jobs Posted</Label>
                      <p className="font-medium text-gray-900">{myJobs.length}</p>
                    </div>
                  )}
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