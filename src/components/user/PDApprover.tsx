import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PDHeader from "../pd/PDHeader";
import {
  GetPDMaster,
  UpdatePDStatus,
  GetPDApprovalHistory,
  ManageProjectWBS,
} from "../../service/projectmaster";
import useUserStore from "../../store/userStore";

const PDApprover = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [approvalHistory, setApprovalHistory] = useState<any[]>([]);
  const data = location.state;
  const [remarks, setRemarks] = useState("");
  const { user } = useUserStore();

  const [rows, setRows] = useState<any[]>([]);
  const [carryForwardRows, setCarryForwardRows] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "Summary" | "Commitments" | "Cashflow" | "Carry Forward"
  >("Summary");

  const isPendingWithCurrentUser =
    data?.status === "PENDING WITH APPROVER" &&
    data?.pendingWithUser?.toString() === user?.userId?.toString();

  // ─────────────────────────────────────────────────────────
  // API calls
  // ─────────────────────────────────────────────────────────

  const fetchPDDetails = async () => {
    try {
      const response = await GetPDMaster(data?.projectID, data?.deptID);
      setRows(response || []);
    } catch (error) {
      console.error("Failed to fetch PD details", error);
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

  useEffect(() => {
    fetchPDDetails();
    fetchApprovalHistory();
    fetchCarryForwardRows();
  }, []);

  // ─────────────────────────────────────────────────────────
  // Summary — computed from fetched rows using new model fields
  // ─────────────────────────────────────────────────────────

  const getTotal = (field: string) =>
    rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);

  const summary = {
    commCapex:
      getTotal("CommCapex_H1FY1") +
      getTotal("CommCapex_H2FY1") +
      getTotal("CommCapex_H1FY2") +
      getTotal("CommCapex_H2FY2") +
      getTotal("CommCapex_H1FY3") +
      getTotal("CommCapex_H2FY3") +
      getTotal("CommCapex_H1FY4") +
      getTotal("CommCapex_H2FY4") +
      getTotal("CommCapex_H1FY5") +
      getTotal("CommCapex_H2FY5"),
    commRevex:
      getTotal("CommRevex_H1FY1") +
      getTotal("CommRevex_H2FY1") +
      getTotal("CommRevex_H1FY2") +
      getTotal("CommRevex_H2FY2") +
      getTotal("CommRevex_H1FY3") +
      getTotal("CommRevex_H2FY3") +
      getTotal("CommRevex_H1FY4") +
      getTotal("CommRevex_H2FY4") +
      getTotal("CommRevex_H1FY5") +
      getTotal("CommRevex_H2FY5"),
    cashCapex:
      getTotal("CashCapex_H1FY1") +
      getTotal("CashCapex_H2FY1") +
      getTotal("CashCapex_H1FY2") +
      getTotal("CashCapex_H2FY2") +
      getTotal("CashCapex_H1FY3") +
      getTotal("CashCapex_H2FY3") +
      getTotal("CashCapex_H1FY4") +
      getTotal("CashCapex_H2FY4") +
      getTotal("CashCapex_H1FY5") +
      getTotal("CashCapex_H2FY5"),
    cashRevex:
      getTotal("CashRevex_H1FY1") +
      getTotal("CashRevex_H2FY1") +
      getTotal("CashRevex_H1FY2") +
      getTotal("CashRevex_H2FY2") +
      getTotal("CashRevex_H1FY3") +
      getTotal("CashRevex_H2FY3") +
      getTotal("CashRevex_H1FY4") +
      getTotal("CashRevex_H2FY4") +
      getTotal("CashRevex_H1FY5") +
      getTotal("CashRevex_H2FY5"),
  };

  const summaryTotals = {
    commitmentTotal: summary.commCapex + summary.commRevex,
    cashFlowTotal: summary.cashCapex + summary.cashRevex,
    commitmentFY1:
      getTotal("CommCapex_H1FY1") +
      getTotal("CommCapex_H2FY1") +
      getTotal("CommRevex_H1FY1") +
      getTotal("CommRevex_H2FY1"),
    cashFlowFY1:
      getTotal("CashCapex_H1FY1") +
      getTotal("CashCapex_H2FY1") +
      getTotal("CashRevex_H1FY1") +
      getTotal("CashRevex_H2FY1"),
    carryForwardCommitment: carryForwardRows.reduce(
      (sum, row) => sum + Number(row.commitmentAmt ?? row.CommitmentAmt ?? 0),
      0,
    ),
    carryForwardCashFlow: carryForwardRows.reduce(
      (sum, row) => sum + Number(row.cashFlowAmt ?? row.CashFlowAmt ?? 0),
      0,
    ),
  };

  // ─────────────────────────────────────────────────────────
  // Approval actions
  // ─────────────────────────────────────────────────────────

  const handleApprove = async () => {
    if (!isPendingWithCurrentUser) return;
    try {
      const response = await UpdatePDStatus({
        projectId: data?.projectID,
        deptId: data?.deptID?.toString(),
        userId: user?.userId!,
        actionPerformed: "APPROVED",
        remarks: remarks,
      });
      alert(response.message);
      navigate("/myprojects");
    } catch (error) {
      console.error("Approval failed", error);
    }
  };

  const handleReviewBack = async () => {
    if (!isPendingWithCurrentUser) return;
    try {
      const response = await UpdatePDStatus({
        projectId: data?.projectID,
        deptId: data?.deptID?.toString(),
        userId: user?.userId!,
        actionPerformed: "REVIEW_BACK",
        remarks: remarks,
      });
      alert(response.message);
      navigate("/myprojects");
    } catch (error) {
      console.error("Review Back failed", error);
    }
  };

  // ─────────────────────────────────────────────────────────
  // Column definitions — reused for header + body + footer
  // ─────────────────────────────────────────────────────────

  // Added missing _H1FY1 and _H2FY1 fields to match the 24 sub-columns
  const commCapexFields = [
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
    "CommCapex_H1FY1", // Aligns with "H1 FY1"
    "CommCapex_H2FY1", // Aligns with "H2 FY1"
    "CommCapex_H1FY2",
    "CommCapex_H2FY2",
    "CommCapex_H1FY3",
    "CommCapex_H2FY3",
    "CommCapex_H1FY4",
    "CommCapex_H2FY4",
    "CommCapex_H1FY5",
    "CommCapex_H2FY5",
  ];

  const commRevexFields = [
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
    "CommRevex_H1FY1", // Aligns with "H1 FY1"
    "CommRevex_H2FY1", // Aligns with "H2 FY1"
    "CommRevex_H1FY2",
    "CommRevex_H2FY2",
    "CommRevex_H1FY3",
    "CommRevex_H2FY3",
    "CommRevex_H1FY4",
    "CommRevex_H2FY4",
    "CommRevex_H1FY5",
    "CommRevex_H2FY5",
  ];

  const cashCapexFields = [
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
    "CashCapex_H1FY1", // Aligns with "H1 FY1"
    "CashCapex_H2FY1", // Aligns with "H2 FY1"
    "CashCapex_H1FY2",
    "CashCapex_H2FY2",
    "CashCapex_H1FY3",
    "CashCapex_H2FY3",
    "CashCapex_H1FY4",
    "CashCapex_H2FY4",
    "CashCapex_H1FY5",
    "CashCapex_H2FY5",
  ];

  const cashRevexFields = [
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
    "CashRevex_H1FY1", // Aligns with "H1 FY1"
    "CashRevex_H2FY1", // Aligns with "H2 FY1"
    "CashRevex_H1FY2",
    "CashRevex_H2FY2",
    "CashRevex_H1FY3",
    "CashRevex_H2FY3",
    "CashRevex_H1FY4",
    "CashRevex_H2FY4",
    "CashRevex_H1FY5",
    "CashRevex_H2FY5",
  ];

  const subCols = [
    // "Total Value",
    // "Total FY1",
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
  ];

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────

  const getGrandTotal = (row: any, prefix: string) => {
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
    );
  };

  const getFY1Total = (row: any, prefix: string) => {
    return (
      Number(row[`${prefix}_H1FY1`] || 0) + Number(row[`${prefix}_H2FY1`] || 0)
    );
  };

  const getRowSummary = (row: any) => ({
    commitmentTotal:
      getGrandTotal(row, "CommCapex") + getGrandTotal(row, "CommRevex"),
    commitmentFY1:
      getFY1Total(row, "CommCapex") + getFY1Total(row, "CommRevex"),
    cashFlowTotal:
      getGrandTotal(row, "CashCapex") + getGrandTotal(row, "CashRevex"),
    cashFlowFY1: getFY1Total(row, "CashCapex") + getFY1Total(row, "CashRevex"),
    commitmentH1FY1:
      Number(row.CommCapex_H1FY1 || 0) + Number(row.CommRevex_H1FY1 || 0),
    commitmentH2FY1:
      Number(row.CommCapex_H2FY1 || 0) + Number(row.CommRevex_H2FY1 || 0),
    cashH1FY1:
      Number(row.CashCapex_H1FY1 || 0) + Number(row.CashRevex_H1FY1 || 0),
    cashH2FY1:
      Number(row.CashCapex_H2FY1 || 0) + Number(row.CashRevex_H2FY1 || 0),
  });

  const tabs: Array<"Summary" | "Commitments" | "Cashflow" | "Carry Forward"> =
    ["Summary", "Commitments", "Cashflow", "Carry Forward"];

  return (
    <div className="p-4 space-y-4">
      {/* ── Header + Summary ───────────────────────────── */}
      <div className="flex gap-x-2">
        <PDHeader
          projectID={data?.projectID}
          projectName={data?.projectName}
          deptName={data?.deptName}
          deptID={data?.deptID}
          category={data?.projectCategoryName}
          pendingWith={data?.pendingWithUser}
          status={data?.status}
          fyYear={data?.FyYear}
        />

        {/* Summary panel — aligned with new model */}
        <div className="border border-slate-200 rounded p-4 bg-gray-200 shadow-sm w-1/2">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Summary</h3>
          <div className="overflow-x-auto rounded border border-base-300 bg-white">
            <table className="table w-full table-xs text-[11px]">
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
                  <th className="border-r border-base-300 font-semibold text-center">
                    Commitment Total
                  </th>
                  <th className="border-r border-base-300 font-semibold text-center">
                    Cash Flow Total
                  </th>
                  <th className="border-r border-base-300 font-semibold text-center">
                    Commitment FY1 Total
                  </th>
                  <th className="font-semibold text-center">
                    Cash Flow FY1 Total
                  </th>
                  <th className="font-semibold text-center">
                    Carry Forward Commitment
                  </th>
                  <th className="font-semibold text-center">
                    Carry Forward Cashflow
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover text-center font-bold text-sm text-slate-800 bg-slate-50">
                  <td className="border-r border-base-300 py-3">
                    {summary.commCapex.toFixed(2)} Cr
                  </td>
                  <td className="border-r border-base-300 py-3">
                    {summary.commRevex.toFixed(2)} Cr
                  </td>
                  <td className="border-r border-base-300 py-3">
                    {summary.cashCapex.toFixed(2)} Cr
                  </td>
                  <td className="border-r border-base-300 py-3">
                    {summary.cashRevex.toFixed(2)} Cr
                  </td>
                  <td className="border-r border-base-300 py-3">
                    {summaryTotals.commitmentTotal.toFixed(2)} Cr
                  </td>
                  <td className="border-r border-base-300 py-3">
                    {summaryTotals.cashFlowTotal.toFixed(2)} Cr
                  </td>
                  <td className="border-r border-base-300 py-3">
                    {summaryTotals.commitmentFY1.toFixed(2)} Cr
                  </td>
                  <td className="py-3">
                    {summaryTotals.cashFlowFY1.toFixed(2)} Cr
                  </td>
                  <td className="py-3">
                    {summaryTotals.carryForwardCommitment.toFixed(2)} Cr
                  </td>
                  <td className="py-3">
                    {summaryTotals.carryForwardCashFlow.toFixed(2)} Cr
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Saved Records Tabs ────────────────────────── */}
      {(rows.length > 0 || carryForwardRows.length > 0) && (
        <div className="mt-6">
          <div
            role="tablist"
            aria-label="Project data tabs"
            className="tabs gap-2 mb-4 text-xs"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={`tab text-xs font-medium shadow rounded ${
                  activeTab === tab
                    ? "tab-active bg-red-500 text-white border-red-500"
                    : "bg-white text-slate-700 border border-slate-300"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}

            <p className="text-sm text-white self-center bg-red-500 p-2 rounded font-semibold">
              NOTE - Entered values are without GST and are in Cr.
            </p>
          </div>

          {activeTab === "Summary" && (
            <div className="border border-slate-300 bg-white overflow-hidden rounded text-xs">
              <div className="max-h-175 overflow-auto">
                <table className="table table-zebra table-xs w-full text-[11px]">
                  <thead className="sticky top-0 z-30 bg-red-500 text-white font-light">
                    <tr>
                      <th className="border border-red-400 text-center">
                        Description
                      </th>
                      <th className="border border-red-400 text-center">
                        Basis
                      </th>
                      <th className="border border-red-400 text-center">
                        Project Commitment <br /> (Capex + Revex)
                      </th>
                      <th className="border border-red-400 text-center">
                        Project Commitment FY1 <br /> (Capex + Revex)
                      </th>
                      <th className="border border-red-400 text-center">
                        Project Cash Flow <br /> (Capex + Revex)
                      </th>
                      <th className="border border-red-400 text-center">
                        Project Cash Flow FY1 <br /> (Capex + Revex)
                      </th>
                      {/* <th className="border border-red-400 text-center">
                        Commitment <br /> H1 FY1
                      </th>
                      <th className="border border-red-400 text-center">
                        Commitment <br /> H2 FY1
                      </th>
                      <th className="border border-red-400 text-center">
                        Cash Flow <br /> H1 FY1
                      </th>
                      <th className="border border-red-400 text-center">
                        Cash Flow <br /> H2 FY1
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const values = getRowSummary(row);

                      return (
                        <tr key={row.PDDetailId} className="text-[11px]">
                          <td className="border border-slate-200 max-w-55 whitespace-normal leading-4">
                            {row.Description}
                          </td>
                          <td className="border border-slate-200 max-w-55 whitespace-normal leading-4">
                            {row.Basis}
                          </td>
                          <td className="border border-slate-200 text-right">
                            {values.commitmentTotal.toFixed(2)}
                          </td>
                          <td className="border border-slate-200 text-right">
                            {values.commitmentFY1.toFixed(2)}
                          </td>
                          <td className="border border-slate-200 text-right">
                            {values.cashFlowTotal.toFixed(2)}
                          </td>
                          <td className="border border-slate-200 text-right">
                            {values.cashFlowFY1.toFixed(2)}
                          </td>
                          {/* <td className="border border-slate-200 text-right">
                            {values.commitmentH1FY1.toFixed(2)}
                          </td>
                          <td className="border border-slate-200 text-right">
                            {values.commitmentH2FY1.toFixed(2)}
                          </td>
                          <td className="border border-slate-200 text-right">
                            {values.cashH1FY1.toFixed(2)}
                          </td>
                          <td className="border border-slate-200 text-right">
                            {values.cashH2FY1.toFixed(2)}
                          </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Commitments" && (
            <div className="border border-slate-300 bg-white overflow-hidden rounded text-xs">
              <div className="max-h-175 overflow-auto">
                <table className="table table-zebra table-xs w-full text-[11px]">
                  <thead className="sticky top-0 z-30">
                    <tr className="bg-red-500 text-white text-[11px]">
                      <th colSpan={2} className="text-center border">
                        General
                      </th>
                      <th colSpan={2} className="text-center border">
                        Total
                      </th>
                      <th colSpan={22} className="text-center border">
                        Commitment Capex
                      </th>
                      <th colSpan={24} className="text-center border">
                        Commitment Revex
                      </th>
                    </tr>
                    <tr className="bg-slate-100 text-slate-800 text-[11px]">
                      <th className="border border-slate-300 font-medium w-[320px] min-w-[320px]">
                        Description
                      </th>
                      <th className="border border-slate-300 font-medium w-65 min-w-65">
                        Basis
                      </th>
                      <th className="border border-slate-300 font-medium">
                        Total Commitment Capex
                      </th>
                      <th className="border border-slate-300 font-medium">
                        Total Commitment Capex FY1
                      </th>
                      {subCols.map((col) => (
                        <th
                          key={`comm-${col}`}
                          className="border border-slate-300 font-medium whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                      <th className="border border-slate-300 font-medium">
                        Total Commitment <br /> Revex
                      </th>
                      <th className="border border-slate-300 font-medium">
                        Total Commitment <br /> Revex FY1
                      </th>
                      {subCols.map((col) => (
                        <th
                          key={`comm-r-${col}`}
                          className="border border-slate-300 font-medium whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.PDDetailId} className="text-[11px]">
                        <td className="border border-slate-200 w-[320px] min-w-[320px] whitespace-normal leading-4">
                          {row.Description}
                        </td>
                        <td className="border border-slate-200 w-55 min-w-55 whitespace-normal leading-4">
                          {row.Basis}
                        </td>
                        <td className="border border-slate-200 text-right">
                          {getGrandTotal(row, "CommCapex").toFixed(2)}
                        </td>
                        <td className="border border-slate-200 text-right">
                          {getFY1Total(row, "CommCapex").toFixed(2)}
                        </td>
                        {commCapexFields.map((f) => (
                          <td
                            key={f}
                            className="border border-slate-200 text-right"
                          >
                            {row[f] ?? 0}
                          </td>
                        ))}
                        <td className="border border-slate-200 text-right">
                          {getGrandTotal(row, "CommRevex").toFixed(2)}
                        </td>
                        <td className="border border-slate-200 text-right">
                          {getFY1Total(row, "CommRevex").toFixed(2)}
                        </td>
                        {commRevexFields.map((f) => (
                          <td
                            key={f}
                            className="border border-slate-200 text-right"
                          >
                            {row[f] ?? 0}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-200 font-semibold text-[11px]">
                    <tr>
                      <td
                        colSpan={2}
                        className="border border-slate-300 text-right"
                      >
                        Total
                      </td>
                      <td className="border border-slate-300 text-right">
                        {summary.commCapex.toFixed(2)}
                      </td>
                      <td className="border border-slate-300 text-right">
                        {(
                          getTotal("CommCapex_H1FY1") +
                          getTotal("CommCapex_H2FY1")
                        ).toFixed(2)}
                      </td>
                      {commCapexFields.map((field) => (
                        <td
                          key={field}
                          className="border border-slate-300 text-right"
                        >
                          {getTotal(field).toFixed(2)}
                        </td>
                      ))}
                      <td className="border border-slate-300 text-right">
                        {summary.commRevex.toFixed(2)}
                      </td>
                      <td className="border border-slate-300 text-right">
                        {(
                          getTotal("CommRevex_H1FY1") +
                          getTotal("CommRevex_H2FY1")
                        ).toFixed(2)}
                      </td>
                      {commRevexFields.map((field) => (
                        <td
                          key={field}
                          className="border border-slate-300 text-right"
                        >
                          {getTotal(field).toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Cashflow" && (
            <div className="border border-slate-300 bg-white overflow-hidden rounded text-xs">
              <div className="max-h-175 overflow-auto">
                <table className="table table-zebra table-xs w-full text-[11px]">
                  <thead className="sticky top-0 z-30">
                    <tr className="bg-red-500 text-white text-[11px]">
                      <th colSpan={2} className="text-center border">
                        General
                      </th>
                      <th colSpan={2} className="text-center border">
                        Total
                      </th>
                      <th colSpan={22} className="text-center border">
                        Cash Flow Capex
                      </th>
                      <th colSpan={24} className="text-center border">
                        Cash Flow Revex
                      </th>
                    </tr>
                    <tr className="bg-slate-100 text-slate-800 text-[11px]">
                      <th className="border border-slate-300 font-medium w-[320px] min-w-[320px]">
                        Description
                      </th>
                      <th className="border border-slate-300 font-medium w-65 min-w-65">
                        Basis
                      </th>
                      <th className="border border-slate-300 font-medium">
                        Total Cash Flow Capex
                      </th>
                      <th className="border border-slate-300 font-medium">
                        Total Cash Flow Capex FY1
                      </th>
                      {subCols.map((col) => (
                        <th
                          key={`cash-${col}`}
                          className="border border-slate-300 font-medium whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}

                      <th className="border border-slate-300 font-medium">
                        Total Cash Flow <br /> Revex
                      </th>
                      <th className="border border-slate-300 font-medium">
                        Total Cash Flow <br /> Revex FY1
                      </th>
                      {subCols.map((col) => (
                        <th
                          key={`cash-r-${col}`}
                          className="border border-slate-300 font-medium whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.PDDetailId} className="text-[11px]">
                        <td className="border border-slate-200 w-[320px] min-w-[320px] whitespace-normal leading-4">
                          {row.Description}
                        </td>
                        <td className="border border-slate-200 w-55 min-w-55 whitespace-normal leading-4">
                          {row.Basis}
                        </td>
                        <td className="border border-slate-200 text-right">
                          {getGrandTotal(row, "CashCapex").toFixed(2)}
                        </td>
                        <td className="border border-slate-200 text-right">
                          {getFY1Total(row, "CashCapex").toFixed(2)}
                        </td>
                        {cashCapexFields.map((f) => (
                          <td
                            key={f}
                            className="border border-slate-200 text-right"
                          >
                            {row[f] ?? 0}
                          </td>
                        ))}
                        <td className="border border-slate-200 text-right">
                          {getGrandTotal(row, "CashRevex").toFixed(2)}
                        </td>
                        <td className="border border-slate-200 text-right">
                          {getFY1Total(row, "CashRevex").toFixed(2)}
                        </td>
                        {cashRevexFields.map((f) => (
                          <td
                            key={f}
                            className="border border-slate-200 text-right"
                          >
                            {row[f] ?? 0}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-200 font-semibold text-[11px]">
                    <tr>
                      <td
                        colSpan={2}
                        className="border border-slate-300 text-right"
                      >
                        Total
                      </td>
                      <td className="border border-slate-300 text-right">
                        {summary.cashCapex.toFixed(2)}
                      </td>
                      <td className="border border-slate-300 text-right">
                        {(
                          getTotal("CashCapex_H1FY1") +
                          getTotal("CashCapex_H2FY1")
                        ).toFixed(2)}
                      </td>
                      {cashCapexFields.map((field) => (
                        <td
                          key={field}
                          className="border border-slate-300 text-right"
                        >
                          {getTotal(field).toFixed(2)}
                        </td>
                      ))}
                      <td className="border border-slate-300 text-right">
                        {summary.cashRevex.toFixed(2)}
                      </td>
                      <td className="border border-slate-300 text-right">
                        {(
                          getTotal("CashRevex_H1FY1") +
                          getTotal("CashRevex_H2FY1")
                        ).toFixed(2)}
                      </td>
                      {cashRevexFields.map((field) => (
                        <td
                          key={field}
                          className="border border-slate-300 text-right"
                        >
                          {getTotal(field).toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Carry Forward" && (
            <div className="border border-slate-300 bg-white overflow-hidden rounded text-xs">
              <div className="max-h-175 overflow-auto">
                <table className="table table-zebra table-xs w-full text-[11px]">
                  <thead className="sticky top-0 z-30 bg-red-500 text-white">
                    <tr>
                      <th className="border border-red-400 text-center">
                        WBS Element
                      </th>
                      <th className="border border-red-400 text-center">
                        WBS Description
                      </th>
                      <th className="border border-red-400 text-center">
                        Financial Year
                      </th>
                      <th className="border border-red-400 text-center">
                        Commitment Capex (Cr.)
                      </th>
                      <th className="border border-red-400 text-center">
                        Commitment Revex (Cr.)
                      </th>
                      <th className="border border-red-400 text-center">
                        Cashflow Capex (Cr.)
                      </th>
                      <th className="border border-red-400 text-center">
                        Cashflow Revex (Cr.)
                      </th>
                      <th className="border border-red-400 text-center">
                        Actual Capex (Cr.)
                      </th>
                      <th className="border border-red-400 text-center">
                        Actual Revex (Cr.)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {carryForwardRows.length > 0 ? (
                      carryForwardRows.map((row) => (
                        <tr key={row.id ?? row.Id} className="text-[11px]">
                          <td className="border border-slate-200">
                            {row.wbsId ?? row.WBSId ?? "-"}
                          </td>
                          <td className="border border-slate-200 max-w-80 whitespace-normal leading-4">
                            {row.wbsDescription ?? row.WBSDescription ?? "-"}
                          </td>
                          <td className="border border-slate-200">
                            {row.fyYear ?? row.FyYear ?? "-"}
                          </td>
                          <td className="border border-slate-300 text-right">
                            {isNaN(
                              Number(
                                row.commitmentCapex ?? row.CommitmentCapex,
                              ),
                            )
                              ? "0.0"
                              : Number(
                                  row.commitmentCapex ?? row.CommitmentCapex,
                                ).toFixed(2)}
                          </td>
                          <td className="border border-slate-300 text-right">
                            {isNaN(
                              Number(
                                row.commitmentRevex ?? row.CommitmentRevex,
                              ),
                            )
                              ? "0.0"
                              : Number(
                                  row.commitmentRevex ?? row.CommitmentRevex,
                                ).toFixed(2)}
                          </td>
                          <td className="border border-slate-300 text-right">
                            {isNaN(
                              Number(row.cashFlowCapex ?? row.CashFlowCapex),
                            )
                              ? "0.0"
                              : Number(
                                  row.cashFlowCapex ?? row.CashFlowCapex,
                                ).toFixed(2)}
                          </td>
                          <td className="border border-slate-300 text-right">
                            {isNaN(
                              Number(row.cashFlowRevex ?? row.CashFlowRevex),
                            )
                              ? "0.0"
                              : Number(
                                  row.cashFlowRevex ?? row.CashFlowRevex,
                                ).toFixed(2)}
                          </td>
                          <td className="border border-slate-300 text-right">
                            {isNaN(
                              Number(
                                row.actualSpentCapex ?? row.ActualSpentCapex,
                              ),
                            )
                              ? "0.0"
                              : Number(
                                  row.actualSpentCapex ?? row.ActualSpentCapex,
                                ).toFixed(2)}
                          </td>
                          <td className="border border-slate-300 text-right">
                            {isNaN(
                              Number(
                                row.actualSpentRevex ?? row.ActualSpentRevex,
                              ),
                            )
                              ? "0.0"
                              : Number(
                                  row.actualSpentRevex ?? row.ActualSpentRevex,
                                ).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-6 text-slate-500"
                        >
                          No carry forward data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {carryForwardRows.length > 0 && (
                    <tfoot className="bg-slate-200 font-semibold text-[11px]">
                      <tr>
                        <td
                          colSpan={3}
                          className="border border-slate-300 text-right"
                        >
                          Total
                        </td>
                        <td className="border border-slate-300 text-right">
                          {carryForwardRows
                            .reduce(
                              (sum, row) =>
                                sum +
                                Number(
                                  row.commitmentCapex ??
                                    row.CommitmentCapex ??
                                    0,
                                ),
                              0,
                            )
                            .toFixed(2)}
                        </td>
                        <td className="border border-slate-300 text-right">
                          {carryForwardRows
                            .reduce(
                              (sum, row) =>
                                sum +
                                Number(
                                  row.commitmentRevex ??
                                    row.CommitmentRevex ??
                                    0,
                                ),
                              0,
                            )
                            .toFixed(2)}
                        </td>
                        <td className="border border-slate-300 text-right">
                          {carryForwardRows
                            .reduce(
                              (sum, row) =>
                                sum +
                                Number(
                                  row.cashFlowCapex ?? row.CashFlowCapex ?? 0,
                                ),
                              0,
                            )
                            .toFixed(2)}
                        </td>
                        <td className="border border-slate-300 text-right">
                          {carryForwardRows
                            .reduce(
                              (sum, row) =>
                                sum +
                                Number(
                                  row.cashFlowRevex ?? row.CashFlowRevex ?? 0,
                                ),
                              0,
                            )
                            .toFixed(2)}
                        </td>
                        <td className="border border-slate-300 text-right">
                          {carryForwardRows
                            .reduce((sum, row) => {
                              const value = Number(
                                row.actualSpentCapex ??
                                  row.ActualSpentCapex ??
                                  0,
                              );
                              return sum + (Number.isNaN(value) ? 0 : value);
                            }, 0)
                            .toFixed(2)}
                        </td>

                        <td className="border border-slate-300 text-right">
                          {carryForwardRows
                            .reduce((sum, row) => {
                              const value = Number(
                                row.actualSpentRevex ??
                                  row.ActualSpentRevex ??
                                  0,
                              );
                              return sum + (Number.isNaN(value) ? 0 : value);
                            }, 0)
                            .toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          )}
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

      {/* ── Approver Actions ───────────────────────────── */}
      {isPendingWithCurrentUser && (
        <div className="mt-4 border border-slate-200 rounded p-4 bg-white max-w-2xl mx-auto">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Remarks
          </label>
          <textarea
            rows={1}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter your remarks..."
            className="textarea text-xs textarea-bordered w-full rounded-xl"
          />
          <div className="flex gap-3 mt-4">
            <button
              className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-red-600"
              onClick={handleApprove}
            >
              Approve
            </button>
            <button className="btn btn-sm" onClick={handleReviewBack}>
              Review Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDApprover;
