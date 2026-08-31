import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PDHeader from "../pd/PDHeader";
import {
  GetPDMaster,
  UpdatePDStatus,
  GetPDApprovalHistory,
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

  useEffect(() => {
    fetchPDDetails();
    fetchApprovalHistory();
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
  ];

  const subCols = [
    "Total Value",
    "Total FY1",
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

  const getSectionGrandTotal = (prefix: string) =>
    rows.reduce((sum, row) => sum + getGrandTotal(row, prefix), 0);

  const getSectionFY1Total = (prefix: string) =>
    rows.reduce((sum, row) => sum + getFY1Total(row, prefix), 0);

  return (
    <div className="p-4 space-y-4">
      {/* ── Header + Summary ───────────────────────────── */}
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

        {/* Summary panel — aligned with new model */}
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
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Saved Records Table ────────────────────────── */}
      {rows.length > 0 && (
        <div className="mt-6 border border-slate-300 font-medium text-xs bg-white overflow-hidden">
          <div className="max-h-175 overflow-auto">
            <table className="table table-zebra table-xs w-full">
              <thead className="sticky top-0 z-30">
                {/* Group header row */}
                <tr className="bg-red-500 text-white text-xs">
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

                {/* Sub-column header row */}
                <tr className="bg-slate-100 text-slate-800">
                  {/* General */}
                  <th className="border border-slate-300 text-xs font-medium">
                    Description
                  </th>
                  <th className="border border-slate-300 text-xs font-medium">
                    Basis
                  </th>

                  {/* Commitment Capex sub-cols */}
                  {subCols.map((col) => (
                    <th
                      key={`cc-${col}`}
                      className="border border-slate-300 text-xs font-medium whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}

                  {/* Commitment Revex sub-cols */}
                  {subCols.map((col) => (
                    <th
                      key={`cr-${col}`}
                      className="border border-slate-300 text-xs font-medium whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}

                  {/* Cash Capex sub-cols */}
                  {subCols.map((col) => (
                    <th
                      key={`cashc-${col}`}
                      className="border border-slate-300 text-xs font-medium whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}

                  {/* Cash Revex sub-cols */}
                  {subCols.map((col) => (
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
                    {/* General */}
                    <td className="border border-slate-200 max-w-55 whitespace-normal leading-4">
                      {row.Description}
                    </td>
                    <td className="border border-slate-200 max-w-55 whitespace-normal leading-4">
                      {row.Basis}
                    </td>

                    {/* Commitment Capex */}
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
                        {row[f]}
                      </td>
                    ))}

                    {/* Commitment Revex */}
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
                        {row[f]}
                      </td>
                    ))}

                    {/* Cash Capex */}
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
                        {row[f]}
                      </td>
                    ))}

                    {/* Cash Revex */}
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
                        {row[f]}
                      </td>
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
                  {/* General — no totals */}
                  <td
                    colSpan={2}
                    className="bg-amber-100 font-semibold text-center border border-slate-300"
                  >
                    Total
                  </td>

                  {/* Commitment Capex totals */}
                  <td className="border border-slate-300 text-right">
                    {getSectionGrandTotal("CommCapex").toFixed(2)}
                  </td>

                  <td className="border border-slate-300 text-right">
                    {getSectionFY1Total("CommCapex").toFixed(2)}
                  </td>

                  {commCapexFields.map((f) => (
                    <td
                      key={`t-${f}`}
                      className="border border-slate-300 text-right"
                    >
                      {getTotal(f)}
                    </td>
                  ))}

                  {/* Commitment Revex totals */}
                  <td className="border border-slate-300 text-right">
                    {getSectionGrandTotal("CommRevex").toFixed(2)}
                  </td>

                  <td className="border border-slate-300 text-right">
                    {getSectionFY1Total("CommRevex").toFixed(2)}
                  </td>
                  {commRevexFields.map((f) => (
                    <td
                      key={`t-${f}`}
                      className="border border-slate-300 text-right"
                    >
                      {getTotal(f)}
                    </td>
                  ))}

                  {/* Cash Capex totals */}
                  <td className="border border-slate-300 text-right">
                    {getSectionGrandTotal("CashCapex").toFixed(2)}
                  </td>

                  <td className="border border-slate-300 text-right">
                    {getSectionFY1Total("CashCapex").toFixed(2)}
                  </td>
                  {cashCapexFields.map((f) => (
                    <td
                      key={`t-${f}`}
                      className="border border-slate-300 text-right"
                    >
                      {getTotal(f)}
                    </td>
                  ))}

                  {/* Cash Revex totals */}
                  <td className="border border-slate-300 text-right">
                    {getSectionGrandTotal("CashRevex").toFixed(2)}
                  </td>

                  <td className="border border-slate-300 text-right">
                    {getSectionFY1Total("CashRevex").toFixed(2)}
                  </td>
                  {cashRevexFields.map((f) => (
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
        <div className="mt-6 border border-slate-200 rounded-xl bg-white overflow-hidden">
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
        <div className="mt-4 border border-slate-200 rounded-xl p-4 bg-white max-w-2xl mx-auto">
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
