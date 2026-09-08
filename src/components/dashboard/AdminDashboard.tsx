import { useEffect, useState } from "react";
import { Calendar, FolderOpen, FileCheck, Files } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GetProjects, GetDashboardSummary } from "../../service/projectmaster";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (project: any) => {
    navigate("/project-detail", {
      state: {
        project,
      },
    });
  };

  /**
   * Returns financial year in format:
   * 2026-27
   * 2027-28
   */
  const getCurrentFinancialYear = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const startYear = month >= 4 ? year : year - 1;
    const endYear = String(startYear + 1).slice(-2);

    return `${startYear}-${endYear}`;
  };

  // const navigate = useNavigate();
  const [financialYear, setFinancialYear] = useState(getCurrentFinancialYear());

  const [financialYears, setFinancialYears] = useState<any[]>([]);

  const [summary, setSummary] = useState({
    totalProjects: 0,
    pendingWithDept: 0,
    pendingWithAdmin: 0,
    pdProjects: 0,
    nonProjects: 0,
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFinancialYears = async () => {
    try {
      /**
       * Replace with your actual dropdown API
       * Type = 4
       */

      // const response = await GetDropdownByType(4);
      // setFinancialYears(response || []);

      // Temporary fallback until dropdown API is plugged in
      setFinancialYears([
        { id: 1, name: "2025-26" },
        { id: 2, name: "2026-27" },
        { id: 3, name: "2027-28" },
        { id: 4, name: "2028-29" },
      ]);
    } catch (error) {
      console.error("Error loading financial years", error);
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [summaryResponse, allProjects] = await Promise.all([
        GetDashboardSummary(financialYear),
        GetProjects(),
      ]);

      /**
       * Summary API
       */
      setSummary((prev) => ({
        ...prev,
        totalProjects: summaryResponse?.totalProjects ?? 0,
        pendingWithDept: summaryResponse?.pendingWithDept ?? 0,
        pendingWithAdmin: summaryResponse?.pendingWithAdmin ?? 0,
      }));

      /**
       * Show only selected/current FY projects
       */
      const filteredProjects = (allProjects || []).filter(
        (project: any) => project.financialYear?.trim() === financialYear,
      );

      setProjects(filteredProjects);

      /**
       * PD & Non-PD tiles derived from Projects API
       */
      const pdProjects = filteredProjects.filter(
        (project: any) => project.projectTypeDesc?.toUpperCase() === "PD",
      ).length;

      const nonProjects = filteredProjects.filter(
        (project: any) => project.projectTypeDesc?.toUpperCase() !== "PD",
      ).length;

      setSummary((prev) => ({
        ...prev,
        pdProjects,
        nonProjects,
      }));
    } catch (error) {
      console.error("Error loading dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialYears();
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [financialYear]);

  return (
    <div className="bg-base-200 min-h-screen p-4">
      {/* Header */}

      <div className="rounded p-4 flex items-center justify-between bg-white shadow">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-red-100 rounded">
            <Calendar />
          </div>

          <h1 className="font-bold text-lg">
            Dashboard <span>FY {financialYear}</span>
          </h1>
        </div>

        <div className="w-48">
          <select
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
            className="select select-bordered select-sm w-full"
          >
            {financialYears.map((fy: any) => (
              <option key={fy.id} value={fy.name}>
                {fy.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
        {/* Total Submitted Projects */}

        <div className="bg-white rounded shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <FolderOpen className="w-4 h-4 text-gray-800" />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500">
                Total Submitted Projects
              </div>

              <div className="text-3xl font-bold">{summary.totalProjects}</div>

              <div className="text-sm font-medium">FY {financialYear}</div>
            </div>
          </div>
        </div>

        {/* Pending With Admin */}
        {/* 
        <div className="bg-white rounded shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-violet-100 p-2 rounded-lg">
              <Clock3 className="w-4 h-4 text-gray-800" />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500">
                Pending With Admin
              </div>

              <div className="text-3xl font-bold">
                {summary.pendingWithAdmin}
              </div>

              <div className="text-sm font-medium">FY {financialYear}</div>
            </div>
          </div>
        </div> */}

        {/* Pending With Dept */}

        {/* <div className="bg-white rounded shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock3 className="w-4 h-4 text-gray-800" />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500">
                Pending With Dept
              </div>

              <div className="text-3xl font-bold">
                {summary.pendingWithDept}
              </div>

              <div className="text-sm font-medium">FY {financialYear}</div>
            </div>
          </div>
        </div> */}

        {/* PD Projects */}

        <div className="bg-white rounded shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <FileCheck className="w-4 h-4 text-gray-800" />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500">
                PD Projects
              </div>

              <div className="text-3xl font-bold">{summary.pdProjects}</div>

              <div className="text-sm font-medium">FY {financialYear}</div>
            </div>
          </div>
        </div>

        {/* Non-PD Projects */}

        <div className="bg-white rounded shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Files className="w-4 h-4 text-gray-800" />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500">
                Non PD Projects
              </div>

              <div className="text-3xl font-bold">{summary.nonProjects}</div>

              <div className="text-sm font-medium">FY {financialYear}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}

      <div className="space-y-4">
        <div className="rounded bg-white shadow">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>Project Name</th>
                  <th>Project Type</th>
                  <th>Financial Year</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No Projects Found
                    </td>
                  </tr>
                ) : (
                  projects.map((project: any) => (
                    <tr key={project.projectId}>
                      <td>{project.projectId}</td>

                      <td>{project.projectName}</td>

                      <td>{project.projectTypeDesc || project.projectType}</td>

                      <td>{project.financialYear}</td>

                      <td>
                        {project.startDate && project.endDate
                          ? `${new Date(project.startDate).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )} - ${new Date(project.endDate).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}`
                          : "-"}
                      </td>

                      <td>{project.status}</td>

                      <td>
                        <button
                          onClick={() => handleNavigation(project)}
                          className="btn btn-neutral btn-xs"
                        >
                          Project Status
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
