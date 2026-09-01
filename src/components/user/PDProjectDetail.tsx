import { useState, useEffect } from "react";
import PDHeader from "../pd/PDHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  SavePDMaster,
  UpdatePDMaster,
  GetPDMaster,
  DeletePDMaster,
  UpdatePDStatus,
  GetPDApprovalHistory,
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

  const [rows, setRows] = useState<any[]>([]);

  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const isEditing = editingRowId !== null;

  const data = location.state;

  console.log(data);
  console.log(data?.status);

  const canEdit = data?.status === "OPENED";

  const { user } = useUserStore();

  const tabs = ["Commitments", "Cash Flow", "Carry Forward"];

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

  // Live computed totals for the summary panel
  const commCapexTotals = calculateRowTotals(formData.commitmentCapex);
  const commRevexTotals = calculateRowTotals(formData.commitmentRevex);
  const cfCapexTotals = calculateRowTotals(formData.cashCapex);
  const cfRevexTotals = calculateRowTotals(formData.cashRevex);

  // ─────────────────────────────────────────────────────────
  // Payload builder
  // ─────────────────────────────────────────────────────────

  const buildPayload = (draftStatus: string) => {
    const commCapexCalc = calculateRowTotals(formData.commitmentCapex);
    const commRevexCalc = calculateRowTotals(formData.commitmentRevex);
    const cashCapexCalc = calculateRowTotals(formData.cashCapex);
    const cashRevexCalc = calculateRowTotals(formData.cashRevex);

    return {
      ProjectId: data?.projectID,
      RecordId: pdDetailId?.toString() || "0",
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
      console.log(data?.projectID, data?.deptID);
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

  useEffect(() => {
    fetchPDDetails();
    fetchApprovalHistory();
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
      allFinancialEmpty(formData.cashRevex) &&
      (!formData.carryForwardWBS || formData.carryForwardWBS.trim() === "") &&
      (!formData.carryForwardDescription ||
        formData.carryForwardDescription.trim() === "") &&
      (!formData.carryForwardFYYear ||
        formData.carryForwardFYYear.trim() === "")
    );
  };

  const getTotal = (field: string) =>
    rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);

  // ─────────────────────────────────────────────────────────
  // Form handlers
  // ─────────────────────────────────────────────────────────

  const handleFinancialChange = (
    section: "commitmentCapex" | "commitmentRevex" | "cashCapex" | "cashRevex",
    field: keyof FinancialValues,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

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

  // ─────────────────────────────────────────────────────────
  // Tab navigation
  // ─────────────────────────────────────────────────────────

  const savePDData = async () => {
    try {
      if (isRowEmpty()) {
        return false;
      }
      const payload = buildPayload("DRAFT");

      if (!pdDetailId) {
        const response = await SavePDMaster(payload);
        setPDDetailId(response?.pdDetailId);
      } else {
        const response = await UpdatePDMaster(payload, pdDetailId);
        setPDDetailId(response?.pdDetailId);
      }

      return true;
    } catch (error) {
      console.error("PD Save Failed", error);
      return false;
    }
  };

  const getGrandTotal = (prefix: string) =>
    rows.reduce(
      (sum, row) =>
        sum +
        Number(row[`${prefix}_H1FY1`] || 0) +
        Number(row[`${prefix}_H2FY1`] || 0) +
        Number(row[`${prefix}_H1FY2`] || 0) +
        Number(row[`${prefix}_H2FY2`] || 0) +
        Number(row[`${prefix}_H1FY3`] || 0) +
        Number(row[`${prefix}_H2FY3`] || 0) +
        Number(row[`${prefix}_H1FY4`] || 0) +
        Number(row[`${prefix}_H2FY4`] || 0) +
        Number(row[`${prefix}_H1FY5`] || 0) +
        Number(row[`${prefix}_H2FY5`] || 0),
      0,
    );

  const getFY1Total = (prefix: string) =>
    rows.reduce(
      (sum, row) =>
        sum +
        Number(row[`${prefix}_H1FY1`] || 0) +
        Number(row[`${prefix}_H2FY1`] || 0),
      0,
    );

  const changeTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const nextTab = async () => {
    const success = await savePDData();
    if (!success) return;

    console.log("This is success - NEXT", success);

    if (activeTab < tabs.length - 1) {
      setActiveTab((prev) => prev + 1);
    }
    fetchPDDetails();
  };

  const prevTab = async () => {
    const success = await savePDData();
    if (!success) return;

    console.log("This is success - PREV", success);

    if (activeTab > 0) {
      setActiveTab((prev) => prev - 1);
    }
    fetchPDDetails();
  };

  // ─────────────────────────────────────────────────────────
  // CRUD handlers
  // ─────────────────────────────────────────────────────────

  const handleSave = async () => {
    try {
      if (isRowEmpty()) {
        alert("Please enter at least one value before saving.");
        return;
      }
      const payload = buildPayload("COMPLETE");

      if (editingRowId) {
        await UpdatePDMaster(payload, Number(editingRowId));
        console.log("Row Updated");
      } else {
        if (!pdDetailId) {
          const response = await SavePDMaster(payload);
          setPDDetailId(response?.pdDetailId);
        } else {
          const response = await UpdatePDMaster(payload, pdDetailId);
          setPDDetailId(response?.pdDetailId);
        }
        console.log("Row Saved");
      }

      await fetchPDDetails();
      resetForm();
      setPDDetailId(null);
      setActiveTab(0);
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
    setActiveTab(0);
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
      if (rows.length === 0) {
        alert("Please save at least one entry before submitting for approval.");
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
                handleFinancialChange(section, m, e.target.value)
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
                handleFinancialChange(section, h, e.target.value)
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

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────

  return (
    <div className="p-4 space-y-4">
      {/* ── Project Info / Summary ──────────────────────── */}
      <div className="flex gap-x-2">
        <PDHeader
          projectID={data?.projectID}
          projectName={data?.projectName}
          deptName={data?.deptName}
          deptID={data?.deptID}
          category={data?.category}
          fyYear={data?.FyYear}
          pendingWith={data?.pendingWithUser}
          status={data?.status}
        />

        {/* Summary panel — live totals matching new model */}
        <div className="border border-slate-200 rounded p-4 bg-gray-200 shadow-sm w-1/2">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Summary</h3>
          <div className="overflow-x-auto rounded border border-base-300 bg-white">
            <table className="table w-full table-sm">
              <thead>
                <tr className="bg-base-200 text-xs">
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
                <tr className="hover text-center font-bold text-sm text-slate-800 bg-slate-50">
                  <td className="border-r border-base-300 py-3">
                    {commCapexTotals.valueTotal} Cr
                  </td>
                  <td className="border-r border-base-300 py-3">
                    {commRevexTotals.valueTotal} Cr
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
        {canEdit && (
          <div className="tabs tabs-box bg-gray-50 p-4 gap-x-2 tabs-xs border border-slate-200">
            {/* ══ TAB 1: COMMITMENTS ══════════════════════ */}
            <input
              type="radio"
              name="pd_tabs"
              className={`tab ${activeTab === 0 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 0}
              onClick={() => changeTab(0)}
              aria-label="Commitments"
            />
            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="overflow-x-auto border border-base-300 rounded">
                <table className="table table-xs table-zebra min-w-max">
                  {financialTableHeaderComm}
                  <tbody>
                    {/* Capex row */}
                    <tr>
                      <td rowSpan={2}>
                        <textarea
                          className="textarea textarea-bordered w-full min-w-48"
                          placeholder="Description"
                          value={formData.description}
                          onChange={(e) =>
                            handleChange("description", e.target.value)
                          }
                        />
                      </td>
                      <td rowSpan={2}>
                        <textarea
                          className="textarea textarea-bordered w-full min-w-48"
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

            {/* ══ TAB 2: CASH FLOW ════════════════════════ */}
            <input
              type="radio"
              name="pd_tabs"
              className={`tab ${activeTab === 1 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 1}
              onClick={() => changeTab(1)}
              aria-label="Cash Flow"
            />
            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="overflow-x-auto border border-base-300 rounded">
                <table className="table table-xs table-zebra min-w-max">
                  {financialTableHeaderCash}
                  <tbody>
                    {/* Capex row */}
                    <tr>
                      <td rowSpan={2}>
                        <textarea
                          className="textarea textarea-bordered w-full min-w-48"
                          placeholder="Description"
                          value={formData.description}
                          onChange={(e) =>
                            handleChange("description", e.target.value)
                          }
                        />
                      </td>
                      <td rowSpan={2}>
                        <textarea
                          className="textarea textarea-bordered w-full min-w-48"
                          placeholder="Basis"
                          value={formData.basis}
                          onChange={(e) =>
                            handleChange("basis", e.target.value)
                          }
                        />
                      </td>
                      {renderFinancialRow(
                        "cashCapex",
                        "Capex",
                        formData.cashCapex,
                        cfCapexTotals,
                      )}
                    </tr>
                    {/* Revex row */}
                    <tr>
                      {renderFinancialRow(
                        "cashRevex",
                        "Revex",
                        formData.cashRevex,
                        cfRevexTotals,
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ══ TAB 3: CARRY FORWARD ════════════════════ */}
            <input
              type="radio"
              name="pd_tabs"
              className={`tab ${activeTab === 2 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 2}
              onClick={() => changeTab(2)}
              aria-label="Carry Forward"
            />
            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="overflow-x-auto border border-base-300 rounded max-w-4xl">
                <table className="table table-xs table-zebra min-w-150">
                  <thead className="bg-red-500 text-white">
                    <tr>
                      <th className="text-center">WBS</th>
                      <th>Description</th>
                      <th className="text-center">FY Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="min-w-45">
                        <input
                          type="text"
                          placeholder="Enter WBS"
                          className="input input-bordered input-xs w-full"
                          value={formData.carryForwardWBS}
                          onChange={(e) =>
                            handleChange("carryForwardWBS", e.target.value)
                          }
                        />
                      </td>
                      <td className="min-w-75">
                        <input
                          type="text"
                          placeholder="Enter Description"
                          className="input input-bordered input-xs w-full"
                          value={formData.carryForwardDescription}
                          onChange={(e) =>
                            handleChange(
                              "carryForwardDescription",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="min-w-37.5">
                        <select
                          className="select select-bordered select-xs w-full"
                          value={formData.carryForwardFYYear}
                          onChange={(e) =>
                            handleChange("carryForwardFYYear", e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          <option value="2025-26">2025-26</option>
                          <option value="2026-27">2026-27</option>
                          <option value="2027-28">2027-28</option>
                          <option value="2028-29">2028-29</option>
                          <option value="2029-30">2029-30</option>
                          <option value="2030-31">2030-31</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-sm text-error self-center font-semibold">
              Please fill the entries in Crores only
            </p>
          </div>
        )}

        {/* ── Action Buttons ──────────────────────────── */}
        {canEdit && (
          <div className="flex gap-x-4 place-content-left m-4">
            <button
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
            </button>

            {!isRowEmpty() && (
              <button
                className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-red-600"
                onClick={handleSave}
              >
                {isEditing ? "Update Row" : "Save All Entries"}
              </button>
            )}

            <button
              className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:border-gray-400"
              onClick={handleSubmitForApproval}
              disabled={rows.length === 0}
            >
              Submit For Approval
            </button>
          </div>
        )}
      </div>

      {/* ── Saved Rows Table ───────────────────────────── */}
      {rows.length > 0 && (
        <div className="mt-6 border border-slate-300 font-medium text-xs bg-white overflow-hidden">
          <div className="max-h-175 overflow-auto">
            <table className="table table-zebra table-xs w-full">
              <thead className="sticky top-0 z-30">
                {/* Group header */}
                <tr className="bg-red-500 text-white text-xs">
                  <th className="sticky left-0 z-40 bg-red-500 border text-center">
                    Actions
                  </th>
                  <th colSpan={2} className="text-center border">
                    General
                  </th>
                  <th colSpan={24} className="text-center border">
                    Commitment Capex
                  </th>
                  <th colSpan={24} className="text-center border">
                    Commitment Revex
                  </th>
                  <th colSpan={24} className="text-center border">
                    Cash Flow Capex
                  </th>
                  <th colSpan={24} className="text-center border">
                    Cash Flow Revex
                  </th>
                  <th colSpan={3} className="text-center border">
                    Carry Forward
                  </th>
                </tr>

                {/* Sub header */}
                <tr className="bg-slate-100 text-slate-800">
                  <th className="sticky left-0 z-40 bg-slate-100"></th>

                  {/* General */}
                  <th className="border border-slate-300 text-xs font-medium">
                    Description
                  </th>
                  <th className="border border-slate-300 text-xs font-medium">
                    Basis
                  </th>

                  {/* Commitment Capex columns */}
                  {[
                    "Total Commitment Value in CR",
                    "Total Commitment Value FY1 in CR",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                    "Jan",
                    "Feb",
                    "Mar",
                    "H1 FY1",
                    "H2 FY1",
                    "H1 FY2",
                    "H2 FY2",
                    "H1 FY3",
                    "H2 FY3",
                    "H1 FY4",
                    "H2 FY4",
                    "H1 FY5",
                    "H2 FY5",
                  ].map((col) => (
                    <th
                      key={`cc-${col}`}
                      className="border border-slate-300 text-xs font-medium whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}

                  {/* Commitment Revex columns */}
                  {[
                    "Total Commitment Value in CR",
                    "Total Commitment Value FY1 in CR",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                    "Jan",
                    "Feb",
                    "Mar",
                    "H1 FY1",
                    "H2 FY1",
                    "H1 FY2",
                    "H2 FY2",
                    "H1 FY3",
                    "H2 FY3",
                    "H1 FY4",
                    "H2 FY4",
                    "H1 FY5",
                    "H2 FY5",
                  ].map((col) => (
                    <th
                      key={`cr-${col}`}
                      className="border border-slate-300 text-xs font-medium whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}

                  {/* Cash Capex columns */}
                  {[
                    "Total Cash Flow Value in CR",
                    "Total Cash Flow Value FY1 in CR",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                    "Jan",
                    "Feb",
                    "Mar",
                    "H1 FY1",
                    "H2 FY1",
                    "H1 FY2",
                    "H2 FY2",
                    "H1 FY3",
                    "H2 FY3",
                    "H1 FY4",
                    "H2 FY4",
                    "H1 FY5",
                    "H2 FY5",
                  ].map((col) => (
                    <th
                      key={`cashc-${col}`}
                      className="border border-slate-300 text-xs font-medium whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}

                  {/* Cash Revex columns */}
                  {[
                    "Total Cash Flow Value in CR",
                    "Total Cash Flow Value FY1 in CR",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                    "Jan",
                    "Feb",
                    "Mar",
                    "H1 FY1",
                    "H2 FY1",
                    "H1 FY2",
                    "H2 FY2",
                    "H1 FY3",
                    "H2 FY3",
                    "H1 FY4",
                    "H2 FY4",
                    "H1 FY5",
                    "H2 FY5",
                  ].map((col) => (
                    <th
                      key={`cashr-${col}`}
                      className="border border-slate-300 text-xs font-medium whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}

                  {/* Carry Forward */}
                  <th className="border border-slate-300 text-xs font-medium">
                    WBS
                  </th>
                  <th className="border border-slate-300 text-xs font-medium">
                    CF Description
                  </th>
                  <th className="border border-slate-300 text-xs font-medium">
                    FY Year
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.PDDetailId} className="text-xs">
                    {/* Actions */}
                    <td className="sticky left-0 z-20 bg-white border border-slate-200">
                      {canEdit && (
                        <div className="flex gap-1 justify-center">
                          <button
                            className="btn btn-xs bg-red-500 text-white"
                            onClick={() => handleEdit(row.PDDetailId)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-xs bg-red-500 text-white"
                            onClick={() => handleDelete(row.PDDetailId)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>

                    {/* General */}
                    <td className="border border-slate-200 max-w-55 whitespace-normal leading-4">
                      {row.Description}
                    </td>
                    <td className="border border-slate-200 max-w-55 whitespace-normal leading-4">
                      {row.Basis}
                    </td>

                    {/* Commitment Capex */}
                    {[
                      "CommCapex_Total",
                      "CommCapex_TotalF1",
                      "CommCapex_AprFY1",
                      "CommCapex_MayFY1",
                      "CommCapex_JunFY1",
                      "CommCapex_JulFY1",
                      "CommCapex_AugFY1",
                      "CommCapex_SepFY1",
                      "CommCapex_OctFY1",
                      "CommCapex_NovFY1",
                      "CommCapex_DecFY1",
                      "CommCapex_JanFY1",
                      "CommCapex_FebFY1",
                      "CommCapex_MarFY1",
                      "CommCapex_H1FY1",
                      "CommCapex_H2FY1",
                      "CommCapex_H1FY2",
                      "CommCapex_H2FY2",
                      "CommCapex_H1FY3",
                      "CommCapex_H2FY3",
                      "CommCapex_H1FY4",
                      "CommCapex_H2FY4",
                      "CommCapex_H1FY5",
                      "CommCapex_H2FY5",
                    ].map((f) => (
                      <>
                        {f === "CommCapex_Total" ? (
                          <td
                            key={f}
                            className="border border-slate-200 text-right"
                          >
                            {(
                              Number(row["CommCapex_H1FY1"]) +
                              Number(row["CommCapex_H2FY1"]) +
                              Number(row["CommCapex_H1FY2"]) +
                              Number(row["CommCapex_H2FY2"]) +
                              Number(row["CommCapex_H1FY3"]) +
                              Number(row["CommCapex_H2FY3"]) +
                              Number(row["CommCapex_H1FY4"]) +
                              Number(row["CommCapex_H2FY4"]) +
                              Number(row["CommCapex_H1FY5"]) +
                              Number(row["CommCapex_H2FY5"])
                            ).toFixed(2)}
                          </td>
                        ) : (
                          <>
                            {f === "CommCapex_TotalF1" ? (
                              <td
                                key={f}
                                className="border border-slate-200 text-right"
                              >
                                {(
                                  Number(row["CommCapex_H1FY1"]) +
                                  Number(row["CommCapex_H2FY1"])
                                ).toFixed(2)}
                              </td>
                            ) : (
                              <td
                                key={f}
                                className="border border-slate-200 text-right"
                              >
                                {row[f]}
                              </td>
                            )}
                          </>
                        )}
                      </>
                    ))}

                    {/* Commitment Revex */}
                    {[
                      "CommRevex_Total",
                      "CommRevex_TotalF1",
                      "CommRevex_AprFY1",
                      "CommRevex_MayFY1",
                      "CommRevex_JunFY1",
                      "CommRevex_JulFY1",
                      "CommRevex_AugFY1",
                      "CommRevex_SepFY1",
                      "CommRevex_OctFY1",
                      "CommRevex_NovFY1",
                      "CommRevex_DecFY1",
                      "CommRevex_JanFY1",
                      "CommRevex_FebFY1",
                      "CommRevex_MarFY1",
                      "CommRevex_H1FY1",
                      "CommRevex_H2FY1",
                      "CommRevex_H1FY2",
                      "CommRevex_H2FY2",
                      "CommRevex_H1FY3",
                      "CommRevex_H2FY3",
                      "CommRevex_H1FY4",
                      "CommRevex_H2FY4",
                      "CommRevex_H1FY5",
                      "CommRevex_H2FY5",
                    ].map((f) => (
                      <>
                        {f === "CommRevex_Total" ? (
                          <td
                            key={f}
                            className="border border-slate-200 text-right"
                          >
                            {(
                              Number(row["CommRevex_H1FY1"]) +
                              Number(row["CommRevex_H2FY1"]) +
                              Number(row["CommRevex_H1FY2"]) +
                              Number(row["CommRevex_H2FY2"]) +
                              Number(row["CommRevex_H1FY3"]) +
                              Number(row["CommRevex_H2FY3"]) +
                              Number(row["CommRevex_H1FY4"]) +
                              Number(row["CommRevex_H2FY4"]) +
                              Number(row["CommRevex_H1FY5"]) +
                              Number(row["CommRevex_H2FY5"])
                            ).toFixed(2)}
                          </td>
                        ) : (
                          <>
                            {f === "CommRevex_TotalF1" ? (
                              <td
                                key={f}
                                className="border border-slate-200 text-right"
                              >
                                {(
                                  Number(row["CommRevex_H1FY1"]) +
                                  Number(row["CommRevex_H2FY1"])
                                ).toFixed(2)}
                              </td>
                            ) : (
                              <td
                                key={f}
                                className="border border-slate-200 text-right"
                              >
                                {row[f]}
                              </td>
                            )}
                          </>
                        )}
                      </>
                    ))}

                    {/* Cash Capex */}
                    {[
                      "CashCapex_Total",
                      "CashCapex_TotalF1",
                      "CashCapex_AprFY1",
                      "CashCapex_MayFY1",
                      "CashCapex_JunFY1",
                      "CashCapex_JulFY1",
                      "CashCapex_AugFY1",
                      "CashCapex_SepFY1",
                      "CashCapex_OctFY1",
                      "CashCapex_NovFY1",
                      "CashCapex_DecFY1",
                      "CashCapex_JanFY1",
                      "CashCapex_FebFY1",
                      "CashCapex_MarFY1",
                      "CashCapex_H1FY1",
                      "CashCapex_H2FY1",
                      "CashCapex_H1FY2",
                      "CashCapex_H2FY2",
                      "CashCapex_H1FY3",
                      "CashCapex_H2FY3",
                      "CashCapex_H1FY4",
                      "CashCapex_H2FY4",
                      "CashCapex_H1FY5",
                      "CashCapex_H2FY5",
                    ].map((f) => (
                      <>
                        {f === "CashCapex_Total" ? (
                          <td
                            key={f}
                            className="border border-slate-200 text-right"
                          >
                            {(
                              Number(row["CashCapex_H1FY1"]) +
                              Number(row["CashCapex_H2FY1"]) +
                              Number(row["CashCapex_H1FY2"]) +
                              Number(row["CashCapex_H2FY2"]) +
                              Number(row["CashCapex_H1FY3"]) +
                              Number(row["CashCapex_H2FY3"]) +
                              Number(row["CashCapex_H1FY4"]) +
                              Number(row["CashCapex_H2FY4"]) +
                              Number(row["CashCapex_H1FY5"]) +
                              Number(row["CashCapex_H2FY5"])
                            ).toFixed(2)}
                          </td>
                        ) : (
                          <>
                            {f === "CashCapex_TotalF1" ? (
                              <td
                                key={f}
                                className="border border-slate-200 text-right"
                              >
                                {(
                                  Number(row["CashCapex_H1FY1"]) +
                                  Number(row["CashCapex_H2FY1"])
                                ).toFixed(2)}
                              </td>
                            ) : (
                              <td
                                key={f}
                                className="border border-slate-200 text-right"
                              >
                                {row[f]}
                              </td>
                            )}
                          </>
                        )}
                      </>
                    ))}

                    {/* Cash Revex */}
                    {[
                      "CashRevex_Total",
                      "CashRevex_TotalF1",
                      "CashRevex_AprFY1",
                      "CashRevex_MayFY1",
                      "CashRevex_JunFY1",
                      "CashRevex_JulFY1",
                      "CashRevex_AugFY1",
                      "CashRevex_SepFY1",
                      "CashRevex_OctFY1",
                      "CashRevex_NovFY1",
                      "CashRevex_DecFY1",
                      "CashRevex_JanFY1",
                      "CashRevex_FebFY1",
                      "CashRevex_MarFY1",
                      "CashRevex_H1FY1",
                      "CashRevex_H2FY1",
                      "CashRevex_H1FY2",
                      "CashRevex_H2FY2",
                      "CashRevex_H1FY3",
                      "CashRevex_H2FY3",
                      "CashRevex_H1FY4",
                      "CashRevex_H2FY4",
                      "CashRevex_H1FY5",
                      "CashRevex_H2FY5",
                    ].map((f) => (
                      <>
                        {f === "CashRevex_Total" ? (
                          <td
                            key={f}
                            className="border border-slate-200 text-right"
                          >
                            {(
                              Number(row["CashRevex_H1FY1"]) +
                              Number(row["CashRevex_H2FY1"]) +
                              Number(row["CashRevex_H1FY2"]) +
                              Number(row["CashRevex_H2FY2"]) +
                              Number(row["CashRevex_H1FY3"]) +
                              Number(row["CashRevex_H2FY3"]) +
                              Number(row["CashRevex_H1FY4"]) +
                              Number(row["CashRevex_H2FY4"]) +
                              Number(row["CashRevex_H1FY5"]) +
                              Number(row["CashRevex_H2FY5"])
                            ).toFixed(2)}
                          </td>
                        ) : (
                          <>
                            {f === "CashRevex_TotalF1" ? (
                              <td
                                key={f}
                                className="border border-slate-200 text-right"
                              >
                                {(
                                  Number(row["CashRevex_H1FY1"]) +
                                  Number(row["CashRevex_H2FY1"])
                                ).toFixed(2)}
                              </td>
                            ) : (
                              <td
                                key={f}
                                className="border border-slate-200 text-right"
                              >
                                {row[f]}
                              </td>
                            )}
                          </>
                        )}
                      </>
                    ))}

                    {/* Carry Forward */}
                    <td className="border border-slate-200">
                      {row.CarryForwardWBS}
                    </td>
                    <td className="border border-slate-200 max-w-55 whitespace-normal leading-4">
                      {row.CarryForwardDescription}
                    </td>
                    <td className="border border-slate-200">
                      {row.CarryForwardFYYear}
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Totals footer */}
              <tfoot>
                <tr className="sticky bottom-0 z-20 bg-amber-100 font-bold text-xs">
                  <td className="sticky left-0 z-40 bg-amber-100 font-semibold text-center">
                    Total
                  </td>
                  {/* General — no totals */}
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  {/* Commitment Capex totals */}
                  <td className="border border-slate-300 text-right">
                    {getGrandTotal("CommCapex")}
                  </td>
                  <td className="border border-slate-300 text-right">
                    {getFY1Total("CommCapex")}
                  </td>
                  {[
                    "CommCapex_AprFY1",
                    "CommCapex_MayFY1",
                    "CommCapex_JunFY1",
                    "CommCapex_JulFY1",
                    "CommCapex_AugFY1",
                    "CommCapex_SepFY1",
                    "CommCapex_OctFY1",
                    "CommCapex_NovFY1",
                    "CommCapex_DecFY1",
                    "CommCapex_JanFY1",
                    "CommCapex_FebFY1",
                    "CommCapex_MarFY1",
                    "CommCapex_H1FY1",
                    "CommCapex_H2FY1",
                    "CommCapex_H1FY2",
                    "CommCapex_H2FY2",
                    "CommCapex_H1FY3",
                    "CommCapex_H2FY3",
                    "CommCapex_H1FY4",
                    "CommCapex_H2FY4",
                    "CommCapex_H1FY5",
                    "CommCapex_H2FY5",
                  ].map((f) => (
                    <td
                      key={`t-${f}`}
                      className="border border-slate-300 text-right"
                    >
                      {getTotal(f)}
                    </td>
                  ))}
                  {/* Commitment Revex totals */}
                  <td className="border border-slate-300 text-right">
                    {getGrandTotal("CommRevex")}
                  </td>

                  <td className="border border-slate-300 text-right">
                    {getFY1Total("CommRevex")}
                  </td>

                  {[
                    "CommRevex_AprFY1",
                    "CommRevex_MayFY1",
                    "CommRevex_JunFY1",
                    "CommRevex_JulFY1",
                    "CommRevex_AugFY1",
                    "CommRevex_SepFY1",
                    "CommRevex_OctFY1",
                    "CommRevex_NovFY1",
                    "CommRevex_DecFY1",
                    "CommRevex_JanFY1",
                    "CommRevex_FebFY1",
                    "CommRevex_MarFY1",
                    "CommRevex_H1FY1",
                    "CommRevex_H2FY1",
                    "CommRevex_H1FY2",
                    "CommRevex_H2FY2",
                    "CommRevex_H1FY3",
                    "CommRevex_H2FY3",
                    "CommRevex_H1FY4",
                    "CommRevex_H2FY4",
                    "CommRevex_H1FY5",
                    "CommRevex_H2FY5",
                  ].map((f) => (
                    <td
                      key={`t-${f}`}
                      className="border border-slate-300 text-right"
                    >
                      {getTotal(f)}
                    </td>
                  ))}
                  {/* Cash Capex totals */}
                  <td className="border border-slate-300 text-right">
                    {getGrandTotal("CashCapex")}
                  </td>

                  <td className="border border-slate-300 text-right">
                    {getFY1Total("CashCapex")}
                  </td>
                  {[
                    "CashCapex_AprFY1",
                    "CashCapex_MayFY1",
                    "CashCapex_JunFY1",
                    "CashCapex_JulFY1",
                    "CashCapex_AugFY1",
                    "CashCapex_SepFY1",
                    "CashCapex_OctFY1",
                    "CashCapex_NovFY1",
                    "CashCapex_DecFY1",
                    "CashCapex_JanFY1",
                    "CashCapex_FebFY1",
                    "CashCapex_MarFY1",
                    "CashCapex_H1FY1",
                    "CashCapex_H2FY1",
                    "CashCapex_H1FY2",
                    "CashCapex_H2FY2",
                    "CashCapex_H1FY3",
                    "CashCapex_H2FY3",
                    "CashCapex_H1FY4",
                    "CashCapex_H2FY4",
                    "CashCapex_H1FY5",
                    "CashCapex_H2FY5",
                  ].map((f) => (
                    <td
                      key={`t-${f}`}
                      className="border border-slate-300 text-right"
                    >
                      {getTotal(f)}
                    </td>
                  ))}
                  {/* Cash Revex totals */}
                  <td className="border border-slate-300 text-right">
                    {getGrandTotal("CashRevex")}
                  </td>

                  <td className="border border-slate-300 text-right">
                    {getFY1Total("CashRevex")}
                  </td>
                  {[
                    "CashRevex_AprFY1",
                    "CashRevex_MayFY1",
                    "CashRevex_JunFY1",
                    "CashRevex_JulFY1",
                    "CashRevex_AugFY1",
                    "CashRevex_SepFY1",
                    "CashRevex_OctFY1",
                    "CashRevex_NovFY1",
                    "CashRevex_DecFY1",
                    "CashRevex_JanFY1",
                    "CashRevex_FebFY1",
                    "CashRevex_MarFY1",
                    "CashRevex_H1FY1",
                    "CashRevex_H2FY1",
                    "CashRevex_H1FY2",
                    "CashRevex_H2FY2",
                    "CashRevex_H1FY3",
                    "CashRevex_H2FY3",
                    "CashRevex_H1FY4",
                    "CashRevex_H2FY4",
                    "CashRevex_H1FY5",
                    "CashRevex_H2FY5",
                  ].map((f) => (
                    <td
                      key={`t-${f}`}
                      className="border border-slate-300 text-right"
                    >
                      {getTotal(f)}
                    </td>
                  ))}
                  {/* Carry Forward — no totals */}
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                </tr>
              </tfoot>
            </table>
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
                    <td>{new Date(item.TDate).toLocaleString()}</td>
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
