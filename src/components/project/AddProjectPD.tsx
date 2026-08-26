import { useState } from "react";
import { Building2, FolderOpen } from "lucide-react";

const AddProjectPD = () => {
  const [projectType, setProjectType] = useState("NEW");
  const [financialYear, setFinancialYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getFinancialYearRange = (fy: string) => {
    if (!fy) {
      return {
        minDate: undefined,
        maxDate: undefined,
      };
    }

    const [startYear] = fy.split("-");

    return {
      minDate: `${startYear}-04-01`,
      maxDate: `${Number(startYear) + 1}-03-31`,
    };
  };

  const { minDate, maxDate } = getFinancialYearRange(financialYear);

  const handleStartDateChange = (e: any) => {
    const value = e.target.value;

    if (endDate && value > endDate) {
      alert("Start Date cannot be greater than End Date");
      return;
    }

    setStartDate(value);
  };

  const handleEndDateChange = (e: any) => {
    const value = e.target.value;

    if (startDate && value < startDate) {
      alert("End Date cannot be earlier than Start Date");
      return;
    }

    setEndDate(value);
  };

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
                Add Project PD
              </h1>
              <p className="text-sm text-base-content/60">
                Create and manage project details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="card bg-base-100 shadow border border-base-300">
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

            <div className="grid grid-cols-1 md:grid-cols-5 xl:grid-cols-6 gap-5">
              {/* Project Name */}
              <div className="col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Project Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Project Name"
                  className="input input-bordered w-full"
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Project Type</span>
                </label>

                <select
                  className="select select-bordered w-full"
                  value={projectType}
                  onChange={(e) => {
                    setProjectType(e.target.value);
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  <option value="NEW">NEW</option>
                  <option value="EXISTING">EXISTING</option>
                </select>
              </div>

              {/* Financial Year */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Financial Year
                  </span>
                </label>

                <select
                  className="select select-bordered w-full"
                  value={financialYear}
                  onChange={(e) => {
                    setFinancialYear(e.target.value);
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  <option value="">Select Financial Year</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2026-27">2026-27</option>
                  <option value="2027-28">2027-28</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Start Date</span>
                </label>

                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={projectType === "NEW" ? minDate : undefined}
                  max={
                    projectType === "NEW"
                      ? endDate || maxDate
                      : endDate || undefined
                  }
                />
              </div>

              {/* End Date */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">End Date</span>
                </label>

                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={endDate}
                  onChange={handleEndDateChange}
                  min={
                    projectType === "NEW"
                      ? startDate || minDate
                      : startDate || undefined
                  }
                  max={projectType === "NEW" ? maxDate : undefined}
                />
              </div>
            </div>
          </div>

          {/* Project Scope */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Project Scope</span>
              </label>

              <textarea
                rows={3}
                className="textarea textarea-bordered w-full"
                placeholder="Describe project scope..."
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Key Assumptions
                </span>
              </label>

              <textarea
                rows={3}
                className="textarea textarea-bordered w-full"
                placeholder="Enter key assumptions..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button className="btn btn-sm btn-error text-white">
              Save Draft
            </button>

            <button
              className="btn btn-sm btn-neutral"
              onClick={() => {
                if (startDate && endDate && startDate > endDate) {
                  alert("Start Date cannot be greater than End Date");
                  return;
                }

                alert("Validation Passed");
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectPD;
