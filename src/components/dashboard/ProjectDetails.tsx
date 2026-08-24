import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  GetProjectHierarchy,
  GetBudgetDashboardDetails,
} from "../../service/projectmaster";

const ProjectDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const project = location.state?.project;

  const [loading, setLoading] = useState(false);
  const [departmentData, setDepartmentData] = useState<any[]>([]);

  useEffect(() => {
    if (!project?.projectId) return;

    loadProjectData();
  }, [project]);

  const loadProjectData = async () => {
    try {
      setLoading(true);

      const hierarchyResponse = await GetProjectHierarchy(project.projectId);

      const detailPromises = hierarchyResponse.map(async (dept: any) => {
        const details = await GetBudgetDashboardDetails(
          project.projectId,
          dept.deptId,
        );

        return {
          hierarchy: dept,
          details: details || [],
        };
      });

      const result = await Promise.all(detailPromises);

      setDepartmentData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const value = status?.toLowerCase() || "";

    if (value.includes("approved")) return "badge-success";

    if (value.includes("pending")) return "badge-warning";

    if (value.includes("reject")) return "badge-error";

    return "badge-info";
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl w-full max-w-md">
          <div className="card-body text-center">
            <h2 className="card-title justify-center text-error">
              Project Not Found
            </h2>

            <p>Unable to load project details.</p>

            <button
              className="btn btn-primary mt-4"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      <div className="max-w-full space-y-6">
        {/* Header */}

        <div className="hero bg-primary text-primary-content rounded-3xl shadow-xl">
          <div className="hero-content w-full flex-col">
            <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">{project.projectName}</h1>

                <p className="opacity-80 mt-1">
                  Project ID : {project.projectId}
                </p>
              </div>

              <div
                className={`badge badge-lg ${getStatusBadgeClass(
                  project.status,
                )}`}
              >
                {project.status}
              </div>
            </div>

            <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 text-base-content w-full mt-6">
              <div className="stat">
                <div className="stat-title">Financial Year</div>

                <div className="stat-value text-lg">
                  {project.financialYear}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Project Type</div>

                <div className="stat-value text-lg">
                  {project.projectTypeDesc}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Status</div>

                <div className="stat-value text-lg">{project.status}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Departments</div>

                <div className="stat-value text-lg">
                  {departmentData.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}

        {loading && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {/* Department Details */}

        {!loading &&
          departmentData.map((deptBlock: any, index: number) => {
            const hierarchyInfo = deptBlock.hierarchy;

            return (
              <div
                key={index}
                className="collapse collapse-arrow bg-base-100 shadow-xl border border-base-300"
              >
                <input type="checkbox" defaultChecked={index === 0} />

                <div className="collapse-title">
                  <div className="flex justify-between items-center pr-6">
                    <div>
                      <h2 className="text-xl font-bold">
                        {hierarchyInfo.deptName}
                      </h2>

                      <p className="text-sm opacity-70">
                        Approval Flow & Budget Details
                      </p>
                    </div>

                    <div className="badge badge-primary badge-outline">
                      {deptBlock.details.length} Record(s)
                    </div>
                  </div>
                </div>

                <div className="collapse-content space-y-6">
                  {/* Approval Hierarchy */}

                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="card-title">Approval Hierarchy</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        <div className="stat bg-base-100 rounded-box shadow">
                          <div className="stat-title">Maker</div>

                          <div className="stat-value text-base">
                            {hierarchyInfo.makerId}
                          </div>
                        </div>

                        <div className="stat bg-base-100 rounded-box shadow">
                          <div className="stat-title">Approver 1</div>

                          <div className="stat-value text-base">
                            {hierarchyInfo.approver1}
                          </div>
                        </div>

                        <div className="stat bg-base-100 rounded-box shadow">
                          <div className="stat-title">Approver 2</div>

                          <div className="stat-value text-base">
                            {hierarchyInfo.approver2}
                          </div>
                        </div>

                        <div className="stat bg-base-100 rounded-box shadow">
                          <div className="stat-title">Approver 3</div>

                          <div className="stat-value text-base">
                            {hierarchyInfo.approver3 || "-"}
                          </div>
                        </div>
                      </div>

                      <div className="stats shadow mt-4">
                        <div className="stat">
                          <div className="stat-title">Project Status</div>

                          <div className="stat-value text-lg">
                            {hierarchyInfo.projectStatus || "-"}
                          </div>
                        </div>

                        <div className="stat">
                          <div className="stat-title">Pending With</div>

                          <div className="stat-value text-lg">
                            {hierarchyInfo.pendingWith || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Budget Records Table */}

                  <div className="card bg-base-100 border border-base-300">
                    <div className="card-body">
                      <div className="flex justify-between items-center">
                        <h3 className="card-title">Budget Details</h3>

                        <div className="badge badge-secondary">
                          {deptBlock.details.length} Rows
                        </div>
                      </div>

                      {deptBlock.details.length === 0 ? (
                        <div className="alert mt-4">
                          <span>No Budget Details Found</span>
                        </div>
                      ) : (
                        <div className="overflow-x-auto border rounded-xl mt-4">
                          <table className="table table-zebra table-sm">
                            <thead>
                              <tr>
                                <th>#</th>

                                {Object.keys(deptBlock.details[0]).map(
                                  (key) => (
                                    <th key={key}>
                                      {key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase(),
                                        )}
                                    </th>
                                  ),
                                )}
                              </tr>
                            </thead>

                            <tbody>
                              {deptBlock.details.map(
                                (record: any, rowIndex: number) => (
                                  <tr key={rowIndex}>
                                    <td>{rowIndex + 1}</td>

                                    {Object.keys(deptBlock.details[0]).map(
                                      (key) => (
                                        <td
                                          key={key}
                                          className="whitespace-nowrap"
                                        >
                                          {record[key] === null ||
                                          record[key] === undefined ||
                                          record[key] === ""
                                            ? "-"
                                            : String(record[key])}
                                        </td>
                                      ),
                                    )}
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ProjectDetails;
