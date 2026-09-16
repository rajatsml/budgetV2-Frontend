import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DeleteNonPDMaster,
  GetNonPDApprovalHistory,
  GetNonPDMaster,
  GetDropdownData,
  InitializeNonPDMaster,
  SaveNonPDMaster,
  UpdateNonPDStatus,
  UpdateNonPDMaster,
} from "../../service/projectmaster";
import useUserStore from "../../store/userStore";
import NonPDApproverHistory from "./NonPDApproverHistory";

type Field = { key: string; label: string; numeric?: boolean };

const generalFields: Field[] = [
  { key: "Division", label: "Division" },
  { key: "Category", label: "Category" },
  { key: "Group", label: "Group" },
  { key: "Location", label: "Location" },
  { key: "ProjectUnit", label: "Project Unit" },
  { key: "ItemDescription", label: "Item Description" },
  {
    key: "CurrentScenerioJustification",
    label: "Current Scenario / Justification for New Requirement",
  },
  { key: "DeliverablesKPI", label: "Deliverables KPI" },
  { key: "BudgetBasedOn", label: "Budget Based On" },
  { key: "RequestFor", label: "Request For" },
  { key: "Financial", label: "Financial" },
  { key: "ProjectOwner", label: "Project Owner" },
  { key: "ExpenditureType", label: "Expenditure Type" },
  { key: "TemplateCategory", label: "Template Category" },
  { key: "ProjectName", label: "Project Name" },
  { key: "Criticality", label: "Criticality" }, // ADDED NEW CATEGORY
  { key: "Quantity", label: "Quantity", numeric: true },
  { key: "UnitOfMeasure", label: "Unit Of Measure" },
  { key: "TypeOfPurchase", label: "Type Of Purchase" },
  { key: "Currency", label: "Currency" },
  { key: "UnitRate", label: "Unit Rate", numeric: true },
  { key: "ExchangeRate", label: "Exchange Rate", numeric: true },
  { key: "BasicsInLac", label: "Basic In Lacs", numeric: true },
  { key: "NRTaxPercentage", label: "Tax %", numeric: true },
  { key: "NetCost", label: "Net Cost", numeric: true },
];

const months = [
  ["Apr", "Apr"],
  ["May", "May"],
  ["Jun", "Jun"],
  ["Jul", "Jul"],
  ["Aug", "Aug"],
  ["Sep", "Sep"],
  ["Oct", "Oct"],
  ["Nov", "Nov"],
  ["Dec", "Dec"],
  ["Jan", "Jan"],
  ["Feb", "Feb"],
  ["Mar", "Mar"],
] as const;
const halfYears = [
  ["Fy2H1", "FY2 H1"],
  ["Fy2H2", "FY2 H2"],
  ["Fy3H1", "FY3 H1"],
  ["Fy3H2", "FY3 H2"],
  ["Fy4H1", "FY4 H1"],
  ["Fy4H2", "FY4 H2"],
  ["Fy5H1", "FY5 H1"],
  ["Fy5H2", "FY5 H2"],
] as const;
const fy1HalfYears = [
  ["Fy1H1", "H1 FY1"],
  ["Fy1H2", "H2 FY1"],
] as const;
const budgetContextFields = generalFields.slice(0, 6);
const derivedBudgetFields: Field[] = [
  { key: "TotalCommitment", label: "Total Project Commitment", numeric: true },
  { key: "TotalCashFlow", label: "Total Project Cash Flow", numeric: true },
  { key: "FY1Commitment", label: "FY1 Commitment", numeric: true },
  { key: "FY2Commitment", label: "FY2 Commitment", numeric: true },
  { key: "FY3Commitment", label: "FY3 Commitment", numeric: true },
  { key: "FY4Commitment", label: "FY4 Commitment", numeric: true },
  { key: "FY5Commitment", label: "FY5 Commitment", numeric: true },
  { key: "FY1CashFlow", label: "FY1 Cash Flow", numeric: true },
  { key: "FY2CashFlow", label: "FY2 Cash Flow", numeric: true },
  { key: "FY3CashFlow", label: "FY3 Cash Flow", numeric: true },
  { key: "FY4CashFlow", label: "FY4 Cash Flow", numeric: true },
  { key: "FY5CashFlow", label: "FY5 Cash Flow", numeric: true },
  { key: "H1FY1Commitment", label: "H1 FY1 Commitment", numeric: true },
  { key: "H2FY1Commitment", label: "H2 FY1 Commitment", numeric: true },
  { key: "H1FY2Commitment", label: "H1 FY2 Commitment", numeric: true },
  { key: "H2FY2Commitment", label: "H2 FY2 Commitment", numeric: true },
  { key: "H1FY1CashFlow", label: "H1 FY1 Cash Flow", numeric: true },
  { key: "H2FY1CashFlow", label: "H2 FY1 Cash Flow", numeric: true },
  { key: "H1FY2CashFlow", label: "H1 FY2 Cash Flow", numeric: true },
  { key: "H2FY2CashFlow", label: "H2 FY2 Cash Flow", numeric: true },
];
const summaryFields: Field[] = [
  { key: "TotalCommitment", label: "Total Project Commitment", numeric: true },
  { key: "TotalCashFlow", label: "Total Project Cash Flow", numeric: true },
  { key: "FY1Commitment", label: "FY1 Commitment", numeric: true },
  { key: "FY2Commitment", label: "FY2 Commitment", numeric: true },
  { key: "FY3Commitment", label: "FY3 Commitment", numeric: true },
  { key: "FY4Commitment", label: "FY4 Commitment", numeric: true },
  { key: "FY5Commitment", label: "FY5 Commitment", numeric: true },
  { key: "FY1CashFlow", label: "FY1 Cash Flow", numeric: true },
  { key: "FY2CashFlow", label: "FY2 Cash Flow", numeric: true },
  { key: "FY3CashFlow", label: "FY3 Cash Flow", numeric: true },
  { key: "FY4CashFlow", label: "FY4 Cash Flow", numeric: true },
  { key: "FY5CashFlow", label: "FY5 Cash Flow", numeric: true },
  { key: "H1FY1Commitment", label: "H1 FY1 Commitment", numeric: true },
  { key: "H2FY1Commitment", label: "H2 FY1 Commitment", numeric: true },
  { key: "H1FY2Commitment", label: "H1 FY2 Commitment", numeric: true },
  { key: "H2FY2Commitment", label: "H2 FY2 Commitment", numeric: true },
  { key: "H1FY1CashFlow", label: "H1 FY1 Cash Flow", numeric: true },
  { key: "H2FY1CashFlow", label: "H2 FY1 Cash Flow", numeric: true },
  { key: "H1FY2CashFlow", label: "H1 FY2 Cash Flow", numeric: true },
  { key: "H2FY2CashFlow", label: "H2 FY2 Cash Flow", numeric: true },
];

const numberValue = (value: unknown) => Number(value || 0);
const amountValue = (value: unknown) => numberValue(value).toFixed(2);
const totalOf = (values: unknown[]): number =>
  values.reduce<number>((total, value) => total + numberValue(value), 0);
const detailId = (row: Record<string, unknown>) => {
  const key = Object.keys(row).find(
    (candidate) => candidate.toLowerCase() === "nonpddetailid",
  );
  return key ? String(row[key] ?? "") : "";
};

const findSavedRow = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    for (const item of value) {
      const match = findSavedRow(item);
      if (detailId(match)) return match;
    }
    return {};
  }
  if (!value || typeof value !== "object") return {};

  const object = value as Record<string, unknown>;
  if (detailId(object)) return object;

  for (const nested of Object.values(object)) {
    const match = findSavedRow(nested);
    if (detailId(match)) return match;
  }

  return {};
};

const dropdownTypes: Record<string, string> = {
  Division: "8",
  Category: "9",
  Group: "10",
  Location: "11",
  ProjectUnit: "12",
  BudgetBasedOn: "13",
  RequestFor: "14",
  Financial: "15",
  TemplateCategory: "16",
  UnitOfMeasure: "17",
  Currency: "18",
  TypeOfPurchase: "19",
  ExpenditureType: "20",
  ProjectName: "21",
  Criticality: "22", //ADDED CRITCALITY
};

const NonPDInput = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((store: any) => store.user);
  const [tab, setTab] = useState<0 | 1 | 2>(1);
  const [form, setForm] = useState<Record<string, any>>({
    NRTaxPercentage: "18",
  });
  const [budgetForm, setBudgetForm] = useState<Record<string, any>>({});
  const [rows, setRows] = useState<any[]>([]);
  const [approvalHistory, setApprovalHistory] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [ownerSearchTerm, setOwnerSearchTerm] = useState("");
  const [ownerMenuPosition, setOwnerMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 260,
  });
  const [ownerMenuOpen, setOwnerMenuOpen] = useState(false);
  const ownerMenuRef = useRef<HTMLDivElement>(null);
  const ownerTriggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownOptions, setDropdownOptions] = useState<
    Record<string, Array<{ value: string; label: string }>>
  >({});
  const [masterRecordId, setMasterRecordId] = useState(
    String(state?.recordId || state?.RecordId || ""),
  );
  const [selectedRowId, setSelectedRowId] = useState("");
  const [editingDetailId, setEditingDetailId] = useState("");
  const [saving, setSaving] = useState(false);
  const status = String(state?.status || "").toUpperCase();
  const pendingWithUser = String(
    state?.pendingWithUser ??
      state?.PendingWithUser ??
      state?.pendingWithUserId ??
      state?.PendingWithUserId ??
      "",
  );
  const currentUserId = String(user?.userId ?? user?.id ?? "");
  const pendingWithMaker =
    !masterRecordId ||
    (pendingWithUser !== "" &&
      currentUserId !== "" &&
      pendingWithUser === currentUserId);
  const readOnly =
    status !== "" &&
    !["OPEN", "OPENED", "DRAFT", "NEW", "REVIEW_BACK", "RETURNED"].includes(
      status,
    );

  const projectId = state?.projectID || state?.ProjectId || "";
  const deptId =
    state?.deptID ||
    state?.DeptId ||
    user?.roles?.[0]?.departmentId ||
    user?.deptCode ||
    "";

  const load = async (recordId = masterRecordId) => {
    if (!deptId || !recordId) return [];
    const result = await GetNonPDMaster(
      projectId || undefined,
      deptId,
      recordId,
    );
    const list = Array.isArray(result) ? result : result?.items || [];
    if (list.length > 0) {
      setRows(list);
      setTab(0);
    } else {
      setTab(1);
    }
    if (editingDetailId) {
      const row = list.find(
        (item: any) => String(detailId(item)) === editingDetailId,
      );
      if (row) setForm(row);
    }
    return list;
  };

  const submitForApproval = async () => {
    if (readOnly || !rows.length) {
      alert("Please save at least one row before submitting for approval.");
      return;
    }
    const projectCommitment = rows.reduce(
      (total, row) =>
        total +
        numberValue(
          row.TotalCommitment ??
            totalOf([
              row.FY1Commitment,
              row.FY2Commitment,
              row.FY3Commitment,
              row.FY4Commitment,
              row.FY5Commitment,
            ]),
        ),
      0,
    );
    const projectCashFlow = rows.reduce(
      (total, row) =>
        total +
        numberValue(
          row.TotalCashFlow ??
            totalOf([
              row.FY1CashFlow,
              row.FY2CashFlow,
              row.FY3CashFlow,
              row.FY4CashFlow,
              row.FY5CashFlow,
            ]),
        ),
      0,
    );
    if (projectCashFlow > projectCommitment + 0.000001) {
      alert("Project CashFlow Cannot be geater than the Project Commitment");
      return;
    }
    setSaving(true);
    try {
      const response = await UpdateNonPDStatus({
        projectId: String(masterRecordId),
        deptId: String(deptId),
        userId: String(user?.userId || ""),
        actionPerformed: "POSTED",
        approvalRemarks: "Submitted for approval",
      });
      alert(response?.message || "Submitted for approval.");
      navigate("/nonpd-records");
    } catch (error) {
      console.error("Non-PD submission failed", error);
      alert("Unable to submit this project for approval.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    void load();
  }, [projectId, deptId, masterRecordId]);

  useEffect(() => {
    if (!masterRecordId || !deptId) return;
    void GetNonPDApprovalHistory(masterRecordId, String(deptId))
      .then((result) => setApprovalHistory(Array.isArray(result) ? result : []))
      .catch((error) => {
        console.error("Unable to load Non-PD approval history", error);
        setApprovalHistory([]);
      });
  }, [masterRecordId, deptId]);

  useEffect(() => {
    void GetDropdownData(
      `2?search=${encodeURIComponent(ownerSearchTerm)}&page=1&pageSize=50`,
    )
      .then((result) => {
        const options = Array.isArray(result) ? result : [];
        setEmployees(options);
      })
      .catch((error) => {
        console.error("Unable to load project owner options", error);
        setEmployees([]);
      });
  }, [deptId, ownerSearchTerm]);

  useEffect(() => {
    if (!ownerMenuOpen) return;

    const updateOwnerMenuPosition = () => {
      const trigger = ownerTriggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const width = Math.max(rect.width, 260);
      const left = Math.min(
        Math.max(8, rect.left),
        Math.max(8, window.innerWidth - width - 8),
      );
      const menuHeight = Math.min(
        320,
        Math.max(180, window.innerHeight - rect.bottom - 16),
      );
      const top =
        rect.bottom + menuHeight <= window.innerHeight - 8
          ? rect.bottom + 4
          : Math.max(8, rect.top - menuHeight - 4);
      setOwnerMenuPosition({ top, left, width });
    };

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Node && !ownerMenuRef.current?.contains(target)) {
        setOwnerMenuOpen(false);
      }
    };

    updateOwnerMenuPosition();
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("scroll", updateOwnerMenuPosition, true);
    window.addEventListener("resize", updateOwnerMenuPosition);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("scroll", updateOwnerMenuPosition, true);
      window.removeEventListener("resize", updateOwnerMenuPosition);
    };
  }, [ownerMenuOpen]);

  useEffect(() => {
    const entries = Object.entries(dropdownTypes);
    void Promise.all(
      entries.map(async ([field, type]) => {
        const result = await GetDropdownData(type);
        const options = (Array.isArray(result) ? result : [])
          .map((item: any) => {
            const text =
              item.text ??
              item.Text ??
              item.label ??
              item.Label ??
              item.name ??
              item.Name ??
              item.description ??
              item.Description;
            const value =
              text ??
              item.value ??
              item.Value ??
              item.id ??
              item.Id ??
              item.code ??
              item.Code;
            return {
              value: String(value ?? ""),
              label: String(text ?? value ?? ""),
            };
          })
          .filter((option) => option.value);
        return [field, options] as const;
      }),
    )
      .then((loaded) => setDropdownOptions(Object.fromEntries(loaded)))
      .catch((error) => {
        console.error("Unable to load Non-PD dropdown options", error);
        setDropdownOptions({});
      });
  }, []);

  const setFormValue = (key: string, value: string) =>
    setForm((previous) => {
      const next = { ...previous, [key]: value };
      if (
        key === "Quantity" ||
        key === "UnitRate" ||
        key === "NRTaxPercentage"
      ) {
        const basic = numberValue(next.Quantity) * numberValue(next.UnitRate);
        const taxRate = numberValue(next.NRTaxPercentage || 18);
        next.BasicsInLac = String(basic);
        next.NetCost = String(basic + (basic * taxRate) / 100);
      }
      if (key === "NRTaxPercentage" && !value) {
        next.NRTaxPercentage = "18";
      }
      return next;
    });
  const setBudgetValue = (key: string, value: string) =>
    setBudgetForm((previous) => ({ ...previous, [key]: value }));

  const fieldInput = (
    field: Field,
    values: Record<string, any>,
    onChange: (key: string, value: string) => void,
  ) => {
    const isCalculated = field.key === "BasicsInLac" || field.key === "NetCost";
    if (field.key === "ProjectOwner") {
      const current = String(values[field.key] ?? "");
      const selectedEmployee = employees.find(
        (employee) =>
          employee.text === current ||
          employee.employeeName === current ||
          employee.EmployeeName === current ||
          employee.name === current,
      );
      return (
        <div ref={ownerMenuRef} className="relative min-w-48">
          <button
            ref={ownerTriggerRef}
            type="button"
            className="btn btn-xs w-full justify-between border border-base-300 bg-slate-50/30 text-left font-normal normal-case"
            onClick={() => {
              if (!ownerMenuOpen) {
                const rect = ownerTriggerRef.current?.getBoundingClientRect();
                if (rect) {
                  setOwnerMenuPosition({
                    top: rect.bottom + 4,
                    left: rect.left,
                    width: Math.max(rect.width, 260),
                  });
                }
              }
              setOwnerMenuOpen((open) => !open);
            }}
            disabled={readOnly}
          >
            <span className="truncate">
              {selectedEmployee
                ? `${selectedEmployee.value} — ${selectedEmployee.text}`
                : current || "Select"}
            </span>
            <span className="text-[10px]">▼</span>
          </button>
          {ownerMenuOpen && (
            <div
              className="fixed z-100 rounded border border-base-200 bg-base-100 p-2 shadow-xl"
              style={{
                top: ownerMenuPosition.top,
                left: ownerMenuPosition.left,
                width: ownerMenuPosition.width,
              }}
            >
              <input
                type="text"
                placeholder="Type name or ID to filter..."
                value={ownerSearchTerm}
                onChange={(event) => setOwnerSearchTerm(event.target.value)}
                className="input input-xs input-bordered mb-2 w-full"
                disabled={readOnly}
                autoFocus
              />
              <div className="max-h-48 overflow-y-auto">
                <button
                  type="button"
                  className="block w-full rounded px-2 py-1.5 text-left text-xs hover:bg-slate-100"
                  onClick={() => {
                    onChange(field.key, "");
                    setOwnerSearchTerm("");
                    setOwnerMenuOpen(false);
                  }}
                >
                  Select
                </button>
                {employees.length ? (
                  employees.map((employee: any) => {
                    const employeeId =
                      employee.value ??
                      employee.Value ??
                      employee.employeeId ??
                      employee.EmployeeId ??
                      "";
                    const employeeName =
                      employee.text ??
                      employee.Text ??
                      employee.employeeName ??
                      employee.EmployeeName ??
                      employee.name ??
                      "";
                    return (
                      <button
                        key={`${employeeId}-${employeeName}`}
                        type="button"
                        className="block w-full rounded px-2 py-1.5 text-left text-xs hover:bg-slate-100"
                        onClick={() => {
                          onChange(field.key, String(employeeName));
                          setOwnerSearchTerm("");
                          setOwnerMenuOpen(false);
                        }}
                      >
                        {employeeId} — {employeeName}
                      </button>
                    );
                  })
                ) : (
                  <span className="block p-2 text-center text-xs opacity-60">
                    No matching employees found
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    const options = dropdownOptions[field.key] || [];

    if (options.length) {
      const current = String(values[field.key] ?? "");
      return (
        <select
          className="select select-bordered select-xs min-w-32"
          value={current}
          onChange={(event) => onChange(field.key, event.target.value)}
          disabled={readOnly}
        >
          <option value="">Select</option>
          {current && !options.some((option) => option.value === current) && (
            <option value={current}>{current}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.numeric ? "number" : "text"}
        step={field.numeric ? "any" : undefined}
        className="input input-bordered input-xs min-w-32"
        value={values[field.key] ?? (field.key === "NRTaxPercentage" ? 18 : "")}
        onChange={(event) => onChange(field.key, event.target.value)}
        disabled={readOnly || isCalculated}
      />
    );
  };

  const financialTotalFor = (
    values: Record<string, any>,
    prefix: "Commitment" | "CashFlow",
  ) =>
    totalOf([
      totalOf(months.slice(0, 6).map(([key]) => values[`${key}${prefix}`])),
      totalOf(months.slice(6).map(([key]) => values[`${key}${prefix}`])),
      ...halfYears.map(([key]) => values[`${prefix}_${key}`]),
    ]);
  const financialFy1For = (
    values: Record<string, any>,
    prefix: "Commitment" | "CashFlow",
  ) => totalOf(months.map(([key]) => values[`${key}${prefix}`]));
  const financialFy1H1For = (
    values: Record<string, any>,
    prefix: "Commitment" | "CashFlow",
  ) => totalOf(months.slice(0, 6).map(([key]) => values[`${key}${prefix}`]));
  const financialFy1H2For = (
    values: Record<string, any>,
    prefix: "Commitment" | "CashFlow",
  ) => totalOf(months.slice(6).map(([key]) => values[`${key}${prefix}`]));
  const financialTotal = (prefix: "Commitment" | "CashFlow") =>
    financialTotalFor(budgetForm, prefix);
  const financialFy1 = (prefix: "Commitment" | "CashFlow") =>
    financialFy1For(budgetForm, prefix);
  const financialFy1H1 = (prefix: "Commitment" | "CashFlow") =>
    financialFy1H1For(budgetForm, prefix);
  const financialFy1H2 = (prefix: "Commitment" | "CashFlow") =>
    financialFy1H2For(budgetForm, prefix);
  const savedHalfYearValue = (
    row: Record<string, any>,
    prefix: "Commitment" | "CashFlow",
    key: "Fy1H1" | "Fy1H2" | "Fy2H1" | "Fy2H2",
  ) =>
    row[`${prefix}_${key}`] ??
    row[`${prefix}_${key.replace("Fy", "FY")}`] ??
    row[
      `${prefix}_${
        key === "Fy1H1"
          ? "H1FY1"
          : key === "Fy1H2"
            ? "H2FY1"
            : key === "Fy2H1"
              ? "H1FY2"
              : "H2FY2"
      }`
    ] ??
    "-";

  const saveGeneral = async () => {
    if (readOnly) return;
    if (!Object.values(form).some((value) => String(value ?? "").trim())) {
      alert("Please enter at least one general value.");
      return;
    }
    setSaving(true);
    try {
      const generalPayload: Record<string, unknown> = {
        ...form,
        NRTaxPercentage:
          form.NRTaxPercentage === "" || form.NRTaxPercentage == null
            ? "18"
            : String(form.NRTaxPercentage),
        BasicsInLac: form.BasicsInLac == null ? "" : String(form.BasicsInLac),
        NetCost: form.NetCost == null ? "" : String(form.NetCost),
        UnitOfMeasure: String(form.UnitOfMeasure || "")
          .toLowerCase()
          .startsWith("decimal")
          ? "decimal"
          : form.UnitOfMeasure == null
            ? ""
            : String(form.UnitOfMeasure),
      };
      let recordId = masterRecordId;
      if (!recordId) {
        const initialized = await InitializeNonPDMaster({
          DeptId: String(deptId),
          UserId: user?.userId,
        });
        recordId = String(initialized?.recordId || initialized?.RecordId || "");
        if (!recordId) throw new Error("Initialize did not return RecordId");
        setMasterRecordId(recordId);
      }
      const saved = await (editingDetailId
        ? UpdateNonPDMaster(
            {
              ...generalPayload,
              ProjectId: projectId,
              RecordId: recordId,
              DeptId: String(deptId),
              UserId: user?.userId,
              DraftStatus: "COMPLETE",
            },
            editingDetailId,
          )
        : SaveNonPDMaster({
            ...generalPayload,
            ProjectId: projectId,
            RecordId: recordId,
            DeptId: String(deptId),
            UserId: user?.userId,
            DraftStatus: "COMPLETE",
          }));
      const responseRow = findSavedRow(saved);
      const savedRow = {
        ...generalPayload,
        ProjectId: projectId,
        RecordId: recordId,
        DeptId: String(deptId),
        UserId: user?.userId,
        DraftStatus: "COMPLETE",
        ...responseRow,
      };
      let savedDetailId = detailId(savedRow) || editingDetailId;

      if (!savedDetailId) {
        const refreshedRows = await load(recordId);
        const matchingRow = refreshedRows.find(
          (row: any) =>
            row.RecordId === recordId &&
            row.ProjectName === generalPayload.ProjectName &&
            row.ItemDescription === generalPayload.ItemDescription,
        );
        if (matchingRow) {
          Object.assign(savedRow, matchingRow);
          savedDetailId = detailId(savedRow);
        }
      }

      setRows((previous) => {
        if (!savedDetailId) return [...previous, savedRow];
        const index = previous.findIndex(
          (row) => detailId(row) === savedDetailId,
        );
        if (index < 0) return [...previous, savedRow];
        return previous.map((row, rowIndex) =>
          rowIndex === index ? savedRow : row,
        );
      });
      if (savedDetailId) {
        await load(recordId);
      }
      setForm({ NRTaxPercentage: "18" });
      setEditingDetailId("");
    } catch (error) {
      console.error("Non-PD general save failed", error);
      alert("Unable to save the general data.");
    } finally {
      setSaving(false);
    }
  };

  const selectBudgetRow = (row: any) => {
    const id = String(detailId(row));
    if (!id) {
      alert(
        "The saved general row has no detail ID. Please refresh and try again.",
      );
      return;
    }
    setSelectedRowId(id);
    setBudgetForm(row);
  };

  const saveBudget = async () => {
    if (readOnly) return;
    if (!selectedRowId) {
      alert("Select a general row before entering budget inputs.");
      return;
    }
    const hasBudgetValue = Object.entries(budgetForm).some(
      ([key, value]) =>
        (key.includes("Commitment") || key.includes("CashFlow")) &&
        String(value ?? "").trim(),
    );
    if (!hasBudgetValue) {
      alert("Please enter at least one commitment or cash-flow value.");
      return;
    }
    setSaving(true);
    try {
      const row = rows.find((item) => String(detailId(item)) === selectedRowId);
      if (!row || !detailId(row)) {
        throw new Error("Selected general row has no detail ID");
      }
      await UpdateNonPDMaster(
        {
          ...row,
          ...budgetForm,
          RecordId: masterRecordId,
          DeptId: String(deptId),
          UserId: user?.userId,
          DraftStatus: "COMPLETE",
        },
        selectedRowId,
      );
      const updatedValues = { ...row, ...budgetForm };
      const updatedRow = {
        ...updatedValues,
        TotalCommitment: financialTotalFor(updatedValues, "Commitment"),
        TotalCashFlow: financialTotalFor(updatedValues, "CashFlow"),
        FY1Commitment: financialFy1For(updatedValues, "Commitment"),
        FY1CashFlow: financialFy1For(updatedValues, "CashFlow"),
        Commitment_Fy1H1: financialFy1H1For(updatedValues, "Commitment"),
        CashFlow_Fy1H1: financialFy1H1For(updatedValues, "CashFlow"),
        Commitment_Fy1H2: financialFy1H2For(updatedValues, "Commitment"),
        CashFlow_Fy1H2: financialFy1H2For(updatedValues, "CashFlow"),
      };
      setRows((previous) =>
        previous.map((item) =>
          detailId(item) === selectedRowId ? updatedRow : item,
        ),
      );
      setBudgetForm({});
      setSelectedRowId("");
    } catch (error) {
      console.error("Non-PD budget save failed", error);
      alert("Unable to save the budget inputs.");
    } finally {
      setSaving(false);
    }
  };

  const editGeneral = (row: any) => {
    setEditingDetailId(String(detailId(row)));
    setForm(row);
    setTab(1);
  };
  const remove = async (id: string) => {
    if (readOnly) return;
    if (!window.confirm("Delete this record?")) return;
    await DeleteNonPDMaster(Number(id));
    await load();
  };

  const generalHeaders = generalFields.map((field) => (
    <th key={field.key}>{field.label}</th>
  ));
  const savedGeneralHeaders = [...generalFields, ...derivedBudgetFields].map(
    (field) => <th key={field.key}>{field.label}</th>,
  );
  const savedGeneralTotal = (field: Field) => {
    const value = rows.reduce((sum, row) => {
      if (field.key === "H1FY1Commitment") {
        return (
          sum + numberValue(savedHalfYearValue(row, "Commitment", "Fy1H1"))
        );
      }
      if (field.key === "H2FY1Commitment") {
        return (
          sum + numberValue(savedHalfYearValue(row, "Commitment", "Fy1H2"))
        );
      }
      if (field.key === "H1FY2Commitment") {
        return (
          sum + numberValue(savedHalfYearValue(row, "Commitment", "Fy2H1"))
        );
      }
      if (field.key === "H2FY2Commitment") {
        return (
          sum + numberValue(savedHalfYearValue(row, "Commitment", "Fy2H2"))
        );
      }
      if (field.key === "H1FY1CashFlow") {
        return sum + numberValue(savedHalfYearValue(row, "CashFlow", "Fy1H1"));
      }
      if (field.key === "H2FY1CashFlow") {
        return sum + numberValue(savedHalfYearValue(row, "CashFlow", "Fy1H2"));
      }
      if (field.key === "H1FY2CashFlow") {
        return sum + numberValue(savedHalfYearValue(row, "CashFlow", "Fy2H1"));
      }
      if (field.key === "H2FY2CashFlow") {
        return sum + numberValue(savedHalfYearValue(row, "CashFlow", "Fy2H2"));
      }
      return sum + numberValue(row[field.key]);
    }, 0);
    return field.numeric ? value.toFixed(2) : "";
  };
  const savedFieldValue = (row: any, field: Field) => {
    if (field.key === "H1FY1Commitment") {
      return savedHalfYearValue(row, "Commitment", "Fy1H1");
    }
    if (field.key === "H2FY1Commitment") {
      return savedHalfYearValue(row, "Commitment", "Fy1H2");
    }
    if (field.key === "H1FY2Commitment") {
      return savedHalfYearValue(row, "Commitment", "Fy2H1");
    }
    if (field.key === "H2FY2Commitment") {
      return savedHalfYearValue(row, "Commitment", "Fy2H2");
    }
    if (field.key === "H1FY1CashFlow") {
      return savedHalfYearValue(row, "CashFlow", "Fy1H1");
    }
    if (field.key === "H2FY1CashFlow") {
      return savedHalfYearValue(row, "CashFlow", "Fy1H2");
    }
    if (field.key === "H1FY2CashFlow") {
      return savedHalfYearValue(row, "CashFlow", "Fy2H1");
    }
    if (field.key === "H2FY2CashFlow") {
      return savedHalfYearValue(row, "CashFlow", "Fy2H2");
    }
    return row[field.key] ?? "-";
  };
  const savedGeneralRows = rows.map((row) => (
    <tr key={detailId(row)}>
      <td>
        {!readOnly && (
          <>
            <button
              className="btn btn-xs btn-neutral mr-1"
              onClick={() => editGeneral(row)}
            >
              Edit
            </button>
            <button
              className="btn btn-xs"
              onClick={() => void remove(String(detailId(row)))}
            >
              Delete
            </button>
          </>
        )}
      </td>
      {generalFields.concat(derivedBudgetFields).map((field) => (
        <td key={field.key}>{savedFieldValue(row, field)}</td>
      ))}
    </tr>
  ));
  const budgetHeaders = [
    ...budgetContextFields.map((field) => field.label),
    "FY1 Commitment",
    "FY1 Cash Flow",
    "H1 FY1 Commitment",
    "H1 FY1 Cash Flow",
    "H2 FY1 Commitment",
    "H2 FY1 Cash Flow",
    ...months.flatMap(([, label]) => [
      `${label} Commitment`,
      `${label} Cash Flow`,
    ]),
    ...halfYears.flatMap(([, label]) => [
      `${label} Commitment`,
      `${label} Cash Flow`,
    ]),
  ];
  const savedBudgetRows = rows.map((row) => (
    <tr key={`budget-${detailId(row)}`}>
      {budgetContextFields.map((field) => (
        <td key={field.key}>{row[field.key] ?? "-"}</td>
      ))}
      <td>{row.FY1Commitment ?? "-"}</td>
      <td>{row.FY1CashFlow ?? "-"}</td>
      <td>{row.Commitment_Fy1H1 ?? row.Commitment_H1FY1 ?? "-"}</td>
      <td>{row.CashFlow_Fy1H1 ?? row.CashFlow_H1FY1 ?? "-"}</td>
      <td>{row.Commitment_Fy1H2 ?? row.Commitment_H2FY1 ?? "-"}</td>
      <td>{row.CashFlow_Fy1H2 ?? row.CashFlow_H2FY1 ?? "-"}</td>
      {months.flatMap(([key]) => [
        <td key={`${key}-commitment`}>{row[`${key}Commitment`] ?? "-"}</td>,
        <td key={`${key}-cash`}>{row[`${key}CashFlow`] ?? "-"}</td>,
      ])}
      {halfYears.flatMap(([key]) => [
        <td key={`${key}-commitment`}>{row[`Commitment_${key}`] ?? "-"}</td>,
        <td key={`${key}-cash`}>{row[`CashFlow_${key}`] ?? "-"}</td>,
      ])}
    </tr>
  ));
  const financialRowFy1 = (row: any, prefix: "Commitment" | "CashFlow") =>
    numberValue(savedHalfYearValue(row, prefix, "Fy1H1")) +
    numberValue(savedHalfYearValue(row, prefix, "Fy1H2"));
  const savedBudgetTotal = (key: string, prefix?: "Commitment" | "CashFlow") =>
    rows
      .reduce((sum, row) => {
        if (key === "FY1" && prefix) {
          return (
            sum +
            numberValue(
              row[`FY1${prefix}`] ?? financialRowFy1(row, prefix).toFixed(2),
            )
          );
        }
        if (key === "Fy1H1" && prefix) {
          return (
            sum +
            numberValue(savedHalfYearValue(row, prefix, "Fy1H1").toFixed(2))
          );
        }
        if (key === "Fy1H2" && prefix) {
          return (
            sum +
            numberValue(savedHalfYearValue(row, prefix, "Fy1H2").toFixed(2))
          );
        }
        return (
          sum +
          numberValue(
            prefix
              ? key.includes("Fy")
                ? row[`${prefix}_${key}`]
                : row[`${key}${prefix}`]
              : row[key],
          )
        );
      }, 0)
      .toFixed(2);

  return (
    <main className="ui-screen min-h-screen space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Non PD Budget Inputs</h1>
          {status && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              Status: {status}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-sm"
            onClick={() => navigate("/nonpd-records")}
          >
            Back
          </button>
        </div>
      </div>

      <div className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
        {pendingWithMaker
          ? "Enter values only in Crs and without GST"
          : "Entered values are in Cr without GST"}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          aria-selected={tab === 0}
          className={`rounded border px-4 hover:cursor-pointer py-2 text-sm font-medium shadow ${
            tab === 0
              ? "border-red-500 bg-red-500 text-white"
              : "border-slate-300 bg-white text-slate-700"
          }`}
          onClick={() => setTab(0)}
        >
          Summary
        </button>
        <button
          type="button"
          aria-selected={tab === 1}
          className={`rounded border hover:cursor-pointer px-4 py-2 text-sm font-medium shadow ${
            tab === 1
              ? "border-red-500 bg-red-500 text-white"
              : "border-slate-300 bg-white text-slate-700"
          }`}
          onClick={() => setTab(1)}
        >
          Consolidated
        </button>
        <button
          type="button"
          aria-selected={tab === 2}
          className={`rounded border hover:cursor-pointer px-4 py-2 text-sm font-medium shadow ${
            tab === 2
              ? "border-red-500 bg-red-500 text-white"
              : "border-slate-300 bg-white text-slate-700"
          }`}
          onClick={() => setTab(2)}
        >
          Budget Inputs
        </button>
      </div>

      {tab === 0 ? (
        <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Project Summary
          </h2>
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="table table-xs table-zebra min-w-max border border-slate-200 [&_td]:border [&_td]:border-slate-200 [&_th]:border [&_th]:border-slate-200">
              <thead className="bg-red-500 text-xs text-white">
                <tr>
                  {summaryFields.map((field) => (
                    <th key={field.key}>{field.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`summary-${detailId(row)}`}>
                    {summaryFields.map((field) => (
                      <td key={field.key}>{savedFieldValue(row, field)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-200 text-xs">
                <tr className="font-semibold">
                  {summaryFields.map((field) => (
                    <td key={`summary-total-${field.key}`}>
                      {savedGeneralTotal(field)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
          {!rows.length && (
            <p className="mt-4 text-xs text-slate-500">
              Save consolidated inputs to view the project summary.
            </p>
          )}
        </div>
      ) : tab === 1 ? (
        <>
          {!readOnly && (
            <div className="overflow-x-auto rounded border border-base-300">
              <table className="table table-xs table-zebra min-w-max border border-slate-200 [&_td]:border [&_td]:border-slate-200 [&_th]:border [&_th]:border-slate-200">
                <thead className="bg-red-500 text-xs text-white">
                  <tr>
                    <th>{editingDetailId ? "Update" : "Input"}</th>
                    {generalHeaders}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td />
                    {generalFields.map((field) => (
                      <td key={field.key}>
                        {readOnly ? (
                          <span>{form[field.key] ?? ""}</span>
                        ) : (
                          fieldInput(field, form, setFormValue)
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {!readOnly && (
            <div className="flex items-center gap-3">
              <button
                className="btn bg-red-500 text-white"
                disabled={saving}
                onClick={() => void saveGeneral()}
              >
                {saving
                  ? "Saving..."
                  : editingDetailId
                    ? "Update General"
                    : "Save General"}
              </button>
              <button
                className="btn bg-red-500 text-white"
                disabled={saving || !rows.length}
                onClick={() => void submitForApproval()}
              >
                {saving ? "Submitting..." : "Submit For Approval"}
              </button>
            </div>
          )}
          <div className="overflow-x-auto rounded border border-base-300">
            <table className="table table-xs table-zebra min-w-max border border-slate-200 [&_td]:border [&_td]:border-slate-200 [&_th]:border [&_th]:border-slate-200">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th>Actions</th>
                  {savedGeneralHeaders}
                </tr>
              </thead>
              <tbody>{savedGeneralRows}</tbody>
              <tfoot className="text-xs bg-slate-200">
                <tr className="font-semibold">
                  <td>Total</td>
                  {generalFields.concat(derivedBudgetFields).map((field) => (
                    <td
                      key={`total-${field.key}`}
                      className="text-right text-xs"
                    >
                      {savedGeneralTotal(field)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
            {!rows.length && (
              <p className="p-6 text-center opacity-70">
                No saved general rows.
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="overflow-x-auto rounded border border-base-300">
            <table className="table table-xs table-zebra min-w-max border border-slate-200 [&_td]:border [&_td]:border-slate-200 [&_th]:border [&_th]:border-slate-200">
              <thead className="bg-red-500 text-xs text-white">
                <tr>
                  <th>Select</th>
                  {budgetContextFields.map((field) => (
                    <th key={field.key}>{field.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const id = String(detailId(row));
                  return (
                    <tr
                      key={id}
                      className={selectedRowId === id ? "bg-amber-50" : ""}
                    >
                      <td>
                        <input
                          type="radio"
                          name="nonpd-budget-row"
                          checked={selectedRowId === id}
                          onChange={() => !readOnly && selectBudgetRow(row)}
                          disabled={readOnly}
                        />
                      </td>
                      {budgetContextFields.map((field) => (
                        <td key={field.key}>{row[field.key] ?? "-"}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!rows.length && (
              <p className="p-6 text-center opacity-70">
                Save a general row before entering budget inputs.
              </p>
            )}
          </div>

          {!readOnly && (
            <div className="overflow-x-auto rounded border border-base-300">
              <table className="table table-xs table-zebra min-w-max border border-slate-200 [&_td]:border [&_td]:border-slate-200 [&_th]:border [&_th]:border-slate-200">
                <thead className="text-xs text-white">
                  <tr className="bg-red-500">
                    <th>Type</th>
                    <th>Total</th>
                    <th>FY1</th>
                    {fy1HalfYears.map(([, label]) => (
                      <th key={label}>{label}</th>
                    ))}
                    {months.map(([, label]) => (
                      <th key={label}>{label}</th>
                    ))}
                    {halfYears.map(([, label]) => (
                      <th key={label}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(["Commitment", "CashFlow"] as const).map((prefix) => (
                    <tr key={prefix}>
                      <td>{prefix === "CashFlow" ? "Cash Flow" : prefix}</td>
                      <td className="font-semibold">
                        {amountValue(financialTotal(prefix))}
                      </td>
                      <td className="font-semibold">
                        {amountValue(financialFy1(prefix))}
                      </td>
                      <td className="font-semibold">
                        {amountValue(financialFy1H1(prefix))}
                      </td>
                      <td className="font-semibold">
                        {amountValue(financialFy1H2(prefix))}
                      </td>
                      {months.map(([key]) => (
                        <td key={`${prefix}-${key}`}>
                          {selectedRowId && (
                            <input
                              type="number"
                              step="any"
                              className="input input-bordered input-xs w-16"
                              value={budgetForm[`${key}${prefix}`] ?? ""}
                              onChange={(event) =>
                                setBudgetValue(
                                  `${key}${prefix}`,
                                  event.target.value,
                                )
                              }
                              disabled={readOnly}
                            />
                          )}
                        </td>
                      ))}
                      {halfYears.map(([key]) => (
                        <td key={`${prefix}-${key}`}>
                          {selectedRowId && (
                            <input
                              type="number"
                              step="any"
                              className="input input-bordered input-xs w-16"
                              value={budgetForm[`${prefix}_${key}`] ?? ""}
                              onChange={(event) =>
                                setBudgetValue(
                                  `${prefix}_${key}`,
                                  event.target.value,
                                )
                              }
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center gap-3">
            {!readOnly && (
              <>
                <button
                  className="btn bg-red-500 text-white"
                  disabled={saving || !selectedRowId}
                  onClick={() => void saveBudget()}
                >
                  {saving ? "Saving..." : "Save Budget Inputs"}
                </button>
                <button
                  className="btn bg-red-500 text-white"
                  disabled={saving || !rows.length}
                  onClick={() => void submitForApproval()}
                >
                  {saving ? "Submitting..." : "Submit For Approval"}
                </button>
              </>
            )}
          </div>
          <h2 className="text-xl font-semibold">Saved budget inputs</h2>
          <div className="overflow-x-auto rounded border border-base-300">
            <table className="table table-xs table-zebra min-w-max border border-slate-200 [&_td]:border [&_td]:border-slate-200 [&_th]:border [&_th]:border-slate-200">
              <thead className="bg-red-500 text-xs text-white">
                <tr>
                  {budgetHeaders.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{savedBudgetRows}</tbody>
              <tfoot className="text-xs bg-slate-200">
                <tr className="font-semibold">
                  {budgetContextFields.map((field) => (
                    <td key={`budget-total-${field.key}`} />
                  ))}
                  <td>{savedBudgetTotal("FY1", "Commitment")}</td>
                  <td>{savedBudgetTotal("FY1", "CashFlow")}</td>
                  <td>{savedBudgetTotal("Fy1H1", "Commitment")}</td>
                  <td>{savedBudgetTotal("Fy1H1", "CashFlow")}</td>
                  <td>{savedBudgetTotal("Fy1H2", "Commitment")}</td>
                  <td>{savedBudgetTotal("Fy1H2", "CashFlow")}</td>
                  {months.flatMap(([key]) => [
                    <td key={`total-${key}-commitment`}>
                      {savedBudgetTotal(key, "Commitment")}
                    </td>,
                    <td key={`total-${key}-cash`}>
                      {savedBudgetTotal(key, "CashFlow")}
                    </td>,
                  ])}
                  {halfYears.flatMap(([key]) => [
                    <td key={`total-${key}-commitment`}>
                      {savedBudgetTotal(key, "Commitment")}
                    </td>,
                    <td key={`total-${key}-cash`}>
                      {savedBudgetTotal(key, "CashFlow")}
                    </td>,
                  ])}
                </tr>
              </tfoot>
            </table>
            {!rows.length && (
              <p className="p-6 text-center opacity-70">
                No saved budget inputs.
              </p>
            )}
          </div>
        </>
      )}
      <NonPDApproverHistory history={approvalHistory} />
    </main>
  );
};

export default NonPDInput;
