import { useState } from "react";
import PDHeader from "../pd/PDHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useLocation } from "react-router-dom";

type PDFormData = {
  capexDescription: string;
  capexRemarks: string;
  capexAmount: string;
  capexTotalPR: string;
  capexH1Fy1: string;
  capexH2Fy1: string;
  capexFy2: string;
  capexFy3: string;

  revenueDescription: string;
  revenueRemarks: string;
  revenueAmount: string;
  revenueTotalPR: string;
  revenueH1Fy1: string;
  revenueH2Fy1: string;
  revenueFy2: string;
  revenueFy3: string;

  carryForward: string;
  actualRevex: string;
  actualCapex: string;

  fundFlowCapH1: string;
  fundFlowCapH2: string;
  fundFlowRevH1: string;
  fundFlowRevH2: string;
  fundFlowH1: string;
  fundFlowH2: string;
  fundFlowTotal: string;
  fundFlow2: string;
  fundFlow3: string;
  fundFlow4: string;
  fundFlow5: string;

  cfCapH1: string;
  cfCapH2: string;
  cfRevH1: string;
  cfRevH2: string;
  cfH1: string;
  cfH2: string;
  cfTotal: string;
};

const initialFormState: PDFormData = {
  capexDescription: "",
  capexRemarks: "",
  capexAmount: "",
  capexTotalPR: "",
  capexH1Fy1: "",
  capexH2Fy1: "",
  capexFy2: "",
  capexFy3: "",

  revenueDescription: "",
  revenueRemarks: "",
  revenueAmount: "",
  revenueTotalPR: "",
  revenueH1Fy1: "",
  revenueH2Fy1: "",
  revenueFy2: "",
  revenueFy3: "",

  carryForward: "",
  actualRevex: "",
  actualCapex: "",

  fundFlowCapH1: "",
  fundFlowCapH2: "",
  fundFlowRevH1: "",
  fundFlowRevH2: "",
  fundFlowH1: "",
  fundFlowH2: "",
  fundFlowTotal: "",
  fundFlow2: "",
  fundFlow3: "",
  fundFlow4: "",
  fundFlow5: "",

  cfCapH1: "",
  cfCapH2: "",
  cfRevH1: "",
  cfRevH2: "",
  cfH1: "",
  cfH2: "",
  cfTotal: "",
};

const NonPDProjectDetail = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  const data = location.state;

  const changeTab = async (tabIndex: number) => {
    // Save will happen only at the next/back button click
    // const success = await savePDData();

    // if (!success) return;

    setActiveTab(tabIndex);
  };

  const inputStyle =
    "w-full h-8  px-3 text-xs border border-slate-200 rounded outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-100";

  return (
    <div className="p-4 space-y-4">
      {/* Project Info / Summary */}
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
        <div className="border border-slate-200 rounded p-4 bg-gray-200 shadow-sm w-1/2">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Summary</h3>

          <div className="overflow-x-auto rounded border border-base-300 bg-white">
            {/* <table className="table w-full table-sm">
              <thead>
                <tr className="bg-base-200">
                  <th className="border-r border-base-300 font-medium">
                    Capex
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Revenue
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Carry Forward
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Actual Revex
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Actual Capex
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Fund Flow
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    C/F Fund Flow
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="hover">
                  <td className="border border-base-300 font-semibold">
                    {summary.capex}
                  </td>

                  <td className="border border-base-300 font-semibold">
                    {summary.revenue}
                  </td>

                  <td className="border border-base-300 font-semibold">
                    {summary.carryForward}
                  </td>

                  <td className="border border-base-300 font-semibold">
                    {summary.actualRevex}
                  </td>

                  <td className="border border-base-300 font-semibold">
                    {summary.actualCapex}
                  </td>

                  <td className="border border-base-300 font-semibold">
                    {summary.fundFlow}
                  </td>

                  <td className="border border-base-300 font-semibold">
                    {summary.cfFundFlow}
                  </td>
                </tr>
              </tbody>
            </table> */}
          </div>
        </div>
      </div>

      <div className=" border-slate-200 rounded">
        {/* name of each tab group should be unique */}

        <div className="tabs tabs-box bg-gray-50 p-4 gap-x-2 tabs-xs  border border-slate-200">
          <input
            type="radio"
            name="my_tabs_2"
            className={`tab ${activeTab === 0 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
            checked={activeTab === 0}
            onClick={() => {
              changeTab(0);
            }}
            aria-label={`Capex | Bifurcation`}
          />
          <div className="tab-content border-base-300 bg-base-100 p-4">
            <div>hello world</div>
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            className={`tab ${activeTab === 1 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
            checked={activeTab === 1}
            onClick={() => {
              changeTab(1);
            }}
            aria-label={`Revenue | Bifurcation`}
          />
          <div className="tab-content border-base-300 bg-base-100 p-4">
            <div>Hello</div>
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            className={`tab ${activeTab === 2 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
            checked={activeTab === 2}
            onClick={() => {
              changeTab(2);
            }}
            aria-label="Carry Forward | Actual Spent"
          />
          <div className="tab-content border-base-300 bg-base-100 p-4">
            <div></div>
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            className={`tab ${activeTab === 3 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
            checked={activeTab === 3}
            onClick={() => {
              changeTab(3);
            }}
            aria-label="Fund Flow"
          />
          <div className="tab-content border-base-300 bg-base-100 p-4"></div>

          <p className="text-sm text-error self-center  font-semibold">
            Please fill the entries and then click on next
          </p>
        </div>

        {/* <div className="flex gap-x-4 place-content-left m-4 ">
          <button
            className="btn btn-sm btn-neutral"
            onClick={prevTab}
            disabled={activeTab === 0}
          >
            <ChevronLeft />
            Back
          </button>
          <button
            className="btn btn-sm btn-neutral"
            onClick={nextTab}
            disabled={activeTab === tabs.length - 1 || !isCurrentTabValid()}
          >
            Next
            <ChevronRight />
          </button>

          {!isRowEmpty() && (
            <button
              className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-red-600"
              onClick={handleSave}
              disabled={isRowEmpty()}
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
        </div> */}
      </div>

      <div className="mt-6 border border-slate-300 font-medium text-xs bg-white overflow-hidden">
        <div className="max-h-175 overflow-auto">
          <table className="table table-zebra table-xs w-full">
            <thead className="sticky top-0 z-30 ">
              <tr className="bg-red-500 text-white text-xs">
                <th className="sticky left-0 z-40 bg-red-500 border  text-center">
                  Actions
                </th>

                <th colSpan={8} className="text-center border ">
                  CAPEX
                </th>

                <th colSpan={8} className="text-center border">
                  REVENUE
                </th>

                <th colSpan={3} className="text-center border ">
                  ACTUALS
                </th>

                <th colSpan={11} className="text-center border">
                  FUND FLOW
                </th>

                <th colSpan={7} className="text-center border">
                  C/F FUND FLOW
                </th>
              </tr>

              <tr className="bg-slate-100 text-slate-800 ">
                <th></th>
                <th className="border border-slate-300 font-medium text-xs">
                  Capex Desc
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Capex Remarks
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Amount
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Total PR
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  H1
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  H2
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  FY28
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  FY29
                </th>

                <th className="border border-slate-300 font-medium text-xs">
                  Revenue Desc
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Revenue Remarks
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Amount
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Total PR
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  H1
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  H2
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  FY28
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  FY29
                </th>

                <th className="border border-slate-300 font-medium text-xs">
                  Carry Fwd
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Act Revex
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Act Capex
                </th>

                <th className="border border-slate-300 font-medium text-xs">
                  Cap H1
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Cap H2
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Rev H1
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Rev H2
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  H1
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  H2
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Total
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  FY28
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  FY29
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  FY30
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  FY31
                </th>

                <th className="border border-slate-300 font-medium text-xs">
                  Cap H1
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Cap H2
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Rev H1
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Rev H2
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  H1
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  H2
                </th>
                <th className="border border-slate-300 font-medium text-xs">
                  Total
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>

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
                <th>Date & Time</th>
              </tr>
            </thead>

            {/* <tbody>
                {approvalHistory.map((item, index) => (
                  <tr key={item.HistoryId}>
                    <td>{index + 1}</td>

                    <td>{item.ActionPerformedBy}</td>
                    <td>{item.EmployeeName}</td>
                    <td>
                      <span className="badge badge-sm badge-neutral ">
                        {item.ActionPerformed}
                      </span>
                    </td>

                    <td>{item.Remarks || "-"}</td>

                    <td>{new Date(item.TDate).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody> */}
          </table>
        </div>
      </div>
    </div>
  );
};

export default NonPDProjectDetail;
