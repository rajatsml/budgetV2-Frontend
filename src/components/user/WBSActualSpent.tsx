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

const WBSActualSpent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [approvalHistory, setApprovalHistory] = useState<any[]>([]);
  const data = location.state;
  const [remarks, setRemarks] = useState("");
  const { user } = useUserStore();

  const [rows, setRows] = useState<any[]>([]);
  const [carryForwardRows, setCarryForwardRows] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "Carry Forward / Actual Spent" | "Summary"
  >("Carry Forward / Actual Spent");

  const isPendingWithCurrentUser =
    data?.status === "PENDING WITH BUDGET MANAGER" &&
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

  const handleActualSpentCapexChange = (id: number, value: string) => {
    setCarryForwardRows((prev) =>
      prev.map((row) =>
        (row.id ?? row.Id) === id ? { ...row, actualSpentCapex: value } : row,
      ),
    );
  };
  const handleActualSpentRevexChange = (id: number, value: string) => {
    setCarryForwardRows((prev) =>
      prev.map((row) =>
        (row.id ?? row.Id) === id ? { ...row, actualSpentRevex: value } : row,
      ),
    );
  };

  const handleActualSpentSave = async (row: any) => {
    try {
      await ManageProjectWBS({
        type: 3,
        id: row.id ?? row.Id,
        projectId: data?.projectID,
        deptId: data?.deptID?.toString(),
        wbsId: row.wbsId ?? row.WBSId,
        wbsDescription: row.wbsDescription ?? row.WBSDescription,
        commitmentCapex: row.commitmentCapex ?? row.CommitmentCapex,
        commitmentRevex: row.commitmentRevex ?? row.CommitmentRevex,
        cashFlowCapex: row.cashFlowCapex ?? row.CashFlowCapex,
        cashFlowRevex: row.cashFlowRevex ?? row.CashFlowRevex,
        fyYear: row.fyYear ?? row.FyYear,

        // new field
        actualSpentCapex: row.actualSpentCapex ?? row.ActualSpentCapex,
        actualSpentRevex: row.actualSpentRevex ?? row.ActualSpentRevex,
      });

      alert("Actual Spent updated successfully.");

      await fetchCarryForwardRows();
    } catch (error) {
      console.error("Failed to update Actual Spent", error);
    }
  };

  const fetchCarryForwardRows = async () => {
    try {
      const response = await ManageProjectWBS({
        type: 1,
        projectId: data?.projectID,
        deptId: data?.deptID?.toString(),
      });

      const items = Array.isArray(response) ? response : response?.items || [];

      setCarryForwardRows(
        items.map((item: any) => ({
          ...item,
          // actualSpent: item.actualSpent ?? item.ActualSpent ?? "",
          actualSpentCapex:
            item.actualSpentCapex ?? item.ActualSpentCapex ?? "",
          actualSpentRevex:
            item.actualSpentRevex ?? item.ActualSpentRevex ?? "",
        })),
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
      (sum, row) =>
        sum + Number(row.commitmentCapex ?? row.CommitmentCapex ?? 0),
      0,
    ),
    carryForwardCashFlow: carryForwardRows.reduce(
      (sum, row) => sum + Number(row.cashFlowCapex ?? row.CashFlowCapex ?? 0),
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
        actionPerformed: "BUDGET_MANAGER_APPROVED",
        remarks: remarks,
      });
      alert(response.message);
      navigate("/pd-budget-manager-projects");
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
      navigate("/pd-budget-manager-projects");
    } catch (error) {
      console.error("Review Back failed", error);
    }
  };

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

  const tabs: Array<"Summary" | "Carry Forward / Actual Spent"> = [
    "Summary",
    "Carry Forward / Actual Spent",
  ];

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
                        Commitment <br /> (Capex + Revex)
                      </th>
                      <th className="border border-red-400 text-center">
                        Commitment FY1 <br /> (Capex + Revex)
                      </th>
                      <th className="border border-red-400 text-center">
                        Cash Flow <br /> (Capex + Revex)
                      </th>
                      <th className="border border-red-400 text-center">
                        Cash Flow FY1 <br /> (Capex + Revex)
                      </th>
                      <th className="border border-red-400 text-center">
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
                      </th>
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
                          <td className="border border-slate-200 text-right">
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
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Carry Forward / Actual Spent" && (
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
                      <th className="border border-red-400 text-center">
                        Action
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
                          <td className="border border-slate-200">
                            <div className="flex items-center gap-2 ">
                              <input
                                type="number"
                                step="0.01"
                                value={row.actualSpentCapex ?? ""}
                                className="input input-xs w-full"
                                onChange={(e) =>
                                  handleActualSpentCapexChange(
                                    row.id ?? row.Id,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td className="border border-slate-200">
                            <div className="flex items-center gap-2 ">
                              <input
                                type="number"
                                step="0.01"
                                value={row.actualSpentRevex ?? ""}
                                className="input input-xs w-full"
                                onChange={(e) =>
                                  handleActualSpentRevexChange(
                                    row.id ?? row.Id,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-xs bg-red-500 text-white hover:bg-red-600"
                              onClick={() => handleActualSpentSave(row)}
                            >
                              Save
                            </button>
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
                                    row.commitmentRevex ??
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
                            .reduce(
                              (sum, row) =>
                                sum +
                                (Number(
                                  row.actualSpentCapex ?? row.ActualSpentCapex,
                                ) || 0),
                              0,
                            )
                            .toFixed(2)}
                        </td>

                        <td className="border border-slate-300 text-right">
                          {carryForwardRows
                            .reduce(
                              (sum, row) =>
                                sum +
                                (Number(
                                  row.actualSpentRevex ?? row.ActualSpentRevex,
                                ) || 0),
                              0,
                            )
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

      {/* ── Approver Actions ───────────────────────────── */}
      {isPendingWithCurrentUser && (
        <div className="mt-4 border border-slate-200 rounded p-4 bg-white mx-auto">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Remarks
          </label>
          <textarea
            rows={1}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter your remarks..."
            className="textarea text-xs textarea-bordered w-full rounded"
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

export default WBSActualSpent;
