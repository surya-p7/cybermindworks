import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Search, MapPin, Briefcase, Plus, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const JobPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
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

  useEffect(() => {
    fetchJobs();
    seedInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchTerm, locationFilter, jobTypeFilter]);

  const seedInitialData = async () => {
    try {
      await axios.post(`${API}/jobs/seed`);
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/jobs`);
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      toast.error("Failed to fetch jobs");
      console.error("Error fetching jobs:", error);
    }
  };

  const applyFilters = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((job) => job.location === locationFilter);
    }

    if (jobTypeFilter !== "all") {
      filtered = filtered.filter((job) => job.jobType === jobTypeFilter);
    }

    setFilteredJobs(filtered);
  };

  const handleCreateJob = async () => {
    try {
      const jobData = {
        ...formData,
        salary: `₹${formData.salaryMin} - ₹${formData.salaryMax}`,
        status: "Active",
        applicants: 0,
      };
      await axios.post(`${API}/jobs`, jobData);
      toast.success("Job published successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      toast.error("Failed to create job");
      console.error("Error creating job:", error);
    }
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

  const uniqueLocations = [...new Set(jobs.map((job) => job.location))];

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffHours = Math.floor((now - posted) / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      {/* Header */}
      <header className="bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <div className="text-xl font-semibold" data-testid="site-logo">Assignment</div>
              
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Home</a>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Find Jobs</a>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Find Talents</a>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">About us</a>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Testimonials</a>
              </nav>
            </div>

            {/* Create Job Button */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium px-5 py-2"
                  data-testid="create-job-button"
                  onClick={() => resetForm()}
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

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-6 py-4 border-t border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by Job Title, Role"
                className="pl-10 bg-white border-gray-300 text-gray-900"
                data-testid="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[200px] bg-white border-gray-300 text-gray-900" data-testid="location-filter">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Preferred Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger className="w-[180px] bg-white border-gray-300 text-gray-900" data-testid="job-type-filter">
                <Briefcase className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full Time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Job Cards */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or create a new job posting</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                data-testid={`job-card-${job.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{job.company.charAt(0)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{getTimeAgo(job.postedDate)}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1" data-testid={`job-title-${job.id}`}>
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{job.company}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  {job.experience && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {job.experience}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900 mb-4">{job.salary}</div>
                <Button
                  className="w-full bg-[#0066ff] hover:bg-[#0052cc] text-white"
                  data-testid={`apply-button-${job.id}`}
                >
                  Apply Now
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default JobPortal;