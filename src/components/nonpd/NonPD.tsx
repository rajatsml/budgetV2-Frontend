const NonPD = () => {
  const sections = {
    "General Information": [
      "ID",
      "Division",
      "Category",
      "Group",
      "Location",
      "Project Unit",
      "Item Description",
      "Current Scenario And Justification",
      "Deliverables KPI",
      "Budget Based On",
      "Request For",
      "Financial",
      "Project Owner",
      "Capex/ Revenue",
      "Template Category",
      "ProjectName",
      "Quantity",
      "Unit Of Measure",
      "Unit Rate",
      "Currency",
      "Exchange rate",
      "Basic In Lacs",
      "Type of Purchase",
      "NR Tax Percentage",
      "NetCost",
      "Remarks",
      "Proposed qty",
      "Proposed Budget",
      "Remark",
      "Contingency Factor",
      "Vital",
      "Essential",
      "Desirable",
    ],

    "PR / Commitment": [
      "H1 PR",
      "H2 PR",
      "Total",
      "Year 2",
      "FY 28 H1 PR/Commitment",
      "FY 28 H2 PR/Commitment",
      "FY 29 H1 PR/Commitment",
      "FY 29 H2 PR/Commitment",
      "FY 30 H1 PR/Commitment",
      "FY 30 H2 PR/Commitment",
      "FY 31 H1 PR/Commitment",
      "FY 31 H2 PR/Commitment",
    ],

    "Cash Flow": [
      "Apr Net Cashflow",
      "May Net Cashflow",
      "Jun Net Cashflow",
      "Jul Net Cashflow",
      "Aug Net Cashflow",
      "Sep Net Cashflow",
      "Oct Net Cashflow",
      "Nov Net Cashflow",
      "Dec Net Cashflow",
      "Jan Net Cashflow",
      "Feb Net Cashflow",
      "Mar Net Cashflow",
      "H1 Cash Flow",
      "H2 Cash Flow",
      "FY 28 H1 Cash Flow",
      "FY 28 H2 Cash Flow",
      "FY 29 H1 Cash Flow",
      "FY 29 H2 Cash Flow",
      "FY 30 H1 Cash Flow",
      "FY 30 H2 Cash Flow",
      "FY 31 H1 Cash Flow",
      "FY 31 H2 Cash Flow",
    ],
  };

  return (
    <div className="p-6 bg-white">
      <h2 className="text-xl font-semibold mb-1">Project Type - Non PD</h2>

      <p className="text-sm text-gray-500 mb-6">
        Please provide the required details
      </p>

      {Object.entries(sections).map(([sectionName, fields]) => (
        <div
          key={sectionName}
          className="mb-8 border border-gray-300 p-4 rounded-md"
        >
          <h3 className="text-lg font-semibold text-red-600 mb-4">
            {sectionName}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {fields.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field}
                </label>

                <input
                  type="text"
                  placeholder={`Enter ${field}`}
                  className="w-full h-9 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end mt-8">
        <button className="px-8 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold">
          Post
        </button>
      </div>
    </div>
  );
};

export default NonPD;
