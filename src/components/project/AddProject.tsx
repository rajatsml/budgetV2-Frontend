import { FileText, X } from "lucide-react";
import { type MouseEvent, useState } from "react";

const AddProject = () => {
  // 1. Array fed into the HTML <datalist> block
  const AVAILABLE_DEPARTMENTS = [
    "Finance",
    "Engineering",
    "HR",
    "Operations",
    "Marketing",
    "Supply Chain",
    "Quality Assurance",
    "IT",
    "Legal",
    "Sales",
    "Customer Support",
    "Research & Development",
    "Procurement",
    "Logistics",
    "Production",
    "Maintenance",
    "Safety",
    "Training",
  ];

  const EMPLOYEE_REGISTRY = [
    { id: "EMP101", name: "Amit Sharma" },
    { id: "EMP102", name: "Priya Patel" },
    { id: "EMP103", name: "Rahul Verma" },
    { id: "EMP104", name: "Sneha Reddy" },
    { id: "EMP105", name: "Vikram Malhotra" },
  ];

  // 2. Add these state hooks to your form states
  const [selectedDeps, setSelectedDeps] = useState<string[]>([]);
  const [hierarchyCount, setHierarchyCount] = useState<number | null>(null);
  const [approvers, setApprovers] = useState<
    Record<string, { id: string; name: string }>
  >({});
  const [makers, setMakers] = useState<
    Record<string, { id: string; name: string }>
  >({});
  const [empSearchTerms, setEmpSearchTerms] = useState<Record<string, string>>(
    {},
  );
  const [makerSearchTerms, setMakerSearchTerms] = useState<
    Record<string, string>
  >({});

  // Financial Year options and selected state
  const AVAILABLE_FINANCIAL_YEARS = [
    "2023-24",
    "2024-25",
    "2025-26",
    "2026-27",
  ];
  const [financialYear, setFinancialYear] = useState<string>("");

  const handleHierarchyCountChange = (value: string) => {
    const parsedValue = value === "" ? null : Number(value);
    if (parsedValue === null || Number.isNaN(parsedValue)) {
      setHierarchyCount(null);
      setApprovers({});
      setEmpSearchTerms({});
      return;
    }

    const normalizedValue = Math.max(0, parsedValue);
    const previousCount = hierarchyCount ?? 0;

    if (normalizedValue < previousCount) {
      const updatedApprovers = { ...approvers };
      const updatedSearchTerms = { ...empSearchTerms };

      selectedDeps.forEach((dept) => {
        for (
          let level = normalizedValue + 1;
          level <= previousCount;
          level += 1
        ) {
          const key = `${dept}-Level ${level}`;
          delete updatedApprovers[key];
          delete updatedSearchTerms[key];
        }
      });

      setApprovers(updatedApprovers);
      setEmpSearchTerms(updatedSearchTerms);
    }

    setHierarchyCount(normalizedValue);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter departments by search input, excluding already selected ones
  const filteredDeps = AVAILABLE_DEPARTMENTS.filter(
    (dept) =>
      dept.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedDeps.includes(dept),
  );

  // Track sequential levels loop dynamically based on hierarchyCount input integer
  const hierarchyLevels = Array.from(
    { length: Math.max(0, hierarchyCount ?? 0) },
    (_, i) => i + 1,
  );

  const totalAssignedApprovers =
    Object.keys(approvers).length + Object.keys(makers).length;
  const totalExpectedApprovers =
    selectedDeps.length * (hierarchyCount ?? 0) + selectedDeps.length;

  // 3. Selection handler function
  const handleSelectDepartment = (deptName: string) => {
    const trimmed = deptName.trim();
    if (
      AVAILABLE_DEPARTMENTS.includes(trimmed) &&
      !selectedDeps.includes(trimmed)
    ) {
      setSelectedDeps([...selectedDeps, trimmed]);
    }
    setSearchTerm(""); // Clears search query input text field
  };

  // 4. Removal handler function (with memory purge)
  const handleRemoveDepartment = (dept: string) => {
    setSelectedDeps(selectedDeps.filter((d) => d !== dept));

    // Wipe out any typed approvers for the deleted department
    const updatedApprovers = { ...approvers };
    Object.keys(updatedApprovers).forEach((key) => {
      if (key.startsWith(`${dept}-`)) delete updatedApprovers[key];
    });
    setApprovers(updatedApprovers);

    const updatedMakers = { ...makers };
    delete updatedMakers[dept];
    setMakers(updatedMakers);

    const updatedMakerSearchTerms = { ...makerSearchTerms };
    delete updatedMakerSearchTerms[dept];
    setMakerSearchTerms(updatedMakerSearchTerms);
  };

  return (
    <div className="min-h-screen bg-base-200/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-base-content">
            Initiate New Project
          </h1>
          <p className="mt-2 text-sm text-base-content/70 max-w-3xl">
            Establish foundational parameters, departmental oversight, and
            approval workflows for new capital allocations.
          </p>
        </div>

        {/* Main Content Split Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
          {/* Left Form Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* 01. Basic Information */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body gap-6">
                {/* Section Header */}
                <div className="flex items-center gap-3 border-b border-base-200 pb-4">
                  <div className="badge badge-neutral w-7 h-7 font-mono p-0 rounded-full flex items-center justify-center text-xs">
                    01
                  </div>
                  <h2 className="card-title text-lg font-bold">
                    Basic Information
                  </h2>
                </div>

                {/* Form Control: Project Name, Project Type, Financial Year */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                  <div className="form-control w-full">
                    <label className="label py-1">
                      <span className="label-text uppercase tracking-wider text-[11px] font-bold text-base-content/60">
                        Project Name
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Q3 Infrastructure Upgrade"
                      className="input input-bordered w-full bg-base-200/30 focus:bg-base-100"
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label py-1">
                      <span className="label-text uppercase tracking-wider text-[11px] font-bold text-base-content/60">
                        Project Type
                      </span>
                    </label>
                    <select defaultValue="" className="select w-full">
                      <option disabled={true} value={""}>
                        Project Type
                      </option>
                      <option>PD</option>
                      <option>Non PD</option>
                      <option>IT</option>
                    </select>
                  </div>

                  <div className="form-control w-full">
                    <label className="label py-1">
                      <span className="label-text uppercase tracking-wider text-[11px] font-bold text-base-content/60">
                        Financial Year
                      </span>
                    </label>
                    <select
                      value={financialYear}
                      onChange={(e) => setFinancialYear(e.target.value)}
                      className="select w-full"
                    >
                      <option disabled={true} value={""}>
                        Select Financial Year
                      </option>
                      {AVAILABLE_FINANCIAL_YEARS.map((fy) => (
                        <option key={fy} value={fy}>
                          {fy}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Form Control: Project Scope */}
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text uppercase tracking-wider text-[11px] font-bold text-base-content/60">
                      Project Scope
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Define the primary objectives and boundaries of this initiative..."
                    className="textarea textarea-bordered w-full bg-base-200/30 focus:bg-base-100 resize-none"
                  />
                </div>

                {/* Form Control: Key Assumptions */}
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text uppercase tracking-wider text-[11px] font-bold text-base-content/60">
                      Key Assumptions
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="List financial or operational dependencies..."
                    className="textarea textarea-bordered w-full bg-base-200/30 focus:bg-base-100 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 02. Execution Timeline */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body gap-6">
                <div className="flex items-center gap-3 border-b border-base-200 pb-4">
                  <div className="badge badge-neutral w-7 h-7 font-mono p-0 rounded-full flex items-center justify-center text-xs">
                    02
                  </div>
                  <h2 className="card-title text-lg font-bold">
                    Execution Timeline
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="form-control w-full">
                    <label className="label py-1">
                      <span className="label-text uppercase tracking-wider text-[11px] font-bold text-base-content/60">
                        Target Start Date
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="input input-bordered w-full bg-base-200/30 focus:bg-base-100"
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="form-control w-full">
                    <label className="label py-1">
                      <span className="label-text uppercase tracking-wider text-[11px] font-bold text-base-content/60">
                        Target End Date
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="input input-bordered w-full bg-base-200/30 focus:bg-base-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 03. Departmental Configuration */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body gap-6">
                <div className="flex items-center gap-3 border-b border-base-200 pb-4">
                  <div className="badge badge-neutral w-7 h-7 font-mono p-0 rounded-full flex items-center justify-center text-xs">
                    03
                  </div>
                  <h2 className="card-title text-lg font-bold">
                    Departmental Configuration
                  </h2>
                </div>

                <div className="form-control w-full gap-2">
                  <label className="label py-0">
                    <span className="label-text uppercase tracking-wider text-[11px] font-bold text-base-content/60">
                      Assign Departments
                    </span>
                  </label>

                  {/* Flex Wrapper: Row of Chips + Dropdown Anchor Button */}
                  <div className="flex flex-wrap gap-2 items-center p-2 rounded-xl border border-base-300 bg-base-200/30">
                    {/* Selected Chips */}
                    {selectedDeps.map((dept) => (
                      <div
                        key={dept}
                        className="badge badge-neutral gap-1 py-3.5 rounded-md pr-1 font-semibold text-xs"
                      >
                        {dept}
                        <button
                          type="button"
                          onClick={() => handleRemoveDepartment(dept)}
                          className="btn btn-ghost btn-xs p-0 min-h-0 h-4 w-4 rounded-full"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}

                    {/* DaisyUI Dropdown Menu */}
                    <div
                      className={`dropdown ${isOpen ? "dropdown-open" : ""} flex-1 min-w-37.5`}
                    >
                      <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="btn btn-ghost btn-xs text-xs justify-start w-full text-base-content/50 font-normal h-8 hover:bg-base-200"
                      >
                        + Add department...
                      </button>

                      {/* Popover Dropdown Card */}
                      {isOpen && (
                        <div className="dropdown-content menu p-3 shadow-lg bg-base-100 border border-base-200 rounded-xl w-full z-100 mt-1 space-y-2">
                          {/* Inner Search Box */}

                          <div className="flex gap-x-2">
                            <input
                              type="text"
                              placeholder="Search departments..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="input input-sm input-bordered w-full bg-base-200/50"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                setSearchTerm("");
                                setIsOpen(false);
                              }}
                              className="btn btn-ghost btn-sm p-0 min-h-0 h-8 w-8 rounded-full"
                            >
                              <X />
                            </button>
                          </div>

                          {/* Options List */}
                          <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar">
                            {filteredDeps.length === 0 ? (
                              <span className="text-xs text-base-content/40 p-2 block text-center">
                                No options found
                              </span>
                            ) : (
                              filteredDeps.map((dept) => (
                                <button
                                  key={dept}
                                  type="button"
                                  onClick={() => {
                                    handleSelectDepartment(dept);
                                    setSearchTerm("");
                                    setIsOpen(false); // Close popover
                                  }}
                                  className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-base-200 text-base-content"
                                >
                                  {dept}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="form-control w-full">
                      <label className="label py-1">
                        <span className="label-text uppercase tracking-wider text-[11px] font-bold text-base-content/60">
                          Hierarchy Count
                        </span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={hierarchyCount ?? ""}
                        onChange={(e) =>
                          handleHierarchyCountChange(e.target.value)
                        }
                        className="input input-bordered w-full bg-base-200/30 focus:bg-base-100"
                        placeholder="Enter number of approval levels"
                      />
                      <p className="text-xs text-base-content/50 mt-1">
                        Add the number of approval levels for each selected
                        department.
                      </p>
                    </div>
                    <div className="form-control w-full">
                      <label className="label py-1">
                        <span className="label-text uppercase tracking-wider text-[11px] font-bold text-base-content/60">
                          Expected Approvers
                        </span>
                      </label>
                      <div className="input input-bordered w-full bg-base-200/30 text-base-content/70 h-11 flex items-center px-3">
                        {selectedDeps.length * (hierarchyCount ?? 0) +
                          selectedDeps.length}
                      </div>
                      <p className="text-xs text-base-content/50 mt-1">
                        Based on selected departments, makers and hierarchy
                        count.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dynamic Generated Approver Assignments Module Matrix */}
                {selectedDeps.length > 0 && hierarchyLevels.length > 0 && (
                  <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body gap-6">
                      <div className="flex items-center gap-3 border-b border-base-200 pb-4">
                        <div className="badge badge-info text-info-content w-7 h-7 font-mono p-0 rounded-full flex items-center justify-center text-xs">
                          03
                        </div>
                        <div>
                          <h2 className="card-title text-lg font-bold">
                            Approver Assignment Matrix
                          </h2>
                          <p className="text-xs text-base-content/60">
                            Search and map employee signatures required per
                            assigned division tier.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {selectedDeps.map((dept) => (
                          <div
                            key={dept}
                            className="bg-base-200/20 border border-base-200 rounded-xl p-4 space-y-4"
                          >
                            <div className="flex items-center justify-between gap-3 border-b border-base-200/60 pb-2">
                              <h3 className="font-bold text-sm text-base-content tracking-wide">
                                {dept} Approval Chain
                              </h3>
                              <div className="text-[10px] uppercase tracking-[0.14em] text-base-content/50">
                                1 Maker + {hierarchyCount ?? 0} Levels
                              </div>
                            </div>

                            <div className="form-control w-full max-w-md">
                              <label className="label py-0">
                                <span className="label-text text-xs font-semibold text-base-content/70">
                                  Maker ID
                                </span>
                              </label>

                              <details className="dropdown w-full relative">
                                <summary className="btn btn-sm btn-outline border-base-300 bg-base-100 text-base-content justify-between w-full font-medium rounded-md normal-case list-none h-9 px-3">
                                  {makers[dept] ? (
                                    <span className="text-sm font-semibold truncate text-neutral">
                                      {makers[dept].id} — {makers[dept].name}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-base-content/40 font-normal">
                                      Select Maker ID...
                                    </span>
                                  )}
                                  <span className="text-xs text-base-content/40">
                                    ▼
                                  </span>
                                </summary>

                                <span
                                  className="fixed inset-0 z-10 cursor-default"
                                  onClick={(e) =>
                                    e.currentTarget.parentElement?.removeAttribute(
                                      "open",
                                    )
                                  }
                                />

                                <div className="dropdown-content menu p-2 shadow-xl bg-base-100 border border-base-200 rounded-lg w-full min-w-60 mt-1 space-y-2 z-20 absolute left-0 top-full">
                                  <input
                                    type="text"
                                    placeholder="Search by name or Employee ID..."
                                    value={makerSearchTerms[dept] || ""}
                                    onChange={(e) =>
                                      setMakerSearchTerms({
                                        ...makerSearchTerms,
                                        [dept]: e.target.value,
                                      })
                                    }
                                    className="input input-xs input-bordered w-full bg-base-200/40 text-xs h-8 pl-2"
                                  />

                                  <div className="max-h-36 overflow-y-auto space-y-0.5">
                                    {EMPLOYEE_REGISTRY.filter(
                                      (emp) =>
                                        emp.name
                                          .toLowerCase()
                                          .includes(
                                            (
                                              makerSearchTerms[dept] || ""
                                            ).toLowerCase(),
                                          ) ||
                                        emp.id
                                          .toLowerCase()
                                          .includes(
                                            (
                                              makerSearchTerms[dept] || ""
                                            ).toLowerCase(),
                                          ),
                                    ).length === 0 ? (
                                      <span className="text-xs text-base-content/40 p-2 block text-center">
                                        No employee records match
                                      </span>
                                    ) : (
                                      EMPLOYEE_REGISTRY.filter(
                                        (emp) =>
                                          emp.name
                                            .toLowerCase()
                                            .includes(
                                              (
                                                makerSearchTerms[dept] || ""
                                              ).toLowerCase(),
                                            ) ||
                                          emp.id
                                            .toLowerCase()
                                            .includes(
                                              (
                                                makerSearchTerms[dept] || ""
                                              ).toLowerCase(),
                                            ),
                                      ).map((emp) => (
                                        <button
                                          key={emp.id}
                                          type="button"
                                          onClick={(
                                            event: MouseEvent<HTMLButtonElement>,
                                          ) => {
                                            setMakers({
                                              ...makers,
                                              [dept]: {
                                                id: emp.id,
                                                name: emp.name,
                                              },
                                            });
                                            setMakerSearchTerms({
                                              ...makerSearchTerms,
                                              [dept]: "",
                                            });
                                            (
                                              document.activeElement as HTMLElement
                                            )?.blur();
                                            const detailsElement = (
                                              event.currentTarget as HTMLElement
                                            ).closest("details");
                                            detailsElement?.removeAttribute(
                                              "open",
                                            );
                                          }}
                                          className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-base-200 flex justify-between text-base-content"
                                        >
                                          <span className="font-medium">
                                            {emp.name}
                                          </span>
                                          <span className="text-base-content/50 font-mono text-[10px]">
                                            {emp.id}
                                          </span>
                                        </button>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </details>
                            </div>

                            {/* Grid loops through your hierarchy levels count integer */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {hierarchyLevels.map((level) => {
                                const uniqueKey = `${dept}-Level ${level}`;
                                const currentSearch =
                                  empSearchTerms[uniqueKey] || "";
                                const currentSignee = approvers[uniqueKey];

                                // Filter employee lookup list based on typed query values
                                const filteredEmps = EMPLOYEE_REGISTRY.filter(
                                  (emp) =>
                                    emp.name
                                      .toLowerCase()
                                      .includes(currentSearch.toLowerCase()) ||
                                    emp.id
                                      .toLowerCase()
                                      .includes(currentSearch.toLowerCase()),
                                );

                                return (
                                  <div
                                    key={uniqueKey}
                                    className="form-control w-full gap-1"
                                  >
                                    <label className="label py-0">
                                      <span className="label-text text-xs font-semibold text-base-content/70">
                                        Level {level} Signee
                                      </span>
                                    </label>

                                    {/* Native Details Dropdown container that snaps shut on click-outside */}
                                    <details className="dropdown w-full relative">
                                      <summary className="btn btn-sm btn-outline border-base-300 bg-base-100 text-base-content justify-between w-full font-medium rounded-md normal-case list-none h-9 px-3">
                                        {currentSignee ? (
                                          <span className="text-sm font-semibold truncate text-neutral">
                                            {currentSignee.id} —{" "}
                                            {currentSignee.name}
                                          </span>
                                        ) : (
                                          <span className="text-xs text-base-content/40 font-normal">
                                            Select Level {level} Approver...
                                          </span>
                                        )}
                                        <span className="text-xs text-base-content/40">
                                          ▼
                                        </span>
                                      </summary>

                                      {/* Fullscreen backdrop to catch out-of-bounds page taps and snap menu shut */}
                                      <span
                                        className="fixed inset-0 z-10 cursor-default"
                                        onClick={(e) =>
                                          e.currentTarget.parentElement?.removeAttribute(
                                            "open",
                                          )
                                        }
                                      />

                                      {/* Dropdown Content Box */}
                                      <div className="dropdown-content menu p-2 shadow-xl bg-base-100 border border-base-200 rounded-lg w-full min-w-60 mt-1 space-y-2 z-20 absolute left-0 top-full">
                                        <input
                                          type="text"
                                          placeholder="Search by name or Employee ID..."
                                          value={currentSearch}
                                          onChange={(e) =>
                                            setEmpSearchTerms({
                                              ...empSearchTerms,
                                              [uniqueKey]: e.target.value,
                                            })
                                          }
                                          className="input input-xs input-bordered w-full bg-base-200/40 text-xs h-8 pl-2"
                                        />

                                        <div className="max-h-36 overflow-y-auto space-y-0.5">
                                          {filteredEmps.length === 0 ? (
                                            <span className="text-xs text-base-content/40 p-2 block text-center">
                                              No employee records match
                                            </span>
                                          ) : (
                                            filteredEmps.map((emp) => (
                                              <button
                                                key={emp.id}
                                                type="button"
                                                onClick={(
                                                  event: MouseEvent<HTMLButtonElement>,
                                                ) => {
                                                  setApprovers({
                                                    ...approvers,
                                                    [uniqueKey]: {
                                                      id: emp.id,
                                                      name: emp.name,
                                                    },
                                                  });
                                                  setEmpSearchTerms({
                                                    ...empSearchTerms,
                                                    [uniqueKey]: "",
                                                  });
                                                  (
                                                    document.activeElement as HTMLElement
                                                  )?.blur();
                                                  const detailsElement = (
                                                    event.currentTarget as HTMLElement
                                                  ).closest("details");
                                                  detailsElement?.removeAttribute(
                                                    "open",
                                                  );
                                                }}
                                                className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-base-200 flex justify-between text-base-content"
                                              >
                                                <span className="font-medium">
                                                  {emp.name}
                                                </span>
                                                <span className="text-base-content/50 font-mono text-[10px]">
                                                  {emp.id}
                                                </span>
                                              </button>
                                            ))
                                          )}
                                        </div>
                                      </div>
                                    </details>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar (Sticky) */}
          <div className="lg:sticky lg:top-24">
            <div className="card bg-base-100 shadow-md border border-base-300">
              <div className="card-body gap-5">
                <h2 className="card-title text-base font-bold border-b border-base-200 pb-3">
                  Draft Summary
                </h2>

                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60">Status</span>
                    <span className="badge badge-ghost font-semibold tracking-wider text-[11px]">
                      DRAFT
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60">
                      Total Departments
                    </span>
                    <span className="font-bold text-base-content">
                      {selectedDeps.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60">
                      Total Approvers
                    </span>
                    <span className="font-bold text-base-content">
                      {totalAssignedApprovers}
                    </span>
                  </div>
                  {totalExpectedApprovers !== totalAssignedApprovers && (
                    <div className="flex justify-between items-center text-xs text-base-content/50">
                      <span>Expected</span>
                      <span>{totalExpectedApprovers}</span>
                    </div>
                  )}
                </div>

                <div className="card-actions flex-col gap-2 mt-4 w-full">
                  <button
                    type="submit"
                    className="btn btn-neutral w-full gap-2 rounded-xl normal-case"
                  >
                    <FileText size={16} />
                    Initialize Project
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm w-full normal-case text-base-content/70 hover:text-base-content"
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
