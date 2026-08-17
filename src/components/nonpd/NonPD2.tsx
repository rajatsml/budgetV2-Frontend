import { useState } from "react";
import { PlusSquare, Pencil, Trash2 } from "lucide-react";
import MasterInfoNonPD from "./MasterInfoNonPD";

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

const NonPD2 = () => {
  const textInput = "input input-bordered input-sm w-56 min-w-80 mx-auto";

  const numberInput =
    "input input-bordered input-sm w-24 min-w-24 text-center mx-auto";
  const rowCellClass = " align-middle";
  const actionCellClass = "flex items-center justify-center py-2";
  const actionButtonClass = "btn btn-sm min-w-[96px]";
  const [rows, setRows] = useState<NonPDRowWithId[]>([]);
  const [currentEntry, setCurrentEntry] = useState<NonPDRow>(initialRowState);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

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

  const createRowId = () =>
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const handleSaveRow = () => {
    if (editingRowId) {
      setRows((previous) =>
        previous.map((row) =>
          row.id === editingRowId ? { ...row, ...currentEntry } : row,
        ),
      );
    } else {
      setRows((previous) => [
        ...previous,
        {
          id: createRowId(),
          ...currentEntry,
        },
      ]);
    }

    resetEntry();
  };

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

  const handleCancelEdit = () => resetEntry();

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-[1700px] bg-white rounded-2xl shadow-sm p-8">
        <MasterInfoNonPD />

        <div className="overflow-x-auto mt-6">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-center text-white">
                <th className="bg-slate-600">Item Desc</th>

                <th className="bg-blue-600">
                  Current Scenario and Justification
                </th>

                <th className="bg-emerald-600">Deliverables KPIs</th>

                <th className="bg-amber-600">Budget Based on</th>

                <th className="bg-violet-600">Request For</th>

                <th className="bg-rose-600">Financial</th>

                <th className="bg-cyan-700">Project Owner</th>

                <th className="bg-cyan-600">Capex/Revex</th>
                <th className="bg-cyan-500">Template Category</th>
                <th className="bg-cyan-400 text-slate-900">Project Name</th>
                <th className="bg-cyan-300 text-slate-900">Qnty</th>

                <th className="bg-indigo-700">Unit of Measure</th>
                <th className="bg-sky-600">Unit Rate</th>
                <th className="bg-sky-600">Currency</th>
                <th className="bg-sky-600">Exchange Rate</th>
                <th className="bg-sky-600">Basic in Lacs</th>
                <th className="bg-sky-600">Type of Purchase</th>
                <th className="bg-sky-600">NR Tax Percentage</th>
                <th className="bg-sky-600">Net Cost</th>
                <th className="bg-sky-600">H1 PR</th>
                <th className="bg-sky-600">H2 PR</th>
                <th className="bg-sky-600">Total</th>
                <th className="bg-sky-600">Year 2</th>
                <th className="bg-sky-600">H1 Cash Flow</th>
                <th className="bg-sky-600">H2 Cash Flow</th>
                <th className="bg-sky-600">Total</th>
                <th className="bg-sky-600">Year 2</th>
                <th className="bg-sky-600">Remarks</th>
                <th className="bg-sky-600">Proposed Qty</th>
                <th className="bg-sky-600">Proposed Budget</th>
                <th className="bg-sky-600">Remarks</th>
                <th className="bg-sky-600">Contigency Factor</th>
                <th className="bg-sky-600">Vital</th>
                <th className="bg-sky-600">Essential</th>
                <th className="bg-sky-600">Desirable</th>
                <th className="bg-sky-600">Apr Net Cashflow</th>
                <th className="bg-sky-600">May Net Cashflow</th>
                <th className="bg-sky-600">Jun Net Cashflow</th>
                <th className="bg-sky-600">Jul Net Cashflow</th>
                <th className="bg-sky-600">Aug Net Cashflow</th>
                <th className="bg-sky-600">Sep Net Cashflow</th>
                <th className="bg-sky-600">Oct Net Cashflow</th>
                <th className="bg-sky-600">Nov Cashflow</th>
                <th className="bg-sky-600">Dec Cashflow</th>
                <th className="bg-sky-600">Jan Cashflow</th>
                <th className="bg-sky-600">Feb Cashflow</th>
                <th className="bg-sky-600">Mar Cashflow</th>
                <th className="bg-sky-600">FY 28 H1</th>
                <th className="bg-sky-600">FY 28 H2</th>
                <th className="bg-sky-600">FY 29 H1</th>
                <th className="bg-sky-600">FY 29 H2</th>
                <th className="bg-sky-600">FY 30 H1</th>
                <th className="bg-sky-600">FY 30 H2</th>
                <th className="bg-sky-600">FY 31 H1</th>
                <th className="bg-sky-600">FY 31 H2</th>
                <th className="bg-green-600">FY 28 H1</th>
                <th className="bg-green-600">FY 28 H2</th>
                <th className="bg-green-600">FY 29 H1</th>
                <th className="bg-green-600">FY 29 H2</th>
                <th className="bg-green-600">FY 30 H1</th>
                <th className="bg-green-600">FY 30 H2</th>
                <th className="bg-green-600">FY 31 H1</th>
                <th className="bg-green-600">FY 31 H2</th>
                <th className="bg-slate-700">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr className="bg-slate-50">
                {NON_PD_ROW_FIELDS.map((field) => {
                  const value = currentEntry[field.key];
                  return (
                    <td key={field.key} className={rowCellClass}>
                      {field.inputType === "textarea" ? (
                        <textarea
                          className={textInput}
                          value={value}
                          placeholder={field.placeholder}
                          onChange={(event) =>
                            handleEntryChange(field.key, event.target.value)
                          }
                        />
                      ) : (
                        <input
                          type="number"
                          className={numberInput}
                          value={value}
                          placeholder={field.placeholder}
                          onChange={(event) =>
                            handleEntryChange(field.key, event.target.value)
                          }
                        />
                      )}
                    </td>
                  );
                })}

                <td className={actionCellClass}>
                  <div className="flex flex-nowrap items-center justify-center gap-2">
                    <button
                      type="button"
                      className={`${actionButtonClass} ${isEditing ? "btn-primary" : "btn-success"}`}
                      onClick={handleSaveRow}
                    >
                      <PlusSquare size={16} />
                      {isEditing ? "Update" : "Add"}
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        className={`${actionButtonClass} btn-ghost text-base-content/70`}
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
    </div>
  );
};

export default NonPD2;
