const years = ["1st Yr", "2nd Yr", "3rd Yr", "4th Yr", "5th Yr"];

const rows = ["Capex", "DRE", "H1", "H2"];

const inputStyle =
  "w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-100";

const NewPD = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-[1700px] bg-white rounded-2xl shadow-sm p-8">
        {/* Header */}

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800">
            Project Details (PD)
          </h2>

          <p className="mt-2 text-slate-500">
            Enter project information and yearly projections.
          </p>
        </div>

        {/* Project Information */}

        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="mb-5 text-lg font-semibold text-slate-800">
            Project Information
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                S.No
              </label>

              <input defaultValue="1" className={inputStyle} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Project Name
              </label>

              <input placeholder="Project Name" className={inputStyle} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Department Name
              </label>

              <input placeholder="Department Name" className={inputStyle} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Department ID
              </label>

              <input placeholder="Department ID" className={inputStyle} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>

              <select className={inputStyle}>
                <option>Select Category</option>
                <option>Capex</option>
                <option>Opex</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                FY Year
              </label>

              <input placeholder="FY Year" className={inputStyle} />
            </div>
          </div>
        </div>

        {/* Financial Projection */}

        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              Financial Projections
            </h3>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              PR / PF Planning
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-300 w-full border-separate border-spacing-y-3">
              <thead>
                {/* Year Header */}

                <tr>
                  <th className="w-40"></th>

                  {years.map((year) => (
                    <th key={year} colSpan={2} className="px-1">
                      <div className="rounded-xl bg-slate-100 py-3 text-center font-semibold text-slate-700">
                        {year}
                      </div>
                    </th>
                  ))}
                </tr>

                {/* PR PF Header */}

                <tr>
                  <th></th>

                  {years.flatMap((year) => [
                    <th
                      key={`${year}-pr`}
                      className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      PR
                    </th>,

                    <th
                      key={`${year}-pf`}
                      className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      PF
                    </th>,
                  ])}
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row}>
                    <td className="sticky left-0 bg-white pr-4 text-sm font-semibold text-slate-700">
                      {row}
                    </td>

                    {years.flatMap((year) => [
                      <td key={`${row}-${year}-pr`} className="px-1">
                        <input
                          type="number"
                          className={inputStyle}
                          placeholder="0"
                        />
                      </td>,

                      <td key={`${row}-${year}-pf`} className="px-1">
                        <input
                          type="number"
                          className={inputStyle}
                          placeholder="0"
                        />
                      </td>,
                    ])}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Remarks */}

        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Remarks</h3>

          <textarea
            rows={4}
            placeholder="Enter remarks..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        {/* Footer */}

        <div className="mt-10 flex justify-end gap-3">
          <button className="rounded-lg bg-slate-100 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-200">
            Cancel
          </button>

          <button className="rounded-lg bg-rose-600 px-6 py-3 font-medium text-white transition hover:bg-rose-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPD;
