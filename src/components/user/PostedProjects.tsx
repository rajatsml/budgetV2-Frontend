import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import { GetUserProjects } from "../../service/projectmaster";

const PostedProjects = () => {
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

      const data = await GetUserProjects(user?.userId);

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

  const handleNavigation = (projectId: string) => {
    navigate(`/add-project-pd/${projectId}`);
  };

  return (
    <div className="ui-screen min-h-screen p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-sm font-bold">My Posted Projects</h1>

          <p className="mt-1 text-xs opacity-70">
            Total Projects: {filteredProjects.length}
          </p>
        </div>

        <input
          type="text"
          placeholder="Search Project..."
          className="input input-bordered input-sm w-full max-w-md"
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
        <div className="overflow-x-auto rounded border border-base-300 bg-base-100 shadow">
          <table className="table table-xs table-zebra min-w-max">
            <thead>
              <tr>
                <th>#</th>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Status</th>
                <th>Financial Year</th>
                <th>Duration (Estimated)</th>
                <th>Creation Date</th>
                <th>Modification Date</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((project: any, index: number) => (
                <tr key={project.projectId}>
                  <td>{index + 1}</td>

                  <td>
                    <span className="font-semibold ">{project.projectId}</span>
                  </td>

                  <td>
                    <div className="font-medium">{project.projectName}</div>
                  </td>

                  <td className="font-semibold">{project.status}</td>
                  <td>{project.financialYear}</td>

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
                  <td>{formatDate(project.createdAt)}</td>
                  <td>{formatDate(project.updatedAt)}</td>

                  <td>
                    <button
                      className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                      onClick={() => handleNavigation(project?.projectId)}
                    >
                      Project Details
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

export default PostedProjects;
