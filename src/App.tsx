import { useState } from "react";

function App() {
  const [projectType, setProjectType] = useState("PD");

  const fiscalYears = ["FY27", "FY28", "FY29", "FY30", "FY31"];
  const rows = ["Capex", "DRE", "H1", "H2"];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100 bg-red-600 p-4">
          Budget Portal V2
        </h1>
      </header>

      <div className="mx-auto rounded-lg bg-white p-8 shadow">
        {/* Project Type */}
        <div className="mb-8">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Type of Project
          </label>

          <div className="flex gap-4">
            {["PD", "Non PD", "IT"].map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="projectType"
                  value={type}
                  checked={projectType === type}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Budget Table */}

        <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow">
          {["1", "2", "3", "4", "5"].map((tableIndex) => (
            <div className="py-4">
              <h5 className="mb-4 border-l-4 border-red-600 pl-3 text-lg font-semibold text-gray-800">
                Department {tableIndex}
              </h5>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th
                      rowSpan={2}
                      className="border border-gray-300 bg-gray-100 px-4 py-2"
                    >
                      Category
                    </th>

                    {fiscalYears.map((year) => (
                      <th
                        key={year}
                        colSpan={2}
                        className="border border-gray-300 bg-gray-100 px-4 py-2 text-center"
                      >
                        {year}
                      </th>
                    ))}
                  </tr>

                  <tr>
                    {fiscalYears.map((year) => (
                      <>
                        <th
                          key={`${year}-pr`}
                          className="border border-gray-300 bg-gray-50 px-3 py-2"
                        >
                          PR
                        </th>
                        <th
                          key={`${year}-pf`}
                          className="border border-gray-300 bg-gray-50 px-3 py-2"
                        >
                          PF
                        </th>
                      </>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr key={row}>
                      <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-50">
                        {row}
                      </td>

                      {fiscalYears.map((year) => (
                        <>
                          <td
                            key={`${row}-${year}-pr`}
                            className="border border-gray-300 p-1"
                          >
                            <input
                              type="number"
                              className="w-full rounded border border-gray-200 px-2 py-1 focus:border-blue-500 focus:outline-none"
                            />
                          </td>

                          <td
                            key={`${row}-${year}-pf`}
                            className="border border-gray-300 p-1"
                          >
                            <input
                              type="number"
                              className="w-full rounded border border-gray-200 px-2 py-1 focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                        </>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="mx-4 mt-4 rounded-lg bg-red-600 px-6 py-1 font-semibold text-white shadow-md transition-all hover:bg-red-650 hover:shadow-lg active:scale-95">
                Submit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
