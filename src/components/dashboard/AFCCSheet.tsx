import { Sheet } from "lucide-react";

const AFCCSheet = () => {
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

        <select className="select select-bordered select-sm w-56">
          <option>Select Financial Year</option>
        </select>

        <select className="select select-bordered select-sm w-56">
          <option>Select Project</option>
        </select>
      </div>

      {/* AFCC SHEET */}
      <div className=" overflow-x-auto p-2 bg-white rounded shadow">
        {/* Top Banner */}
        <div className="grid grid-cols-12 border border-black bg-[#eac892] text-sm font-semibold">
          <div className="col-span-7 p-2 border-r border-black">
            Project Name -
          </div>

          <div className="col-span-5">
            <div className="grid grid-cols-2">
              <div className="p-2 border-r border-black">
                Project Outlay Cr.
              </div>
              <div className="p-2">Ask for FY 27 Cr.</div>
            </div>
          </div>
        </div>

        {/* Owner / Category */}
        <div className="grid grid-cols-12 border border-black text-sm font-semibold">
          <div className="col-span-7 p-2 border-r border-black">
            New &nbsp;&nbsp; Owner :
          </div>

          <div className="col-span-5 p-2 text-center">
            Category: New Development
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12">
          {/* LEFT SECTION */}
          <div className="col-span-7 border-r border-black">
            {/* Objective */}
            <div className="border border-black">
              <div className="font-bold p-2">1. Objective :</div>

              <div className="h-44 p-2">
                <textarea
                  className="textarea textarea-bordered w-full h-full bg-white"
                  placeholder="Enter Objective"
                />
              </div>
            </div>

            {/* Scope */}
            <div className="border border-black mt-4">
              <div className="font-bold p-2">2. Brief / Scope :</div>

              <div className="h-72 p-2">
                <textarea
                  className="textarea textarea-bordered w-full h-full bg-white"
                  placeholder="Enter Scope Details"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="col-span-5">
            {/* PROJECT COST */}
            <div>
              <div className="bg-red-600 text-white font-bold px-2 py-1 border border-black">
                3. Project Cost
              </div>

              <table className="table table-xs w-full">
                <tbody>
                  <tr>
                    <td className="border">Capital SML</td>
                    <td className="border"></td>
                    <td className="border">Location</td>
                    <td className="border"></td>
                  </tr>

                  <tr>
                    <td className="border">Revenue SML</td>
                    <td className="border"></td>
                    <td className="border">IRR / Pay Back</td>
                    <td className="border"></td>
                  </tr>

                  <tr>
                    <td className="border">Carry Forward</td>
                    <td className="border"></td>
                    <td className="border">SOP</td>
                    <td className="border"></td>
                  </tr>

                  <tr>
                    <td className="border">Spent till March</td>
                    <td className="border"></td>
                    <td className="border">Material Cost</td>
                    <td className="border"></td>
                  </tr>

                  <tr>
                    <td className="border">Contingency</td>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border"></td>
                  </tr>

                  <tr>
                    <td className="border font-semibold">Project Cost</td>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* BUDGETED */}
            <div className="mt-4">
              <div className="bg-red-600 text-white font-bold px-2 py-1">
                4. Budgeted
              </div>

              <table className="table table-xs w-full">
                <thead>
                  <tr>
                    <th className="border">FY29</th>
                    <th className="border">FY30</th>
                    <th className="border">FY31</th>
                    <th className="border">FY32</th>
                    <th className="border">FY33</th>
                    <th className="border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border text-center font-bold">0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CAPEX BREAKUP */}
            <div className="mt-4">
              <div className="font-bold border px-2 py-1 bg-white">
                5. Capex Breakup
              </div>

              <table className="table table-xs w-full">
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th>S</th>
                    <th>Details</th>
                    <th>Total</th>
                    <th>FY27</th>
                    <th>FY28</th>
                    <th>FY29</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="border">1</td>
                    <td className="border">PD</td>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border"></td>
                  </tr>

                  <tr>
                    <td className="border">2</td>
                    <td className="border">CDM</td>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border"></td>
                  </tr>

                  <tr>
                    <td className="border">3</td>
                    <td className="border">CME Bus</td>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border"></td>
                  </tr>

                  <tr>
                    <td colSpan={2} className="border font-bold">
                      Total
                    </td>
                    <td className="border">0.00</td>
                    <td className="border">0.00</td>
                    <td className="border">0.00</td>
                    <td className="border">0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* REVENUE BREAKUP */}
            <div className="mt-4">
              <div className="font-bold border px-2 py-1 bg-white">
                6. Revenue Breakup
              </div>

              <table className="table table-xs w-full">
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th>S</th>
                    <th>Details</th>
                    <th>Total</th>
                    <th>FY27</th>
                    <th>FY28</th>
                    <th>FY29</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="border">1</td>
                    <td className="border">PD</td>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border"></td>
                  </tr>

                  <tr>
                    <td colSpan={2} className="border font-bold">
                      Total
                    </td>
                    <td className="border">0.00</td>
                    <td className="border">0.00</td>
                    <td className="border">0.00</td>
                    <td className="border">0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AFCCSheet;
