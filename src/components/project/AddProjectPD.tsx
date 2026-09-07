import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Building2,
  FolderOpen,
  Calendar,
  HelpCircle,
  FileText,
  Target,
  User,
} from "lucide-react";
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
  const [employees, setEmployees] = useState<any[]>([]);
  const [ownerSearchTerm, setOwnerSearchTerm] = useState("");
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

  const GetEmployees = async (search = "") => {
    try {
      const data = await GetDropdownData(
        `2?search=${search}&page=1&pageSize=50`,
      );
      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

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
      setProjectOwnerId(data.projectOwnerID?.split("-").pop()?.trim() || "");
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
    const month = today.getMonth() + 1;
    const startYear = month >= 4 ? year : year - 1;
    return startYear;
  };

  const getFinancialYearOptions = () => {
    const currentFY = getCurrentFinancialYear();
    let years: number[] = [];
    if (projectType === "ONGOING") {
      for (let i = -1; i <= 5; i++) {
        years.push(currentFY + i);
      }
    } else {
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
        resetFormFields();
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
        await GetEmployees();
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

  useEffect(() => {
    GetEmployees(ownerSearchTerm);
  }, [ownerSearchTerm]);

  useEffect(() => {
    if (projectOwnerId && employees.length > 0 && !projectOwnerName) {
      const selectedEmp = employees.find(
        (emp) => emp.value.split("-").pop()?.trim() === projectOwnerId.trim(),
      );
      if (selectedEmp) {
        setProjectOwnerName(selectedEmp.text);
      }
    }
  }, [employees, projectOwnerId]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 tracking-tight antialiased">
      {/* Header (Kept intact structually with subtle polish matching modern daisyUI layouts) */}
      <div className="rounded bg-base-100 border border-base-200 p-5 shadow-sm mb-6 transition-all">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-error/10 p-3 rounded text-error">
              <Building2 className="w-6 h-6 text-error" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-base-content">
                {isEditMode ? "Update Project PD" : "Add Project PD"}
              </h1>
              <p className="text-xs text-base-content/60 mt-0.5">
                Create and manage project details smoothly
              </p>
            </div>
          </div>
          {isEditMode && projectStatus && (
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 bg-base-200/50 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded">
              <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                Status
              </span>
              <div
                className={`badge badge-sm py-2.5 px-3 uppercase tracking-wide border-0 font-semibold ${
                  normalizedStatus === "draft"
                    ? "bg-amber-500 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {projectStatus.toUpperCase()}
              </div>
              {!canEdit && (
                <span className="text-[11px] font-medium text-error mt-0.5">
                  {normalizedStatus === "draft" && !isCurrentUserOwner
                    ? "Only project owner can edit"
                    : "Cannot edit posted projects"}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="bg-base-100 rounded border border-base-200 shadow-sm overflow-hidden transition-all">
        {/* Form Title Section */}
        <div className="border-b border-base-200 px-6 py-4.5 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2.5 text-slate-700 font-semibold">
            <FolderOpen size={18} className="text-slate-500" />
            <span className="text-base tracking-tight">
              Project Configuration
            </span>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-1.5 h-3.5 bg-error rounded-full"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/70">
                General Meta
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Project Name */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold text-slate-600">
                    Project Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter clear project definition"
                  className="input input-bordered w-full input-md rounded focus:input-error transition-all text-sm bg-slate-50/30"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={!canEdit}
                />
              </div>

              {/* Project Type */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold text-slate-600">
                    Project Type
                  </span>
                </label>
                <select
                  className="select select-bordered w-full select-md rounded focus:select-error transition-all text-sm bg-slate-50"
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

              {/* Project Owner Selection */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold text-slate-600">
                    Project Owner
                  </span>
                </label>
                <details className="dropdown w-full relative">
                  <summary className="btn btn-md btn-bordered bg-slate-50/30 border border-base-300 w-full justify-between normal-case font-normal rounded text-sm hover:bg-slate-50">
                    {projectOwnerName ? (
                      <span className="truncate flex items-center gap-2 font-medium text-slate-800">
                        <User size={14} className="text-slate-400" />
                        {projectOwnerId} — {projectOwnerName}
                      </span>
                    ) : (
                      <span className="text-base-content/40 flex items-center gap-2">
                        <User size={14} className="text-slate-400" />
                        Select assigned lead...
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">▼</span>
                  </summary>

                  <span
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={(e) =>
                      e.currentTarget.parentElement?.removeAttribute("open")
                    }
                  />

                  <div className="dropdown-content menu p-2.5 shadow-xl bg-base-100 border border-base-200 rounded w-full min-w-64 mt-1.5 space-y-2 z-50 absolute left-0 top-full">
                    <input
                      type="text"
                      placeholder="Type name or ID to filter..."
                      value={ownerSearchTerm}
                      onChange={(e) => setOwnerSearchTerm(e.target.value)}
                      className="input input-sm input-bordered w-full rounded focus:input-error"
                    />

                    <div className="max-h-48 overflow-y-auto space-y-0.5 rounded border border-slate-100 p-1">
                      {employees.length === 0 ? (
                        <span className="text-xs text-base-content/40 p-3 block text-center italic">
                          No matching employees found
                        </span>
                      ) : (
                        employees.map((emp) => (
                          <button
                            key={emp.value}
                            type="button"
                            className="w-full text-left px-2.5 py-2 text-xs rounded transition-colors hover:bg-slate-100 flex justify-between items-center text-slate-700"
                            onClick={(event) => {
                              setProjectOwnerId(
                                emp.value.split("-").pop()?.trim() || "",
                              );
                              setProjectOwnerName(emp.text);
                              setOwnerSearchTerm("");
                              event.currentTarget
                                .closest("details")
                                ?.removeAttribute("open");
                            }}
                          >
                            <span className="font-medium">{emp.text}</span>
                            <span className="text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                              {emp.value}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>

          {/* Section 2: Timeline & Parameters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-1.5 h-3.5 bg-error rounded-full"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/70">
                Timeline & Categorization
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Financial Year */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold text-slate-600">
                    Financial Year
                  </span>
                </label>
                <select
                  className="select select-bordered w-full select-md rounded focus:select-error transition-all text-sm bg-slate-50"
                  value={financialYear}
                  onChange={(e) => {
                    setFinancialYear(e.target.value);
                    setStartDate(null);
                    setEndDate(null);
                  }}
                  disabled={!canEdit}
                >
                  <option value="">Select Year</option>
                  {financialYearOptions.map((fy) => (
                    <option key={fy.value} value={fy.value}>
                      {fy.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div className="form-control w-full custom-datepicker-container">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold text-slate-600">
                    Start Date
                  </span>
                </label>
                <div className="relative">
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
                    placeholderText="DD/MM/YYYY"
                    className="input input-bordered w-full input-md rounded focus:input-error transition-all text-sm bg-slate-50 pl-9"
                    wrapperClassName="w-full"
                    minDate={projectType === "NEW" ? minDate : undefined}
                    maxDate={
                      projectType === "NEW"
                        ? endDate || maxDate
                        : endDate || undefined
                    }
                    disabled={!canEdit}
                  />
                  <Calendar
                    size={14}
                    className="absolute left-3 top-3.5 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="form-control w-full custom-datepicker-container">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold text-slate-600">
                    End Date
                  </span>
                </label>
                <div className="relative">
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
                    placeholderText="DD/MM/YYYY"
                    className="input input-bordered w-full input-md rounded focus:input-error transition-all text-sm bg-slate-50/30 pl-9"
                    wrapperClassName="w-full"
                    minDate={
                      projectType === "NEW"
                        ? startDate || minDate
                        : startDate || undefined
                    }
                    maxDate={projectType === "NEW" ? maxDate : undefined}
                    disabled={!canEdit}
                  />
                  <Calendar
                    size={14}
                    className="absolute left-3 top-3.5 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold text-slate-600">
                    Category
                  </span>
                </label>
                <select
                  className="select select-bordered w-full select-md rounded focus:select-error transition-all text-sm bg-slate-50"
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
          </div>

          {/* Section 3: Deep Context Contextual Textareas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-1.5 h-3.5 bg-error rounded-full"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/70">
                Scope & Operational Alignment
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Scope */}
              <div className="form-control w-full">
                <label className="label py-1 flex items-center gap-1.5">
                  <FileText size={13} className="text-slate-400" />
                  <span className="label-text text-xs font-semibold text-slate-600">
                    Project Scope
                  </span>
                </label>
                <textarea
                  rows={4}
                  className="textarea textarea-bordered w-full text-sm rounded focus:textarea-error transition-all bg-slate-50/30 resize-none leading-relaxed"
                  placeholder="Clearly outline the technical or operational boundaries..."
                  value={projectScope}
                  onChange={(e) => setProjectScope(e.target.value)}
                  disabled={!canEdit}
                />
              </div>

              {/* Key Assumptions */}
              <div className="form-control w-full">
                <label className="label py-1 flex items-center gap-1.5">
                  <HelpCircle size={13} className="text-slate-400" />
                  <span
                    className="label-text text-xs font-semibold text-slate-600 truncate max-w-full"
                    title="Key Assumptions / Application Model / Activities Currently Undertaken"
                  >
                    Key Assumptions / Change Scope / Activities Currently
                    Undertaken
                  </span>
                </label>
                <textarea
                  rows={4}
                  className="textarea textarea-bordered w-full text-sm rounded focus:textarea-error transition-all bg-slate-50/30 resize-none leading-relaxed"
                  placeholder="Detail high-level assumptions, operating dependencies or current work state..."
                  value={keyAssumptions}
                  onChange={(e) => setKeyAssumptions(e.target.value)}
                  disabled={!canEdit}
                />
              </div>

              {/* Project Objective */}
              <div className="form-control w-full">
                <label className="label py-1 flex items-center gap-1.5">
                  <Target size={13} className="text-slate-400" />
                  <span className="label-text text-xs font-semibold text-slate-600">
                    Project Objective
                  </span>
                </label>
                <textarea
                  rows={4}
                  className="textarea textarea-bordered w-full text-sm rounded focus:textarea-error transition-all bg-slate-50/30 resize-none leading-relaxed"
                  placeholder="State the measurable objective and core business targets..."
                  value={projectObjective}
                  onChange={(e) => setProjectObjective(e.target.value)}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleSubmit("Draft")}
              className="btn btn-md border border-amber-200 bg-amber-50 hover:bg-amber-100 hover:border-amber-300 text-amber-800 font-medium px-6 rounded transition-all"
              disabled={!canEdit}
            >
              Save Draft
            </button>

            <button
              className="btn btn-md btn-neutral text-white px-7 font-medium rounded shadow-sm hover:shadow transition-all"
              onClick={() => handleSubmit("Posted")}
              disabled={!canEdit}
            >
              {isEditMode ? "Update Details" : "Submit Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectPD;
