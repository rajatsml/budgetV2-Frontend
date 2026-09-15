import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Building2 } from "lucide-react";
import { GetProjectById } from "../../service/projectmaster";

type ProjectDetailsData = {
  projectId?: string;
  projectName?: string;
  projectTypeDesc?: string;
  financialYear?: string;
  departmentName?: string;
  startDate?: string;
  endDate?: string;
  deptProjectStatus?: string;
  status?: string;
  projectScope?: string;
  keyAssumptions?: string;
  projectOwner?: string;
  projectCategoryName?: string;
  projectObjective?: string;
  isOngoing?: boolean;
};

const UserProjectDetails = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<ProjectDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadProjectDetails = async () => {
      if (!projectId) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);

        const projectResponse = await GetProjectById(projectId);

        setProject(projectResponse?.project ?? projectResponse);
      } catch (loadError) {
        console.error("Error loading project details:", loadError);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProjectDetails();
  }, [projectId]);

  const formatValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200 p-6">
        <div className="alert alert-error max-w-lg">
          <AlertCircle className="h-5 w-5" />
          <span>Unable to load the requested project details.</span>
          <button
            className="btn btn-sm"
            onClick={() => navigate("/myprojects")}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const projectInformation = [
    { label: "Project ID", value: formatValue(project.projectId) },
    { label: "Project Name", value: formatValue(project.projectName) },
    { label: "Financial Year", value: formatValue(project.financialYear) },
    {
      label: "Timeline",
      value: `${formatDate(project.startDate)} - ${formatDate(project.endDate)}`,
    },
    { label: "Owner", value: formatValue(project.projectOwner) },
    { label: "Category Name", value: formatValue(project.projectCategoryName) },
    { label: "Scope", value: formatValue(project.projectScope), wide: true },
    {
      label: "Assumptions",
      value: formatValue(project.keyAssumptions),
      wide: true,
    },
    {
      label: "Objective",
      value: formatValue(project.projectObjective),
      wide: true,
    },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded bg-white p-4 shadow">
        <div className="flex items-center gap-3">
          <div className="rounded bg-red-100 p-2 text-gray-800">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Project Details</h1>
            <p className="text-sm text-gray-500">
              User view · {formatValue(project.projectId)}
            </p>
          </div>
        </div>
        <button
          className="btn btn-neutral btn-sm flex items-center gap-1.5"
          onClick={() => navigate("/myprojects")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Projects
        </button>
      </div>

      <div className="space-y-4">
        <section className="rounded bg-white p-4 shadow">
          <div className="border-b border-base-300 px-4 py-3">
            <h2 className="font-bold">Project Information</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-3">
            {projectInformation.map(({ label, value, wide }) => (
              <div
                key={label}
                className={`rounded border border-base-300 p-4 ${
                  wide ? "md:col-span-3" : ""
                }`}
              >
                <div className="mb-1 text-sm font-semibold text-gray-500">
                  {label}
                </div>
                <div className="whitespace-pre-wrap text-xs text-gray-800">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserProjectDetails;
