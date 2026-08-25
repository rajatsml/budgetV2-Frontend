import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Layers,
  TableProperties,
  AlertCircle,
} from "lucide-react";
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

  const hiddenKeys = [
    "nonPDDetailId",
    "projectId",
    "recordId",
    "isDeleted",
    "draftStatus",
    "id",
    "deletedAt",
    "deletedBy",
    "pdDetailId",
  ];

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
    if (value.includes("approved"))
      return "bg-green-100 text-green-800 border-green-200";
    if (value.includes("pending"))
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (value.includes("reject"))
      return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="bg-white shadow rounded-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Project Not Found
          </h2>
          <p className="text-gray-500 mb-5">
            Unable to load project context parameters.
          </p>
          <button
            className="btn btn-neutral w-full"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-200 min-h-screen p-4 space-y-4">
      {/* Header Bar */}
      <div className="rounded p-4 flex items-center justify-between bg-white shadow">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-red-100 rounded text-gray-800">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-800">
              Project Workspace
            </h1>
            <p className="text-xs font-medium text-gray-500">
              ID: {project.projectId}
            </p>
          </div>
        </div>
        <button
          className="btn btn-neutral btn-sm flex items-center gap-1.5"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      {/* Statistics & Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded shadow p-4">
          <div className="text-xs font-medium text-gray-500 mb-1">
            Project Name
          </div>
          <div className="text-lg font-bold text-gray-800 truncate">
            {project.projectName}
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <div className="text-xs font-medium text-gray-500 mb-1">
            Financial Year
          </div>
          <div className="text-lg font-bold text-gray-800">
            FY {project.financialYear}
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <div className="text-xs font-medium text-gray-500 mb-1">
            Project Type
          </div>
          <div className="text-lg font-bold text-gray-800">
            {project.projectTypeDesc || "Standard"}
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <div className="text-xs font-medium text-gray-500 mb-1">Status</div>
          <div className="mt-1">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(project.status)}`}
            >
              {project.status}
            </span>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <div className="text-xs font-medium text-gray-500 mb-1">
            Linked Departments
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {departmentData.length}
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-20 bg-white rounded shadow">
          <span className="loading loading-spinner loading-lg text-neutral" />
        </div>
      )}

      {/* Department Blocks */}
      {!loading &&
        departmentData.map((deptBlock: any, index: number) => {
          const hierarchyInfo = deptBlock.hierarchy;

          return (
            <div
              key={index}
              className="bg-white rounded shadow overflow-hidden border border-gray-100"
            >
              {/* Department Section Header */}
              <div className="px-4 py-3 bg-gray-50 border-b border-slate-300 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gray-600" />
                  <h2 className="font-bold text-base text-gray-800">
                    {hierarchyInfo.deptName}
                  </h2>
                </div>
                <span className="text-xs bg-neutral text-white px-2 py-0.5 rounded font-medium">
                  {deptBlock.details.length} Records Available
                </span>
              </div>

              <div className="p-4 space-y-6">
                {/* Approval Hierarchy Structural Grid */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Approval Hierarchy
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="p-3 bg-base-200 rounded border border-gray-100">
                      <div className="text-[10px] uppercase font-semibold text-gray-500">
                        Maker
                      </div>
                      <div className="text-sm font-medium text-gray-800 mt-0.5">
                        {hierarchyInfo.makerId || "-"}
                      </div>
                    </div>
                    <div className="p-3 bg-base-200 rounded border border-gray-100">
                      <div className="text-[10px] uppercase font-semibold text-gray-500">
                        Approver 1
                      </div>
                      <div className="text-sm font-medium text-gray-800 mt-0.5">
                        {hierarchyInfo.approver1 || "-"}
                      </div>
                    </div>
                    <div className="p-3 bg-base-200 rounded border border-gray-100">
                      <div className="text-[10px] uppercase font-semibold text-gray-500">
                        Approver 2
                      </div>
                      <div className="text-sm font-medium text-gray-800 mt-0.5">
                        {hierarchyInfo.approver2 || "-"}
                      </div>
                    </div>
                    <div className="p-3 bg-base-200 rounded border border-gray-100">
                      <div className="text-[10px] uppercase font-semibold text-gray-500">
                        Approver 3
                      </div>
                      <div className="text-sm font-medium text-gray-800 mt-0.5">
                        {hierarchyInfo.approver3 || "-"}
                      </div>
                    </div>
                    <div className="p-3 bg-base-200 rounded border border-gray-100">
                      <div className="text-[10px] uppercase font-semibold text-gray-500">
                        Project Status
                      </div>
                      <div className="text-sm font-medium text-gray-800 mt-0.5">
                        {hierarchyInfo.projectStatus || "-"}
                      </div>
                    </div>
                    <div className="p-3 bg-base-200 rounded border border-gray-100">
                      <div className="text-[10px] uppercase font-semibold text-gray-500">
                        Pending With
                      </div>
                      <div className="text-sm font-medium text-gray-800 mt-0.5">
                        {hierarchyInfo.pendingWith || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Budget Data Matrix */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <TableProperties className="w-4 h-4 text-gray-500" />
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Budget Details
                    </h3>
                  </div>

                  {deptBlock.details.length === 0 ? (
                    <div className="p-4 text-center border border-dashed rounded-lg text-sm text-gray-500 bg-gray-50">
                      No active ledger mappings found for this functional group.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                      <table className="table table-zebra table-sm w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-gray-700">
                            <th className="font-semibold text-xs py-2">#</th>
                            {Object.keys(deptBlock.details[0])
                              // Filter out hidden columns from the headers
                              .filter((key) => !hiddenKeys.includes(key))
                              .map((key) => (
                                <th
                                  key={key}
                                  className="font-semibold text-xs py-2"
                                >
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody>
                          {deptBlock.details.map(
                            (record: any, rowIndex: number) => {
                              // Filter the keys to exclude the hidden ones
                              const visibleKeys = Object.keys(
                                deptBlock.details[0],
                              ).filter((key) => !hiddenKeys.includes(key));

                              return (
                                <tr
                                  key={rowIndex}
                                  className="hover:bg-gray-50/50 transition-colors"
                                >
                                  <td className="font-medium text-gray-500 text-xs">
                                    {rowIndex + 1}
                                  </td>
                                  {visibleKeys.map((key) => (
                                    <td
                                      key={key}
                                      className="whitespace-nowrap text-xs text-gray-700 py-2"
                                    >
                                      {record[key] === null ||
                                      record[key] === undefined ||
                                      record[key] === ""
                                        ? "-"
                                        : String(record[key])}
                                    </td>
                                  ))}
                                </tr>
                              );
                            },
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ProjectDetails;
