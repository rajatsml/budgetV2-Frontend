import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Building2, FolderOpen } from "lucide-react";
import {
  CreateProject,
  UpdateProject,
  GetProjectById,
  GetDropdownData,
} from "../../service/projectmaster";
import useUserStore from "../../store/userStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddProjectPD = () => {
  const [projectType, setProjectType] = useState("NEW");
  const [financialYear, setFinancialYear] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const user = useUserStore();
  const [projectName, setProjectName] = useState("");
  const [projectScope, setProjectScope] = useState("");
  const [keyAssumptions, setKeyAssumptions] = useState("");
  const [projectOwnerName, setProjectOwnerName] = useState("");
  const [projectOwnerId, setProjectOwnerId] = useState("");
  const [category, setCategory] = useState("");
  const [projectObjective, setProjectObjective] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [projectStatus, setProjectStatus] = useState<string>("");
  const [projectCreatedBy, setProjectCreatedBy] = useState<string>("");
  const { projectId } = useParams();
  const isEditMode = Boolean(projectId);

  const currentUserId = String(user?.user?.userId ?? "");
  const normalizedStatus = projectStatus?.toLowerCase().trim();
  const isCurrentUserOwner = currentUserId === String(projectCreatedBy ?? "");
  const canEdit =
    !isEditMode || (normalizedStatus === "draft" && isCurrentUserOwner);

  const getFinancialYearRange = (fy: string) => {
    if (!fy) {
      return {
        minDate: undefined,
        maxDate: undefined,
      };
    }

    const [startYear] = fy.split("-");

    return {
      minDate: new Date(`${startYear}-04-01`),
      maxDate: new Date(`${Number(startYear) + 1}-03-31`),
    };
  };

  const loadProject = async () => {
    try {
      if (!projectId) return;

      const data = await GetProjectById(projectId);

      if (!data) return;

      setProjectName(data.projectName || "");
      setProjectType(data.isOngoing ? "ONGOING" : "NEW");
      setFinancialYear(data.financialYear || "");
      setProjectScope(data.projectScope || "");
      setKeyAssumptions(data.keyAssumptions || "");
      setProjectOwnerName(data.projectOwner || "");
      setProjectOwnerId(data.projectOwnerID || "");
      setCategory(data.projectCategoryType || "");
      setProjectObjective(data.projectObjective || "");
      setProjectStatus(data.status || "");
      setProjectCreatedBy(String(data.createdBy ?? ""));

      setStartDate(data.startDate ? new Date(data.startDate) : null);
      setEndDate(data.endDate ? new Date(data.endDate) : null);
    } catch (error) {
      console.error("Error loading project:", error);
    }
  };

  const formatDateForApi = (date: Date | null) => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const { minDate, maxDate } = getFinancialYearRange(financialYear);

  const getCurrentFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Jan = 1

    // FY starts from April
    const startYear = month >= 4 ? year : year - 1;

    return startYear;
  };

  const getFinancialYearOptions = () => {
    const currentFY = getCurrentFinancialYear();

    let years: number[] = [];

    if (projectType === "ONGOING") {
      // n-1 to n+5
      for (let i = -1; i <= 5; i++) {
        years.push(currentFY + i);
      }
    } else {
      // n+1 to n+5
      for (let i = 1; i <= 5; i++) {
        years.push(currentFY + i);
      }
    }

    return years.map((startYear) => ({
      value: `${startYear}-${String(startYear + 1).slice(-2)}`,
      label: `${startYear}-${String(startYear + 1).slice(-2)}`,
    }));
  };

  const handleSubmit = async (status: string) => {
    try {
      if (!canEdit) {
        alert("You do not have permission to edit this project.");
        return;
      }

      if (!projectName.trim()) {
        alert("Project Name is required");
        return;
      }

      if (!financialYear) {
        alert("Please select Financial Year");
        return;
      }

      if (!startDate || !endDate) {
        alert("Please select Start Date and End Date");
        return;
      }

      if (startDate > endDate) {
        alert("Start Date cannot be greater than End Date");
        return;
      }

      const payload = {
        projectId,
        projectName: projectName.trim().toUpperCase(),
        projectType: "2",
        financialYear,
        projectScope: projectScope.trim().toUpperCase(),
        projectObjective: projectObjective.trim().toUpperCase(),
        projectOwner: projectOwnerName.trim().toUpperCase(),
        projectOwnerID: projectOwnerId.trim().toUpperCase(),
        projectCategoryType: category,
        keyAssumptions: keyAssumptions.trim().toUpperCase(),
        createdBy: user?.user?.userId,
        createdByDept: user?.user?.roles?.[0]?.departmentName,
        isOngoing: projectType === "ONGOING",
        startDate: formatDateForApi(startDate),
        endDate: formatDateForApi(endDate),
        status,
      };

      let response;

      if (isEditMode) {
        response = await UpdateProject(projectId!, payload);
        alert("Project updated successfully");
      } else {
        response = await CreateProject(payload);
        alert("Project created successfully");

        setProjectName("");
        setProjectType("NEW");
        setFinancialYear("");
        setProjectScope("");
        setKeyAssumptions("");
        setProjectOwnerName("");
        setProjectOwnerId("");
        setCategory("");
        setProjectObjective("");
        setStartDate(null);
        setEndDate(null);
      }

      console.log(response);
    } catch (error) {
      console.error("Error saving project:", error);
      alert(
        isEditMode ? "Failed to update project" : "Failed to create project",
      );
    }
  };
  const financialYearOptions = getFinancialYearOptions();

  const resetFormFields = () => {
    setProjectName("");
    setProjectType("NEW");
    setFinancialYear("");
    setProjectScope("");
    setKeyAssumptions("");
    setProjectOwnerName("");
    setProjectOwnerId("");
    setCategory("");
    setProjectObjective("");
    setProjectStatus("");
    setProjectCreatedBy("");
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        const dropdownData = await GetDropdownData("5");
        setCategories(dropdownData || []);

        if (projectId) {
          await loadProject();
        } else {
          resetFormFields();
        }
      } catch (error) {
        console.error("Error initializing page:", error);
      }
    };

    initializePage();
  }, [projectId]);

  return (
    <div className="min-h-screen bg-base-200 p-4">
      {/* Header */}
      <div className="rounded bg-base-100 border border-base-300 p-4 shadow mb-4">
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-neutral/10 p-2 rounded">
              <Building2 className="w-7 h-7 text-neutral" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-base-content">
                {isEditMode ? "Update Project PD" : "Add Project PD"}
              </h1>
              <p className="text-sm text-base-content/60">
                Create and manage project details
              </p>
            </div>
          </div>
          {isEditMode && projectStatus && (
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs uppercase tracking-wide text-base-content/60">
                Status
              </span>
              <div
                className={`badge ${
                  normalizedStatus === "draft" ? "badge-warning" : "badge-error"
                } text-white font-semibold`}
              >
                {projectStatus.toUpperCase()}
              </div>
              {!canEdit && (
                <span className="text-xs text-error mt-1">
                  {normalizedStatus === "draft" && !isCurrentUserOwner
                    ? "Only project owner can edit"
                    : "Cannot edit posted projects"}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-base-100 shadow border border-base-300">
        <div className="border-b border-slate-300 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FolderOpen size={22} />
            <span className="text-lg font-semibold">Project Details</span>
          </div>
        </div>

        <div className="card-body">
          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/70 mb-4">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-4 gap-5">
              {/* Project Name */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Project Name</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter Project Name"
                  className="input input-bordered w-full input-sm"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={!canEdit}
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Project Type</span>
                </label>

                <select
                  className="select select-bordered w-full select-sm"
                  value={projectType}
                  onChange={(e) => {
                    setProjectType(e.target.value);
                    setFinancialYear("");
                    setStartDate(null);
                    setEndDate(null);
                  }}
                  disabled={!canEdit}
                >
                  <option value="NEW">NEW</option>
                  <option value="ONGOING">ONGOING</option>
                </select>
              </div>

              {/* Project Owner Name */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Project Owner Name
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="Enter Owner Name"
                  className="input input-bordered w-full input-sm"
                  value={projectOwnerName}
                  onChange={(e) => setProjectOwnerName(e.target.value)}
                  disabled={!canEdit}
                />
              </div>

              {/* Project Owner ID */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Project Owner Id
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="Enter Owner Id"
                  className="input input-bordered w-full input-sm"
                  value={projectOwnerId}
                  onChange={(e) => setProjectOwnerId(e.target.value)}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-4 gap-5">
            {/* Financial Year */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Financial Year</span>
              </label>

              <select
                className="select select-bordered w-full select-sm"
                value={financialYear}
                onChange={(e) => {
                  setFinancialYear(e.target.value);
                  setStartDate(null);
                  setEndDate(null);
                }}
                disabled={!canEdit}
              >
                <option value="">Select Financial Year</option>

                {financialYearOptions.map((fy) => (
                  <option key={fy.value} value={fy.value}>
                    {fy.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Start Date</span>
              </label>

              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  if (date && endDate && date > endDate) {
                    alert("Start Date cannot be greater than End Date");
                    return;
                  }

                  setStartDate(date);
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select Start Date"
                className="input input-bordered w-full input-sm"
                wrapperClassName="w-full"
                minDate={projectType === "NEW" ? minDate : undefined}
                maxDate={
                  projectType === "NEW"
                    ? endDate || maxDate
                    : endDate || undefined
                }
                disabled={!canEdit}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">End Date</span>
              </label>

              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => {
                  if (date && startDate && date < startDate) {
                    alert("End Date cannot be earlier than Start Date");
                    return;
                  }

                  setEndDate(date);
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select End Date"
                className="input input-bordered w-full input-sm"
                wrapperClassName="w-full"
                minDate={
                  projectType === "NEW"
                    ? startDate || minDate
                    : startDate || undefined
                }
                maxDate={projectType === "NEW" ? maxDate : undefined}
                disabled={!canEdit}
              />
            </div>
            {/* Category */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Category</span>
              </label>

              <select
                className="select select-bordered w-full select-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={!canEdit}
              >
                <option value="">Select Category</option>

                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Scope */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8 mt-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Project Scope</span>
              </label>

              <textarea
                rows={3}
                className="textarea textarea-bordered w-full textarea-sm"
                placeholder="Describe project scope..."
                value={projectScope}
                onChange={(e) => setProjectScope(e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Key Assumptions/Application Model/Activites Currently
                  Undertaken
                </span>
              </label>

              <textarea
                rows={3}
                className="textarea textarea-bordered w-full textarea-sm"
                placeholder="Enter key assumptions..."
                value={keyAssumptions}
                onChange={(e) => setKeyAssumptions(e.target.value)}
                disabled={!canEdit}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Project Objective
                </span>
              </label>

              <textarea
                rows={3}
                className="textarea textarea-bordered w-full textarea-sm"
                placeholder="Describe project objective..."
                value={projectObjective}
                onChange={(e) => setProjectObjective(e.target.value)}
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => handleSubmit("Draft")}
              className="btn btn-sm btn-error text-white"
              disabled={!canEdit}
            >
              Save Draft
            </button>

            <button
              className="btn btn-sm btn-neutral"
              onClick={() => handleSubmit("Posted")}
              disabled={!canEdit}
            >
              {isEditMode ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectPD;
