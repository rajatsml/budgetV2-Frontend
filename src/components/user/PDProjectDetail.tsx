import { Fragment, useState, useEffect } from "react";
import PDHeader from "../pd/PDHeader";
// import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  SavePDMaster,
  UpdatePDMaster,
  GetPDMaster,
  DeletePDMaster,
  UpdatePDStatus,
  GetPDApprovalHistory,
  ManageProjectWBS,
  GetWBSDropdown,
  GetDropdownData,
} from "../../service/projectmaster";
import useUserStore from "../../store/userStore";

import { useLocation, useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type FinancialValues = {
  aprFY1: string;
  mayFY1: string;
  junFY1: string;
  julFY1: string;
  augFY1: string;
  sepFY1: string;
  octFY1: string;
  novFY1: string;
  decFY1: string;
  janFY1: string;
  febFY1: string;
  marFY1: string;

  h1FY1: string;
  h2FY1: string;

  h1FY2: string;
  h2FY2: string;

  h1FY3: string;
  h2FY3: string;

  h1FY4: string;
  h2FY4: string;

  h1FY5: string;
  h2FY5: string;
};

type PDFormData = {
  description: string;
  basis: string;

  commitmentCapex: FinancialValues;
  commitmentRevex: FinancialValues;

  cashCapex: FinancialValues;
  cashRevex: FinancialValues;

  carryForwardWBS: string;
  carryForwardDescription: string;
  carryForwardFYYear: string;
};

type CashFlowDraft = {
  cashCapex: FinancialValues;
  cashRevex: FinancialValues;
};

type CarryForwardFormData = {
  wbsId: string;
  wbsDescription: string;
  fyYear: string;
  commitmentCapex: string;
  commitmentRevex: string;
  cashFlowCapex: string;
  cashFlowRevex: string;
};

// ─────────────────────────────────────────────────────────
// Initial state helpers
// ─────────────────────────────────────────────────────────

const emptyFinancialValues: FinancialValues = {
  aprFY1: "",
  mayFY1: "",
  junFY1: "",
  julFY1: "",
  augFY1: "",
  sepFY1: "",
  octFY1: "",
  novFY1: "",
  decFY1: "",
  janFY1: "",
  febFY1: "",
  marFY1: "",

  h1FY1: "",
  h2FY1: "",
  h1FY2: "",
  h2FY2: "",
  h1FY3: "",
  h2FY3: "",
  h1FY4: "",
  h2FY4: "",
  h1FY5: "",
  h2FY5: "",
};

const initialFormState: PDFormData = {
  description: "",
  basis: "",

  commitmentCapex: { ...emptyFinancialValues },
  commitmentRevex: { ...emptyFinancialValues },

  cashCapex: { ...emptyFinancialValues },
  cashRevex: { ...emptyFinancialValues },

  carryForwardWBS: "",
  carryForwardDescription: "",
  carryForwardFYYear: "",
};

const initialCarryForwardForm: CarryForwardFormData = {
  wbsId: "",
  wbsDescription: "",
  fyYear: "",
  commitmentCapex: "",
  commitmentRevex: "",
  cashFlowCapex: "",
  cashFlowRevex: "",
};

const financialFields: (keyof FinancialValues)[] = [
  "aprFY1",
  "mayFY1",
  "junFY1",
  "julFY1",
  "augFY1",
  "sepFY1",
  "octFY1",
  "novFY1",
  "decFY1",
  "janFY1",
  "febFY1",
  "marFY1",
  "h1FY1",
  "h2FY1",
  "h1FY2",
  "h2FY2",
  "h1FY3",
  "h2FY3",
  "h1FY4",
  "h2FY4",
  "h1FY5",
  "h2FY5",
];

const getFinancialValuesFromRow = (
  row: Record<string, unknown>,
  prefix: "CommCapex" | "CommRevex" | "CashCapex" | "CashRevex",
): FinancialValues => {
  const values = {} as FinancialValues;

  financialFields.forEach((field) => {
    const apiField = `${prefix}_${field.charAt(0).toUpperCase()}${field.slice(1)}`;
    values[field] = String(row[apiField] ?? "");
  });

  return values;
};

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const PDProjectDetail = () => {
  const navigate = useNavigate();
  const [pdDetailId, setPDDetailId] = useState<number | null>(null);

  const location = useLocation();
  const [approvalHistory, setApprovalHistory] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState<PDFormData>(initialFormState);

  const [allFiYears, setAllFiYears] = useState<any[]>([]);

  const [rows, setRows] = useState<any[]>([]);
  const [carryForwardRows, setCarryForwardRows] = useState<any[]>([]);
  const [wbsOptions, setWbsOptions] = useState<any[]>([]);
  const [carryForwardForm, setCarryForwardForm] =
    useState<CarryForwardFormData>(initialCarryForwardForm);
  const [editingCarryForwardId, setEditingCarryForwardId] = useState<
    number | null
  >(null);

  const [selectedCashFlowRows, setSelectedCashFlowRows] = useState<
    Record<number, boolean>
  >({});
  const [cashFlowDrafts, setCashFlowDrafts] = useState<
    Record<number, CashFlowDraft>
  >({});

  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const isEditing = editingRowId !== null;

  const data = location.state;

  const canEdit = data?.status === "OPENED";

  const { user } = useUserStore();

  // const tabs = ["Commitments", "Cash Flow", "Carry Forward"];

  //  FOR INPUT VALIDATION
  const isValidNumber = (value: string) => {
    return /^\d*\.?\d*$/.test(value);
  };

  // ─────────────────────────────────────────────────────────
  // Calculation helpers
  // ─────────────────────────────────────────────────────────

  const parseNum = (val: string): number => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  const calculateRowTotals = (row: FinancialValues) => {
    const h1FY1 =
      parseNum(row.aprFY1) +
      parseNum(row.mayFY1) +
      parseNum(row.junFY1) +
      parseNum(row.julFY1) +
      parseNum(row.augFY1) +
      parseNum(row.sepFY1);

    const h2FY1 =
      parseNum(row.octFY1) +
      parseNum(row.novFY1) +
      parseNum(row.decFY1) +
      parseNum(row.janFY1) +
      parseNum(row.febFY1) +
      parseNum(row.marFY1);

    const fy1Total = h1FY1 + h2FY1;

    const valueTotal =
      fy1Total +
      parseNum(row.h1FY2) +
      parseNum(row.h2FY2) +
      parseNum(row.h1FY3) +
      parseNum(row.h2FY3) +
      parseNum(row.h1FY4) +
      parseNum(row.h2FY4) +
      parseNum(row.h1FY5) +
      parseNum(row.h2FY5);

    return {
      h1FY1Total: h1FY1.toFixed(2),
      h2FY1Total: h2FY1.toFixed(2),
      fy1Total: fy1Total.toFixed(2),
      valueTotal: valueTotal.toFixed(2),
    };
  };

  const getCommTotal = (row: any, prefix: "CommCapex" | "CommRevex") => {
    return (
      Number(row[`${prefix}_H1FY1`] || 0) +
      Number(row[`${prefix}_H2FY1`] || 0) +
      Number(row[`${prefix}_H1FY2`] || 0) +
      Number(row[`${prefix}_H2FY2`] || 0) +
      Number(row[`${prefix}_H1FY3`] || 0) +
      Number(row[`${prefix}_H2FY3`] || 0) +
      Number(row[`${prefix}_H1FY4`] || 0) +
      Number(row[`${prefix}_H2FY4`] || 0) +
      Number(row[`${prefix}_H1FY5`] || 0) +
      Number(row[`${prefix}_H2FY5`] || 0)
    ).toFixed(2);
  };

  const getCommFY1Total = (row: any, prefix: "CommCapex" | "CommRevex") => {
    return (
      Number(row[`${prefix}_H1FY1`] || 0) + Number(row[`${prefix}_H2FY1`] || 0)
    ).toFixed(2);
  };

  const getCashFlowTotal = (row: any, prefix: "CashCapex" | "CashRevex") => {
    return (
      Number(row[`${prefix}_H1FY1`] || 0) +
      Number(row[`${prefix}_H2FY1`] || 0) +
      Number(row[`${prefix}_H1FY2`] || 0) +
      Number(row[`${prefix}_H2FY2`] || 0) +
      Number(row[`${prefix}_H1FY3`] || 0) +
      Number(row[`${prefix}_H2FY3`] || 0) +
      Number(row[`${prefix}_H1FY4`] || 0) +
      Number(row[`${prefix}_H2FY4`] || 0) +
      Number(row[`${prefix}_H1FY5`] || 0) +
      Number(row[`${prefix}_H2FY5`] || 0)
    ).toFixed(2);
  };

  const getCashFlowFY1Total = (row: any, prefix: "CashCapex" | "CashRevex") => {
    return (
      Number(row[`${prefix}_H1FY1`] || 0) + Number(row[`${prefix}_H2FY1`] || 0)
    ).toFixed(2);
  };

  const hasCashFlowValues = (row: any) =>
    Number(getCashFlowTotal(row, "CashCapex")) +
      Number(getCashFlowTotal(row, "CashRevex")) >
    0;

  // Live computed totals for the summary panel
  const commCapexTotals = calculateRowTotals(formData.commitmentCapex);
  const commRevexTotals = calculateRowTotals(formData.commitmentRevex);
  const cfCapexTotals = calculateRowTotals(formData.cashCapex);
  const cfRevexTotals = calculateRowTotals(formData.cashRevex);
  const hasSavedCashFlow = rows.some(hasCashFlowValues);
  const editableCashFlowRows = rows.filter(
    (row) => !hasCashFlowValues(row) || selectedCashFlowRows[row.PDDetailId],
  );

  // ─────────────────────────────────────────────────────────
  // Payload builder
  // ─────────────────────────────────────────────────────────

  const buildPayload = (
    draftStatus: string,
    values: PDFormData = formData,
    recordId: number | null = pdDetailId,
  ) => {
    const formData = values;
    const commCapexCalc = calculateRowTotals(formData.commitmentCapex);
    const commRevexCalc = calculateRowTotals(formData.commitmentRevex);
    const cashCapexCalc = calculateRowTotals(formData.cashCapex);
    const cashRevexCalc = calculateRowTotals(formData.cashRevex);

    return {
      ProjectId: data?.projectID,
      RecordId: recordId?.toString() || "0",
      DeptId: data?.deptID?.toString(),

      Description: formData.description,
      Basis: formData.basis,

      // ── Commitment Capex ──────────────────────────────
      CommCapex_AprFY1: formData.commitmentCapex.aprFY1,
      CommCapex_MayFY1: formData.commitmentCapex.mayFY1,
      CommCapex_JunFY1: formData.commitmentCapex.junFY1,
      CommCapex_JulFY1: formData.commitmentCapex.julFY1,
      CommCapex_AugFY1: formData.commitmentCapex.augFY1,
      CommCapex_SepFY1: formData.commitmentCapex.sepFY1,
      CommCapex_OctFY1: formData.commitmentCapex.octFY1,
      CommCapex_NovFY1: formData.commitmentCapex.novFY1,
      CommCapex_DecFY1: formData.commitmentCapex.decFY1,
      CommCapex_JanFY1: formData.commitmentCapex.janFY1,
      CommCapex_FebFY1: formData.commitmentCapex.febFY1,
      CommCapex_MarFY1: formData.commitmentCapex.marFY1,
      CommCapex_H1FY1: commCapexCalc.h1FY1Total,
      CommCapex_H2FY1: commCapexCalc.h2FY1Total,
      CommCapex_H1FY2: formData.commitmentCapex.h1FY2,
      CommCapex_H2FY2: formData.commitmentCapex.h2FY2,
      CommCapex_H1FY3: formData.commitmentCapex.h1FY3,
      CommCapex_H2FY3: formData.commitmentCapex.h2FY3,
      CommCapex_H1FY4: formData.commitmentCapex.h1FY4,
      CommCapex_H2FY4: formData.commitmentCapex.h2FY4,
      CommCapex_H1FY5: formData.commitmentCapex.h1FY5,
      CommCapex_H2FY5: formData.commitmentCapex.h2FY5,

      // ── Commitment Revex ──────────────────────────────
      CommRevex_AprFY1: formData.commitmentRevex.aprFY1,
      CommRevex_MayFY1: formData.commitmentRevex.mayFY1,
      CommRevex_JunFY1: formData.commitmentRevex.junFY1,
      CommRevex_JulFY1: formData.commitmentRevex.julFY1,
      CommRevex_AugFY1: formData.commitmentRevex.augFY1,
      CommRevex_SepFY1: formData.commitmentRevex.sepFY1,
      CommRevex_OctFY1: formData.commitmentRevex.octFY1,
      CommRevex_NovFY1: formData.commitmentRevex.novFY1,
      CommRevex_DecFY1: formData.commitmentRevex.decFY1,
      CommRevex_JanFY1: formData.commitmentRevex.janFY1,
      CommRevex_FebFY1: formData.commitmentRevex.febFY1,
      CommRevex_MarFY1: formData.commitmentRevex.marFY1,
      CommRevex_H1FY1: commRevexCalc.h1FY1Total,
      CommRevex_H2FY1: commRevexCalc.h2FY1Total,
      CommRevex_H1FY2: formData.commitmentRevex.h1FY2,
      CommRevex_H2FY2: formData.commitmentRevex.h2FY2,
      CommRevex_H1FY3: formData.commitmentRevex.h1FY3,
      CommRevex_H2FY3: formData.commitmentRevex.h2FY3,
      CommRevex_H1FY4: formData.commitmentRevex.h1FY4,
      CommRevex_H2FY4: formData.commitmentRevex.h2FY4,
      CommRevex_H1FY5: formData.commitmentRevex.h1FY5,
      CommRevex_H2FY5: formData.commitmentRevex.h2FY5,

      // ── CashFlow Capex ────────────────────────────────
      CashCapex_AprFY1: formData.cashCapex.aprFY1,
      CashCapex_MayFY1: formData.cashCapex.mayFY1,
      CashCapex_JunFY1: formData.cashCapex.junFY1,
      CashCapex_JulFY1: formData.cashCapex.julFY1,
      CashCapex_AugFY1: formData.cashCapex.augFY1,
      CashCapex_SepFY1: formData.cashCapex.sepFY1,
      CashCapex_OctFY1: formData.cashCapex.octFY1,
      CashCapex_NovFY1: formData.cashCapex.novFY1,
      CashCapex_DecFY1: formData.cashCapex.decFY1,
      CashCapex_JanFY1: formData.cashCapex.janFY1,
      CashCapex_FebFY1: formData.cashCapex.febFY1,
      CashCapex_MarFY1: formData.cashCapex.marFY1,
      CashCapex_H1FY1: cashCapexCalc.h1FY1Total,
      CashCapex_H2FY1: cashCapexCalc.h2FY1Total,
      CashCapex_H1FY2: formData.cashCapex.h1FY2,
      CashCapex_H2FY2: formData.cashCapex.h2FY2,
      CashCapex_H1FY3: formData.cashCapex.h1FY3,
      CashCapex_H2FY3: formData.cashCapex.h2FY3,
      CashCapex_H1FY4: formData.cashCapex.h1FY4,
      CashCapex_H2FY4: formData.cashCapex.h2FY4,
      CashCapex_H1FY5: formData.cashCapex.h1FY5,
      CashCapex_H2FY5: formData.cashCapex.h2FY5,

      // ── CashFlow Revex ────────────────────────────────
      CashRevex_AprFY1: formData.cashRevex.aprFY1,
      CashRevex_MayFY1: formData.cashRevex.mayFY1,
      CashRevex_JunFY1: formData.cashRevex.junFY1,
      CashRevex_JulFY1: formData.cashRevex.julFY1,
      CashRevex_AugFY1: formData.cashRevex.augFY1,
      CashRevex_SepFY1: formData.cashRevex.sepFY1,
      CashRevex_OctFY1: formData.cashRevex.octFY1,
      CashRevex_NovFY1: formData.cashRevex.novFY1,
      CashRevex_DecFY1: formData.cashRevex.decFY1,
      CashRevex_JanFY1: formData.cashRevex.janFY1,
      CashRevex_FebFY1: formData.cashRevex.febFY1,
      CashRevex_MarFY1: formData.cashRevex.marFY1,
      CashRevex_H1FY1: cashRevexCalc.h1FY1Total,
      CashRevex_H2FY1: cashRevexCalc.h2FY1Total,
      CashRevex_H1FY2: formData.cashRevex.h1FY2,
      CashRevex_H2FY2: formData.cashRevex.h2FY2,
      CashRevex_H1FY3: formData.cashRevex.h1FY3,
      CashRevex_H2FY3: formData.cashRevex.h2FY3,
      CashRevex_H1FY4: formData.cashRevex.h1FY4,
      CashRevex_H2FY4: formData.cashRevex.h2FY4,
      CashRevex_H1FY5: formData.cashRevex.h1FY5,
      CashRevex_H2FY5: formData.cashRevex.h2FY5,

      // ── Carry Forward ─────────────────────────────────
      CarryForwardWBS: formData.carryForwardWBS,
      CarryForwardDescription: formData.carryForwardDescription,
      CarryForwardFYYear: formData.carryForwardFYYear,

      UserId: user?.userId,
      FyYear: data?.FyYear,
      CategoryId: data?.categoryId || 1,
      DraftStatus: draftStatus,
    };
  };

  // ─────────────────────────────────────────────────────────
  // API calls
  // ─────────────────────────────────────────────────────────

  const fetchPDDetails = async () => {
    try {
      const response = await GetPDMaster(data?.projectID, data?.deptID);
      setRows(response);
    } catch (error) {
      console.error("Failed to fetch PD Details", error);
    }
  };

  const fetchApprovalHistory = async () => {
    try {
      const response = await GetPDApprovalHistory(
        data?.projectID,
        data?.deptID?.toString(),
      );
      setApprovalHistory(response || []);
    } catch (error) {
      console.error("Failed to fetch approval history", error);
    }
  };

  const fetchCarryForwardRows = async () => {
    try {
      const response = await ManageProjectWBS({
        type: 1,
        projectId: data?.projectID,
        deptId: data?.deptID?.toString(),
      });
      setCarryForwardRows(
        Array.isArray(response) ? response : response?.items || [],
      );
    } catch (error) {
      console.error("Failed to fetch carry forward rows", error);
    }
  };

  const fetchWBSOptions = async () => {
    try {
      const response = await GetWBSDropdown(user?.roles[0]?.departmentId!);
      setWbsOptions(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Failed to fetch WBS options", error);
    }
  };
  const fetchFinancialYears = async () => {
    try {
      const response = await GetDropdownData("4");
      setAllFiYears(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Failed to fetch financial years", error);
    }
  };

  useEffect(() => {
    fetchPDDetails();
    fetchApprovalHistory();
    fetchCarryForwardRows();
    fetchWBSOptions();
    fetchFinancialYears();
  }, []);

  // ─────────────────────────────────────────────────────────
  // Row helpers
  // ─────────────────────────────────────────────────────────

  const isRowEmpty = () => {
    const allFinancialEmpty = (fv: FinancialValues) =>
      Object.values(fv).every((v) => !v || v.trim() === "");

    return (
      (!formData.description || formData.description.trim() === "") &&
      (!formData.basis || formData.basis.trim() === "") &&
      allFinancialEmpty(formData.commitmentCapex) &&
      allFinancialEmpty(formData.commitmentRevex) &&
      allFinancialEmpty(formData.cashCapex) &&
      allFinancialEmpty(formData.cashRevex)
    );
  };

  // const getTotal = (field: string) =>
  //   rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);

  // ─────────────────────────────────────────────────────────
  // Form handlers
  // ─────────────────────────────────────────────────────────

  const handleFinancialChange = (
    section: "commitmentCapex" | "commitmentRevex" | "cashCapex" | "cashRevex",
    field: keyof FinancialValues,
    value: string,
  ) => {
    if (!isValidNumber(value)) {
      alert("Please enter a valid amount");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const getCashFlowDraft = (row: any): CashFlowDraft =>
    cashFlowDrafts[row.PDDetailId] || {
      cashCapex: getFinancialValuesFromRow(row, "CashCapex"),
      cashRevex: getFinancialValuesFromRow(row, "CashRevex"),
    };

  const handleCashFlowChange = (
    rowId: number,
    section: "cashCapex" | "cashRevex",
    field: keyof FinancialValues,
    value: string,
  ) => {
    if (!isValidNumber(value)) {
      alert("Please enter a valid amount");
      return;
    }

    setCashFlowDrafts((previous) => {
      const row = rows.find((item) => item.PDDetailId === rowId);
      if (!row) return previous;

      const currentDraft = previous[rowId] || {
        cashCapex: getFinancialValuesFromRow(row, "CashCapex"),
        cashRevex: getFinancialValuesFromRow(row, "CashRevex"),
      };

      return {
        ...previous,
        [rowId]: {
          ...currentDraft,
          [section]: {
            ...currentDraft[section],
            [field]: value,
          },
        },
      };
    });
  };

  const getCashFlowPayloadForm = (
    row: any,
    draft: CashFlowDraft,
  ): PDFormData => ({
    description: row.Description || "",
    basis: row.Basis || "",
    commitmentCapex: getFinancialValuesFromRow(row, "CommCapex"),
    commitmentRevex: getFinancialValuesFromRow(row, "CommRevex"),
    cashCapex: draft.cashCapex,
    cashRevex: draft.cashRevex,
    carryForwardWBS: row.CarryForwardWBS || "",
    carryForwardDescription: row.CarryForwardDescription || "",
    carryForwardFYYear: row.CarryForwardFYYear || "",
  });

  const handleChange = (key: keyof PDFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingRowId(null);
  };

  const getWBSOptionId = (option: Record<string, unknown>) =>
    String(
      option.wbsId ??
        option.WBSId ??
        option.wbsElement ??
        option.code ??
        option.value ??
        option.id ??
        "",
    );

  const getWBSOptionDescription = (option: Record<string, unknown>) =>
    String(
      option.wbsDescription ??
        option.WBSDescription ??
        option.description ??
        option.name ??
        option.label ??
        option.text ??
        "",
    );

  const handleCarryForwardWBSChange = (wbsId: string) => {
    const selectedOption = wbsOptions.find(
      (option) => getWBSOptionId(option) === wbsId,
    );

    setCarryForwardForm((previous) => ({
      ...previous,
      wbsId,
      wbsDescription: selectedOption
        ? getWBSOptionDescription(selectedOption)
        : "",
    }));
  };

  const resetCarryForwardForm = () => {
    setCarryForwardForm(initialCarryForwardForm);
    setEditingCarryForwardId(null);
  };

  // ─────────────────────────────────────────────────────────
  // Tab navigation
  // ─────────────────────────────────────────────────────────

  // const savePDData = async () => {
  //   try {
  //     if (isRowEmpty()) {
  //       return false;
  //     }
  //     const payload = buildPayload("DRAFT");

  //     if (!pdDetailId) {
  //       const response = await SavePDMaster(payload);
  //       setPDDetailId(response?.pdDetailId);
  //     } else {
  //       const response = await UpdatePDMaster(payload, pdDetailId);
  //       setPDDetailId(response?.pdDetailId);
  //     }

  //     return true;
  //   } catch (error) {
  //     console.error("PD Save Failed", error);
  //     return false;
  //   }
  // };

  // const getGrandTotal = (prefix: string) =>
  //   rows.reduce(
  //     (sum, row) =>
  //       sum +
  //       Number(row[`${prefix}_H1FY1`] || 0) +
  //       Number(row[`${prefix}_H2FY1`] || 0) +
  //       Number(row[`${prefix}_H1FY2`] || 0) +
  //       Number(row[`${prefix}_H2FY2`] || 0) +
  //       Number(row[`${prefix}_H1FY3`] || 0) +
  //       Number(row[`${prefix}_H2FY3`] || 0) +
  //       Number(row[`${prefix}_H1FY4`] || 0) +
  //       Number(row[`${prefix}_H2FY4`] || 0) +
  //       Number(row[`${prefix}_H1FY5`] || 0) +
  //       Number(row[`${prefix}_H2FY5`] || 0),
  //     0,
  //   );

  // const getFY1Total = (prefix: string) =>
  //   rows.reduce(
  //     (sum, row) =>
  //       sum +
  //       Number(row[`${prefix}_H1FY1`] || 0) +
  //       Number(row[`${prefix}_H2FY1`] || 0),
  //     0,
  //   );

  const changeTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  // const nextTab = async () => {
  //   const success = await savePDData();
  //   if (!success) return;

  //   if (activeTab < tabs.length - 1) {
  //     setActiveTab((prev) => prev + 1);
  //   }
  //   fetchPDDetails();
  // };

  // const prevTab = async () => {
  //   const success = await savePDData();
  //   if (!success) return;

  //   if (activeTab > 0) {
  //     setActiveTab((prev) => prev - 1);
  //   }
  //   fetchPDDetails();
  // };

  // ─────────────────────────────────────────────────────────
  // CRUD handlers
  // ─────────────────────────────────────────────────────────

  const handleCarryForwardSave = async () => {
    const {
      wbsId,
      wbsDescription,
      fyYear,
      commitmentCapex,
      commitmentRevex,
      cashFlowCapex,
      cashFlowRevex,
    } = carryForwardForm;

    if (
      !wbsId ||
      !fyYear ||
      !commitmentCapex ||
      !commitmentRevex ||
      !cashFlowCapex ||
      !cashFlowRevex
    ) {
      alert("Please select a WBS and financial year, then enter amounts.");
      return;
    }

    try {
      await ManageProjectWBS({
        type: editingCarryForwardId ? 3 : 2,
        ...(editingCarryForwardId ? { id: editingCarryForwardId } : {}),
        projectId: data?.projectID,
        deptId: data?.deptID?.toString(),
        wbsId,
        wbsDescription,
        commitmentCapex,
        commitmentRevex,
        cashFlowCapex,
        cashFlowRevex,
        fyYear,
      });
      await fetchCarryForwardRows();
      resetCarryForwardForm();
    } catch (error) {
      console.error("Failed to save carry forward row", error);
    }
  };

  const handleCarryForwardEdit = (row: any) => {
    setCarryForwardForm({
      wbsId: String(row.wbsId ?? row.WBSId ?? ""),
      wbsDescription: String(row.wbsDescription ?? row.WBSDescription ?? ""),
      fyYear: String(row.fyYear ?? row.FyYear ?? ""),
      commitmentCapex: String(row.commitmentCapex ?? row.CommitmentCapex ?? ""),
      commitmentRevex: String(row.commitmentRevex ?? row.CommitmentRevex ?? ""),
      cashFlowCapex: String(row.cashFlowCapex ?? row.CashFlowCapex ?? ""),
      cashFlowRevex: String(row.cashFlowRevex ?? row.CashFlowRevex ?? ""),
    });
    setEditingCarryForwardId(Number(row.id ?? row.Id));
  };

  const handleCarryForwardDelete = async (row: any) => {
    const id = Number(row.id ?? row.Id);
    if (
      !id ||
      !window.confirm("Are you sure you want to delete this carry forward row?")
    ) {
      return;
    }

    try {
      await ManageProjectWBS({ type: 4, id });
      await fetchCarryForwardRows();
      if (editingCarryForwardId === id) resetCarryForwardForm();
    } catch (error) {
      console.error("Failed to delete carry forward row", error);
    }
  };

  const handleCashFlowSave = async () => {
    const selectedRows = rows.filter(
      (row) => selectedCashFlowRows[row.PDDetailId],
    );

    if (selectedRows.length === 0) {
      alert("Select at least one commitment before saving cash flow.");
      return;
    }

    const hasEmptyCashFlow = selectedRows.some((row) => {
      const draft = getCashFlowDraft(row);
      return (
        Object.values(draft.cashCapex).every((value) => !value.trim()) &&
        Object.values(draft.cashRevex).every((value) => !value.trim())
      );
    });

    if (hasEmptyCashFlow) {
      alert(
        "Enter at least one cash flow value for every selected commitment.",
      );
      return;
    }

    try {
      await Promise.all(
        selectedRows.map((row) =>
          UpdatePDMaster(
            buildPayload(
              "COMPLETE",
              getCashFlowPayloadForm(row, getCashFlowDraft(row)),
              row.PDDetailId,
            ),
            row.PDDetailId,
          ),
        ),
      );

      await fetchPDDetails();
      setSelectedCashFlowRows({});
      setCashFlowDrafts({});
    } catch (error) {
      console.error("Error saving cash flow rows:", error);
    }
  };

  const handleSave = async () => {
    if (activeTab === 1) {
      await handleCashFlowSave();
      return;
    }

    if (activeTab === 2) {
      await handleCarryForwardSave();
      return;
    }

    try {
      if (isRowEmpty()) {
        alert("Please enter at least one value before saving.");
        return;
      }
      const payload = buildPayload("COMPLETE");

      if (editingRowId) {
        await UpdatePDMaster(payload, Number(editingRowId));
      } else {
        if (!pdDetailId) {
          const response = await SavePDMaster(payload);
          setPDDetailId(response?.pdDetailId);
        } else {
          const response = await UpdatePDMaster(payload, pdDetailId);
          setPDDetailId(response?.pdDetailId);
        }
      }

      await fetchPDDetails();
      resetForm();
      setPDDetailId(null);
      // setActiveTab(0);
    } catch (error) {
      console.error("Error saving row:", error);
    }
  };

  const handleEdit = (id: number) => {
    const row = rows.find((r) => r.PDDetailId === id);
    if (!row) return;

    setPDDetailId(row.PDDetailId);

    setFormData({
      description: row.Description || "",
      basis: row.Basis || "",

      commitmentCapex: {
        aprFY1: row.CommCapex_AprFY1 || "",
        mayFY1: row.CommCapex_MayFY1 || "",
        junFY1: row.CommCapex_JunFY1 || "",
        julFY1: row.CommCapex_JulFY1 || "",
        augFY1: row.CommCapex_AugFY1 || "",
        sepFY1: row.CommCapex_SepFY1 || "",
        octFY1: row.CommCapex_OctFY1 || "",
        novFY1: row.CommCapex_NovFY1 || "",
        decFY1: row.CommCapex_DecFY1 || "",
        janFY1: row.CommCapex_JanFY1 || "",
        febFY1: row.CommCapex_FebFY1 || "",
        marFY1: row.CommCapex_MarFY1 || "",
        h1FY1: row.CommCapex_H1FY1 || "",
        h2FY1: row.CommCapex_H2FY1 || "",
        h1FY2: row.CommCapex_H1FY2 || "",
        h2FY2: row.CommCapex_H2FY2 || "",
        h1FY3: row.CommCapex_H1FY3 || "",
        h2FY3: row.CommCapex_H2FY3 || "",
        h1FY4: row.CommCapex_H1FY4 || "",
        h2FY4: row.CommCapex_H2FY4 || "",
        h1FY5: row.CommCapex_H1FY5 || "",
        h2FY5: row.CommCapex_H2FY5 || "",
      },

      commitmentRevex: {
        aprFY1: row.CommRevex_AprFY1 || "",
        mayFY1: row.CommRevex_MayFY1 || "",
        junFY1: row.CommRevex_JunFY1 || "",
        julFY1: row.CommRevex_JulFY1 || "",
        augFY1: row.CommRevex_AugFY1 || "",
        sepFY1: row.CommRevex_SepFY1 || "",
        octFY1: row.CommRevex_OctFY1 || "",
        novFY1: row.CommRevex_NovFY1 || "",
        decFY1: row.CommRevex_DecFY1 || "",
        janFY1: row.CommRevex_JanFY1 || "",
        febFY1: row.CommRevex_FebFY1 || "",
        marFY1: row.CommRevex_MarFY1 || "",
        h1FY1: row.CommRevex_H1FY1 || "",
        h2FY1: row.CommRevex_H2FY1 || "",
        h1FY2: row.CommRevex_H1FY2 || "",
        h2FY2: row.CommRevex_H2FY2 || "",
        h1FY3: row.CommRevex_H1FY3 || "",
        h2FY3: row.CommRevex_H2FY3 || "",
        h1FY4: row.CommRevex_H1FY4 || "",
        h2FY4: row.CommRevex_H2FY4 || "",
        h1FY5: row.CommRevex_H1FY5 || "",
        h2FY5: row.CommRevex_H2FY5 || "",
      },

      cashCapex: {
        aprFY1: row.CashCapex_AprFY1 || "",
        mayFY1: row.CashCapex_MayFY1 || "",
        junFY1: row.CashCapex_JunFY1 || "",
        julFY1: row.CashCapex_JulFY1 || "",
        augFY1: row.CashCapex_AugFY1 || "",
        sepFY1: row.CashCapex_SepFY1 || "",
        octFY1: row.CashCapex_OctFY1 || "",
        novFY1: row.CashCapex_NovFY1 || "",
        decFY1: row.CashCapex_DecFY1 || "",
        janFY1: row.CashCapex_JanFY1 || "",
        febFY1: row.CashCapex_FebFY1 || "",
        marFY1: row.CashCapex_MarFY1 || "",
        h1FY1: row.CashCapex_H1FY1 || "",
        h2FY1: row.CashCapex_H2FY1 || "",
        h1FY2: row.CashCapex_H1FY2 || "",
        h2FY2: row.CashCapex_H2FY2 || "",
        h1FY3: row.CashCapex_H1FY3 || "",
        h2FY3: row.CashCapex_H2FY3 || "",
        h1FY4: row.CashCapex_H1FY4 || "",
        h2FY4: row.CashCapex_H2FY4 || "",
        h1FY5: row.CashCapex_H1FY5 || "",
        h2FY5: row.CashCapex_H2FY5 || "",
      },

      cashRevex: {
        aprFY1: row.CashRevex_AprFY1 || "",
        mayFY1: row.CashRevex_MayFY1 || "",
        junFY1: row.CashRevex_JunFY1 || "",
        julFY1: row.CashRevex_JulFY1 || "",
        augFY1: row.CashRevex_AugFY1 || "",
        sepFY1: row.CashRevex_SepFY1 || "",
        octFY1: row.CashRevex_OctFY1 || "",
        novFY1: row.CashRevex_NovFY1 || "",
        decFY1: row.CashRevex_DecFY1 || "",
        janFY1: row.CashRevex_JanFY1 || "",
        febFY1: row.CashRevex_FebFY1 || "",
        marFY1: row.CashRevex_MarFY1 || "",
        h1FY1: row.CashRevex_H1FY1 || "",
        h2FY1: row.CashRevex_H2FY1 || "",
        h1FY2: row.CashRevex_H1FY2 || "",
        h2FY2: row.CashRevex_H2FY2 || "",
        h1FY3: row.CashRevex_H1FY3 || "",
        h2FY3: row.CashRevex_H2FY3 || "",
        h1FY4: row.CashRevex_H1FY4 || "",
        h2FY4: row.CashRevex_H2FY4 || "",
        h1FY5: row.CashRevex_H1FY5 || "",
        h2FY5: row.CashRevex_H2FY5 || "",
      },

      carryForwardWBS: row.CarryForwardWBS || "",
      carryForwardDescription: row.CarryForwardDescription || "",
      carryForwardFYYear: row.CarryForwardFYYear || "",
    });

    setEditingRowId(id.toString());
    // setActiveTab(0);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record?",
    );
    if (!confirmed) return;

    try {
      await DeletePDMaster(id);
      await fetchPDDetails();
      if (editingRowId === id.toString()) {
        resetForm();
      }
    } catch (error) {
      console.error("Delete Failed", error);
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      if (rows.length === 0 && carryForwardRows.length === 0) {
        alert(
          "Please save at least one budget or carry forward entry before submitting for approval.",
        );
        return;
      }

      const response = await UpdatePDStatus({
        projectId: data?.projectID,
        deptId: data?.deptID?.toString(),
        userId: user?.userId!,
        actionPerformed: "POSTED",
        remarks: "Submitted for approval",
      });

      alert(response.message);
      navigate("/myprojects");
    } catch (error) {
      console.error(error);
    }
  };

  // ─────────────────────────────────────────────────────────
  // Reusable financial row renderer (matches PDInputs layout)
  // ─────────────────────────────────────────────────────────

  const renderFinancialRow = (
    section: "commitmentCapex" | "commitmentRevex" | "cashCapex" | "cashRevex",
    label: string,
    data: FinancialValues,
    totals: {
      h1FY1Total: string;
      h2FY1Total: string;
      fy1Total: string;
      valueTotal: string;
    },
    onValueChange?: (field: keyof FinancialValues, value: string) => void,
  ) => {
    const months: (keyof FinancialValues)[] = [
      "aprFY1",
      "mayFY1",
      "junFY1",
      "julFY1",
      "augFY1",
      "sepFY1",
      "octFY1",
      "novFY1",
      "decFY1",
      "janFY1",
      "febFY1",
      "marFY1",
    ];

    const halves: (keyof FinancialValues)[] = [
      "h1FY2",
      "h2FY2",
      "h1FY3",
      "h2FY3",
      "h1FY4",
      "h2FY4",
      "h1FY5",
      "h2FY5",
    ];

    return (
      <>
        {/* Type label */}
        <td className="font-medium">{label}</td>

        {/* Read-only computed totals */}
        <td>
          <input
            type="text"
            value={totals.valueTotal}
            disabled
            className="input input-bordered input-xs w-24 bg-gray-100 font-semibold text-slate-700"
          />
        </td>
        <td>
          <input
            type="text"
            value={totals.fy1Total}
            disabled
            className="input input-bordered input-xs w-24 bg-gray-100 font-semibold text-slate-700"
          />
        </td>

        {/* Monthly inputs */}
        {months.map((m) => (
          <td key={m}>
            <input
              type="text"
              value={data[m]}
              onChange={(e) =>
                onValueChange
                  ? onValueChange(m, e.target.value)
                  : handleFinancialChange(section, m, e.target.value)
              }
              className="input input-bordered input-xs w-16"
            />
          </td>
        ))}

        {/* Auto-computed H1 / H2 FY1 */}
        <td>
          <input
            type="text"
            value={totals.h1FY1Total}
            disabled
            className="input input-bordered input-xs w-24 bg-gray-100 font-semibold text-slate-700"
          />
        </td>
        <td>
          <input
            type="text"
            value={totals.h2FY1Total}
            disabled
            className="input input-bordered input-xs w-24 bg-gray-100 font-semibold text-slate-700"
          />
        </td>

        {/* Half-yearly inputs FY2–FY5 */}
        {halves.map((h) => (
          <td key={h}>
            <input
              type="text"
              value={data[h]}
              onChange={(e) =>
                onValueChange
                  ? onValueChange(h, e.target.value)
                  : handleFinancialChange(section, h, e.target.value)
              }
              className="input input-bordered input-xs w-16"
            />
          </td>
        ))}
      </>
    );
  };

  // ─────────────────────────────────────────────────────────
  // Shared table header for Commitments / Cash Flow tabs
  // ─────────────────────────────────────────────────────────

  const financialTableHeaderComm = (
    <thead className="text-xs bg-red-500 text-white">
      <tr>
        <th className="align-middle">Description</th>
        <th className="align-middle">Basis</th>
        <th className="align-middle">Type</th>
        <th>
          Total Commitment
          <br /> Value in CR.
        </th>
        <th>
          Total Commitment <br /> Value FY1 in CR.
        </th>
        <th>Apr FY1</th>
        <th>May FY1</th>
        <th>Jun FY1</th>
        <th>Jul FY1</th>
        <th>Aug FY1</th>
        <th>Sep FY1</th>
        <th>Oct FY1</th>
        <th>Nov FY1</th>
        <th>Dec FY1</th>
        <th>Jan FY1</th>
        <th>Feb FY1</th>
        <th>Mar FY1</th>
        <th>H1 FY1</th>
        <th>H2 FY1</th>
        <th>H1 FY2</th>
        <th>H2 FY2</th>
        <th>H1 FY3</th>
        <th>H2 FY3</th>
        <th>H1 FY4</th>
        <th>H2 FY4</th>
        <th>H1 FY5</th>
        <th>H2 FY5</th>
      </tr>
    </thead>
  );
  const financialTableHeaderCash = (
    <thead className="text-xs bg-red-500 text-white">
      <tr>
        <th className="align-middle text-center">Select</th>
        <th className="align-middle">Description</th>
        <th className="align-middle">Basis</th>
        <th className="align-middle">Type</th>
        <th>
          Total Cash Flow
          <br /> Value in CR.
        </th>
        <th>
          Total Cash Flow <br /> Value FY1 in CR.
        </th>
        <th>Apr FY1</th>
        <th>May FY1</th>
        <th>Jun FY1</th>
        <th>Jul FY1</th>
        <th>Aug FY1</th>
        <th>Sep FY1</th>
        <th>Oct FY1</th>
        <th>Nov FY1</th>
        <th>Dec FY1</th>
        <th>Jan FY1</th>
        <th>Feb FY1</th>
        <th>Mar FY1</th>
        <th>H1 FY1</th>
        <th>H2 FY1</th>
        <th>H1 FY2</th>
        <th>H2 FY2</th>
        <th>H1 FY3</th>
        <th>H2 FY3</th>
        <th>H1 FY4</th>
        <th>H2 FY4</th>
        <th>H1 FY5</th>
        <th>H2 FY5</th>
      </tr>
    </thead>
  );

  const savedFinancialHeaders = [
    { label: "Apr FY1", color: "bg-sky-100 text-sky-950" },
    { label: "May FY1", color: "bg-sky-100 text-sky-950" },
    { label: "Jun FY1", color: "bg-sky-100 text-sky-950" },
    { label: "Jul FY1", color: "bg-sky-100 text-sky-950" },
    { label: "Aug FY1", color: "bg-sky-100 text-sky-950" },
    { label: "Sep FY1", color: "bg-sky-100 text-sky-950" },
    { label: "Oct FY1", color: "bg-emerald-100 text-emerald-950" },
    { label: "Nov FY1", color: "bg-emerald-100 text-emerald-950" },
    { label: "Dec FY1", color: "bg-emerald-100 text-emerald-950" },
    { label: "Jan FY1", color: "bg-emerald-100 text-emerald-950" },
    { label: "Feb FY1", color: "bg-emerald-100 text-emerald-950" },
    { label: "Mar FY1", color: "bg-emerald-100 text-emerald-950" },
    { label: "H1 FY1", color: "bg-sky-300 text-sky-950 font-bold" },
    { label: "H2 FY1", color: "bg-emerald-300 text-emerald-950 font-bold" },
    { label: "H1 FY2", color: "bg-indigo-200 text-indigo-950" },
    { label: "H2 FY2", color: "bg-indigo-200 text-indigo-950" },
    { label: "H1 FY3", color: "bg-violet-200 text-violet-950" },
    { label: "H2 FY3", color: "bg-violet-200 text-violet-950" },
    { label: "H1 FY4", color: "bg-fuchsia-200 text-fuchsia-950" },
    { label: "H2 FY4", color: "bg-fuchsia-200 text-fuchsia-950" },
    { label: "H1 FY5", color: "bg-orange-200 text-orange-950" },
    { label: "H2 FY5", color: "bg-orange-200 text-orange-950" },
  ];

  const renderSavedFinancialHeaders = () =>
    savedFinancialHeaders.map(({ label, color }, index) => (
      <th
        key={`${label}-${index}`}
        className={`border border-slate-300 ${color}`}
      >
        {label}
      </th>
    ));

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────

  const CommitmentTable = () => {
    return (
      <div className="overflow-x-auto border border-base-300 rounded">
        <table className="table table-xs table-zebra min-w-max">
          <thead className="text-xs text-white">
            <tr className="bg-red-500   ">
              {canEdit && <th className="text-center border">Actions</th>}
              <th className="text-center border" colSpan={2}>
                General
              </th>
              <th className="text-center border" colSpan={5}>
                Total
              </th>
              <th className="text-center border" colSpan={22}>
                Commitment Capex
              </th>
              <th className="text-center border" colSpan={22}>
                Commitment Revex
              </th>
            </tr>
            <tr className="bg-red-400">
              {canEdit && <th></th>}
              <th className="align-middle border border-slate-300 ">
                Description
              </th>
              <th className="align-middle border border-slate-300">Basis</th>
              <th className="border border-slate-300">
                Total Commitment
                <br /> Value in CR.
              </th>
              <th className="border border-slate-300">
                Total Commitment <br /> Capex in CR.
              </th>
              <th className="border border-slate-300">
                Total Commitment <br /> Revex in CR.
              </th>
              <th className="border border-slate-300">
                Total Commitment <br /> Capex F1 in CR.
              </th>
              <th className="border border-slate-300">
                Total Commitment <br /> Revex F1 in CR.
              </th>

              {renderSavedFinancialHeaders()}

              {renderSavedFinancialHeaders()}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.PDDetailId} className="hover ">
                {canEdit && (
                  <td className="border border-slate-300">
                    <button
                      className="btn btn-xs mr-2 btn-neutral"
                      onClick={() => handleEdit(row.PDDetailId)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-xs"
                      onClick={() => handleDelete(row.PDDetailId)}
                    >
                      Delete
                    </button>
                  </td>
                )}
                <td className="max-w-80 whitespace-normal wrap-break-word align-top border border-slate-300">
                  {row.Description}
                </td>
                <td className="max-w-80 whitespace-normal wrap-break-word align-top border border-slate-300">
                  {row.Basis}
                </td>
                <td className="border border-slate-300">
                  {(
                    Number(getCommTotal(row, "CommCapex")) +
                    Number(getCommTotal(row, "CommRevex"))
                  ).toFixed(2)}
                </td>

                <td className="border border-slate-300">
                  {getCommTotal(row, "CommCapex")}
                </td>
                <td className="border border-slate-300">
                  {getCommTotal(row, "CommRevex")}
                </td>

                <td className="border border-slate-300">
                  {getCommFY1Total(row, "CommCapex")}
                </td>
                <td className="border border-slate-300">
                  {getCommFY1Total(row, "CommRevex")}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_AprFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_MayFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_JunFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_JulFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_AugFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_SepFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_OctFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_NovFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_DecFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_JanFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_FebFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_MarFY1}
                </td>

                <td className="border border-slate-300">
                  {row.CommCapex_H1FY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_H2FY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_H1FY2}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_H2FY2}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_H1FY3}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_H2FY3}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_H1FY4}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_H2FY4}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_H1FY5}
                </td>
                <td className="border border-slate-300">
                  {row.CommCapex_H2FY5}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_AprFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_MayFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_JunFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_JulFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_AugFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_SepFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_OctFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_NovFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_DecFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_JanFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_FebFY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_MarFY1}
                </td>

                <td className="border border-slate-300">
                  {row.CommRevex_H1FY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_H2FY1}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_H1FY2}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_H2FY2}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_H1FY3}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_H2FY3}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_H1FY4}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_H2FY4}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_H1FY5}
                </td>
                <td className="border border-slate-300">
                  {row.CommRevex_H2FY5}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const CashFlowTable = () => {
    return (
      <div className="overflow-x-auto border border-base-300 rounded">
        <table className="table table-xs table-zebra min-w-max">
          <thead className="text-xs  text-white">
            <tr>
              {canEdit && (
                <th className="text-center border bg-red-500">Actions</th>
              )}
              <th className="text-center border bg-red-500" colSpan={2}>
                General
              </th>
              <th className="text-center border bg-red-500" colSpan={5}>
                Cash Flow Totals
              </th>
              <th className="text-center border bg-red-500" colSpan={22}>
                CashFlow Capex
              </th>
              <th className="text-center border bg-red-500" colSpan={22}>
                CashFlow Revex
              </th>
            </tr>
            <tr className="bg-red-400">
              {canEdit && <th></th>}
              <th className="align-middle border border-slate-300">
                Description
              </th>
              <th className="align-middle border border-slate-300">Basis</th>
              <th className="border border-slate-300">
                Total CashFlow
                <br /> Value in CR.
              </th>
              <th className="border border-slate-300">
                Total CashFlow <br /> Capex in CR.
              </th>
              <th className="border border-slate-300">
                Total CashFlow <br /> Revex in CR.
              </th>
              <th className="border border-slate-300">
                Total CashFlow <br /> Capex F1 in CR.
              </th>
              <th className="border border-slate-300">
                Total CashFlow <br /> Revex F1 in CR.
              </th>

              {renderSavedFinancialHeaders()}

              {renderSavedFinancialHeaders()}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const total =
                Number(getCashFlowTotal(row, "CashCapex")) +
                Number(getCashFlowTotal(row, "CashRevex"));

              if (total <= 0) return null;

              return (
                <tr key={row.PDDetailId} className="hover">
                  {canEdit && (
                    <td className="border border-slate-300">
                      <button
                        className="btn btn-xs mr-2 btn-neutral"
                        onClick={() => {
                          setCashFlowDrafts((previous) => ({
                            ...previous,
                            [row.PDDetailId]: getCashFlowDraft(row),
                          }));
                          setSelectedCashFlowRows((previous) => ({
                            ...previous,
                            [row.PDDetailId]: true,
                          }));
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  )}

                  <td className="max-w-80 whitespace-normal wrap-break-word align-top border border-slate-300">
                    {row.Description}
                  </td>
                  <td className="max-w-80 whitespace-normal wrap-break-word align-top border border-slate-300">
                    {row.Basis}
                  </td>

                  <td className="border border-slate-300">
                    {total.toFixed(2)}
                  </td>

                  <td className="border border-slate-300">
                    {getCashFlowTotal(row, "CashCapex")}
                  </td>

                  <td className="border border-slate-300">
                    {getCashFlowTotal(row, "CashRevex")}
                  </td>

                  <td className="border border-slate-300">
                    {getCashFlowFY1Total(row, "CashCapex")}
                  </td>

                  <td className="border border-slate-300">
                    {getCashFlowFY1Total(row, "CashRevex")}
                  </td>

                  {/* Cash Capex FY1 Monthly */}
                  <td className="border border-slate-300">
                    {row.CashCapex_AprFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_MayFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_JunFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_JulFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_AugFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_SepFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_OctFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_NovFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_DecFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_JanFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_FebFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_MarFY1}
                  </td>

                  {/* Cash Capex Half-Yearly */}
                  <td className="border border-slate-300">
                    {row.CashCapex_H1FY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_H2FY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_H1FY2}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_H2FY2}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_H1FY3}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_H2FY3}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_H1FY4}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_H2FY4}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_H1FY5}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashCapex_H2FY5}
                  </td>

                  {/* Cash Revex FY1 Monthly */}
                  <td className="border border-slate-300">
                    {row.CashRevex_AprFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_MayFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_JunFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_JulFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_AugFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_SepFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_OctFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_NovFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_DecFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_JanFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_FebFY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_MarFY1}
                  </td>

                  {/* Cash Revex Half-Yearly */}
                  <td className="border border-slate-300">
                    {row.CashRevex_H1FY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_H2FY1}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_H1FY2}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_H2FY2}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_H1FY3}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_H2FY3}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_H1FY4}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_H2FY4}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_H1FY5}
                  </td>
                  <td className="border border-slate-300">
                    {row.CashRevex_H2FY5}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const CarryForwardTable = () => {
    return (
      <div className="overflow-x-auto border border-base-300 rounded">
        <table className="table table-xs table-zebra min-w-225">
          <thead className="text-xs text-white">
            <tr className="bg-red-500">
              {canEdit && <th className="border border-red-400">Actions</th>}
              <th className="border border-red-400">WBS Element</th>
              <th className="border border-red-400">WBS Description</th>
              <th className="border border-red-400">Financial Year</th>
              <th className="border border-red-400 text-right">
                Commitment Capex (Cr.)
              </th>
              <th className="border border-red-400 text-right">
                Commitment Revex (Cr.)
              </th>
              <th className="border border-red-400 text-right">
                Cash Flow Capex (Cr.)
              </th>
              <th className="border border-red-400 text-right">
                Cash Flow Revex (Cr.)
              </th>
              <th className="border border-red-400 text-right">
                Actual Spent Capex (Cr.)
              </th>
              <th className="border border-red-400 text-right">
                Actual Spent Revex (Cr.)
              </th>
            </tr>
          </thead>

          <tbody>
            {carryForwardRows.map((row) => (
              <tr key={row.id ?? row.Id}>
                {canEdit && (
                  <td className="border border-slate-300 whitespace-nowrap">
                    <button
                      className="btn btn-xs btn-neutral mr-2"
                      onClick={() => handleCarryForwardEdit(row)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-xs btn-error text-white"
                      onClick={() => handleCarryForwardDelete(row)}
                    >
                      Delete
                    </button>
                  </td>
                )}
                <td className="border border-slate-300">
                  {row.wbsId ?? row.WBSId ?? "-"}
                </td>
                <td className="max-w-80 whitespace-normal wrap-break-word border border-slate-300">
                  {row.wbsDescription ?? row.WBSDescription ?? "-"}
                </td>
                <td className="border border-slate-300">
                  {row.fyYear ?? row.FyYear ?? "-"}
                </td>
                <td className="border border-slate-300 text-right">
                  {isNaN(Number(row.commitmentCapex ?? row.CommitmentCapex))
                    ? "0.0"
                    : Number(
                        row.commitmentCapex ?? row.CommitmentCapex,
                      ).toFixed(2)}
                </td>
                <td className="border border-slate-300 text-right">
                  {isNaN(Number(row.commitmentRevex ?? row.CommitmentRevex))
                    ? "0.0"
                    : Number(
                        row.commitmentRevex ?? row.CommitmentRevex,
                      ).toFixed(2)}
                </td>
                <td className="border border-slate-300 text-right">
                  {isNaN(Number(row.cashFlowCapex ?? row.CashFlowCapex))
                    ? "0.0"
                    : Number(row.cashFlowCapex ?? row.CashFlowCapex).toFixed(2)}
                </td>
                <td className="border border-slate-300 text-right">
                  {isNaN(Number(row.cashFlowRevex ?? row.CashFlowRevex))
                    ? "0.0"
                    : Number(row.cashFlowRevex ?? row.CashFlowRevex).toFixed(2)}
                </td>
                <td className="border border-slate-300 text-right">
                  {isNaN(Number(row.actualSpentCapex ?? row.ActualSpentCapex))
                    ? "0.0"
                    : Number(
                        row.actualSpentCapex ?? row.ActualSpentCapex,
                      ).toFixed(2)}
                </td>
                <td className="border border-slate-300 text-right">
                  {isNaN(Number(row.actualSpentRevex ?? row.ActualSpentRevex))
                    ? "0.0"
                    : Number(
                        row.actualSpentRevex ?? row.ActualSpentRevex,
                      ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="ui-screen space-y-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-slate-800">PD Budget Inputs</h1>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Status: {data?.status || "-"}
          </span>
        </div>
        <button
          className="btn btn-sm border border-slate-200 bg-white text-slate-700 shadow-sm"
          onClick={() => navigate("/myprojects")}
        >
          Back
        </button>
      </div>
      <div className="rounded border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700">
        {canEdit
          ? "Enter values only in Crs and without GST"
          : "Entered values are in Cr without GST"}
      </div>

      {/* ── Project Info / Summary ──────────────────────── */}
      <div className="flex flex-col gap-4 xl:flex-row">
        <PDHeader
          projectID={data?.projectID}
          projectName={data?.projectName}
          deptName={data?.deptName}
          deptID={data?.deptID}
          category={data?.projectCategoryName}
          fyYear={data?.FyYear}
          pendingWith={data?.pendingWithUser}
          status={data?.status}
          isOngoing={data?.isOngoing}
        />

        {/* Summary panel — live totals matching new model */}
        <div className="w-full rounded border border-slate-200 bg-white p-4 shadow-sm xl:w-1/2">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Summary</h3>
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="table table-xs w-full">
              <thead className="bg-red-500 text-xs">
                <tr className=" text-xs">
                  <th className="border-r border-base-300 font-semibold text-center">
                    Commitments Capex Total
                  </th>
                  <th className="border-r border-base-300 font-semibold text-center">
                    Commitments Revex Total
                  </th>
                  <th className="border-r border-base-300 font-semibold text-center">
                    Cash Flow Capex Total
                  </th>
                  <th className="border-r border-base-300 font-semibold text-center">
                    Cash Flow Revex Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center font-semibold text-xs text-slate-800">
                  <td className="border-r border-base-300 py-3">
                    {cfCapexTotals.valueTotal} Cr
                  </td>
                  <td className="border-r border-base-300 py-3">
                    {cfRevexTotals.valueTotal} Cr
                  </td>
                  <td className="border-r border-base-300 py-3">
                    {cfCapexTotals.valueTotal} Cr
                  </td>
                  <td className="border-r border-base-300 py-3">
                    {cfRevexTotals.valueTotal} Cr
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Input Tabs ─────────────────────────────────── */}
      <div className="border-slate-200 rounded">
        {
          <div className="tabs tabs-box bg-gray-50 p-4 gap-x-2 border border-slate-200">
            {/* ══ TAB 1: COMMITMENTS ══════════════════════ */}
            <input
              type="radio"
              name="pd_tabs"
              className={`tab ${activeTab === 0 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 0}
              onClick={() => changeTab(0)}
              aria-label="Commitments"
            />
            {canEdit && (
              <div className="tab-content border-base-300 bg-base-100 p-4">
                <div className="overflow-x-auto border border-base-300 rounded">
                  <table className="table table-xs table-zebra min-w-max">
                    {financialTableHeaderComm}
                    <tbody>
                      {/* Capex row */}
                      <tr>
                        <td rowSpan={2}>
                          <textarea
                            className="textarea textarea-bordered w-full min-w-48 max-w-80"
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) =>
                              handleChange("description", e.target.value)
                            }
                          />
                        </td>
                        <td rowSpan={2}>
                          <textarea
                            className="textarea textarea-bordered w-full min-w-48 max-w-80"
                            placeholder="Basis"
                            value={formData.basis}
                            onChange={(e) =>
                              handleChange("basis", e.target.value)
                            }
                          />
                        </td>
                        {renderFinancialRow(
                          "commitmentCapex",
                          "Capex",
                          formData.commitmentCapex,
                          commCapexTotals,
                        )}
                      </tr>
                      {/* Revex row */}
                      <tr>
                        {renderFinancialRow(
                          "commitmentRevex",
                          "Revex",
                          formData.commitmentRevex,
                          commRevexTotals,
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══ TAB 2: CASH FLOW ════════════════════════ */}
            <input
              type="radio"
              name="pd_tabs"
              className={`tab ${activeTab === 1 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 1}
              onClick={() => changeTab(1)}
              aria-label="Cash Flow"
            />

            {canEdit && (
              <div className="tab-content border-base-300 bg-base-100 p-4">
                <div className="overflow-x-auto border border-base-300 rounded">
                  <table className="table table-xs table-zebra min-w-max">
                    {financialTableHeaderCash}
                    <tbody>
                      {rows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={28}
                            className="py-6 text-center text-gray-500"
                          >
                            Save a commitment before adding its cash flow.
                          </td>
                        </tr>
                      ) : editableCashFlowRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={28}
                            className="py-6 text-center text-gray-500"
                          >
                            All cash flow entries are saved. Use Edit Cash Flow
                            below to make changes.
                          </td>
                        </tr>
                      ) : (
                        editableCashFlowRows.map((row) => {
                          const draft = getCashFlowDraft(row);
                          const capexTotals = calculateRowTotals(
                            draft.cashCapex,
                          );
                          const revexTotals = calculateRowTotals(
                            draft.cashRevex,
                          );
                          const selected = Boolean(
                            selectedCashFlowRows[row.PDDetailId],
                          );

                          return (
                            <Fragment key={row.PDDetailId}>
                              <tr key={`${row.PDDetailId}-capex`}>
                                <td
                                  rowSpan={2}
                                  className="text-center align-middle"
                                >
                                  <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm"
                                    checked={selected}
                                    onChange={(event) =>
                                      setSelectedCashFlowRows((previous) => ({
                                        ...previous,
                                        [row.PDDetailId]: event.target.checked,
                                      }))
                                    }
                                  />
                                </td>
                                <td
                                  rowSpan={2}
                                  className="min-w-48 max-w-80 whitespace-normal wrap-break-word align-middle"
                                >
                                  {row.Description || "-"}
                                </td>
                                <td
                                  rowSpan={2}
                                  className="min-w-48 max-w-80 whitespace-normal wrap-break-word align-middle"
                                >
                                  {row.Basis || "-"}
                                </td>
                                {renderFinancialRow(
                                  "cashCapex",
                                  "Capex",
                                  draft.cashCapex,
                                  capexTotals,
                                  (field, value) =>
                                    handleCashFlowChange(
                                      row.PDDetailId,
                                      "cashCapex",
                                      field,
                                      value,
                                    ),
                                )}
                              </tr>
                              <tr key={`${row.PDDetailId}-revex`}>
                                {renderFinancialRow(
                                  "cashRevex",
                                  "Revex",
                                  draft.cashRevex,
                                  revexTotals,
                                  (field, value) =>
                                    handleCashFlowChange(
                                      row.PDDetailId,
                                      "cashRevex",
                                      field,
                                      value,
                                    ),
                                )}
                              </tr>
                            </Fragment>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══ TAB 3: CARRY FORWARD ════════════════════ */}
            <>
              {data?.isOngoing && (
                <>
                  <input
                    type="radio"
                    name="pd_tabs"
                    className={`tab ${activeTab === 2 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
                    checked={activeTab === 2}
                    onClick={() => changeTab(2)}
                    aria-label="Carry Forward/Actual Spent"
                  />
                  {canEdit && (
                    <div className="tab-content border-base-300 bg-base-100 p-4">
                      <div className="overflow-x-auto border border-base-300 rounded">
                        <table className="table table-xs table-zebra min-w-250">
                          <thead className="bg-red-500 text-white">
                            <tr>
                              <th>WBS Element</th>
                              <th>WBS Description</th>
                              <th>Financial Year</th>
                              <th>Commitment Capex (Cr.)</th>
                              <th>Commitment Revex (Cr.)</th>
                              <th>Cash Flow Capex (Cr.)</th>
                              <th>Cash Flow Revex (Cr.)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="min-w-55">
                                <select
                                  className="select select-bordered select-xs w-full"
                                  value={carryForwardForm.wbsId}
                                  onChange={(event) =>
                                    handleCarryForwardWBSChange(
                                      event.target.value,
                                    )
                                  }
                                >
                                  <option value="">Select WBS element</option>
                                  {wbsOptions.map((option) => {
                                    const wbsId = getWBSOptionId(option);
                                    const description =
                                      getWBSOptionDescription(option);

                                    return (
                                      <option key={wbsId} value={wbsId}>
                                        {description
                                          ? `${wbsId} - ${description}`
                                          : wbsId}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                              <td className="min-w-80">
                                <textarea
                                  className="textarea textarea-bordered textarea-xs h-8 min-h-8 w-full resize-none"
                                  value={carryForwardForm.wbsDescription}
                                  readOnly
                                  placeholder="Selected automatically from WBS"
                                />
                              </td>
                              <td className="min-w-40">
                                <select
                                  className="select select-bordered select-xs w-full"
                                  value={carryForwardForm.fyYear}
                                  onChange={(event) =>
                                    setCarryForwardForm((previous) => ({
                                      ...previous,
                                      fyYear: event.target.value,
                                    }))
                                  }
                                >
                                  <option value="">
                                    Select financial year
                                  </option>

                                  {allFiYears.map((fy) => (
                                    <option key={fy.value} value={fy.value}>
                                      {fy.text}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="min-w-45">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  min="0"
                                  step="any"
                                  className="input input-bordered input-xs w-full"
                                  value={carryForwardForm.commitmentCapex}
                                  onChange={(event) => {
                                    const value = event.target.value;

                                    if (!isValidNumber(value)) {
                                      alert("Enter a valid amount");
                                      return;
                                    }

                                    setCarryForwardForm((previous) => ({
                                      ...previous,
                                      commitmentCapex: value,
                                    }));
                                  }}
                                />
                              </td>
                              <td className="min-w-45">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  min="0"
                                  step="any"
                                  className="input input-bordered input-xs w-full"
                                  value={carryForwardForm.commitmentRevex}
                                  onChange={(event) => {
                                    const value = event.target.value;

                                    if (!isValidNumber(value)) {
                                      alert("Enter a valid amount");
                                      return;
                                    }

                                    setCarryForwardForm((previous) => ({
                                      ...previous,
                                      commitmentRevex: value,
                                    }));
                                  }}
                                />
                              </td>
                              <td className="min-w-45">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  min="0"
                                  step="any"
                                  className="input input-bordered input-xs w-full"
                                  value={carryForwardForm.cashFlowCapex}
                                  onChange={(event) => {
                                    const value = event.target.value;

                                    if (!isValidNumber(value)) {
                                      alert("Enter a valid amount");
                                      return;
                                    }

                                    setCarryForwardForm((previous) => ({
                                      ...previous,
                                      cashFlowCapex: value,
                                    }));
                                  }}
                                />
                              </td>
                              <td className="min-w-45">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  min="0"
                                  step="any"
                                  className="input input-bordered input-xs w-full"
                                  value={carryForwardForm.cashFlowRevex}
                                  onChange={(event) => {
                                    const value = event.target.value;

                                    if (!isValidNumber(value)) {
                                      alert("Enter a valid amount");
                                      return;
                                    }

                                    setCarryForwardForm((previous) => ({
                                      ...previous,
                                      cashFlowRevex: value,
                                    }));
                                  }}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          </div>
        }

        {/* ── Action Buttons ──────────────────────────── */}
        {canEdit && (
          <div className="flex gap-x-4 place-content-left m-4">
            {/* <button
              className="btn btn-sm btn-neutral"
              onClick={prevTab}
              disabled={activeTab === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>

            <button
              className="btn btn-sm btn-neutral"
              onClick={nextTab}
              disabled={activeTab === tabs.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button> */}

            {(activeTab === 1
              ? editableCashFlowRows.length > 0
              : activeTab === 2
                ? true
                : !isRowEmpty()) && (
              <button
                className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-red-600"
                onClick={handleSave}
              >
                {activeTab === 1
                  ? "Save Cash Flow"
                  : activeTab === 2
                    ? editingCarryForwardId
                      ? "Update Carry Forward"
                      : "Save Carry Forward"
                    : isEditing
                      ? "Update Row"
                      : "Save"}
              </button>
            )}

            <button
              className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:border-gray-400"
              onClick={handleSubmitForApproval}
              disabled={rows.length === 0 && carryForwardRows.length === 0}
            >
              Submit For Approval
            </button>
          </div>
        )}
      </div>

      {/* ── Saved Rows Table ───────────────────────────── */}
      {(activeTab === 1
        ? hasSavedCashFlow
        : activeTab === 2
          ? carryForwardRows.length > 0
          : rows.length > 0) && (
        <div className="mt-6 border border-slate-300 font-medium text-xs bg-white overflow-hidden">
          <div className="max-h-175 overflow-auto">
            {rows.length > 0 && activeTab === 0 && <CommitmentTable />}

            {rows.length > 0 && activeTab === 1 && <CashFlowTable />}

            {carryForwardRows.length > 0 && activeTab === 2 && (
              <CarryForwardTable />
            )}
          </div>
        </div>
      )}

      {/* ── Approval History ───────────────────────────── */}
      {approvalHistory.length > 0 && (
        <div className="mt-6 border border-slate-200 rounded bg-white overflow-hidden">
          <div className="px-4 py-3 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-700">
              Approval History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra table-xs w-full">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th>S.No.</th>
                  <th>User ID</th>
                  <th>Employee</th>
                  <th>Action</th>
                  <th>Remarks</th>
                  <th>Date &amp; Time</th>
                </tr>
              </thead>
              <tbody>
                {approvalHistory.map((item, index) => (
                  <tr key={item.HistoryId}>
                    <td>{index + 1}</td>
                    <td>{item.ActionPerformedBy}</td>
                    <td>{item.EmployeeName}</td>
                    <td>
                      <span className="badge badge-sm badge-neutral">
                        {item.ActionPerformed}
                      </span>
                    </td>
                    <td>{item.Remarks || "-"}</td>
                    <td>{item.TDate}</td>
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

export default PDProjectDetail;
