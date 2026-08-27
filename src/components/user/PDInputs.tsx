import { useState, useEffect } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import PDHeaderNew from "./PDHeaderNew";

const PDInputs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const canEdit = true;

  //   const { user } = useUserStore();

  useEffect(() => {}, []);

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

  const tabs = [
    "Commitments",
    "CashFlow",
    "Carry Forward",
    "Fund Flow",
    "C/F Fund Flow",
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Project Info / Summary */}
      <div className="flex gap-x-2">
        <PDHeaderNew
          projectID="P001"
          projectName="Sample Project"
          deptName="Engineering"
          deptID={4}
          category="Capex"
          fyYear="FY27"
          pendingWith="Manager"
          status="OPENED"
          projectType="ONGOING"
        />
        <div className="border border-slate-200 rounded p-4 bg-gray-200 shadow-sm w-1/2">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Summary</h3>

          <div className="overflow-x-auto rounded border border-base-300 bg-white">
            <table className="table w-full table-sm">
              <thead>
                <tr className="bg-base-200">
                  <th className="border-r border-base-300 font-medium">
                    Capex
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Revenue
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Carry Forward
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Actual Revex
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Actual Capex
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Fund Flow
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    C/F Fund Flow
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="hover"></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className=" border-slate-200 rounded">
        {/* name of each tab group should be unique */}

        {canEdit && (
          <div className="tabs tabs-box bg-gray-50 p-4 gap-x-2 tabs-xs  border border-slate-200">
            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${activeTab === 0 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 0}
              onClick={() => {
                changeTab(0);
              }}
              aria-label={`Commitments`}
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
                        />
                      </td>

                      <td rowSpan={2}>
                        <textarea
                          className="textarea textarea-bordered w-full min-w-48"
                          placeholder="Basis"
                        />
                      </td>

                      <td className="font-medium">Capex</td>

                      {/* Total Commitment */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>

                      {/* Apr-Mar */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>

                      {/* FY2-Y5 */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                    </tr>

                    <tr>
                      <td className="font-medium">Revex</td>

                      {/* Total Commitment */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>

                      {/* Apr-Mar */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>

                      {/* FY2-Y5 */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${activeTab === 1 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 1}
              onClick={() => {
                changeTab(1);
              }}
              aria-label={`Cash Flow`}
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
                        />
                      </td>

                      <td rowSpan={2}>
                        <textarea
                          className="textarea textarea-bordered w-full min-w-48"
                          placeholder="Basis"
                        />
                      </td>

                      <td className="font-medium">Capex</td>

                      {/* Total Commitment */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>

                      {/* Apr-Mar */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>

                      {/* FY2-Y5 */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                    </tr>

                    <tr>
                      <td className="font-medium">Revex</td>

                      {/* Total Commitment */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-24"
                        />
                      </td>

                      {/* Apr-Mar */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>

                      {/* FY2-Y5 */}
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered input-xs w-16"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${activeTab === 2 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 2}
              onClick={() => {
                changeTab(2);
              }}
              aria-label="Carry Forward"
            />
            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="overflow-x-auto border border-base-300 rounded max-w-4xl">
                <table className="table table-xs table-zebra min-w-150">
                  <thead className="bg-red-500 text-white">
                    <tr>
                      <th className="text-center">WBH</th>
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

            <p className="text-sm text-error self-center  font-semibold">
              Please fill the entries in Crores only
            </p>
          </div>
        )}

        {canEdit && (
          <div className="flex gap-x-4 place-content-left m-4 ">
            <button onClick={prevTab} className="btn btn-sm btn-neutral">
              <ChevronLeft />
              Back
            </button>

            <button onClick={nextTab} className="btn btn-sm btn-neutral">
              Next
              <ChevronRight />
            </button>

            {/* <button className="btn btn-sm bg-red-500 text-white">
              Save All Entries
            </button>

            <button className="btn btn-sm bg-red-500 text-white">
              Submit For Approval
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDInputs;
