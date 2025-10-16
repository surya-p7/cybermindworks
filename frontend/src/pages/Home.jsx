import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Search, MapPin, Briefcase, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");

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
      {/* Search and Filters */}
      <div className="bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
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
                <SelectValue placeholder="All Locations" />
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
                <SelectValue placeholder="All Types" />
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
      </div>

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

export default Home;