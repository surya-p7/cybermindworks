import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Search, MapPin, Briefcase, User, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { jobsAPI } from "@/utils/api";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full-time",
    salaryMin: "",
    salaryMax: "",
    description: "",
    experience: "",
    deadline: "",
  });

  const handleCreateJob = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to create a job");
      navigate('/login');
      return;
    }

    try {
      const salary = formData.salaryMin && formData.salaryMax 
        ? `₹${formData.salaryMin} - ₹${formData.salaryMax}`
        : '';

      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        jobType: formData.jobType,
        salary: salary,
        requirements: formData.experience,
        deadline: formData.deadline || undefined,
      };

      await jobsAPI.create(jobData);
      toast.success("Job published successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      window.location.reload();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to create a job");
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || "Failed to create job");
      }
      console.error("Error creating job:", error);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/');
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      jobType: "Full-time",
      salaryMin: "",
      salaryMax: "",
      description: "",
      experience: "",
      deadline: "",
    });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-semibold" data-testid="site-logo">
              Assignment
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm transition-colors ${
                  isActive("/") ? "text-white font-medium" : "text-gray-300 hover:text-white"
                }`}
                data-testid="nav-home"
              >
                Home
              </Link>
              <Link
                to="/find-jobs"
                className={`text-sm transition-colors ${
                  isActive("/find-jobs") ? "text-white font-medium" : "text-gray-300 hover:text-white"
                }`}
                data-testid="nav-find-jobs"
              >
                Find Jobs
              </Link>
              <Link
                to="/find-talents"
                className={`text-sm transition-colors ${
                  isActive("/find-talents") ? "text-white font-medium" : "text-gray-300 hover:text-white"
                }`}
                data-testid="nav-find-talents"
              >
                Find Talents
              </Link>
              <Link
                to="/about"
                className={`text-sm transition-colors ${
                  isActive("/about") ? "text-white font-medium" : "text-gray-300 hover:text-white"
                }`}
                data-testid="nav-about"
              >
                About us
              </Link>
              <Link
                to="/testimonials"
                className={`text-sm transition-colors ${
                  isActive("/testimonials") ? "text-white font-medium" : "text-gray-300 hover:text-white"
                }`}
                data-testid="nav-testimonials"
              >
                Testimonials
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-gray-800"
                    data-testid="profile-button"
                    title={user?.fullName}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-gray-800"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium px-5 py-2"
                  data-testid="create-job-button"
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error("Please login to create a job");
                      navigate('/login');
                    } else {
                      resetForm();
                    }
                  }}
                >
                  Create Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Create Job Opening</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="text-sm font-medium">Job Title</Label>
                    <Input
                      id="title"
                      data-testid="job-title-input"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Full Stack Developer"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company" className="text-sm font-medium">Company Name</Label>
                    <Input
                      id="company"
                      data-testid="job-company-input"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Amazon, Microsoft, Swiggy"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                      <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                        <SelectTrigger data-testid="job-location-select" className="border-gray-300">
                          <SelectValue placeholder="Choose Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="Chennai">Chennai</SelectItem>
                          <SelectItem value="Bangalore">Bangalore</SelectItem>
                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="jobType" className="text-sm font-medium">Job Type</Label>
                      <Select value={formData.jobType} onValueChange={(value) => setFormData({ ...formData, jobType: value })}>
                        <SelectTrigger data-testid="job-type-select" className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Full-time">Full Time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="experience" className="text-sm font-medium">Experience Required</Label>
                    <Input
                      id="experience"
                      data-testid="job-experience-input"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="e.g. 1-3 years"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="salaryMin" className="text-sm font-medium">Salary Min (₹)</Label>
                      <Input
                        id="salaryMin"
                        data-testid="job-salary-min-input"
                        type="number"
                        value={formData.salaryMin}
                        onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                        placeholder="10000"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="salaryMax" className="text-sm font-medium">Salary Max (₹)</Label>
                      <Input
                        id="salaryMax"
                        data-testid="job-salary-max-input"
                        type="number"
                        value={formData.salaryMax}
                        onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                        placeholder="15000"
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deadline" className="text-sm font-medium">Application Deadline</Label>
                    <Input
                      id="deadline"
                      data-testid="job-deadline-input"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description" className="text-sm font-medium">Job Description</Label>
                    <Textarea
                      id="description"
                      data-testid="job-description-input"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Please share a description so the candidates know more about the job soon."
                      rows={5}
                      className="border-gray-300 resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    data-testid="save-draft-button"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Save Draft
                  </Button>
                  <Button
                    onClick={handleCreateJob}
                    data-testid="publish-button"
                    className="bg-[#0066ff] hover:bg-[#0052cc] text-white"
                  >
                    Publish
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;