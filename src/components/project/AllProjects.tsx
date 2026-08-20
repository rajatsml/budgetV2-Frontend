import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { GetProjects } from "../../service/projectmaster";

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
  const [search, setSearch] = useState("");
  const [fyFilter, setFyFilter] = useState("All");
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);

      const data = await GetProjects();

      console.log("Projects API Response:", data);

      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fiscalYears = useMemo(() => {
    const years = projects.map((p) => p.financialYear).filter(Boolean);

    return ["All", ...Array.from(new Set(years))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        project.projectId?.toLowerCase().includes(searchValue) ||
        project.projectName?.toLowerCase().includes(searchValue) ||
        project.status?.toLowerCase().includes(searchValue) ||
        project.financialYear?.toLowerCase().includes(searchValue);

      const matchesFY =
        fyFilter === "All" || project.financialYear === fyFilter;

      return matchesSearch && matchesFY;
    });
  }, [projects, search, fyFilter]);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Projects</h1>

          <p className="text-sm opacity-70 mt-1">
            Total Projects: {filteredProjects.length}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search Project..."
            className="input input-bordered w-full lg:w-80"
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={fyFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setFyFilter(e.target.value)
            }
            className="select select-bordered"
          >
            {fiscalYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="alert">
          <span>No projects found.</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow">
          <table className="table table-zebra table-pin-rows">
            <thead>
              <tr>
                <th>#</th>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Financial Year</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((project, index) => (
                <tr key={project.projectId}>
                  <td>{index + 1}</td>

                  <td>
                    <span className="font-semibold">{project.projectId}</span>
                  </td>

                  <td>
                    <div
                      className="font-medium max-w-xs truncate"
                      title={project.projectName}
                    >
                      {project.projectName}
                    </div>
                  </td>

                  <td>{project.financialYear}</td>

                  <td>
                    <div className="badge badge-neutral">{project.status}</div>
                  </td>

                  <td>
                    <div className="text-xs">
                      <div>
                        <strong>Start:</strong> {formatDate(project.startDate)}
                      </div>

                      <div>
                        <strong>End:</strong> {formatDate(project.endDate)}
                      </div>
                    </div>
                  </td>

                  <td>{project.createdBy}</td>

                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => onView?.(project.projectId)}
                      >
                        View
                      </button>
                      {/* 
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onEdit?.(project.projectId)}
                      >
                        Edit
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllProjects;
