import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PDHeader from "../pd/PDHeader";
import {
  GetNonPDMaster,
  UpdateNonPDStatus,
  GetNonPDApprovalHistory,
} from "../../service/projectmaster";
import useUserStore from "../../store/userStore";

const NonPDApprover = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [approvalHistory, setApprovalHistory] = useState<any[]>([]);
  const [remarks, setRemarks] = useState("");
  const [rows, setRows] = useState<any[]>([]);

  const data = location.state;
  const { user } = useUserStore();

  const isPendingWithCurrentUser =
    data?.status === "PENDING WITH APPROVER" &&
    data?.pendingWithUser?.toString() === user?.userId?.toString();

  const fetchNonPDDetails = async () => {
    try {
      const response = await GetNonPDMaster(data?.projectID, data?.deptID);

      setRows(response || []);
    } catch (error) {
      console.error("Failed to fetch Non-PD details", error);
    }
  };

  const getTotal = (field: string) =>
    rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);

  const summary = {
    quantity: getTotal("Quantity"),
    unitRate: getTotal("UnitRate"),
    basicsInLac: getTotal("BasicsInLac"),
    netCost: getTotal("NetCost"),
    totalPR: getTotal("Total1"),
    totalCF: getTotal("Total2"),
    proposedBudget: getTotal("ProposedBudget"),
  };

  const fetchApprovalHistory = async () => {
    try {
      const response = await GetNonPDApprovalHistory(
        data?.projectID,
        data?.deptID?.toString(),
      );

      setApprovalHistory(response || []);
    } catch (error) {
      console.error("Failed to fetch approval history", error);
    }
  };

  const handleApprove = async () => {
    if (!isPendingWithCurrentUser) return;

    try {
      const response = await UpdateNonPDStatus({
        projectId: data?.projectID,
        deptId: data?.deptID?.toString(),
        userId: user?.userId!,
        actionPerformed: "APPROVED",
        approvalRemarks: remarks,
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
      const response = await UpdateNonPDStatus({
        projectId: data?.projectID,
        deptId: data?.deptID?.toString(),
        userId: user?.userId!,
        actionPerformed: "REVIEW_BACK",
        approvalRemarks: remarks,
      });

      alert(response.message);
      navigate("/myprojects");
    } catch (error) {
      console.error("Review Back failed", error);
    }
  };

  useEffect(() => {
    fetchNonPDDetails();
    fetchApprovalHistory();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Header + Summary */}
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

        {/* NON-PD SUMMARY */}
        <div className="border border-slate-200 rounded p-4 bg-gray-200 shadow-sm w-1/2">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Summary</h3>

          <div className="overflow-x-auto rounded border border-base-300 bg-white">
            <table className="table w-full table-sm">
              <thead>
                <tr className="bg-base-200">
                  <th className="border-r border-base-300 font-medium">
                    Quantity
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Unit Rate
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Basics In Lac
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Net Cost
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Total PR
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Total CF
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Proposed Budget
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="hover">
                  <td className="border border-base-300 font-semibold text-right">
                    {summary.quantity}
                  </td>

                  <td className="border border-base-300 font-semibold text-right">
                    {summary.unitRate}
                  </td>

                  <td className="border border-base-300 font-semibold text-right">
                    {summary.basicsInLac}
                  </td>

                  <td className="border border-base-300 font-semibold text-right">
                    {summary.netCost}
                  </td>

                  <td className="border border-base-300 font-semibold text-right">
                    {summary.totalPR}
                  </td>

                  <td className="border border-base-300 font-semibold text-right">
                    {summary.totalCF}
                  </td>

                  <td className="border border-base-300 font-semibold text-right">
                    {summary.proposedBudget}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Saved Non-PD Records Table */}
      {rows.length > 0 && (
        <div className="mt-6 border border-slate-300 font-medium text-xs bg-white overflow-hidden">
          <div className="max-h-175 overflow-auto">
            <table className="table table-zebra table-xs w-full">
              <thead className="sticky top-0 z-30">
                {/* GROUP HEADER */}
                <tr className="bg-red-500 text-white text-xs">
                  <th className="sticky left-0 z-40 bg-red-500 border text-center">
                    Actions
                  </th>

                  {/* 11 columns */}
                  <th colSpan={11} className="text-center border">
                    PROJECT DETAILS
                  </th>

                  {/* 10 columns */}
                  <th colSpan={10} className="text-center border">
                    BUDGET DETAILS
                  </th>

                  {/* 5 columns */}
                  <th colSpan={5} className="text-center border">
                    PR / CF
                  </th>

                  {/* 5 columns */}
                  <th colSpan={5} className="text-center border">
                    YEAR 2 / CF
                  </th>

                  {/* 5 columns */}
                  <th colSpan={5} className="text-center border">
                    PROPOSED / PRIORITY
                  </th>

                  {/* 12 columns */}
                  <th colSpan={12} className="text-center border">
                    MONTHLY NET CF
                  </th>

                  {/* 8 columns */}
                  <th colSpan={8} className="text-center border">
                    PR BIFURCATION
                  </th>

                  {/* 8 columns */}
                  <th colSpan={8} className="text-center border">
                    CF BIFURCATION
                  </th>
                </tr>

                {/* COLUMN HEADER */}
                <tr className="bg-slate-100 text-slate-800">
                  <th></th>

                  {/* PROJECT DETAILS - 11 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    ID
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Division
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Category
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Group Name
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Location
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Project Unit
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Current Scenario Justification
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Deliverables / KPI
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Budget Based On
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Request For
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Financial
                  </th>

                  {/* BUDGET DETAILS - 10 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    Project Owner
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Capex / Revenue
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Template Category
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Project Name
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Quantity
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Unit Rate
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Currency
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Exchange Rate
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Basics In Lac
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Type Of Purchase
                  </th>

                  {/* PR / CF - 5 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    NR Tax %
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Net Cost
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    H1 PR
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    H2 PR
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Total 1
                  </th>

                  {/* YEAR 2 / CF - 5 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    Year 2
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    H1 CF
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    H2 CF
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Total 2
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Remarks
                  </th>

                  {/* PROPOSED / PRIORITY - 5 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    Proposed Qty
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Proposed Budget
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Remark
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Contingency Factor
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Vital
                  </th>

                  {/* MONTHLY NET CF - 12 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    Apr
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    May
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Jun
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Jul
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Aug
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Sep
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Oct
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Nov
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Dec
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Jan
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Feb
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Mar
                  </th>

                  {/* PR BIFURCATION - 8 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY1 H1
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY1 H2
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY2 H1
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY2 H2
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY3 H1
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY3 H2
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY4 H1
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY4 H2
                  </th>

                  {/* CF BIFURCATION - 8 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY1 H1
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY1 H2
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY2 H1
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY2 H2
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY3 H1
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY3 H2
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY4 H1
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY4 H2
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.NonPDDetailId} className="text-xs">
                    {/* ACTIONS */}

                    <td className="sticky left-0 z-20 bg-white border border-slate-200">
                      {/* {isPendingWithCurrentUser && (
                        <div className="flex gap-1 justify-center">
                          <button
                            className="btn btn-xs bg-red-500 text-white"
                            onClick={() =>
                              navigate("/budgetV2/nonpd/edit", {
                                state: {
                                  ...data,
                                  row,
                                },
                              })
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-xs bg-red-500 text-white"
                            onClick={() => {
                              console.log("Delete:", row.NonPDDetailId);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )} */}
                    </td>

                    {/* PROJECT DETAILS */}

                    <td className="border border-slate-200">{row.Id}</td>

                    <td className="border border-slate-200">{row.Division}</td>

                    <td className="border border-slate-200">{row.Category}</td>

                    <td className="border border-slate-200">{row.GroupName}</td>

                    <td className="border border-slate-200">{row.Location}</td>

                    <td className="border border-slate-200">
                      {row.ProjectUnit}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.CurrentScenerioJustification}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.DeliverablesKPI}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.BudgetBasedOn}
                    </td>

                    <td className="border border-slate-200">
                      {row.RequestFor}
                    </td>

                    <td className="border border-slate-200">{row.Financial}</td>

                    {/* BUDGET DETAILS */}

                    <td className="border border-slate-200">
                      {row.ProjectOwner}
                    </td>

                    <td className="border border-slate-200">
                      {row.Capex_Revenue}
                    </td>

                    <td className="border border-slate-200">
                      {row.TemplateCategory}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.ProjectName}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.Quantity}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.UnitRate}
                    </td>

                    <td className="border border-slate-200">{row.Currency}</td>

                    <td className="border border-slate-200 text-right">
                      {row.ExchangeRate}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.BasicsInLac}
                    </td>

                    <td className="border border-slate-200">
                      {row.TypeOfPurchase}
                    </td>

                    {/* PR / CF */}

                    <td className="border border-slate-200 text-right">
                      {row.NRTaxPercentage}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.NetCost}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.H1PR}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.H2PR}
                    </td>

                    <td className="border border-slate-200 text-right font-semibold">
                      {row.Total1}
                    </td>

                    {/* YEAR 2 / CF */}

                    <td className="border border-slate-200 text-right">
                      {row.Year2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.H1CF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.H2CF}
                    </td>

                    <td className="border border-slate-200 text-right font-semibold">
                      {row.Total2}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.Remarks}
                    </td>

                    {/* PROPOSED / PRIORITY */}

                    <td className="border border-slate-200 text-right">
                      {row.ProposedQty}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.ProposedBudget}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.Remark}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.ContingencyFactor}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.Vital}
                    </td>

                    {/* MONTHLY NET CF */}

                    <td className="border border-slate-200 text-right">
                      {row.AprNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.MayNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.JunNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.JulNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.AugNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.SepNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.OctNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.NovNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.DecNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.JanNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.FebNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.MarNetCF}
                    </td>

                    {/* PR BIFURCATION */}

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy1H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy1H2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy2H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy2H2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy3H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy3H2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy4H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy4H2}
                    </td>

                    {/* CF BIFURCATION */}

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy1H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy1H2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy2H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy2H2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy3H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy3H2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy4H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy4H2}
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* TOTAL */}

              <tfoot>
                <tr className="sticky bottom-0 z-20 bg-amber-100 font-bold text-xs">
                  <td className="sticky left-0 z-40 bg-amber-100 font-semibold text-center">
                    Total
                  </td>

                  {/* PROJECT DETAILS */}

                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>

                  {/* BUDGET DETAILS */}

                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>

                  <td className="border border-slate-300">
                    {getTotal("Quantity")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("UnitRate")}
                  </td>

                  <td className="border border-slate-300"></td>

                  <td className="border border-slate-300">
                    {getTotal("ExchangeRate")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("BasicsInLac")}
                  </td>

                  <td className="border border-slate-300"></td>

                  {/* PR / CF */}

                  <td className="border border-slate-300">
                    {getTotal("NRTaxPercentage")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("NetCost")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("H1PR")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("H2PR")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("Total1")}
                  </td>

                  {/* YEAR 2 / CF */}

                  <td className="border border-slate-300">
                    {getTotal("Year2")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("H1CF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("H2CF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("Total2")}
                  </td>

                  <td className="border border-slate-300"></td>

                  {/* PROPOSED / PRIORITY */}

                  <td className="border border-slate-300">
                    {getTotal("ProposedQty")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("ProposedBudget")}
                  </td>

                  <td className="border border-slate-300"></td>

                  <td className="border border-slate-300">
                    {getTotal("ContingencyFactor")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("Vital")}
                  </td>

                  {/* MONTHLY NET CF */}

                  <td className="border border-slate-300">
                    {getTotal("AprNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("MayNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("JunNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("JulNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("AugNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("SepNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("OctNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("NovNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("DecNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("JanNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("FebNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("MarNetCF")}
                  </td>

                  {/* PR BIFURCATION */}

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy1H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy1H2")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy2H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy2H2")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy3H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy3H2")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy4H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy4H2")}
                  </td>

                  {/* CF BIFURCATION */}

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy1H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy1H2")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy2H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy2H2")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy3H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy3H2")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy4H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy4H2")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Approval History */}

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
                  <th>Date & Time</th>
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

                    <td>{item.ApprovalRemarks || "-"}</td>

                    <td>{new Date(item.TDate).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Approval Actions */}

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

export default NonPDApprover;
