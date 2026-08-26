import { useState, useEffect } from "react";
import PDHeader from "../pd/PDHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const PDInputs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const mockRows = [
    {
      PDDetailId: 1,
      CapexDescription: "Equipment",
      CapexAmount: 100000,
      RevenueAmount: 50000,
      CarryForward: 15000,
      ActualRevex: 10000,
      ActualCapex: 25000,
      FundFlowTotal: 75000,
      CFTotal: 30000,
    },
  ];

  const [rows] = useState(mockRows);

  const [formData, setFormData] = useState(initialFormState);

  const canEdit = true;

  //   const { user } = useUserStore();

  useEffect(() => {}, []);

  const changeTab = async (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const nextTab = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const prevTab = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  //   const handleChange = (key: keyof PDFormData, value: string) => {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [key]: value,
  //     }));
  //   };

  const getNumber = (value: string) => Number(value || 0);

  //   const isCurrentTabValid = () => {
  //     switch (activeTab) {
  //       case 0:
  //         return [
  //           formData.capexDescription,
  //           formData.capexRemarks,
  //           formData.capexAmount,
  //           formData.capexTotalPR,
  //           formData.capexH1Fy1,
  //           formData.capexH2Fy1,
  //           formData.capexFy2,
  //           formData.capexFy3,
  //         ].some(hasValue);

  //       case 1:
  //         return [
  //           formData.revenueDescription,
  //           formData.revenueRemarks,
  //           formData.revenueAmount,
  //           formData.revenueTotalPR,
  //           formData.revenueH1Fy1,
  //           formData.revenueH2Fy1,
  //           formData.revenueFy2,
  //           formData.revenueFy3,
  //         ].some(hasValue);

  //       case 2:
  //         return [
  //           formData.carryForward,
  //           formData.actualRevex,
  //           formData.actualCapex,
  //         ].some(hasValue);

  //       case 3:
  //         return [
  //           formData.fundFlowCapH1,
  //           formData.fundFlowCapH2,
  //           formData.fundFlowRevH1,
  //           formData.fundFlowRevH2,
  //           formData.fundFlowH1,
  //           formData.fundFlowH2,
  //           formData.fundFlowTotal,
  //           formData.fundFlow2,
  //           formData.fundFlow3,
  //           formData.fundFlow4,
  //           formData.fundFlow5,
  //         ].some(hasValue);

  //       case 4:
  //         return [
  //           formData.cfCapH1,
  //           formData.cfCapH2,
  //           formData.cfRevH1,
  //           formData.cfRevH2,
  //           formData.cfH1,
  //           formData.cfH2,
  //           formData.cfTotal,
  //         ].some(hasValue);

  //       default:
  //         return false;
  //     }
  //   };

  const tabs = [
    "Commitments",
    "CashFlow",
    "Carry Forward",
    "Fund Flow",
    "C/F Fund Flow",
  ];

  const getTotal = (field: keyof (typeof rows)[number]) =>
    rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);

  const summary = canEdit
    ? {
        capex: getNumber(formData.capexAmount),
        revenue: getNumber(formData.revenueAmount),
        carryForward: getNumber(formData.carryForward),
        actualRevex: getNumber(formData.actualRevex),
        actualCapex: getNumber(formData.actualCapex),
        fundFlow: getNumber(formData.fundFlowTotal),
        cfFundFlow: getNumber(formData.cfTotal),
      }
    : {
        capex: getTotal("CapexAmount"),
        revenue: getTotal("RevenueAmount"),
        carryForward: getTotal("CarryForward"),
        actualRevex: getTotal("ActualRevex"),
        actualCapex: getTotal("ActualCapex"),
        fundFlow: getTotal("FundFlowTotal"),
        cfFundFlow: getTotal("CFTotal"),
      };

  return (
    <div className="p-4 space-y-4">
      {/* Project Info / Summary */}
      <div className="flex gap-x-2">
        <PDHeader
          projectID="P001"
          projectName="Sample Project"
          deptName="Engineering"
          deptID={4}
          category="Capex"
          fyYear="FY27"
          pendingWith="Manager"
          status="OPENED"
        />
        <div className="border border-slate-200 rounded p-4 bg-gray-200 shadow-sm w-1/2">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Summary</h3>

          <div className="overflow-x-auto rounded border border-base-300 bg-white">
            <table className="table w-full table-sm">
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
            </table>
          </div>
        </div>
      </div>

      <div className=" border-slate-200 rounded">
        {/* name of each tab group should be unique */}

        {canEdit && (
          <div className="tabs tabs-box bg-gray-50 p-4 gap-x-2 tabs-xs  border border-slate-200">
            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${activeTab === 0 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 0}
              onClick={() => {
                changeTab(0);
              }}
              aria-label={`Commitments`}
            />
            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="overflow-x-auto border border-base-300 rounded">
                <table className="table table-xs table-zebra min-w-max">
                  <thead className="text-xs bg-red-500 text-white ">
                    <tr>
                      <th>Description</th>
                      <th>Basis</th>
                      <th></th>
                      <th>
                        Total Commitment <br /> Value in CR.
                      </th>
                      <th>
                        Total Commitment <br /> FY1 in CR.
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

                  <tbody>
                    <tr>
                      <td rowSpan={2}>
                        <textarea
                          className="textarea textarea-bordered w-full min-w-48"
                          placeholder="Description"
                        />
                      </td>

                      <td rowSpan={2}>
                        <textarea
                          className="textarea textarea-bordered w-full min-w-48"
                          placeholder="Basis"
                        />
                      </td>

                      <td className="font-medium">Capex</td>

                      {/* Total Commitment */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>

                      {/* Apr-Mar */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>

                      {/* FY2-Y5 */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                    </tr>

                    <tr>
                      <td className="font-medium">Revex</td>

                      {/* Total Commitment */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>

                      {/* Apr-Mar */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>

                      {/* FY2-Y5 */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${activeTab === 1 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 1}
              onClick={() => {
                changeTab(1);
              }}
              aria-label={`Cash Flow`}
            />
            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="overflow-x-auto border border-base-300 rounded">
                <table className="table table-xs table-zebra min-w-max">
                  <thead className="text-xs bg-red-500 text-white ">
                    <tr>
                      <th>Description</th>
                      <th>Basis</th>
                      <th></th>
                      <th>
                        Total Commitment <br /> Value in CR.
                      </th>
                      <th>
                        Total Commitment <br /> FY1 in CR.
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

                  <tbody>
                    <tr>
                      <td rowSpan={2}>
                        <textarea
                          className="textarea textarea-bordered w-full min-w-48"
                          placeholder="Description"
                        />
                      </td>

                      <td rowSpan={2}>
                        <textarea
                          className="textarea textarea-bordered w-full min-w-48"
                          placeholder="Basis"
                        />
                      </td>

                      <td className="font-medium">Capex</td>

                      {/* Total Commitment */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>

                      {/* Apr-Mar */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>

                      {/* FY2-Y5 */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                    </tr>

                    <tr>
                      <td className="font-medium">Revex</td>

                      {/* Total Commitment */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>

                      {/* Apr-Mar */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>

                      {/* FY2-Y5 */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${activeTab === 2 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 2}
              onClick={() => {
                changeTab(2);
              }}
              aria-label="Carry Forward"
            />
            <div className="tab-content border-base-300 bg-base-100 p-4">
              Hello World
            </div>

            <p className="text-sm text-error self-center  font-semibold">
              Please fill the entries and then click on next
            </p>
          </div>
        )}

        {canEdit && (
          <div className="flex gap-x-4 place-content-left m-4 ">
            <button onClick={prevTab} className="btn btn-sm btn-neutral">
              <ChevronLeft />
              Back
            </button>

            <button onClick={nextTab} className="btn btn-sm btn-neutral">
              Next
              <ChevronRight />
            </button>

            {/* <button className="btn btn-sm bg-red-500 text-white">
              Save All Entries
            </button>

            <button className="btn btn-sm bg-red-500 text-white">
              Submit For Approval
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDInputs;
