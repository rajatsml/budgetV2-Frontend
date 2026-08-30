import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PDHeaderNew from "./PDHeaderNew";

// Define the interface for a single row's financial months and half-years
interface FinancialValues {
  // Monthly breakdowns for FY1
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
  // Semi-annual breakdowns for future fiscal years
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
}

// Interface for a grid state row containing type-based records
interface TabData {
  capex: FinancialValues;
  revex: FinancialValues;
}

// Initial structure for financial input fields
const initialFinancialValues: FinancialValues = {
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

const initialTabData: TabData = {
  capex: { ...initialFinancialValues },
  revex: { ...initialFinancialValues },
};

const PDInputs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const canEdit = true;

  // 1. Shared Text Meta States across tabs
  const [description, setDescription] = useState("");
  const [basis, setBasis] = useState("");

  // Grid Financial States
  const [commitments, setCommitments] = useState<TabData>(initialTabData);
  const [cashFlow, setCashFlow] = useState<TabData>(initialTabData);

  // Tab configurations
  const tabs = ["Commitments", "CashFlow", "Carry Forward"];

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

  // Helper utility to strictly parse string inputs to valid floating numbers
  const parseNum = (val: string): number => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  // 2. Real-time Computed Totals Matrix Calculation Engine
  const calculateRowTotals = (row: FinancialValues) => {
    // Total Commitment FY1 = Sum of individual months (Apr to Mar)
    const h1FY1Total =
      parseNum(row.aprFY1) +
      parseNum(row.mayFY1) +
      parseNum(row.junFY1) +
      parseNum(row.julFY1) +
      parseNum(row.augFY1) +
      parseNum(row.sepFY1);

    const h2FY1Total =
      parseNum(row.octFY1) +
      parseNum(row.novFY1) +
      parseNum(row.decFY1) +
      parseNum(row.janFY1) +
      parseNum(row.febFY1) +
      parseNum(row.marFY1);

    const totalCommitmentFY1 = h1FY1Total + h2FY1Total;

    // Total Commitment Value = Total Commitment FY1 + H1/H2 variations of FY2 to FY5
    const totalCommitmentValue =
      totalCommitmentFY1 +
      parseNum(row.h1FY2) +
      parseNum(row.h2FY2) +
      parseNum(row.h1FY3) +
      parseNum(row.h2FY3) +
      parseNum(row.h1FY4) +
      parseNum(row.h2FY4) +
      parseNum(row.h1FY5) +
      parseNum(row.h2FY5);

    return {
      h1FY1Total: h1FY1Total.toFixed(2),
      h2FY1Total: h2FY1Total.toFixed(2),
      fy1Total: totalCommitmentFY1.toFixed(2),
      valueTotal: totalCommitmentValue.toFixed(2),
    };
  };

  // Grid state values computation mapping
  const commCapexTotals = calculateRowTotals(commitments.capex);
  const commRevexTotals = calculateRowTotals(commitments.revex);
  const cfCapexTotals = calculateRowTotals(cashFlow.capex);
  const cfRevexTotals = calculateRowTotals(cashFlow.revex);

  // Structural Input Field Handler Factory
  const handleInputChange = (
    tabType: "commitments" | "cashFlow",
    rowType: "capex" | "revex",
    field: keyof FinancialValues,
    value: string,
  ) => {
    const stateSetter =
      tabType === "commitments" ? setCommitments : setCashFlow;
    stateSetter((prev) => ({
      ...prev,
      [rowType]: {
        ...prev[rowType],
        [field]: value,
      },
    }));
  };

  // Reusable sub-component wrapper for table rows to bypass duplicate inline definitions
  const renderFinancialRow = (
    tabType: "commitments" | "cashFlow",
    rowType: "capex" | "revex",
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
        <td className="font-medium">{label}</td>
        {/* Read-only dynamically computed metric aggregates */}
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
        {/* Render interactive monthly configurations */}
        {months.map((m) => (
          <td key={m}>
            <input
              type="text"
              value={data[m]}
              onChange={(e) =>
                handleInputChange(tabType, rowType, m, e.target.value)
              }
              className="input input-bordered input-xs w-16"
            />
          </td>
        ))}
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

        {/* Render interactive half-yearly configurations */}
        {halves.map((h) => (
          <td key={h}>
            <input
              type="text"
              value={data[h]}
              onChange={(e) =>
                handleInputChange(tabType, rowType, h, e.target.value)
              }
              className="input input-bordered input-xs w-16"
            />
          </td>
        ))}
      </>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-x-2">
        <PDHeaderNew
          projectID="P001"
          projectName="Sample Project"
          deptName="Engineering"
          deptID={4}
          category="Capex"
          fyYear="2027-28"
          pendingWith="Manager"
          status="OPENED"
          projectType="ONGOING"
        />
        {/* Refactored Summary Component according to parameters 3, 4, 5 */}
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

      <div className="border-slate-200 rounded">
        {canEdit && (
          <div className="tabs tabs-box bg-gray-50 p-4 gap-x-2 tabs-xs border border-slate-200">
            {/* TAB 1: COMMITMENTS */}
            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${activeTab === 0 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 0}
              onClick={() => changeTab(0)}
              aria-label="Commitments"
            />
            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="overflow-x-auto border border-base-300 rounded">
                <table className="table table-xs table-zebra min-w-max">
                  <thead className="text-xs bg-red-500 text-white">
                    <tr>
                      {/* Explicitly span these header cells to cover both row configurations */}
                      <th className="align-middle">Description</th>
                      <th className="align-middle">Basis</th>
                      <th className="align-middle">Type</th>
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
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </td>
                      <td rowSpan={2}>
                        <textarea
                          className="textarea textarea-bordered w-full min-w-48"
                          placeholder="Basis"
                          value={basis}
                          onChange={(e) => setBasis(e.target.value)}
                        />
                      </td>

                      {renderFinancialRow(
                        "commitments",
                        "capex",
                        "Capex",
                        commitments.capex,
                        commCapexTotals,
                      )}
                    </tr>

                    <tr>
                      {renderFinancialRow(
                        "commitments",
                        "revex",
                        "Revex",
                        commitments.revex,
                        commRevexTotals,
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TAB 2: CASH FLOW */}
            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${activeTab === 1 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 1}
              onClick={() => changeTab(1)}
              aria-label="Cash Flow"
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
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </td>

                      <td rowSpan={2}>
                        <textarea
                          className="textarea textarea-bordered w-full min-w-48"
                          placeholder="Basis"
                          value={basis}
                          onChange={(e) => setBasis(e.target.value)}
                        />
                      </td>

                      {renderFinancialRow(
                        "cashFlow",
                        "capex",
                        "Capex",
                        cashFlow.capex,
                        cfCapexTotals,
                      )}
                    </tr>

                    <tr>
                      {renderFinancialRow(
                        "cashFlow",
                        "revex",
                        "Revex",
                        cashFlow.revex,
                        cfRevexTotals,
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TAB 3: CARRY FORWARD */}
            <input
              type="radio"
              name="my_tabs_2"
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
                        <select className="select select-bordered select-xs w-full">
                          <option value="">Select</option>
                          <option value="one">One</option>
                          <option value="two">Two</option>
                          <option value="three">Three</option>
                        </select>
                      </td>
                      <td className="min-w-75">
                        <input
                          type="text"
                          placeholder="Enter Description"
                          className="input input-bordered input-xs w-full"
                        />
                      </td>
                      <td className="min-w-37.5">
                        <select className="select select-bordered select-xs w-full">
                          <option value="">Select</option>
                          <option value="2025-26">2025-26</option>
                          <option value="2026-27">2026-27</option>
                          <option value="2027-28">2027-28</option>
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

        {canEdit && (
          <div className="flex gap-x-4 place-content-left m-4 ">
            <button onClick={prevTab} className="btn btn-sm btn-neutral">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </button>
            <button onClick={nextTab} className="btn btn-sm btn-neutral">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDInputs;
