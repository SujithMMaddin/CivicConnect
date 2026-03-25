import { useState, useEffect, useMemo } from "react";
import {
  Check,
  MapPin,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Search,
  Filter,
  Image,
} from "lucide-react";
import { Issue, fetchIssues, updateIssueStatus } from "@/shared/api";

const CATEGORIES = [
  { value: "Pothole", label: "Pothole" },
  { value: "Streetlight", label: "Street Light" },
  { value: "Water", label: "Water" },
  { value: "Trash", label: "Trash" },
  { value: "Graffiti", label: "Graffiti" },
  { value: "Traffic Sign", label: "Traffic Sign" },
  { value: "Sidewalk", label: "Sidewalk" },
  { value: "Parking", label: "Parking" },
  { value: "Noise", label: "Noise" },
  { value: "Other", label: "Other" },
];

export default function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true);
        const data = await fetchIssues();
        setIssues(data);
        setError(null);
      } catch (err) {
        setError("Failed to load issues. Please try again later.");
        console.error("Error loading issues:", err);
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  const summary = useMemo(() => {
    const total = issues.length;
    const pending = issues.filter((i) => i.status === "Pending").length;
    const inProgress = issues.filter((i) => i.status === "In Progress").length;
    const resolved = issues.filter((i) => i.status === "Resolved").length;
    const highPriority = issues.filter((i) => i.priority === "High").length;

    return { total, pending, inProgress, resolved, highPriority };
  }, [issues]);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch =
        searchQuery === "" ||
        issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || issue.status === statusFilter;
      const matchesPriority =
        priorityFilter === "All" || issue.priority === priorityFilter;
      const matchesCategory =
        categoryFilter === "All" ||
        issue.category.toLowerCase() === categoryFilter.toLowerCase();

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesCategory
      );
    });
  }, [issues, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const handleStatusUpdate = async (
    id: string,
    newStatus: Issue["status"],
  ) => {
    if (!id || id === "undefined" || isNaN(Number(id))) {
      console.error("Invalid issue ID:", id);
      setError("Invalid issue ID. Please refresh and try again.");
      return;
    }

    try {
      await updateIssueStatus(id, newStatus);
      // Update local state
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === id ? { ...issue, status: newStatus } : issue,
        ),
      );
    } catch (err) {
      setError("Failed to update issue status. Please try again.");
      console.error("Error updating issue status:", err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-50 border-red-200 text-red-700";
      case "Medium":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "Low":
        return "bg-green-50 border-green-200 text-green-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Civic Issue Dashboard
          </h1>
          <p className="text-slate-600">
            Monitor and manage crowdsourced civic issues
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">Total Issues</p>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{summary.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">Pending</p>
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-amber-600">
              {summary.pending}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">In Progress</p>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {summary.inProgress}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">Resolved</p>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {summary.resolved}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">
                High Priority
              </p>
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">
              {summary.highPriority}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by issue ID, category, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-600">
                  Filters:
                </span>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-slate-600">Loading issues...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                issue.status === "Resolved" ? "opacity-75 bg-slate-50" : ""
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">
                      {issue.id}
                    </h3>
                    <p className="text-sm text-slate-500">{issue.category}</p>
                  </div>
                  {issue.status === "Resolved" && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-medium">Resolved</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-slate-700 mb-4 text-sm leading-relaxed">
                  {issue.description}
                </p>

                {/* Photos Section */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-600 mb-2">
                    Photos
                  </label>
                  {issue.imageUrls && issue.imageUrls.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        <img
                          src={issue.imageUrls[0]}
                          alt="Issue photo"
                          className="w-20 h-20 object-cover rounded-md transition-transform duration-200 group-hover:scale-110"
                        />
                      </div>
                      {issue.imageUrls.length > 1 && (
                        <span className="text-xs text-slate-500 font-medium">
                          +{issue.imageUrls.length - 1} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Image className="w-4 h-4" />
                      <span>No Image</span>
                    </div>
                  )}
                </div>

                {/* Priority Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(issue.priority)}`}
                  >
                    {issue.priority} Priority
                  </span>
                </div>

                {/* Status Dropdown */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-600 mb-2">
                    Status
                  </label>
                  <select
                    value={issue.status}
                    onChange={(e) =>
                      handleStatusUpdate(
                        issue.id,
                        e.target.value as Issue["status"],
                      )
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                {/* Meta Information */}
                <div className="flex flex-col gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(issue.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
