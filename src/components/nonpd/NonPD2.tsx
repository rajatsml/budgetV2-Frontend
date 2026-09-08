import { useState } from "react";
// import { PlusSquare, Pencil, Trash2, ChevronRight } from "lucide-react";
// import MasterInfoNonPD from "./MasterInfoNonPD";
import NonPDHeader from "./NonPDHeader";

type NonPDRow = {
  itemDescription: string;
  currentScenarioAndJustification: string;
  deliverablesKPI: string;
  budgetBasedOn: string;
  requestFor: string;
  financial: string;
  projectOwner: string;
  capexRevenue: string;
  templateCategory: string;
  projectName: string;

  quantity: string;
  unitOfMeasure: string;
  unitRate: string;
  currency: string;
  exchangeRate: string;
  basicInLacs: string;
  typeOfPurchase: string;
  nrTaxPercentage: string;
  netCost: string;

  h1PR: string;
  h2PR: string;
  prTotal: string;
  prYear2: string;

  h1CashFlow: string;
  h2CashFlow: string;
  cashFlowTotal: string;
  cashFlowYear2: string;

  remarks: string;

  proposedQty: string;
  proposedBudget: string;
  proposalRemark: string;
  contingencyFactor: string;

  vital: string;
  essential: string;
  desirable: string;

  aprNetCashflow: string;
  mayNetCashflow: string;
  junNetCashflow: string;
  julNetCashflow: string;
  augNetCashflow: string;
  sepNetCashflow: string;
  octNetCashflow: string;
  novNetCashflow: string;
  decNetCashflow: string;
  janNetCashflow: string;
  febNetCashflow: string;
  marNetCashflow: string;

  fy28H1: string;
  fy28H2: string;
  fy29H1: string;
  fy29H2: string;
  fy30H1: string;
  fy30H2: string;
  fy31H1: string;
  fy31H2: string;

  cfFy28H1: string;
  cfFy28H2: string;
  cfFy29H1: string;
  cfFy29H2: string;
  cfFy30H1: string;
  cfFy30H2: string;
  cfFy31H1: string;
  cfFy31H2: string;
};

type NonPDRowWithId = NonPDRow & {
  id: string;
};

type NonPDFieldKey = keyof NonPDRow;

const NON_PD_ROW_FIELDS: Array<{
  key: NonPDFieldKey;
  inputType: "textarea" | "number";
  placeholder: string;
}> = [
  {
    key: "itemDescription",
    inputType: "textarea",
    placeholder: "Item Description",
  },
  {
    key: "currentScenarioAndJustification",
    inputType: "textarea",
    placeholder: "Current Scenario And Justification",
  },
  {
    key: "deliverablesKPI",
    inputType: "textarea",
    placeholder: "Deliverables KPI",
  },
  {
    key: "budgetBasedOn",
    inputType: "textarea",
    placeholder: "Budget Based On",
  },
  { key: "requestFor", inputType: "textarea", placeholder: "Request For" },
  { key: "financial", inputType: "textarea", placeholder: "Financial" },
  { key: "projectOwner", inputType: "textarea", placeholder: "Project Owner" },
  { key: "capexRevenue", inputType: "textarea", placeholder: "Capex/ Revenue" },
  {
    key: "templateCategory",
    inputType: "textarea",
    placeholder: "Template Category",
  },
  { key: "projectName", inputType: "textarea", placeholder: "Project Name" },

  { key: "quantity", inputType: "number", placeholder: "Quantity" },
  {
    key: "unitOfMeasure",
    inputType: "textarea",
    placeholder: "Unit Of Measure",
  },
  { key: "unitRate", inputType: "number", placeholder: "Unit Rate" },
  { key: "currency", inputType: "textarea", placeholder: "Currency" },
  { key: "exchangeRate", inputType: "number", placeholder: "Exchange Rate" },
  { key: "basicInLacs", inputType: "number", placeholder: "Basic In Lacs" },
  {
    key: "typeOfPurchase",
    inputType: "textarea",
    placeholder: "Type of Purchase",
  },
  {
    key: "nrTaxPercentage",
    inputType: "number",
    placeholder: "NR Tax Percentage",
  },
  { key: "netCost", inputType: "number", placeholder: "Net Cost" },

  { key: "h1PR", inputType: "number", placeholder: "H1 PR" },
  { key: "h2PR", inputType: "number", placeholder: "H2 PR" },
  { key: "prTotal", inputType: "number", placeholder: "Total" },
  { key: "prYear2", inputType: "number", placeholder: "Year 2" },

  { key: "h1CashFlow", inputType: "number", placeholder: "H1 Cash Flow" },
  { key: "h2CashFlow", inputType: "number", placeholder: "H2 Cash Flow" },
  { key: "cashFlowTotal", inputType: "number", placeholder: "Total" },
  { key: "cashFlowYear2", inputType: "number", placeholder: "Year 2" },

  { key: "remarks", inputType: "textarea", placeholder: "Remarks" },

  { key: "proposedQty", inputType: "number", placeholder: "Proposed Qty" },
  {
    key: "proposedBudget",
    inputType: "number",
    placeholder: "Proposed Budget",
  },
  { key: "proposalRemark", inputType: "textarea", placeholder: "Remark" },
  {
    key: "contingencyFactor",
    inputType: "number",
    placeholder: "Contingency Factor",
  },

  { key: "vital", inputType: "number", placeholder: "Vital" },
  { key: "essential", inputType: "number", placeholder: "Essential" },
  { key: "desirable", inputType: "number", placeholder: "Desirable" },

  {
    key: "aprNetCashflow",
    inputType: "number",
    placeholder: "Apr Net Cashflow",
  },
  {
    key: "mayNetCashflow",
    inputType: "number",
    placeholder: "May Net Cashflow",
  },
  {
    key: "junNetCashflow",
    inputType: "number",
    placeholder: "Jun Net Cashflow",
  },
  {
    key: "julNetCashflow",
    inputType: "number",
    placeholder: "Jul Net Cashflow",
  },
  {
    key: "augNetCashflow",
    inputType: "number",
    placeholder: "Aug Net Cashflow",
  },
  {
    key: "sepNetCashflow",
    inputType: "number",
    placeholder: "Sep Net Cashflow",
  },
  {
    key: "octNetCashflow",
    inputType: "number",
    placeholder: "Oct Net Cashflow",
  },
  {
    key: "novNetCashflow",
    inputType: "number",
    placeholder: "Nov Net Cashflow",
  },
  {
    key: "decNetCashflow",
    inputType: "number",
    placeholder: "Dec Net Cashflow",
  },
  {
    key: "janNetCashflow",
    inputType: "number",
    placeholder: "Jan Net Cashflow",
  },
  {
    key: "febNetCashflow",
    inputType: "number",
    placeholder: "Feb Net Cashflow",
  },
  {
    key: "marNetCashflow",
    inputType: "number",
    placeholder: "Mar Net Cashflow",
  },

  { key: "fy28H1", inputType: "number", placeholder: "FY 28 H1" },
  { key: "fy28H2", inputType: "number", placeholder: "FY 28 H2" },
  { key: "fy29H1", inputType: "number", placeholder: "FY 29 H1" },
  { key: "fy29H2", inputType: "number", placeholder: "FY 29 H2" },
  { key: "fy30H1", inputType: "number", placeholder: "FY 30 H1" },
  { key: "fy30H2", inputType: "number", placeholder: "FY 30 H2" },
  { key: "fy31H1", inputType: "number", placeholder: "FY 31 H1" },
  { key: "fy31H2", inputType: "number", placeholder: "FY 31 H2" },

  // Second set of FY columns (if these represent another section such as CF)
  { key: "cfFy28H1", inputType: "number", placeholder: "FY 28 H1" },
  { key: "cfFy28H2", inputType: "number", placeholder: "FY 28 H2" },
  { key: "cfFy29H1", inputType: "number", placeholder: "FY 29 H1" },
  { key: "cfFy29H2", inputType: "number", placeholder: "FY 29 H2" },
  { key: "cfFy30H1", inputType: "number", placeholder: "FY 30 H1" },
  { key: "cfFy30H2", inputType: "number", placeholder: "FY 30 H2" },
  { key: "cfFy31H1", inputType: "number", placeholder: "FY 31 H1" },
  { key: "cfFy31H2", inputType: "number", placeholder: "FY 31 H2" },
];

const initialRowState: NonPDRow = NON_PD_ROW_FIELDS.reduce((acc, field) => {
  acc[field.key] = "";
  return acc;
}, {} as NonPDRow);

const tabs = [
  {
    label: "Master Info",
    fields: [
      "itemDescription",
      "currentScenarioAndJustification",
      "deliverablesKPI",
      "budgetBasedOn",
      "requestFor",
      "financial",
      "projectOwner",
      "capexRevenue",
      "templateCategory",
      "projectName",
    ],
    cols: "lg:grid-cols-5",
  },
  {
    label: "Costing",
    fields: [
      "quantity",
      "unitOfMeasure",
      "unitRate",
      "currency",
      "exchangeRate",
      "basicInLacs",
      "typeOfPurchase",
      "nrTaxPercentage",
      "netCost",
    ],
    cols: "lg:grid-cols-5",
  },
  {
    label: "PR Plan",
    fields: ["h1PR", "h2PR", "prTotal", "prYear2"],
    cols: "md:grid-cols-4",
  },
  {
    label: "Cash Flow",
    fields: ["h1CashFlow", "h2CashFlow", "cashFlowTotal", "cashFlowYear2"],
    cols: "md:grid-cols-4",
  },
  {
    label: "Proposal",
    fields: [
      "remarks",
      "proposedQty",
      "proposedBudget",
      "proposalRemark",
      "contingencyFactor",
      "vital",
      "essential",
      "desirable",
    ],
    cols: "md:grid-cols-4",
  },
  {
    label: "Monthly Cash Flow",
    fields: [
      "aprNetCashflow",
      "mayNetCashflow",
      "junNetCashflow",
      "julNetCashflow",
      "augNetCashflow",
      "sepNetCashflow",
      "octNetCashflow",
      "novNetCashflow",
      "decNetCashflow",
      "janNetCashflow",
      "febNetCashflow",
      "marNetCashflow",
    ],
    cols: "md:grid-cols-6",
  },
  {
    label: "Fund Flow",
    fields: [
      "fy28H1",
      "fy28H2",
      "fy29H1",
      "fy29H2",
      "fy30H1",
      "fy30H2",
      "fy31H1",
      "fy31H2",
    ],
    cols: "md:grid-cols-4",
  },
  {
    label: "C/F Fund Flow",
    fields: [
      "cfFy28H1",
      "cfFy28H2",
      "cfFy29H1",
      "cfFy29H2",
      "cfFy30H1",
      "cfFy30H2",
      "cfFy31H1",
      "cfFy31H2",
    ],
    cols: "md:grid-cols-4",
  },
];

const NonPD2 = () => {
  // const textInput = "input input-bordered input-sm w-56 min-w-80 mx-auto";

  // const numberInput =
  "input input-bordered input-sm w-24 min-w-24 text-center mx-auto";
  const rowCellClass = " align-middle";
  // const actionCellClass = "flex items-center justify-center py-2";
  // const actionButtonClass = "btn btn-sm min-w-[96px]";
  const [rows, setRows] = useState<NonPDRowWithId[]>([]);
  const [currentEntry, setCurrentEntry] = useState<NonPDRow>(initialRowState);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const getField = (key: NonPDFieldKey) =>
    NON_PD_ROW_FIELDS.find((f) => f.key === key);

  const numericFieldKeys = NON_PD_ROW_FIELDS.filter(
    (field) => field.inputType === "number",
  ).map((field) => field.key);

  const totals = rows.reduce(
    (acc, row) => {
      numericFieldKeys.forEach((key) => {
        const value = Number(row[key]);
        acc[key] += Number.isFinite(value) ? value : 0;
      });

      return acc;
    },
    numericFieldKeys.reduce(
      (acc, key) => ({ ...acc, [key]: 0 }),
      {} as Record<NonPDFieldKey, number>,
    ),
  );

  const isEditing = editingRowId !== null;

  const handleEntryChange = (key: keyof NonPDRow, value: string) => {
    setCurrentEntry((previous) => ({ ...previous, [key]: value }));
  };

  const resetEntry = () => {
    setCurrentEntry(initialRowState);
    setEditingRowId(null);
  };

  // const createRowId = () =>
  //   `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  // const handleSaveRow = () => {
  //   if (editingRowId) {
  //     setRows((previous) =>
  //       previous.map((row) =>
  //         row.id === editingRowId ? { ...row, ...currentEntry } : row,
  //       ),
  //     );
  //   } else {
  //     setRows((previous) => [
  //       ...previous,
  //       {
  //         id: createRowId(),
  //         ...currentEntry,
  //       },
  //     ]);
  //   }

  //   resetEntry();
  // };

  const handleEditRow = (id: string) => {
    const rowToEdit = rows.find((row) => row.id === id);

    if (!rowToEdit) return;

    const { id: removedId, ...rowData } = rowToEdit;

    setCurrentEntry(rowData);

    setEditingRowId(id);
  };

  const handleDeleteRow = (id: string) => {
    setRows((previous) => previous.filter((row) => row.id !== id));

    if (editingRowId === id) {
      resetEntry();
    }
  };

  // const handleCancelEdit = () => resetEntry();

  const inputStyle =
    "w-full h-8  px-3 text-xs border border-slate-200 rounded-lg outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-100";

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="flex gap-x-2">
        <NonPDHeader />

        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 shadow-sm self-stretch w-1/2">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Summary</h3>

          <div className="overflow-x-auto rounded-lg border border-base-300 bg-white">
            <table className="table w-full table-sm">
              <thead>
                <tr className="bg-base-200 ">
                  <th className="border-r border-base-300 font-medium">
                    Budget
                  </th>
                  <th className="border-r border-base-300 font-medium">Amt</th>
                  <th className="border-r border-base-300 font-medium">
                    Budget
                  </th>
                  <th className="border-r border-base-300 font-medium">Amt</th>
                  <th className="border-r border-base-300 font-medium">
                    Budget
                  </th>
                  <th className="border-r border-base-300 font-medium">Amt</th>
                </tr>
              </thead>

              <tbody>
                <tr className="hover">
                  <td className="border border-base-300 font-medium">Capex</td>
                  <td className="border border-base-300 font-semibold">
                    value
                  </td>

                  <td className="border border-base-300 font-medium">
                    Revenue
                  </td>
                  <td className="border border-base-300 font-semibold">
                    value
                  </td>

                  <td className="border border-base-300 font-medium">
                    Carry Forward
                  </td>
                  <td className="border border-base-300 font-semibold">
                    value
                  </td>
                </tr>

                <tr className="hover">
                  <td className="border border-base-300 font-medium">
                    Actual Revex
                  </td>
                  <td className="border border-base-300 font-semibold">
                    value
                  </td>

                  <td className="border border-base-300 font-medium">
                    Actual Capex
                  </td>
                  <td className="border border-base-300 font-semibold">
                    value
                  </td>

                  <td className="border border-base-300 font-medium">
                    Fund Flow
                  </td>
                  <td className="border border-base-300 font-semibold">
                    value
                  </td>
                </tr>

                <tr className="hover">
                  <td className="border border-base-300 font-medium">
                    C/F Fund Flow
                  </td>
                  <td className="border border-base-300 font-semibold">
                    value
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

        {rows.length > 0 && (
          <div className="mt-6 overflow-hidden border border-base-200 bg-base-100">
            <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between border-b border-base-200">
              <div>
                <h3 className="text-xl font-semibold text-base-content">
                  Added entries overview
                </h3>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                {rows.length} item{rows.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="overflow-x-auto px-6 pb-6 pt-4">
              <div className=" border border-base-200 bg-white">
                <table className="table w-full min-w-max text-sm border-separate border border-slate-200">
                  <thead>
                    <tr className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                      {NON_PD_ROW_FIELDS.map((field) => (
                        <th
                          key={field.key}
                          className="border border-slate-200 bg-slate-50/80 whitespace-nowrap px-3 py-2"
                        >
                          {String(field.key)
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (char) => char.toUpperCase())
                            .replace(/Fy/g, "FY")
                            .replace(/H1/g, "H1")
                            .replace(/H2/g, "H2")}
                        </th>
                      ))}
                      <th className="border border-slate-200 bg-slate-50/80 px-3 py-2 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.id}
                        className="transition-colors hover:bg-slate-50"
                      >
                        {NON_PD_ROW_FIELDS.map((field) => (
                          <td
                            key={`${row.id}-${String(field.key)}`}
                            className={`${rowCellClass} whitespace-pre border border-slate-200 px-3 py-2`}
                          >
                            {row[field.key] || "—"}
                          </td>
                        ))}

                        <td className="py-3 align-middle border border-slate-200 bg-slate-50/40">
                          <div className="flex flex-nowrap items-center justify-center gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline btn-primary min-w-22.5"
                              onClick={() => handleEditRow(row.id)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline btn-error min-w-22.5"
                              onClick={() => handleDeleteRow(row.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr className="bg-slate-100 font-semibold text-slate-700">
                      {NON_PD_ROW_FIELDS.map((field, index) => (
                        <td
                          key={`total-${String(field.key)}`}
                          className={`${rowCellClass} whitespace-pre border border-slate-200 px-3 py-2`}
                        >
                          {field.inputType === "number"
                            ? (totals[field.key] ?? 0).toLocaleString()
                            : index === 0
                              ? "Total"
                              : ""}
                        </td>
                      ))}
                      <td className="border border-slate-200 bg-slate-100 px-3 py-2" />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className=" border-slate-200 rounded-xl">
        {/* name of each tab group should be unique */}

        <div className="border border-slate-200 rounded-xl bg-gray-50 p-4 my-4">
          <div className="tabs tabs-xs roundex-xl flex flex-wrap gap-2 mb-4">
            {tabs.map((tab, index) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`tab ${activeTab === index ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className={`grid grid-cols-1 ${tabs[activeTab].cols} gap-3`}>
              {tabs[activeTab].fields.map((fieldKey) => {
                const field = getField(fieldKey as NonPDFieldKey);

                if (!field) return null;

                return (
                  <div key={field.key}>
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      {field.placeholder}
                    </label>

                    {field.inputType === "textarea" ? (
                      <textarea
                        rows={2}
                        className="textarea textarea-sm w-full rounded-lg"
                        value={currentEntry[field.key]}
                        onChange={(e) =>
                          handleEntryChange(field.key, e.target.value)
                        }
                      />
                    ) : (
                      <input
                        type="number"
                        className={inputStyle}
                        value={currentEntry[field.key]}
                        onChange={(e) =>
                          handleEntryChange(field.key, e.target.value)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-error font-semibold">
              Please fill the entries and then click on next
            </p>
          </div>
        </div>

        <div className="flex gap-x-4 place-content-left m-4 ">
          <button
            className="btn btn-sm btn-neutral"
            // onClick={prevTab}
            // disabled={activeTab === 0}
          >
            {/* <ChevronLeft /> */}
            Back
          </button>
          <button
            className="btn btn-sm btn-neutral"
            // onClick={nextTab}
            // disabled={activeTab === tabs.length - 1 || !isCurrentTabValid()}
          >
            Next
            {/* <ChevronRight /> */}
          </button>

          {/* {!isRowEmpty() && (
              <button
                className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-red-600"
                onClick={handleSave}
                disabled={isRowEmpty()}
              >
                {isEditing ? "Update Row" : "Save All Entries"}
              </button>
            )} */}

          <button
            className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-red-600"
            // onClick={handleSave}
            // disabled={isRowEmpty()}
          >
            {isEditing ? "Update Row" : "Save All Entries"}
          </button>

          <button
            className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-red-600"
            // onClick={handleSubmitForApproval}
          >
            Submit For Approval
          </button>
        </div>
      </div>
    </div>
  );
};

export default NonPD2;
