import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import {
  InitializeNonPDMaster,
  InitializePDMaster,
  GetBudgetManagerProjects,
} from "../../service/projectmaster";

const WBSProjects = () => {
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

      const data = await GetBudgetManagerProjects(user?.userId);

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
    // projectTypeDesc: string,
    projectID: string,
    projectName: string,
    deptName: string,
    deptID: number,
    category: string,
    FyYear: string,
    projectType: string,
    makerId: string,
    approver1: string,
    approver2: string,
    approver3: string,
    projectCategoryName: string,
    isOngoing: boolean,
  ) => {
    let status = "";
    let pendingWithUser = "";

    try {
      let response: any = null;

      if (projectType === "2") {
        response = await InitializePDMaster({
          ProjectId: projectID,
          DeptId: deptID?.toString(),
          FyYear: FyYear,
          CategoryId: projectType,
          UserId: user?.userId,
        });
      } else if (projectType === "3") {
        response = await InitializeNonPDMaster({
          ProjectId: projectID,
          DeptId: deptID?.toString(),
          FyYear: FyYear,
          CategoryId: projectType,
          UserId: user?.userId,
        });
      }

      status = response.status;
      pendingWithUser = response.pendingWithUser;
    } catch (err: any) {
      status = err?.response?.data?.status;
      pendingWithUser = err?.response?.data?.pendingWithUser;

      console.error("Initialization error:", err);
    }

    navigate("/wbs-actual-spent", {
      state: {
        projectType,
        projectName,
        projectID,
        deptName,
        deptID,
        category,
        FyYear,
        makerId,
        approver1,
        approver2,
        approver3,
        status,
        pendingWithUser,
        projectCategoryName,
        isOngoing: isOngoing,
      },
    });
  };
  return (
    <div className="ui-screen min-h-screen p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-sm font-bold">Actual Spent</h1>

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
                <th>Type</th>
                <th>Financial Year</th>
                <th>Dept</th>
                <th>Project</th>
                <th>Duration</th>
                <th>Project Status</th>
                {/* <th>Pending With</th> */}
                {/* <th>Created By</th> */}
                <th>Action</th>
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

                  <td>
                    <div className="badge badge-neutral">
                      {project?.projectTypeDesc}
                    </div>
                  </td>

                  <td>{project.financialYear}</td>
                  <td>{project.departmentName}</td>

                  <td>
                    <div
                      className="max-w-xs truncate font-semibold"
                      title={project.isOngoing ? `(Ongoing)` : "New"}
                    >
                      {project.isOngoing ? `(Ongoing)` : "New"}
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

                  <td className="text-xs">
                    {project.deptProjectStatus === "APPROVED"
                      ? "APPROVED"
                      : `${project.deptProjectStatus || "OPENED"} - ${
                          project.pendingWithUserName || project.makerId || ""
                        }`}
                  </td>

                  <td>
                    <button
                      className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                      onClick={() =>
                        handleNavigation(
                          // project?.projectTypeDesc,
                          project?.projectId,
                          project?.projectName,
                          project?.departmentName,
                          project?.departmentId,
                          project?.projectTypeDesc,
                          project?.financialYear,
                          project?.projectType,
                          project?.makerId,
                          project?.approver1,
                          project?.approver2,
                          project?.approver3,
                          project?.projectCategoryName,
                          project?.isOngoing,
                        )
                      }
                    >
                      Actual Spent
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

export default WBSProjects;
