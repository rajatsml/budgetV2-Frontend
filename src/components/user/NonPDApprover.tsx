import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import {
  GetNonPDApprovalHistory,
  GetNonPDMaster,
  UpdateNonPDStatus,
} from "../../service/projectmaster";
import NonPDApproverHistory from "./NonPDApproverHistory";

const money = (value: unknown) => Number(value || 0);
const months = [
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
];
const halfYears = [
  "Fy2H1",
  "Fy2H2",
  "Fy3H1",
  "Fy3H2",
  "Fy4H1",
  "Fy4H2",
  "Fy5H1",
  "Fy5H2",
];
const fieldValue = (row: any, key: string) => {
  const actualKey = Object.keys(row || {}).find(
    (candidate) => candidate.toLowerCase() === key.toLowerCase(),
  );
  return actualKey ? row[actualKey] : undefined;
};

const NonPDApprover = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((store: any) => store.user);
  const [activeTab, setActiveTab] = useState<
    "Summary" | "Commitments" | "Cashflow"
  >("Summary");
  const [rows, setRows] = useState<any[]>([]);
  const [remarks, setRemarks] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const recordId = state?.recordId || state?.RecordId || state?.projectID;
  const nonPDCheckerRole = user?.roles?.some(
    (role: any) =>
      String(role.projectType).trim().toUpperCase() === "NON PD" &&
      String(role.role).trim().toUpperCase() === "CHECKER",
  );
  const pending =
    nonPDCheckerRole &&
    String(state?.status || state?.Status).toUpperCase() ===
      "PENDING WITH APPROVER" &&
    String(state?.pendingWithUser || state?.PendingWithUser) ===
      String(user?.userId);

  useEffect(() => {
    if (!recordId || !state?.deptID) return;
    void Promise.all([
      GetNonPDMaster(String(recordId), state.deptID, recordId),
      GetNonPDApprovalHistory(String(recordId), String(state.deptID)),
    ]).then(([details, approvals]) => {
      setRows(Array.isArray(details) ? details : details?.items || []);
      setHistory(Array.isArray(approvals) ? approvals : []);
    });
  }, [recordId, state?.deptID]);

  const act = async (actionPerformed: "APPROVED" | "REVIEW_BACK") => {
    if (!pending) return;
    try {
      const response = await UpdateNonPDStatus({
        projectId: String(recordId),
        deptId: String(state.deptID),
        userId: String(user.userId),
        actionPerformed,
        approvalRemarks: remarks,
      });
      alert(response?.message || "Workflow updated.");
      navigate("/nonpd-records");
    } catch (error) {
      console.error("Non-PD approval failed", error);
      alert("Unable to update the approval status.");
    }
  };

  const getTotal = (row: any, prefix: "Commitment" | "CashFlow") =>
    getFy1(row, prefix) +
    halfYears.reduce(
      (sum, halfYear) => sum + money(fieldValue(row, `${prefix}_${halfYear}`)),
      0,
    );
  const getFy1 = (row: any, prefix: "Commitment" | "CashFlow") =>
    getFy1H1(row, prefix) + getFy1H2(row, prefix);
  const getFy1H1 = (row: any, prefix: "Commitment" | "CashFlow") =>
    money(fieldValue(row, `${prefix}_Fy1H1`)) ||
    money(fieldValue(row, `${prefix}_H1FY1`)) ||
    months
      .slice(0, 6)
      .reduce(
        (sum, month) => sum + money(fieldValue(row, `${month}${prefix}`)),
        0,
      );
  const getFy1H2 = (row: any, prefix: "Commitment" | "CashFlow") =>
    money(fieldValue(row, `${prefix}_Fy1H2`)) ||
    money(fieldValue(row, `${prefix}_H2FY1`)) ||
    months
      .slice(6)
      .reduce(
        (sum, month) => sum + money(fieldValue(row, `${month}${prefix}`)),
        0,
      );
  const budgetColumns = [
    ["Total", "Total"],
    ["FY1", "FY1"],
    ["Fy1H1", "H1 FY1"],
    ["Fy1H2", "H2 FY1"],
    ...months.map((month) => [month, month]),
    ...halfYears.map((halfYear) => [halfYear, halfYear.replace("Fy", "FY ")]),
  ] as const;
  const totalFor = (getter: (row: any) => number) =>
    rows.reduce((sum, row) => sum + getter(row), 0).toFixed(2);
  const checkerBudgetValue = (
    row: any,
    prefix: "Commitment" | "CashFlow",
    key: string,
  ) => {
    if (key === "Total") return getTotal(row, prefix);
    if (key === "FY1") return getFy1(row, prefix);
    if (key === "Fy1H1") return getFy1H1(row, prefix);
    if (key === "Fy1H2") return getFy1H2(row, prefix);
    return money(
      fieldValue(row, `${key}${prefix}`) ?? fieldValue(row, `${prefix}_${key}`),
    );
  };

  if (!nonPDCheckerRole) {
    return (
      <main className="min-h-screen p-6">
        <div className="alert alert-error">
          You are not authorized to access the Non-PD approver screen.
        </div>
      </main>
    );
  }

  return (
    <main className="ui-screen space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Non-PD Approval</h1>
        <span className="font-semibold">
          Status: {state?.status || state?.Status || "-"}
        </span>
      </div>

      <div role="tablist" className="mb-4 flex flex-wrap gap-2">
        {(["Summary", "Commitments", "Cashflow"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`rounded border px-4 py-2 text-sm font-medium shadow ${
              activeTab === tab
                ? "border-red-500 bg-red-500 text-white"
                : "border-slate-300 bg-white text-slate-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-h-[70vh] overflow-auto rounded border border-slate-300">
        {activeTab === "Summary" ? (
          <table className="table table-xs min-w-max border border-slate-200 [&_td]:border [&_td]:border-slate-200 [&_th]:border [&_th]:border-slate-200">
            <thead className="sticky top-0 z-20 bg-red-500 text-white">
              <tr>
                <th>Project Commitment</th>
                <th>Project Commitment FY1</th>
                <th>Project Cash Flow</th>
                <th>Project Cash Flow FY1</th>
                <th>H1 FY1 Commitment</th>
                <th>H2 FY1 Commitment</th>
                <th>H1 FY2 Commitment</th>
                <th>H2 FY2 Commitment</th>
                <th>H1 FY1 Cash Flow</th>
                <th>H2 FY1 Cash Flow</th>
                <th>H1 FY2 Cash Flow</th>
                <th>H2 FY2 Cash Flow</th>
                <th>ID</th>
                <th>Division</th>
                <th>Category</th>
                <th>Group</th>
                <th>Location</th>
                <th>Project Unit</th>
                <th>Item Description</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.NonPDDetailId}>
                  <td className="text-right">
                    {getTotal(row, "Commitment").toFixed(2)}
                  </td>
                  <td className="text-right">
                    {getFy1(row, "Commitment").toFixed(2)}
                  </td>
                  <td className="text-right">
                    {getTotal(row, "CashFlow").toFixed(2)}
                  </td>
                  <td className="text-right">
                    {getFy1(row, "CashFlow").toFixed(2)}
                  </td>
                  <td className="text-right">
                    {getFy1H1(row, "Commitment").toFixed(2)}
                  </td>
                  <td className="text-right">
                    {getFy1H2(row, "Commitment").toFixed(2)}
                  </td>
                  <td className="text-right">
                    {money(
                      fieldValue(row, "Commitment_Fy2H1") ??
                        fieldValue(row, "Commitment_H1FY2"),
                    ).toFixed(2)}
                  </td>
                  <td className="text-right">
                    {money(
                      fieldValue(row, "Commitment_Fy2H2") ??
                        fieldValue(row, "Commitment_H2FY2"),
                    ).toFixed(2)}
                  </td>
                  <td className="text-right">
                    {getFy1H1(row, "CashFlow").toFixed(2)}
                  </td>
                  <td className="text-right">
                    {getFy1H2(row, "CashFlow").toFixed(2)}
                  </td>
                  <td className="text-right">
                    {money(
                      fieldValue(row, "CashFlow_Fy2H1") ??
                        fieldValue(row, "CashFlow_H1FY2"),
                    ).toFixed(2)}
                  </td>
                  <td className="text-right">
                    {money(
                      fieldValue(row, "CashFlow_Fy2H2") ??
                        fieldValue(row, "CashFlow_H2FY2"),
                    ).toFixed(2)}
                  </td>
                  <td>{fieldValue(row, "NonPDDetailId") || "-"}</td>
                  <td>{fieldValue(row, "Division") || "-"}</td>
                  <td>{fieldValue(row, "Category") || "-"}</td>
                  <td>{fieldValue(row, "Group") || "-"}</td>
                  <td>{fieldValue(row, "Location") || "-"}</td>
                  <td>{fieldValue(row, "ProjectUnit") || "-"}</td>
                  <td>{fieldValue(row, "ItemDescription") || "-"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="text-xs bg-slate-200">
              <tr className="font-semibold">
                {[
                  (row: any) => getTotal(row, "Commitment"),
                  (row: any) => getFy1(row, "Commitment"),
                  (row: any) => getTotal(row, "CashFlow"),
                  (row: any) => getFy1(row, "CashFlow"),
                  (row: any) => getFy1H1(row, "Commitment"),
                  (row: any) => getFy1H2(row, "Commitment"),
                  (row: any) =>
                    money(
                      fieldValue(row, "Commitment_Fy2H1") ??
                        fieldValue(row, "Commitment_H1FY2"),
                    ),
                  (row: any) =>
                    money(
                      fieldValue(row, "Commitment_Fy2H2") ??
                        fieldValue(row, "Commitment_H2FY2"),
                    ),
                  (row: any) => getFy1H1(row, "CashFlow"),
                  (row: any) => getFy1H2(row, "CashFlow"),
                  (row: any) =>
                    money(
                      fieldValue(row, "CashFlow_Fy2H1") ??
                        fieldValue(row, "CashFlow_H1FY2"),
                    ),
                  (row: any) =>
                    money(
                      fieldValue(row, "CashFlow_Fy2H2") ??
                        fieldValue(row, "CashFlow_H2FY2"),
                    ),
                ].map((getter, index) => (
                  <td key={`summary-total-${index}`} className="text-right">
                    {totalFor(getter)}
                  </td>
                ))}
                {Array.from({ length: 7 }, (_, index) => (
                  <td key={`summary-total-label-${index}`}>
                    {index === 0 ? "Total" : ""}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        ) : (
          <table className="table table-xs min-w-max border border-slate-200 [&_td]:border [&_td]:border-slate-200 [&_th]:border [&_th]:border-slate-200">
            <thead className="sticky top-0 z-20 bg-red-500 text-white">
              <tr>
                <th>ID</th>
                <th>Division</th>
                <th>Category</th>
                <th>Group</th>
                <th>Location</th>
                <th>Project Unit</th>
                <th>Item Description</th>
                {budgetColumns.map(([, label]) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const prefix =
                  activeTab === "Commitments" ? "Commitment" : "CashFlow";
                return (
                  <tr key={row.NonPDDetailId}>
                    <td>{fieldValue(row, "NonPDDetailId") || "-"}</td>
                    <td>{fieldValue(row, "Division") || "-"}</td>
                    <td>{fieldValue(row, "Category") || "-"}</td>
                    <td>{fieldValue(row, "Group") || "-"}</td>
                    <td>{fieldValue(row, "Location") || "-"}</td>
                    <td>{fieldValue(row, "ProjectUnit") || "-"}</td>
                    <td>{fieldValue(row, "ItemDescription") || "-"}</td>
                    {budgetColumns.map(([key]) => (
                      <td key={key} className="text-right">
                        {key === "Total"
                          ? getTotal(row, prefix).toFixed(2)
                          : key === "FY1"
                            ? getFy1(row, prefix).toFixed(2)
                            : key === "Fy1H1"
                              ? getFy1H1(row, prefix).toFixed(2)
                              : key === "Fy1H2"
                                ? getFy1H2(row, prefix).toFixed(2)
                                : money(
                                    fieldValue(row, `${key}${prefix}`) ??
                                      fieldValue(row, `${prefix}_${key}`),
                                  ).toFixed(2)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="text-xs bg-slate-200">
              <tr className="font-semibold">
                <td colSpan={7}>Total</td>
                {budgetColumns.map(([key]) => (
                  <td key={`financial-total-${key}`} className="text-right">
                    {totalFor((row) =>
                      checkerBudgetValue(
                        row,
                        activeTab === "Commitments" ? "Commitment" : "CashFlow",
                        key,
                      ),
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {pending && (
        <div className="space-y-2">
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Approval remarks"
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
          />
          <div className="flex gap-2">
            <button
              className="btn btn-sm bg-red-500 text-white"
              onClick={() => void act("APPROVED")}
            >
              Approve
            </button>
            <button
              className="btn btn-sm"
              onClick={() => void act("REVIEW_BACK")}
            >
              Review Back
            </button>
          </div>
        </div>
      )}

      <NonPDApproverHistory history={history} />
    </main>
  );
};

export default NonPDApprover;
