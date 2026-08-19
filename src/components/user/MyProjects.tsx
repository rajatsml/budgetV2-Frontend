import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import { GetProjects, InitializePDMaster } from "../../service/projectmaster";

const MyProjects = () => {
  const navigate = useNavigate();

  const user = useUserStore((s: any) => s.user);

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const data = await GetProjects();

      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchProjects();
    }
  }, [user]);

  const filteredProjects = useMemo(() => {
    if (!searchText.trim()) {
      return projects;
    }

    const search = searchText.toLowerCase();

    return projects.filter(
      (project) =>
        project.projectId?.toLowerCase().includes(search) ||
        project.projectName?.toLowerCase().includes(search) ||
        project.financialYear?.toLowerCase().includes(search) ||
        project.status?.toLowerCase().includes(search),
    );
  }, [projects, searchText]);

  const handleNavigation = async (
    projectTypeDesc: string,
    projectID: string,
    projectName: string,
    deptName: string,
    deptID: number,
    category: string,
    FyYear: string,
    projectType: string,
  ) => {
    try {
      await InitializePDMaster({
        ProjectId: projectID,
        DeptId: deptID?.toString(),
        FyYear: FyYear,
        CategoryId: projectType,
        UserId: user?.userId,
      });
    } catch (err) {
      console.error("Initialization error:", err);
    }

    if (projectTypeDesc === "PD") {
      navigate("/pd-project", {
        state: {
          projectType,
          projectName,
          projectID,
          deptName,
          deptID,
          category,
          FyYear,
        },
      });
    } else if (projectTypeDesc === "Non PD") {
      navigate("/nonpd-project", {
        state: {
          projectType,
          projectName,
          projectID,
          deptName,
          deptID,
          category,
          FyYear,
        },
      });
    } else navigate("/");
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Projects</h1>

          <p className="text-sm opacity-70 mt-1">
            Total Projects: {filteredProjects.length}
          </p>
        </div>

        <input
          type="text"
          placeholder="Search Project..."
          className="input input-bordered w-full max-w-md"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
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
                <th>Type</th>
                <th>Financial Year</th>
                <th>Project Scope</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((project: any, index: number) => (
                <tr key={project.projectId}>
                  <td>{index + 1}</td>

                  <td>
                    <span className="font-semibold text-primary">
                      {project.projectId}
                    </span>
                  </td>

                  <td>
                    <div className="font-medium">{project.projectName}</div>
                  </td>

                  <td>
                    <div
                      className={`badge ${
                        project.projectType === "1"
                          ? "badge-info"
                          : "badge-secondary"
                      }`}
                    >
                      {project?.projectTypeDesc}
                    </div>
                  </td>

                  <td>{project.financialYear}</td>

                  <td>
                    <div
                      className="max-w-xs truncate"
                      title={project.projectScope}
                    >
                      {project.projectScope}
                    </div>
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

                  <td>
                    <div
                      className={`badge ${
                        project.status === "Posted"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {project.status}
                    </div>
                  </td>

                  <td>{project.createdBy}</td>

                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        handleNavigation(
                          project?.projectTypeDesc,
                          project?.projectId,
                          project?.projectName,
                          project?.departmentName,
                          project?.deptId,
                          project?.projectTypeDesc,
                          project?.financialYear,
                          project?.projectType,
                        )
                      }
                    >
                      View Details
                    </button>
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

export default MyProjects;
