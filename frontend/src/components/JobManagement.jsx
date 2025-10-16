import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Search, Plus, Filter, Edit2, Trash2, MapPin, DollarSign, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    status: "Active",
    jobType: "Full-time",
    salary: "",
    description: "",
    applicants: 0,
  });

  useEffect(() => {
    fetchJobs();
    seedInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchTerm, statusFilter, jobTypeFilter, locationFilter]);

  const seedInitialData = async () => {
    try {
      await axios.post(`${API}/jobs/seed`);
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/jobs`);
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      toast.error("Failed to fetch jobs");
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
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

    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    if (jobTypeFilter !== "all") {
      filtered = filtered.filter((job) => job.jobType === jobTypeFilter);
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((job) => job.location === locationFilter);
    }

    setFilteredJobs(filtered);
  };

  const handleAddJob = async () => {
    try {
      await axios.post(`${API}/jobs`, formData);
      toast.success("Job added successfully");
      setIsAddDialogOpen(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      toast.error("Failed to add job");
      console.error("Error adding job:", error);
    }
  };

  const handleEditJob = async () => {
    try {
      await axios.put(`${API}/jobs/${selectedJob.id}`, formData);
      toast.success("Job updated successfully");
      setIsEditDialogOpen(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      toast.error("Failed to update job");
      console.error("Error updating job:", error);
    }
  };

  const handleDeleteJob = async () => {
    try {
      await axios.delete(`${API}/jobs/${selectedJob.id}`);
      toast.success("Job deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedJob(null);
      fetchJobs();
    } catch (error) {
      toast.error("Failed to delete job");
      console.error("Error deleting job:", error);
    }
  };

  const openEditDialog = (job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      status: job.status,
      jobType: job.jobType,
      salary: job.salary,
      description: job.description,
      applicants: job.applicants,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (job) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      status: "Active",
      jobType: "Full-time",
      salary: "",
      description: "",
      applicants: 0,
    });
    setSelectedJob(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactive":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Closed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const uniqueLocations = [...new Set(jobs.map((job) => job.location))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" data-testid="page-title">
                Job Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track all job postings
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="add-job-button"
                  onClick={() => resetForm()}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Job</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new job posting
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      data-testid="job-title-input"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g. Senior Full Stack Developer"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      data-testid="job-company-input"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      placeholder="e.g. Tech Solutions Inc"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      data-testid="job-location-input"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="e.g. New York, NY"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger data-testid="job-status-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="jobType">Job Type</Label>
                      <Select
                        value={formData.jobType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, jobType: value })
                        }
                      >
                        <SelectTrigger data-testid="job-type-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input
                      id="salary"
                      data-testid="job-salary-input"
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                      placeholder="e.g. $100,000 - $130,000"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      data-testid="job-description-input"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Job description..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    data-testid="cancel-add-button"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddJob}
                    data-testid="submit-add-button"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add Job
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="shadow-md border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-lg">Filters</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-10"
                  data-testid="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                <SelectTrigger data-testid="job-type-filter">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger data-testid="location-filter">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600" data-testid="job-count">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </p>
              {(searchTerm || statusFilter !== "all" || jobTypeFilter !== "all" || locationFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setJobTypeFilter("all");
                    setLocationFilter("all");
                  }}
                  data-testid="clear-filters-button"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your filters or add a new job posting
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-lg transition-all duration-300 border-gray-200 bg-white"
                data-testid={`job-card-${job.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2" data-testid={`job-title-${job.id}`}>
                        {job.title}
                      </CardTitle>
                      <CardDescription className="text-base font-medium text-gray-700">
                        {job.company}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(job)}
                        data-testid={`edit-job-${job.id}`}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(job)}
                        data-testid={`delete-job-${job.id}`}
                        className="h-8 w-8 p-0 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.jobType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{job.applicants} applicants</span>
                  </div>
                  <div className="pt-2">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                        job.status
                      )}`}
                      data-testid={`job-status-${job.id}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 pt-2">
                    {job.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update the job posting details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Job Title</Label>
              <Input
                id="edit-title"
                data-testid="edit-job-title-input"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-company">Company</Label>
              <Input
                id="edit-company"
                data-testid="edit-job-company-input"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                data-testid="edit-job-location-input"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger data-testid="edit-job-status-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-jobType">Job Type</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, jobType: value })
                  }
                >
                  <SelectTrigger data-testid="edit-job-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-salary">Salary Range</Label>
              <Input
                id="edit-salary"
                data-testid="edit-job-salary-input"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                data-testid="edit-job-description-input"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              data-testid="cancel-edit-button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditJob}
              data-testid="submit-edit-button"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the job posting for{" "}
              <span className="font-semibold">{selectedJob?.title}</span> at{" "}
              <span className="font-semibold">{selectedJob?.company}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancel-delete-button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteJob}
              data-testid="confirm-delete-button"
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobManagement;
