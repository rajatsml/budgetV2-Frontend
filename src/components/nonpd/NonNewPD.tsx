import React from "react";

const inputStyle =
  "w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-100";

interface Field {
  label: string;
  type?: "text" | "number" | "textarea";
}

const projectFields: Field[] = [
  { label: "ID" },
  { label: "Project Name" },
  { label: "Division" },
  { label: "Category" },
  { label: "Group" },
  { label: "Location" },
  { label: "Project Unit" },
  { label: "Project Owner" },
];

const financialFields: Field[] = [
  { label: "Budget Based On" },
  { label: "Request For" },
  { label: "Financial" },
  { label: "Capex / Revenue" },
  { label: "Quantity", type: "number" },
  { label: "Unit Of Measure" },
  { label: "Unit Rate", type: "number" },
  { label: "Currency" },
  { label: "Exchange Rate", type: "number" },
  { label: "Basic In Lacs", type: "number" },
  { label: "NR Tax %", type: "number" },
  { label: "Net Cost", type: "number" },
];

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
  "H1 1st Yr",
  "H2 1st Yr",
  "Total",
  "H1 2nd Yr",
  "H2 2nd Yr",
  "H1 3rd Yr",
  "H2 3rd Yr",
  "H1 4th Yr",
  "H2 4th Yr",
  "H1 5th Yr",
  "H2 5th Yr",
];

const NonNewPD: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-[1800px] rounded-2xl bg-white p-8 shadow-sm">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800">
            Project Details (Non PD)
          </h2>

          <p className="mt-1 text-slate-500">
            Project Planning & Financial Estimation
          </p>
        </div>

        {/* PROJECT OVERVIEW */}
        <div className="rounded-xl border border-slate-200 p-5">
          <h3 className="mb-4 font-semibold text-slate-800">
            Project Overview
          </h3>

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {projectFields.map((field) => (
              <div key={field.label}>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {field.label}
                </label>

                <input
                  className={inputStyle}
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* DESCRIPTION + KPI */}
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-5 xl:col-span-2">
            <h3 className="mb-3 font-semibold text-slate-800">
              Business Justification
            </h3>

            <textarea
              rows={6}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              placeholder="Describe the current scenario, business need and project justification..."
            />
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="mb-3 font-semibold text-slate-800">
              Deliverables KPI
            </h3>

            <textarea
              rows={6}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              placeholder="Enter expected deliverables, KPIs and success criteria..."
            />
          </div>
        </div>

        {/* FINANCIAL DETAILS */}
        <div className="mt-5 rounded-xl border border-slate-200 p-5">
          <h3 className="mb-4 font-semibold text-slate-800">
            Financial Details
          </h3>

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
            {financialFields.map((field) => (
              <div key={field.label}>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {field.label}
                </label>

                <input
                  type={field.type || "text"}
                  className={inputStyle}
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
            <input className={inputStyle} placeholder="Enter Proposed Qty" />

            <input className={inputStyle} placeholder="Enter Proposed Budget" />

            <input
              className={inputStyle}
              placeholder="Enter Contingency Factor"
            />

            <input
              className={inputStyle}
              placeholder="Select Type Of Purchase"
            />
          </div>

          <div className="mt-5 flex gap-8">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" />
              Vital
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" />
              Essential
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" />
              Desirable
            </label>
          </div>
        </div>

        {/* PR / COMMITMENT */}
        <div className="mt-5 rounded-xl border border-slate-200 p-5">
          <h3 className="mb-4 font-semibold text-slate-800">PR / Commitment</h3>

          <div className="overflow-x-auto">
            <table className="min-w-xl w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-3 text-left">Metric</th>

                  <th className="p-3">1st Yr</th>
                  <th className="p-3">2nd Yr</th>
                  <th className="p-3">3rd Yr</th>
                  <th className="p-3">4th Yr</th>
                  <th className="p-3">5th Yr</th>
                </tr>
              </thead>

              <tbody>
                {["H1 PR", "H2 PR", "Total"].map((metric) => (
                  <tr key={metric}>
                    <td className="p-2 font-medium text-slate-700">{metric}</td>

                    {[1, 2, 3, 4, 5].map((item) => (
                      <td key={item} className="p-2">
                        <input
                          type="number"
                          className={inputStyle}
                          placeholder="0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CASH FLOW */}
        <div className="mt-5 rounded-xl border border-slate-200 p-5">
          <h3 className="mb-4 font-semibold text-slate-800">
            Cash Flow Planning
          </h3>

          <div className="overflow-x-auto scrollbar-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  {months.map((month) => (
                    <th
                      key={month}
                      className="bg-slate-100 p-3 text-sm font-medium text-slate-700"
                    >
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr>
                  {months.map((month) => (
                    <td key={month} className="min-w-30 p-2">
                      <input
                        type="number"
                        className={inputStyle}
                        placeholder="0"
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* REMARKS */}
        <div className="mt-5 rounded-xl border border-slate-200 p-5">
          <h3 className="mb-3 font-semibold text-slate-800">Remarks</h3>

          <textarea
            rows={4}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            placeholder="Enter additional comments, assumptions or remarks..."
          />
        </div>

        {/* FOOTER */}
        <div className="mt-8 flex justify-end gap-3">
          <button className="rounded-lg bg-slate-100 px-6 py-3 font-medium text-slate-700 hover:bg-slate-200">
            Cancel
          </button>

          <button className="rounded-lg bg-rose-600 px-6 py-3 font-medium text-white hover:bg-rose-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NonNewPD;
