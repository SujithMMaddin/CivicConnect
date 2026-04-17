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
} from "lucide-react";
import { Issue, fetchIssues, updateIssueStatus } from "@/shared/api";

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

// ---------- Issue Detail Modal ----------
function IssueDetailModal({
  issue,
  onClose,
}: {
  issue: Issue | null;
  onClose: () => void;
}) {
  if (!issue) return null;

  const reportCount = (issue as any).reportCount || 1;
  const userId = (issue as any).userId;
  const assignedDept = (issue as any).assignedDepartment || "Not assigned";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Issue #{issue.id}
            </h2>
            <p className="text-sm text-slate-500">{issue.category}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status + Priority + Report count */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(issue.priority)}`}
            >
              {issue.priority} Priority
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                issue.status === "Resolved"
                  ? "bg-green-100 text-green-700"
                  : issue.status === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {issue.status}
            </span>
            {reportCount > 1 && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                {reportCount} reports
              </span>
            )}
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Description
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Reporter Info */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-3 flex items-center gap-1">
              <User className="w-3 h-3" /> Reporter Information
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">User ID</span>
                <span className="text-xs font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 max-w-[200px] truncate">
                  {userId ? userId : "Anonymous"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Name</span>
                <span className="text-xs font-medium text-slate-700">
                  {(issue as any).userName || "Not available"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Email</span>
                <span className="text-xs font-medium text-slate-700">
                  {(issue as any).userEmail || "Not available"}
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <p className="text-xs font-semibold text-green-500 uppercase tracking-wide mb-3 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location Details
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Latitude</span>
                <span className="text-xs font-mono text-slate-700">
                  {issue.latitude?.toFixed(6)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Longitude</span>
                <span className="text-xs font-mono text-slate-700">
                  {issue.longitude?.toFixed(6)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs text-slate-500 flex-shrink-0">
                  Address
                </span>
                <span className="text-xs text-slate-700 text-right">
                  {(issue as any).address ||
                    `Lat: ${issue.latitude?.toFixed(4)}, Lng: ${issue.longitude?.toFixed(4)}`}
                </span>
              </div>
              <a
                href={`https://www.openstreetmap.org/?mlat=${issue.latitude}&mlon=${issue.longitude}&zoom=16`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1 font-medium"
              >
                <Map className="w-3 h-3" /> View on OpenStreetMap →
              </a>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-3 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Date & Time
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Reported On</span>
                <span className="text-xs font-medium text-slate-700">
                  {new Date(issue.createdAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Time</span>
                <span className="text-xs font-medium text-slate-700">
                  {new Date(issue.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Department */}
          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Department
              </span>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-lg border ${getDeptColor(assignedDept)}`}
            >
              {assignedDept}
            </span>
          </div>

          {/* Photos */}
          {(issue as any).imageUrls?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Photos
              </p>
              <div className="flex gap-2 flex-wrap">
                {(issue as any).imageUrls.map((url: string, i: number) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Issue photo ${i + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
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
            <span style="color:#64748b;font-size:12px">${issue.description?.substring(0, 60)}...</span><br/><br/>
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
      const cat =
        i.category?.charAt(0).toUpperCase() + i.category?.slice(1) || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [issues]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach((i) => {
      counts[i.status || "Pending"] = (counts[i.status || "Pending"] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [issues]);

  const priorityData = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach((i) => {
      counts[i.priority || "Medium"] =
        (counts[i.priority || "Medium"] || 0) + 1;
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

  if (issues.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center mb-8">
        <p className="text-slate-500 font-medium">No data available</p>
      </div>
    );
  }

  const maxCategory = Math.max(...categoryData.map((d) => d.value));
  const maxDept = Math.max(...deptData.map((d) => d.value));
  const total = issues.length;

  return (
    <div className="mb-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" /> Issues by Category
          </h3>
          <div className="space-y-3">
            {categoryData.map((item, i) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">
                    {item.name}
                  </span>
                  <span className="text-slate-500">{item.value}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.value / maxCategory) * 100}%`,
                      backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Donut */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-green-500" /> Issues by Status
          </h3>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                {(() => {
                  let offset = 0;
                  return statusData.map((item, i) => {
                    const pct = (item.value / total) * 100;
                    const color = STATUS_COLORS[item.name] || CHART_COLORS[i];
                    const el = (
                      <circle
                        key={item.name}
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke={color}
                        strokeWidth="3.5"
                        strokeDasharray={`${pct} ${100 - pct}`}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += pct;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-800">
                  {total}
                </span>
                <span className="text-xs text-slate-500">Total</span>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {statusData.map((item, i) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          STATUS_COLORS[item.name] || CHART_COLORS[i],
                      }}
                    />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {item.value}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({((item.value / total) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Donut */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-red-500" /> Issues by Priority
          </h3>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                {(() => {
                  let offset = 0;
                  return priorityData.map((item, i) => {
                    const pct = (item.value / total) * 100;
                    const color = PRIORITY_COLORS[item.name] || CHART_COLORS[i];
                    const el = (
                      <circle
                        key={item.name}
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke={color}
                        strokeWidth="3.5"
                        strokeDasharray={`${pct} ${100 - pct}`}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += pct;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-800">
                  {total}
                </span>
                <span className="text-xs text-slate-500">Total</span>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {priorityData.map((item, i) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          PRIORITY_COLORS[item.name] || CHART_COLORS[i],
                      }}
                    />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {item.value}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({((item.value / total) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-500" /> Issues by
            Department
          </h3>
          <div className="space-y-3">
            {deptData.map((item, i) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium truncate max-w-[180px]">
                    {item.name}
                  </span>
                  <span className="text-slate-500">{item.value}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.value / maxDept) * 100}%`,
                      backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Dashboard ----------
export default function AdminDashboard() {
  const [sortNewest, setSortNewest] = useState(true);
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
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

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

  const filteredIssues = useMemo(() => {
    let data = issues.filter((issue) => {
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
    });

    // 🔥 SORT LOGIC
    data.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortNewest ? dateB - dateA : dateA - dateB;
    });

    return data;
  }, [
    issues,
    searchQuery,
    statusFilter,
    priorityFilter,
    categoryFilter,
    sortNewest,
  ]);

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
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setSortNewest(true)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                    sortNewest
                      ? "bg-white shadow text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Newest
                </button>

                <button
                  onClick={() => setSortNewest(false)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                    !sortNewest
                      ? "bg-white shadow text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Oldest
                </button>
              </div>
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
                  onClick={() => setSelectedIssue(issue)}
                  className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 hover:shadow-md hover:scale-[1.01] cursor-pointer ${
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
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelect(issue.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
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
                    <div className="mb-3" onClick={(e) => e.stopPropagation()}>
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
                    <div className="mb-4" onClick={(e) => e.stopPropagation()}>
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

                    {/* Click hint */}
                    <div className="mt-3 pt-3 border-t border-slate-100 text-center">
                      <span className="text-xs text-blue-400 font-medium">
                        Click card to view full details →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />
    </div>
  );
}
