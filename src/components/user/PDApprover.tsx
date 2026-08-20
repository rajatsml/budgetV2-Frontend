import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PDHeader from "../pd/PDHeader";
import { GetPDMaster, UpdatePDStatus } from "../../service/projectmaster";
import useUserStore from "../../store/userStore";

const PDApprover = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const [remarks, setRemarks] = useState("");
  const { user } = useUserStore();

  const [rows, setRows] = useState<any[]>([]);

  const isPendingWithCurrentUser =
    data?.status === "PENDING WITH APPROVER" &&
    data?.pendingWithUser?.toString() === user?.userId?.toString();

  const fetchPDDetails = async () => {
    try {
      const response = await GetPDMaster(data?.projectID, data?.deptID);

      setRows(response || []);
    } catch (error) {
      console.error("Failed to fetch PD details", error);
    }
  };

  const getTotal = (field: string) =>
    rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);

  const summary = {
    capex: getTotal("CapexAmount"),
    revenue: getTotal("RevenueAmount"),
    carryForward: getTotal("CarryForward"),
    actualRevex: getTotal("ActualRevex"),
    actualCapex: getTotal("ActualCapex"),
    fundFlow: getTotal("FundFlowTotal"),
    cfFundFlow: getTotal("CFTotal"),
  };

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

      // await ApprovePD(payload);

      alert("Project approved successfully");
      navigate("/my-projects");
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

      // await ReviewBackPD(payload);
      navigate("/my-projects");
      alert("Project sent back for review");
    } catch (error) {
      console.error("Review Back failed", error);
    }
  };

  useEffect(() => {
    fetchPDDetails();
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
        />
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 shadow-sm self-stretch w-1/2">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Summary</h3>

          <div className="overflow-x-auto rounded-lg border border-base-300 bg-white">
            <table className="table w-full table-xs">
              <thead>
                <tr className="bg-base-200 ">
                  <th className="border-r border-base-300 font-medium">
                    Metric
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Value
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Metric
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Value
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Metric
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Value
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="hover">
                  <td className="border border-base-300 font-medium">Capex</td>
                  <td className="border border-base-300 font-semibold">
                    {summary.capex}
                  </td>

                  <td className="border border-base-300 font-medium">
                    Revenue
                  </td>
                  <td className="border border-base-300 font-semibold">
                    {summary.revenue}
                  </td>

                  <td className="border border-base-300 font-medium">
                    Carry Forward
                  </td>
                  <td className="border border-base-300 font-semibold">
                    {summary.carryForward}
                  </td>
                </tr>

                <tr className="hover">
                  <td className="border border-base-300 font-medium">
                    Actual Revex
                  </td>
                  <td className="border border-base-300 font-semibold">
                    {summary.actualRevex}
                  </td>

                  <td className="border border-base-300 font-medium">
                    Actual Capex
                  </td>
                  <td className="border border-base-300 font-semibold">
                    {summary.actualCapex}
                  </td>

                  <td className="border border-base-300 font-medium">
                    Fund Flow
                  </td>
                  <td className="border border-base-300 font-semibold">
                    {summary.fundFlow}
                  </td>
                </tr>

                <tr className="hover">
                  <td className="border border-base-300 font-medium">
                    C/F Fund Flow
                  </td>
                  <td className="border border-base-300 font-semibold">
                    {summary.cfFundFlow}
                  </td>

                  <td className="border border-base-300 bg-base-100"></td>
                  <td className="border border-base-300 bg-base-100"></td>

                  <td className="border border-base-300 bg-base-100"></td>
                  <td className="border border-base-300 bg-base-100"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Saved Records Table */}

      {rows.length > 0 && (
        <div className="mt-6 border border-slate-300 font-medium text-xs bg-white overflow-hidden">
          <div className="max-h-175 overflow-auto">
            <table className="table table-zebra table-xs w-full">
              {/* COPY THEAD FROM PDProjecDetail */}
              <thead className="sticky top-0 z-30">
                <tr className="bg-red-500 text-white text-xs">
                  <th colSpan={8} className="text-center border">
                    CAPEX
                  </th>

                  <th colSpan={8} className="text-center border">
                    REVENUE
                  </th>

                  <th colSpan={3} className="text-center border">
                    ACTUALS
                  </th>

                  <th colSpan={11} className="text-center border">
                    FUND FLOW
                  </th>

                  <th colSpan={7} className="text-center border">
                    C/F FUND FLOW
                  </th>
                </tr>

                <tr className="bg-slate-100 text-slate-800">
                  {/* CAPEX */}
                  <th className="border border-slate-300">Capex Desc</th>
                  <th className="border border-slate-300">Capex Remarks</th>
                  <th className="border border-slate-300">Amount</th>
                  <th className="border border-slate-300">Total PR</th>
                  <th className="border border-slate-300">H1</th>
                  <th className="border border-slate-300">H2</th>
                  <th className="border border-slate-300">FY28</th>
                  <th className="border border-slate-300">FY29</th>

                  {/* REVENUE */}
                  <th className="border border-slate-300">Revenue Desc</th>
                  <th className="border border-slate-300">Revenue Remarks</th>
                  <th className="border border-slate-300">Amount</th>
                  <th className="border border-slate-300">Total PR</th>
                  <th className="border border-slate-300">H1</th>
                  <th className="border border-slate-300">H2</th>
                  <th className="border border-slate-300">FY28</th>
                  <th className="border border-slate-300">FY29</th>

                  {/* ACTUALS */}
                  <th className="border border-slate-300">Carry Fwd</th>
                  <th className="border border-slate-300">Act Revex</th>
                  <th className="border border-slate-300">Act Capex</th>

                  {/* FUND FLOW */}
                  <th className="border border-slate-300">Cap H1</th>
                  <th className="border border-slate-300">Cap H2</th>
                  <th className="border border-slate-300">Rev H1</th>
                  <th className="border border-slate-300">Rev H2</th>
                  <th className="border border-slate-300">H1</th>
                  <th className="border border-slate-300">H2</th>
                  <th className="border border-slate-300">Total</th>
                  <th className="border border-slate-300">FY28</th>
                  <th className="border border-slate-300">FY29</th>
                  <th className="border border-slate-300">FY30</th>
                  <th className="border border-slate-300">FY31</th>

                  {/* C/F FUND FLOW */}
                  <th className="border border-slate-300">Cap H1</th>
                  <th className="border border-slate-300">Cap H2</th>
                  <th className="border border-slate-300">Rev H1</th>
                  <th className="border border-slate-300">Rev H2</th>
                  <th className="border border-slate-300">H1</th>
                  <th className="border border-slate-300">H2</th>
                  <th className="border border-slate-300">Total</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.PDDetailId}>
                    {/* REMOVE ACTION COLUMN */}

                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.CapexDescription}
                    </td>
                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.CapexRemarks}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.CapexAmount}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.CapexTotalPR}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.CapexH1Fy1}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.CapexH2Fy1}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.CapexFy2}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.CapexFy3}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.RevenueDescription}
                    </td>
                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.RevenueRemarks}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.RevenueAmount}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.RevenueTotalPR}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.RevenueH1Fy1}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.RevenueH2Fy1}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.RevenueFy2}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.RevenueFy3}
                    </td>

                    <td className="border border-slate-200 text-center">
                      {row.CarryForward}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.ActualRevex}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.ActualCapex}
                    </td>

                    <td className="border border-slate-200 text-center">
                      {row.FundFlowCapH1}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.FundFlowCapH2}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.FundFlowRevH1}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.FundFlowRevH2}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.FundFlowH1}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.FundFlowH2}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.FundFlowTotal}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.FundFlow2}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.FundFlow3}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.FundFlow4}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.FundFlow5}
                    </td>

                    <td className="border border-slate-200 text-center">
                      {row.CFCapH1}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.CFCapH2}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.CFRevH1}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.CFRevH2}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.CFH1}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.CFH2}
                    </td>
                    <td className="border border-slate-200 text-center">
                      {row.CFTotal}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="bg-amber-100 font-bold text-xs">
                  <td
                    colSpan={2}
                    className="bg-amber-100 font-semibold text-center border border-slate-300"
                  >
                    Total
                  </td>
                  {/* <td></td> */}

                  <td className="text-center">{getTotal("CapexAmount")}</td>
                  <td className="text-center">{getTotal("CapexTotalPR")}</td>
                  <td className="text-center">{getTotal("CapexH1Fy1")}</td>
                  <td className="text-center">{getTotal("CapexH2Fy1")}</td>
                  <td className="text-center">{getTotal("CapexFy2")}</td>
                  <td className="text-center">{getTotal("CapexFy3")}</td>

                  <td></td>
                  <td></td>

                  <td className="text-center">{getTotal("RevenueAmount")}</td>
                  <td className="text-center">{getTotal("RevenueTotalPR")}</td>
                  <td className="text-center">{getTotal("RevenueH1Fy1")}</td>
                  <td className="text-center">{getTotal("RevenueH2Fy1")}</td>
                  <td className="text-center">{getTotal("RevenueFy2")}</td>
                  <td className="text-center">{getTotal("RevenueFy3")}</td>

                  <td className="text-center">{getTotal("CarryForward")}</td>
                  <td className="text-center">{getTotal("ActualRevex")}</td>
                  <td className="text-center">{getTotal("ActualCapex")}</td>

                  <td className="text-center">{getTotal("FundFlowCapH1")}</td>
                  <td className="text-center">{getTotal("FundFlowCapH2")}</td>
                  <td className="text-center">{getTotal("FundFlowRevH1")}</td>
                  <td className="text-center">{getTotal("FundFlowRevH2")}</td>
                  <td className="text-center">{getTotal("FundFlowH1")}</td>
                  <td className="text-center">{getTotal("FundFlowH2")}</td>
                  <td className="text-center">{getTotal("FundFlowTotal")}</td>
                  <td className="text-center">{getTotal("FundFlow2")}</td>
                  <td className="text-center">{getTotal("FundFlow3")}</td>
                  <td className="text-center">{getTotal("FundFlow4")}</td>
                  <td className="text-center">{getTotal("FundFlow5")}</td>

                  <td className="text-center">{getTotal("CFCapH1")}</td>
                  <td className="text-center">{getTotal("CFCapH2")}</td>
                  <td className="text-center">{getTotal("CFRevH1")}</td>
                  <td className="text-center">{getTotal("CFRevH2")}</td>
                  <td className="text-center">{getTotal("CFH1")}</td>
                  <td className="text-center">{getTotal("CFH2")}</td>
                  <td className="text-center">{getTotal("CFTotal")}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

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
