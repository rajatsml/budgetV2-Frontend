import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { GetProjects } from "../../service/projectmaster";

// 1. Interface matching the form fields from your image and list requirements

export interface ProjectItem {
  projectId: string;
  projectName: string;
  projectType: string;
  financialYear: string;

  projectScope: string;
  keyAssumptions: string;

  startDate?: string;
  endDate?: string;

  createdAt?: string;
  updatedAt?: string;

  createdBy: string;

  status: string;

  departments: ProjectDepartment[];
}

export interface ProjectDepartment {
  departmentId: number;
  departmentName: string;

  hierarchy: ProjectHierarchy;
}

export interface ProjectHierarchy {
  makerId: string;
  approver1: string;
  approver2: string;
  approver3: string;
}

interface ProjectListProps {
  onEdit?: (projectId: string) => void;
  onView?: (projectId: string) => void;
}

const AllProjects: React.FC<ProjectListProps> = ({ onEdit, onView }) => {
  const [search, setSearch] = useState<string>("");
  const [fyFilter, setFyFilter] = useState<string>("All");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get dynamic fiscal years for filter dropdown
  const fiscalYears = useMemo<string[]>(() => {
    const years = projects.map((p) => p.financialYear);
    return ["All", ...Array.from(new Set(years))];
  }, [projects]);

  // Filter projects by search string (ID/Name) and Fiscal Year
  const filteredProjects = useMemo<ProjectItem[]>(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.projectId?.toLowerCase().includes(search.toLowerCase()) ||
        project.projectName?.toLowerCase().includes(search.toLowerCase());

      const matchesFY =
        fyFilter === "All" || project.financialYear === fyFilter;

      return matchesSearch && matchesFY;
    });
  }, [projects, search, fyFilter]);

  // Status badge styling helper
  const getStatusStyle = (status: ProjectItem["status"]): string => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "Pending Approval":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);

      const data = await GetProjects();

      console.log("Projects API Response:", data);

      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full mx-auto p-6 bg-gray-50 min-h-screen ">
      {/* Search and Filters Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-1 gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search Project ID or Name..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="w-full sm:max-w-md px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={fyFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setFyFilter(e.target.value)
            }
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fiscalYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-500 self-end sm:self-center">
          Showing <strong>{filteredProjects.length}</strong> projects
        </div>
      </div>

      {/* Responsive Line Item Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-4 px-6">Project ID</th>
                <th className="py-4 px-6">Project Details</th>
                {/* <th className="py-4 px-6 text-center">Type</th> */}
                <th className="py-4 px-6 text-center">FY</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">
                    No active configurations found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr
                    key={project?.projectId}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Project ID */}
                    <td className="py-4 px-6 font-mono text-xs font-bold text-gray-900">
                      {project?.projectId}
                    </td>

                    {/* Project Name and Timeline */}
                    <td className="py-4 px-6 max-w-xs">
                      <div
                        className="font-semibold text-gray-900 truncate mb-1"
                        title={project?.projectName}
                      >
                        {project?.projectName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {project?.startDate
                          ? new Date(project.startDate).toLocaleDateString(
                              "en-GB",
                            )
                          : "-"}{" "}
                        to{" "}
                        {project?.endDate
                          ? new Date(project.endDate).toLocaleDateString(
                              "en-GB",
                            )
                          : "-"}
                      </div>
                    </td>

                    {/* Project Type */}
                    {/* <td className="py-4 px-6 text-center">
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-md">
                        {project.projectType}
                      </span>
                    </td> */}

                    {/* Fiscal Year */}
                    <td className="py-4 px-6 text-center font-xs text-gray-600">
                      {project.financialYear}
                    </td>

                    {/* Custom Status Tag */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </td>

                    {/* Actions Interactive Buttons */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => onView?.(project.projectId)}
                          className="px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onEdit?.(project.projectId)}
                          className="px-2.5 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
