import { Sheet } from "lucide-react";
import { useEffect, useState } from "react";
import {
  GetDropdownData,
  GetProjectsDropdown,
  GetProjectById,
} from "../../service/projectmaster";
const AFCCSummary = () => {
  const departments = [
    "PD / Validation",
    "CDMM Bus",
    "CDMM Chassis",
    "CME Bus",
    "CME Chassis",
  ];

  const [financialYear, setFinancialYear] = useState("");
  const [project, setProject] = useState("");

  const [fiYears, setFiYears] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectDetails, setProjectDetails] = useState<any>(null);

  const fetchFiYears = async () => {
    try {
      const data = await GetDropdownData("4"); // Replace 6 with actual dropdown type

      setFiYears(data);
    } catch (error) {
      console.error("Error fetching financial years:", error);
    }
  };

  useEffect(() => {
    fetchFiYears();
  }, []);

  useEffect(() => {
    if (!financialYear) {
      setProjects([]);
      setProject("");
      return;
    }

    GetProjectsDropdown(financialYear).then(setProjects).catch(console.error);
  }, [financialYear]);

  useEffect(() => {
    if (!project) {
      setProjectDetails(null);
      return;
    }

    GetProjectById(project).then(setProjectDetails).catch(console.error);
  }, [project]);

  return (
    <section className="bg-base-200 min-h-screen p-4">
      {/* HEADER */}
      <div className="rounded p-4 flex items-center bg-white shadow gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-100 rounded">
            <Sheet size={20} />
          </div>
          <h1 className="font-bold text-lg">AFCC Sheet View</h1>
        </div>

        {/* Financial Year */}
        <select
          className="select select-bordered select-sm w-56"
          value={financialYear}
          onChange={(e) => {
            setFinancialYear(e.target.value);
            setProject("");
          }}
        >
          <option value="">Select Financial Year</option>

          {fiYears.map((item) => (
            <option key={item.text} value={item.text}>
              {item.text}
            </option>
          ))}
        </select>

        {/* Project */}
        <select
          className="select select-bordered select-sm w-72 max-w-4xl"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          disabled={!financialYear}
        >
          <option value="">Select Project</option>

          {projects.map((item) => (
            <option
              className="max-w-4xl"
              key={item.id || item.projectId || item.value}
              value={item.value || item.name || item.value}
            >
              {item.value} - {item.text}
            </option>
          ))}
        </select>
      </div>

      {projectDetails ? (
        <div className="bg-white shadow rounded p-4 overflow-x-auto">
          {/* AFCC SUMMARY TABLE */}
          <div className="bg-white shadow rounded p-4 overflow-x-auto">
            <table className="border-collapse w-full text-sm">
              <tbody>
                {/* Title */}
                <tr>
                  <th
                    colSpan={10}
                    className="border-2 border-black text-center font-bold text-lg py-2 bg-gray-100"
                  >
                    AFCC Summary
                  </th>
                </tr>

                {/* Project Name */}
                <tr>
                  <th
                    colSpan={10}
                    className="border-x-2 border-b-2 border-black text-center font-bold text-lg py-2"
                  >
                    {projectDetails?.projectName}
                  </th>
                </tr>

                {/* Header Row 1 */}
                <tr className="bg-[#f3ebca]">
                  <th className="border-2 border-black w-55">Cost in cr</th>

                  <th colSpan={3} className="border-2 border-black text-center">
                    Spent till FY 26
                  </th>

                  <th colSpan={4} className="border-2 border-black text-center">
                    Proposed for approval FY 27
                  </th>

                  <th className="border-2 border-black text-center">
                    FY 28 onwards
                  </th>

                  <th
                    rowSpan={2}
                    className="border-2 border-black text-center bg-[#eadfb8]"
                  >
                    Overall
                    <br />
                    Outlay
                  </th>
                </tr>

                {/* Header Row 2 */}
                <tr className="bg-[#f3ebca]">
                  <th className="border-2 border-black font-bold">
                    Department
                  </th>

                  <th className="border-2 border-black">Capex</th>
                  <th className="border-2 border-black">Revex</th>
                  <th className="border-2 border-black">Total</th>

                  <th className="border-2 border-black">C/f</th>
                  <th className="border-2 border-black">Capex</th>
                  <th className="border-2 border-black">Revex</th>
                  <th className="border-2 border-black">Total</th>

                  <th className="border-2 border-black">Total</th>
                </tr>

                {/* Department Rows */}
                {departments.map((dept, index) => (
                  <tr key={index}>
                    <td className="border border-gray-400 px-2 h-9 font-semibold">
                      {dept}
                    </td>

                    <td className="border border-gray-400"></td>
                    <td className="border border-gray-400"></td>
                    <td className="border border-gray-400"></td>

                    <td className="border border-gray-400"></td>
                    <td className="border border-gray-400"></td>
                    <td className="border border-gray-400"></td>
                    <td className="border border-gray-400"></td>

                    <td className="border border-gray-400"></td>

                    <td className="border border-gray-400 bg-[#f7f0d2]"></td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="font-bold text-lg">
                  <td className="border-2 border-black px-2">Total</td>

                  <td className="border-2 border-black text-center">0.00</td>
                  <td className="border-2 border-black text-center">0.00</td>
                  <td className="border-2 border-black text-center">0.00</td>

                  <td className="border-2 border-black text-center">0.00</td>
                  <td className="border-2 border-black text-center">0.00</td>
                  <td className="border-2 border-black text-center">0.00</td>

                  <td className="border-2 border-black text-center bg-[#f2b37d]">
                    0.00
                  </td>

                  <td className="border-2 border-black text-center">0.00</td>

                  <td className="border-2 border-black text-center">0.00</td>
                </tr>

                {/* Contingency Provision */}
                <tr>
                  <td className="border-2 border-black px-2 font-semibold">
                    Contingency provision in Capex Budget
                  </td>

                  <td colSpan={7} className="border-2 border-black"></td>

                  <td className="border-2 border-black text-center bg-[#f7f0d2] font-bold">
                    0.00
                  </td>

                  <td className="border-2 border-black bg-[#f7f0d2]"></td>
                </tr>

                {/* Total Project Cost */}
                <tr>
                  <td className="border-2 border-black px-2 font-bold text-xl">
                    Total Project Cost
                  </td>

                  <td colSpan={7} className="border-2 border-black"></td>

                  <td className="border-2 border-black text-center font-bold">
                    0.00
                  </td>

                  <td className="border-2 border-black text-center font-bold">
                    0.00
                  </td>
                </tr>
              </tbody>
            </table>

            {/* BOTTOM TABLE */}
            <div className="mt-14 w-fit">
              <table className="border-collapse text-sm min-w-135">
                <tbody>
                  <tr>
                    <th
                      colSpan={5}
                      className="border-2 border-black bg-gray-200 py-1"
                    >
                      Budget Proposed in FY 27 in cr
                    </th>
                  </tr>

                  <tr className="bg-[#f3ebca]">
                    <th className="border-2 border-black w-55">Department</th>
                    <th className="border-2 border-black">C/f FY 27</th>
                    <th className="border-2 border-black">Capex</th>
                    <th className="border-2 border-black">Revex</th>
                    <th className="border-2 border-black">Total</th>
                  </tr>

                  <tr>
                    <td className="border border-gray-400 px-2 h-9 text-center">
                      PD / Validation
                    </td>
                    <td className="border border-gray-400"></td>
                    <td className="border border-gray-400"></td>
                    <td className="border border-gray-400"></td>
                    <td className="border border-gray-400 text-center">0.00</td>
                  </tr>

                  <tr>
                    <td className="border border-gray-400 px-2 text-center">
                      CDMM Bus
                    </td>
                    <td className="border border-gray-400"></td>
                    <td className="border border-gray-400"></td>
                    <td className="border border-gray-400"></td>
                    <td className="border border-gray-400 text-center">0.00</td>
                  </tr>

                  <tr>
                    <td className="border border-gray-400 px-2 text-center">
                      CME Bus
                    </td>
                    <td className="border border-gray-400"></td>
                    <td className="border border-gray-400"></td>
                    <td className="border border-gray-400"></td>
                    <td className="border border-gray-400 text-center">0.00</td>
                  </tr>

                  <tr className="font-bold">
                    <td className="border-2 border-black text-center">Total</td>

                    <td className="border-2 border-black text-center">0.00</td>

                    <td className="border-2 border-black text-center">0.00</td>

                    <td className="border-2 border-black text-center">0.00</td>

                    <td className="border-2 border-black text-center bg-[#f2b37d]">
                      0.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded p-8 text-center text-gray-500">
          Please select a Financial Year and Project to view the AFCC Summary.
        </div>
      )}
    </section>
  );
};

export default AFCCSummary;
