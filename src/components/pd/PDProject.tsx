import { PlusSquare } from "lucide-react";
import { useState } from "react";
import MasterInfoPD from "./MasterInfoPD";

type PDRow = {
  pdInfo: string;
  pdAmt: string;
  revenueInfo: string;
  revenueAmt: string;
  capexRemarks: string;
  capexTotalPR: string;
  capexH1Fy27: string;
  capexH2Fy27: string;
  capexFy28: string;
  capexFy29: string;
  revexRemarks: string;
  revexTotalPR: string;
  revexH1Fy27: string;
  revexH2Fy27: string;
  revexFy28: string;
  revexFy29: string;
  carryForward: string;
  actualCapex: string;
  actualRevex: string;
  fundFlow27Total: string;
  fundFlow27H1: string;
  fundFlow27H2: string;
  fundFlow27CapH1: string;
  fundFlow27CapH2: string;
  fundFlow27RevH1: string;
  fundFlow27RevH2: string;
  fundFlow28: string;
  fundFlow29: string;
  fundFlow30: string;
  fundFlow31: string;
  cfFundFlow27Total: string;
  cfFundFlow27H1: string;
  cfFundFlow27H2: string;
  cfFundFlow27CapH1: string;
  cfFundFlow27CapH2: string;
  cfFundFlow27RevH1: string;
  cfFundFlow27RevH2: string;
};

type PDRowWithId = PDRow & { id: string };

const PD_ROW_FIELDS: Array<{
  key: keyof PDRow;
  inputType: "textarea" | "number";
  placeholder: string;
}> = [
  { key: "pdInfo", inputType: "textarea", placeholder: "PD-001" },
  { key: "pdAmt", inputType: "number", placeholder: "120" },
  { key: "revenueInfo", inputType: "textarea", placeholder: "Revenue-A" },
  { key: "revenueAmt", inputType: "number", placeholder: "45" },
  {
    key: "capexRemarks",
    inputType: "textarea",
    placeholder: "Network Upgrade",
  },
  { key: "capexTotalPR", inputType: "number", placeholder: "80" },
  { key: "capexH1Fy27", inputType: "number", placeholder: "20" },
  { key: "capexH2Fy27", inputType: "number", placeholder: "25" },
  { key: "capexFy28", inputType: "number", placeholder: "20" },
  { key: "capexFy29", inputType: "number", placeholder: "15" },
  {
    key: "revexRemarks",
    inputType: "textarea",
    placeholder: "Operations Cost",
  },
  { key: "revexTotalPR", inputType: "number", placeholder: "35" },
  { key: "revexH1Fy27", inputType: "number", placeholder: "10" },
  { key: "revexH2Fy27", inputType: "number", placeholder: "8" },
  { key: "revexFy28", inputType: "number", placeholder: "9" },
  { key: "revexFy29", inputType: "number", placeholder: "8" },
  { key: "carryForward", inputType: "number", placeholder: "12" },
  { key: "actualCapex", inputType: "number", placeholder: "55" },
  { key: "actualRevex", inputType: "number", placeholder: "18" },
  { key: "fundFlow27Total", inputType: "number", placeholder: "73" },
  { key: "fundFlow27H1", inputType: "number", placeholder: "35" },
  { key: "fundFlow27H2", inputType: "number", placeholder: "38" },
  { key: "fundFlow27CapH1", inputType: "number", placeholder: "20" },
  { key: "fundFlow27CapH2", inputType: "number", placeholder: "18" },
  { key: "fundFlow27RevH1", inputType: "number", placeholder: "15" },
  { key: "fundFlow27RevH2", inputType: "number", placeholder: "23" },
  { key: "fundFlow28", inputType: "number", placeholder: "40" },
  { key: "fundFlow29", inputType: "number", placeholder: "32" },
  { key: "fundFlow30", inputType: "number", placeholder: "20" },
  { key: "fundFlow31", inputType: "number", placeholder: "15" },
  { key: "cfFundFlow27Total", inputType: "number", placeholder: "107" },
  { key: "cfFundFlow27H1", inputType: "number", placeholder: "50" },
  { key: "cfFundFlow27H2", inputType: "number", placeholder: "57" },
  { key: "cfFundFlow27CapH1", inputType: "number", placeholder: "30" },
  { key: "cfFundFlow27CapH2", inputType: "number", placeholder: "20" },
  { key: "cfFundFlow27RevH1", inputType: "number", placeholder: "25" },
  { key: "cfFundFlow27RevH2", inputType: "number", placeholder: "32" },
];

const initialRowState: PDRow = PD_ROW_FIELDS.reduce(
  (acc, field) => ({ ...acc, [field.key]: "" }),
  {} as PDRow,
);

const PDProject = () => {
  const textInput = "input input-bordered input-sm w-56 min-w-80 mx-auto";

  const numberInput =
    "input input-bordered input-sm w-24 min-w-24 text-center mx-auto";
  const rowCellClass = " align-middle";
  const actionCellClass = "flex items-center justify-center py-2";
  const actionButtonClass = "btn btn-sm min-w-[96px]";
  const [rows, setRows] = useState<PDRowWithId[]>([]);
  const [currentEntry, setCurrentEntry] = useState<PDRow>(initialRowState);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const numericFieldKeys = PD_ROW_FIELDS.filter(
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
      {} as Record<keyof PDRow, number>,
    ),
  );

  const isEditing = editingRowId !== null;

  const handleEntryChange = (key: keyof PDRow, value: string) => {
    setCurrentEntry((previous) => ({ ...previous, [key]: value }));
  };

  const resetEntry = () => {
    setCurrentEntry(initialRowState);
    setEditingRowId(null);
  };

  const createRowId = () =>
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const handleSaveRow = () => {
    if (isEditing) {
      setRows((previous) =>
        previous.map((row) =>
          row.id === editingRowId ? { ...row, ...currentEntry } : row,
        ),
      );
    } else {
      setRows((previous) => [
        ...previous,
        { id: createRowId(), ...currentEntry },
      ]);
    }

    resetEntry();
  };

  const handleEditRow = (id: string) => {
    const rowToEdit = rows.find((row) => row.id === id);
    if (!rowToEdit) return;
    setCurrentEntry(rowToEdit);
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
    <>
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-[1700px] bg-white rounded-2xl shadow-sm p-8">
          <MasterInfoPD />

          <div className="overflow-x-auto mt-6">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="text-center text-white">
                  <th colSpan={2} className="bg-slate-600">
                    PD Cap
                  </th>

                  <th colSpan={2} className="bg-blue-600">
                    Revenue
                  </th>

                  <th colSpan={6} className="bg-emerald-600">
                    Capex Bifurcation (CR.)
                  </th>

                  <th colSpan={6} className="bg-amber-600">
                    Revex Bifurcation (CR.)
                  </th>

                  <th className="bg-violet-600">Carry Forward</th>

                  <th colSpan={2} className="bg-rose-600">
                    Actual Spent
                  </th>

                  <th colSpan={7} className="bg-cyan-700">
                    Fund Flow 27
                  </th>

                  <th className="bg-cyan-600">Fund Flow 28</th>
                  <th className="bg-cyan-500">Fund Flow 29</th>
                  <th className="bg-cyan-400 text-slate-900">Fund Flow 30</th>
                  <th className="bg-cyan-300 text-slate-900">Fund Flow 31</th>

                  <th colSpan={7} className="bg-indigo-700">
                    C/F Fund Flow 27
                  </th>
                  <th className="bg-sky-600">Action</th>
                </tr>

                <tr className="text-center text-sm">
                  {/* PD Cap */}
                  <th className="bg-slate-100">Info</th>
                  <th className="bg-slate-100">Amt</th>

                  {/* Revenue */}
                  <th className="bg-blue-50">Info</th>
                  <th className="bg-blue-50">Amt</th>

                  {/* Capex */}
                  <th className="bg-emerald-50">Remarks</th>
                  <th className="bg-emerald-50">Total PR</th>
                  <th className="bg-emerald-50">H1 Fy 27</th>
                  <th className="bg-emerald-50">H2 Fy 27</th>
                  <th className="bg-emerald-50">Fy 28</th>
                  <th className="bg-emerald-50">Fy 29</th>

                  {/* Revex */}
                  <th className="bg-amber-50">Remarks</th>
                  <th className="bg-amber-50">Total PR</th>
                  <th className="bg-amber-50">H1 Fy 27</th>
                  <th className="bg-amber-50">H2 Fy 27</th>
                  <th className="bg-amber-50">Fy 28</th>
                  <th className="bg-amber-50">Fy 29</th>

                  {/* CF */}
                  <th className="bg-violet-50">Carry Forward</th>

                  {/* Actual */}
                  <th className="bg-rose-50">Capex</th>
                  <th className="bg-rose-50">Revex</th>

                  {/* FF27 */}
                  <th className="bg-cyan-50">Total</th>
                  <th className="bg-cyan-50">H1</th>
                  <th className="bg-cyan-50">H2</th>
                  <th className="bg-cyan-50">Cap H1</th>
                  <th className="bg-cyan-50">Cap H2</th>
                  <th className="bg-cyan-50">Rev H1</th>
                  <th className="bg-cyan-50">Rev H2</th>

                  {/* FF28-31 */}
                  <th className="bg-cyan-100">Fund Flow 28</th>
                  <th className="bg-cyan-100">Fund Flow 29</th>
                  <th className="bg-cyan-100">Fund Flow 30</th>
                  <th className="bg-cyan-100">Fund Flow 31</th>

                  {/* C/F FF27 */}
                  <th className="bg-indigo-50">Total</th>
                  <th className="bg-indigo-50">H1</th>
                  <th className="bg-indigo-50">H2</th>
                  <th className="bg-indigo-50">Cap H1</th>
                  <th className="bg-indigo-50">Cap H2</th>
                  <th className="bg-indigo-50">Rev H1</th>
                  <th className="bg-indigo-50">Rev H2</th>
                  <th className="bg-indigo-50">Action</th>
                </tr>
              </thead>

              <tbody>
                <tr className="bg-slate-50">
                  {PD_ROW_FIELDS.map((field) => {
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
                        className={`${actionButtonClass} ${
                          isEditing ? "btn-primary" : "btn-success"
                        }`}
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
                        {PD_ROW_FIELDS.map((field) => (
                          <th
                            key={field.key}
                            className="border border-slate-200 bg-slate-50/80 whitespace-nowrap px-3 py-2"
                          >
                            {field.key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (char) => char.toUpperCase())
                              .replace("Fy", "FY")
                              .replace("H1", "H1")
                              .replace("H2", "H2")}
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
                          {PD_ROW_FIELDS.map((field) => (
                            <td
                              key={`${row.id}-${field.key}`}
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
                        {PD_ROW_FIELDS.map((field) => (
                          <td
                            key={`total-${field.key}`}
                            className={`${rowCellClass} whitespace-pre border border-slate-200 px-3 py-2`}
                          >
                            {field.inputType === "number"
                              ? totals[field.key].toLocaleString()
                              : field.key === "pdInfo"
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
    </>
  );
};

export default PDProject;
