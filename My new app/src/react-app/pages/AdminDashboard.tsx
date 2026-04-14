import { useState, useEffect, useMemo, useRef } from "react";
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
  Building2,
  RefreshCw,
  BarChart3,
  Map,
  List,
  User,
  Users,
  ChevronDown,
} from "lucide-react";
import { Issue, fetchIssues, updateIssueStatus } from "@/shared/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ---------- Constants ----------
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

const DEPARTMENTS = [
  "Public Works Department",
  "Water Supply Department",
  "Sanitation Department",
  "Electrical Department",
  "Municipal Corporation",
  "General Administration",
];

const CHART_COLORS = [
  "#3B82F6",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6B7280",
];
const STATUS_COLORS: Record<string, string> = {
  Pending: "#F59E0B",
  "In Progress": "#3B82F6",
  Resolved: "#10B981",
};
const PRIORITY_COLORS: Record<string, string> = {
  High: "#EF4444",
  Medium: "#F97316",
  Low: "#10B981",
};

function suggestDepartment(category: string): string {
  const cat = (category || "").toLowerCase();
  if (
    cat.includes("pothole") ||
    cat.includes("sidewalk") ||
    cat.includes("traffic")
  )
    return "Public Works Department";
  if (cat.includes("water")) return "Water Supply Department";
  if (
    cat.includes("trash") ||
    cat.includes("graffiti") ||
    cat.includes("garbage")
  )
    return "Sanitation Department";
  if (
    cat.includes("streetlight") ||
    cat.includes("electric") ||
    cat.includes("light")
  )
    return "Electrical Department";
  if (cat.includes("noise") || cat.includes("parking"))
    return "Municipal Corporation";
  return "General Administration";
}

function getDeptColor(dept: string): string {
  switch (dept) {
    case "Public Works Department":
      return "bg-blue-50 border-blue-200 text-blue-700";
    case "Water Supply Department":
      return "bg-cyan-50 border-cyan-200 text-cyan-700";
    case "Sanitation Department":
      return "bg-green-50 border-green-200 text-green-700";
    case "Electrical Department":
      return "bg-yellow-50 border-yellow-200 text-yellow-700";
    case "Municipal Corporation":
      return "bg-purple-50 border-purple-200 text-purple-700";
    default:
      return "bg-gray-50 border-gray-200 text-gray-700";
  }
}

function getPriorityColor(priority: string): string {
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
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------- Map View Component ----------
declare global {
  interface Window {
    L: any;
  }
}

function IssuesMapView({ issues }: { issues: Issue[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => {
      const L = window.L;
      const validIssues = issues.filter((i) => i.latitude && i.longitude);
      const centerLat =
        validIssues.length > 0
          ? validIssues.reduce((s, i) => s + i.latitude, 0) / validIssues.length
          : 12.9716;
      const centerLng =
        validIssues.length > 0
          ? validIssues.reduce((s, i) => s + i.longitude, 0) /
            validIssues.length
          : 77.5946;

      const map = L.map(mapRef.current).setView([centerLat, centerLng], 12);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      validIssues.forEach((issue) => {
        const color =
          issue.priority === "High"
            ? "#EF4444"
            : issue.priority === "Medium"
              ? "#F59E0B"
              : "#10B981";
        const marker = L.circleMarker([issue.latitude, issue.longitude], {
          radius: 8,
          fillColor: color,
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        }).addTo(map);
        marker.bindPopup(`
          <div style="min-width:180px">
            <b style="font-size:14px">${issue.category}</b><br/>
            <span style="color:#64748b;font-size:12px">${issue.description?.substring(0, 60)}...</span><br/>
            <br/>
            <span style="background:${color};color:white;padding:2px 8px;border-radius:9999px;font-size:11px">${issue.priority} Priority</span>
            &nbsp;
            <span style="background:#e2e8f0;color:#334155;padding:2px 8px;border-radius:9999px;font-size:11px">${issue.status}</span>
            <br/><br/>
            <span style="font-size:11px;color:#94a3b8">Reported ${(issue as any).reportCount || 1} time(s)</span>
          </div>
        `);
      });
    };
    document.head.appendChild(script);
  }, [issues]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="p-4 border-b border-slate-100 flex items-center gap-2">
        <Map className="w-5 h-5 text-blue-500" />
        <h2 className="font-semibold text-slate-800">Issues Map</h2>
        <span className="ml-auto text-xs text-slate-500">
          {issues.filter((i) => i.latitude && i.longitude).length} issues
          plotted
        </span>
      </div>
      <div ref={mapRef} style={{ height: 400 }} />
      <div className="p-3 flex gap-4 bg-slate-50 border-t border-slate-100">
        {[
          { label: "High", color: "#EF4444" },
          { label: "Medium", color: "#F59E0B" },
          { label: "Low", color: "#10B981" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-slate-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Analytics Component ----------
function AnalyticsView({ issues }: { issues: Issue[] }) {
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach((i) => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [issues]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach((i) => {
      counts[i.status] = (counts[i.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [issues]);

  const priorityData = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach((i) => {
      counts[i.priority] = (counts[i.priority] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [issues]);

  const deptData = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach((i) => {
      const dept = (i as any).assignedDepartment || "Unassigned";
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [issues]);

  return (
    <div className="mb-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" /> Issues by Category
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={categoryData}
              margin={{ top: 5, right: 10, bottom: 40, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-30}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" name="Issues" radius={[4, 4, 0, 0]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-green-500" /> Issues by Status
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={(props) => {
                  const { name, percent } = props;

                  if (!name || percent === undefined) return "";

                  return `${name} ${(percent * 100).toFixed(0)}%`;
                }}
              >
                {statusData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={STATUS_COLORS[entry.name] || CHART_COLORS[i]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-red-500" /> Issues by Priority
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={(props) => {
                  const { name, percent } = props;

                  if (!name || percent === undefined) return "";

                  return `${name} ${(percent * 100).toFixed(0)}%`;
                }}
              >
                {priorityData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={PRIORITY_COLORS[entry.name] || CHART_COLORS[i]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-500" /> Issues by
            Department
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={deptData}
              layout="vertical"
              margin={{ top: 5, right: 20, bottom: 5, left: 120 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 10 }}
                width={120}
              />
              <Tooltip />
              <Bar dataKey="value" name="Issues" radius={[0, 4, 4, 0]}>
                {deptData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Dashboard ----------
export default function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeView, setActiveView] = useState<"list" | "map" | "analytics">(
    "list",
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("In Progress");
  const [changingDept, setChangingDept] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchIssues();
        setIssues(data);
      } catch {
        setError("Failed to load issues.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const summary = useMemo(
    () => ({
      total: issues.length,
      pending: issues.filter((i) => i.status === "Pending").length,
      inProgress: issues.filter((i) => i.status === "In Progress").length,
      resolved: issues.filter((i) => i.status === "Resolved").length,
      highPriority: issues.filter((i) => i.priority === "High").length,
    }),
    [issues],
  );

  const filteredIssues = useMemo(
    () =>
      issues.filter((issue) => {
        const matchesSearch =
          searchQuery === "" ||
          issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchQuery.toLowerCase());
        return (
          matchesSearch &&
          (statusFilter === "All" || issue.status === statusFilter) &&
          (priorityFilter === "All" || issue.priority === priorityFilter) &&
          (categoryFilter === "All" ||
            issue.category.toLowerCase() === categoryFilter.toLowerCase())
        );
      }),
    [issues, searchQuery, statusFilter, priorityFilter, categoryFilter],
  );

  const handleStatusUpdate = async (id: string, newStatus: Issue["status"]) => {
    if (!id || isNaN(Number(id))) return;
    try {
      await updateIssueStatus(id, newStatus);
      setIssues((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)),
      );
    } catch {
      setError("Failed to update status.");
    }
  };

  const handleConfirmDepartment = async (issue: Issue, dept: string) => {
    if (!issue.id || isNaN(Number(issue.id))) return;
    try {
      await fetch(`http://localhost:8080/api/issues/${issue.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: issue.status,
          priority: issue.priority,
          assignedDepartment: dept,
          departmentConfirmed: "true",
        }),
      });
      setIssues((prev) =>
        prev.map((i) =>
          i.id === issue.id
            ? ({
                ...i,
                assignedDepartment: dept,
                departmentConfirmed: true,
              } as any)
            : i,
        ),
      );
      setChangingDept((prev) => {
        const u = { ...prev };
        delete u[issue.id];
        return u;
      });
    } catch {
      setError("Failed to assign department.");
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    await Promise.all(
      ids.map((id) => updateIssueStatus(id, bulkStatus as Issue["status"])),
    );
    setIssues((prev) =>
      prev.map((i) =>
        selectedIds.has(i.id)
          ? { ...i, status: bulkStatus as Issue["status"] }
          : i,
      ),
    );
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredIssues.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredIssues.map((i) => i.id)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-1">
              Civic Issue Dashboard
            </h1>
            <p className="text-slate-600">
              Monitor and manage crowdsourced civic issues
            </p>
          </div>
          {/* View Toggle */}
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-sm">
            {[
              { id: "list", icon: <List className="w-4 h-4" />, label: "List" },
              { id: "map", icon: <Map className="w-4 h-4" />, label: "Map" },
              {
                id: "analytics",
                icon: <BarChart3 className="w-4 h-4" />,
                label: "Analytics",
              },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === v.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {v.icon} {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Total Issues",
              value: summary.total,
              icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
              color: "text-slate-800",
            },
            {
              label: "Pending",
              value: summary.pending,
              icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
              color: "text-amber-600",
            },
            {
              label: "In Progress",
              value: summary.inProgress,
              icon: <Clock className="w-5 h-5 text-blue-500" />,
              color: "text-blue-600",
            },
            {
              label: "Resolved",
              value: summary.resolved,
              icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
              color: "text-green-600",
            },
            {
              label: "High Priority",
              value: summary.highPriority,
              icon: <AlertCircle className="w-5 h-5 text-red-500" />,
              color: "text-red-600",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-600">
                  {card.label}
                </p>
                {card.icon}
              </div>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 min-w-0 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Filter className="w-4 h-4 text-slate-500 self-center" />
              {[
                {
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: ["All Status", "Pending", "In Progress", "Resolved"],
                },
                {
                  value: priorityFilter,
                  onChange: setPriorityFilter,
                  options: ["All Priority", "High", "Medium", "Low"],
                },
              ].map((sel, i) => (
                <select
                  key={i}
                  value={sel.value}
                  onChange={(e) => sel.onChange(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sel.options.map((o) => (
                    <option
                      key={o}
                      value={
                        o.includes(" ") &&
                        !["All Status", "All Priority"].includes(o)
                          ? o
                          : o
                              .replace("All Status", "All")
                              .replace("All Priority", "All")
                      }
                    >
                      {o}
                    </option>
                  ))}
                </select>
              ))}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {activeView === "list" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex items-center gap-4">
            <button
              onClick={toggleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <Users className="w-4 h-4" />
              {selectedIds.size === filteredIssues.length
                ? "Deselect All"
                : "Select All"}
            </button>
            {selectedIds.size > 0 && (
              <>
                <span className="text-sm text-slate-500">
                  {selectedIds.size} selected
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-slate-600 font-medium">
                    Bulk update to:
                  </span>
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <button
                    onClick={handleBulkUpdate}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" /> Apply
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Loading/Error */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            <p className="mt-2 text-slate-600">Loading issues...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Views */}
        {!loading && activeView === "analytics" && (
          <AnalyticsView issues={filteredIssues} />
        )}
        {!loading && activeView === "map" && (
          <IssuesMapView issues={filteredIssues} />
        )}

        {/* List View */}
        {!loading && activeView === "list" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => {
              const suggested = suggestDepartment(issue.category);
              const isConfirmed = (issue as any).departmentConfirmed === true;
              const assignedDept = (issue as any).assignedDepartment;
              const isChanging = changingDept[issue.id] !== undefined;
              const changeValue =
                changingDept[issue.id] || assignedDept || suggested;
              const reportCount = (issue as any).reportCount || 1;
              const isSelected = selectedIds.has(issue.id);

              return (
                <div
                  key={issue.id}
                  className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
                    isSelected
                      ? "border-blue-400 ring-2 ring-blue-100"
                      : issue.status === "Resolved"
                        ? "border-slate-100 opacity-75"
                        : "border-slate-200"
                  }`}
                >
                  <div className="p-6">
                    {/* Header with checkbox */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(issue.id)}
                          className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                        />
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            #{issue.id}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {issue.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {issue.status === "Resolved" && (
                          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            <Check className="w-3 h-3" /> Resolved
                          </span>
                        )}
                        {reportCount > 1 && (
                          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium">
                            {reportCount} reports
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-700 mb-4 text-sm leading-relaxed line-clamp-2">
                      {issue.description}
                    </p>

                    {/* Photos */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Photos
                      </label>
                      {(issue as any).imageUrls?.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={(issue as any).imageUrls[0]}
                            alt="Issue"
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          {(issue as any).imageUrls.length > 1 && (
                            <span className="text-xs text-slate-400">
                              +{(issue as any).imageUrls.length - 1}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <Image className="w-3 h-3" /> No image
                        </div>
                      )}
                    </div>

                    {/* Priority */}
                    <div className="mb-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(issue.priority)}`}
                      >
                        {issue.priority} Priority
                      </span>
                    </div>

                    {/* Department Assignment */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> Department
                      </label>
                      {isConfirmed && !isChanging ? (
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getDeptColor(assignedDept)}`}
                          >
                            <Check className="w-3 h-3" /> {assignedDept}
                          </span>
                          <button
                            onClick={() =>
                              setChangingDept((prev) => ({
                                ...prev,
                                [issue.id]: assignedDept,
                              }))
                            }
                            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" /> Reassign
                          </button>
                        </div>
                      ) : isChanging ? (
                        <div className="space-y-2">
                          <select
                            value={changeValue}
                            onChange={(e) =>
                              setChangingDept((prev) => ({
                                ...prev,
                                [issue.id]: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {DEPARTMENTS.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleConfirmDepartment(issue, changeValue)
                              }
                              className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Confirm
                            </button>
                            <button
                              onClick={() =>
                                setChangingDept((prev) => {
                                  const u = { ...prev };
                                  delete u[issue.id];
                                  return u;
                                })
                              }
                              className="flex-1 bg-slate-100 text-slate-600 text-xs py-1.5 rounded-lg hover:bg-slate-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                            <div>
                              <p className="text-xs text-blue-400">Suggested</p>
                              <p className="text-sm text-blue-700 font-semibold">
                                {suggested}
                              </p>
                            </div>
                            <Building2 className="w-4 h-4 text-blue-300" />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleConfirmDepartment(issue, suggested)
                              }
                              className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Confirm
                            </button>
                            <button
                              onClick={() =>
                                setChangingDept((prev) => ({
                                  ...prev,
                                  [issue.id]: suggested,
                                }))
                              }
                              className="flex-1 bg-slate-100 text-slate-600 text-xs py-1.5 rounded-lg hover:bg-slate-200"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
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
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col gap-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>
                          {issue.latitude.toFixed(4)},{" "}
                          {issue.longitude.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(issue.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5" />
                        <span className="truncate">
                          {(issue as any).userId
                            ? `Reporter: ${(issue as any).userId.substring(0, 12)}...`
                            : "Anonymous"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>
                          Reported {reportCount} time
                          {reportCount > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
