import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  // Layers,
  // TableProperties,
  AlertCircle,
} from "lucide-react";
import {
  GetProjectHierarchy,
  // GetBudgetDashboardDetails,
} from "../../service/projectmaster";

const ProjectDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const project = location.state?.project;

  const [loading, setLoading] = useState(false);
  const [departmentData, setDepartmentData] = useState<any[]>([]);

  // const hiddenKeys = [
  //   "nonPDDetailId",
  //   "projectId",
  //   "recordId",
  //   "isDeleted",
  //   "draftStatus",
  //   "id",
  //   "deletedAt",
  //   "deletedBy",
  //   "pdDetailId",
  // ];

  useEffect(() => {
    if (!project?.projectId) return;
    loadProjectData();
  }, [project]);

  const loadProjectData = async () => {
    try {
      setLoading(true);

      const response = await GetProjectHierarchy(project.projectId);

      setDepartmentData(response || []);
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
      {!loading && (
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-slate-200">
            <h2 className="font-bold text-base text-gray-800">
              Department Status Tracker
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Pending With</th>
                </tr>
              </thead>

              <tbody>
                {departmentData.map((dept: any, index: number) => (
                  <tr key={index}>
                    <td className="font-medium">{dept.deptName}</td>

                    <td>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                          dept.projectStatus,
                        )}`}
                      >
                        {dept.projectStatus}
                      </span>
                    </td>

                    <td>
                      {dept.pendingWith?.trim() && dept.pendingWith !== "-"
                        ? dept.pendingWith
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
