import { Sheet } from "lucide-react";
import { useState, useEffect } from "react";
import {
  GetDropdownData,
  GetProjectsDropdown,
  GetProjectById,
  GetBudgetedByProject,
  InsertBudgeted,
  UpdateBudgeted,
  DeleteBudgeted,
} from "../../service/projectmaster";
const AFCCSheet = () => {
  const [financialYear, setFinancialYear] = useState("");

  const [project, setProject] = useState("");

  const [fiYears, setFiYears] = useState<any[]>([]);

  const [projects, setProjects] = useState<any[]>([]);

  const [projectDetails, setProjectDetails] = useState<any>(null);

  const [budgetedRows, setBudgetedRows] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [editData, setEditData] = useState<any>({});

  const [newBudgeted, setNewBudgeted] = useState({
    budgeted: "",
    fy3: "",
    fy4: "",
    fy5: "",
    fy6: "",
    fy7: "",
  });

  const fetchFiYears = async () => {
    try {
      const data = await GetDropdownData("4"); // Replace 6 with actual dropdown type

      setFiYears(data);
    } catch (error) {
      console.error("Error fetching financial years:", error);
    }
  };

  const fetchBudgetedData = async (projectId: string) => {
    try {
      const data = await GetBudgetedByProject(projectId);

      setBudgetedRows(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (row: any) => {
    setEditingId(row.BudgetedId);

    setEditData({
      budgeted: row.Budgeted,
      fy3: row.Fy3,
      fy4: row.Fy4,
      fy5: row.Fy5,
      fy6: row.Fy6,
      fy7: row.Fy7,
    });
  };

  const handleUpdate = async (budgetedId: number) => {
    try {
      await UpdateBudgeted({
        budgetedId,
        budgeted: editData.budgeted,
        fy3: editData.fy3,
        fy4: editData.fy4,
        fy5: editData.fy5,
        fy6: editData.fy6,
        fy7: editData.fy7,
      });

      setEditingId(null);

      fetchBudgetedData(project);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (budgetedId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this row?",
    );

    if (!confirmed) return;

    try {
      await DeleteBudgeted(budgetedId);

      fetchBudgetedData(project);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveBudgeted = async () => {
    if (!project) {
      alert("Select project first");
      return;
    }

    try {
      await InsertBudgeted({
        projectId: project,
        budgeted: newBudgeted.budgeted,
        fy3: newBudgeted.fy3,
        fy4: newBudgeted.fy4,
        fy5: newBudgeted.fy5,
        fy6: newBudgeted.fy6,
        fy7: newBudgeted.fy7,
      });

      setNewBudgeted({
        budgeted: "",
        fy3: "",
        fy4: "",
        fy5: "",
        fy6: "",
        fy7: "",
      });

      await fetchBudgetedData(project);
    } catch (error) {
      console.error(error);
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

    const fetchProjects = async () => {
      try {
        const data = await GetProjectsDropdown(financialYear);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [financialYear]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!project) {
        setProjectDetails(null);
        return;
      }

      try {
        const response = await GetProjectById(project);

        setProjectDetails(response);
        await fetchBudgetedData(project);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
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

      {!project ? (
        <div className="bg-white rounded shadow p-8 text-center text-gray-500">
          Please select a Financial Year and Project to view the AFCC Sheet.
        </div>
      ) : (
        <div className="overflow-x-auto p-2 bg-white rounded shadow">
          {/* AFCC SHEET */}
          <div className=" overflow-x-auto p-2 bg-white rounded shadow">
            {/* Top Banner */}
            <div className="grid grid-cols-12 border border-black bg-[#eac892] text-sm font-semibold">
              <div className="col-span-7 p-2 border-r border-black">
                Project Name - {projectDetails?.projectName || ""}
              </div>

              <div className="col-span-5">
                <div className="grid grid-cols-2">
                  <div className="p-2 border-r border-black">
                    Project Outlay Cr.
                  </div>
                  <div className="p-2">Ask for FY {financialYear} Cr.</div>
                </div>
              </div>
            </div>

            {/* Owner / Category */}
            <div className="grid grid-cols-12 border border-black text-sm font-semibold">
              <div className="col-span-7 p-2 border-r border-black">
                {projectDetails?.isOngoing ? "Ongoing" : "New"} &nbsp;&nbsp;
                Owner : {projectDetails?.projectOwner || ""}
              </div>

              <div className="col-span-5 p-2 text-center">
                Category: {projectDetails?.projectCategoryName || ""}
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
                      value={projectDetails?.projectObjective || ""}
                      readOnly
                    />
                  </div>
                </div>

                {/* Scope */}
                <div className="border border-black mt-4">
                  <div className="font-bold p-2">2. Brief / Scope :</div>

                  <div className="h-72 p-2">
                    <textarea
                      className="textarea textarea-bordered w-full h-full bg-white"
                      value={projectDetails?.projectScope || ""}
                      readOnly
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
                  <table className="table table-xs w-full">
                    <thead>
                      <tr className="bg-red-600 text-white font-bold px-2 py-1">
                        <th className="border  border-black">4. Budgeted</th>
                        <th className="border  border-black">FY 1</th>
                        <th className="border  border-black">FY 2</th>
                        <th className="border  border-black">FY 3</th>
                        <th className="border  border-black">FY 4</th>
                        <th className="border  border-black">FY 5</th>
                        <th className="border  border-black">Total</th>
                        <th className="border  border-black">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* Add New Row */}
                      <tr>
                        <td className="border p-0">
                          <input
                            className="w-full h-full min-h-10 px-2 border-0 outline-none"
                            placeholder="Enter Budgeted"
                            value={newBudgeted.budgeted}
                            onChange={(e) =>
                              setNewBudgeted({
                                ...newBudgeted,
                                budgeted: e.target.value,
                              })
                            }
                          />
                        </td>

                        <td className="border p-0">
                          <input
                            type="number"
                            className="w-full h-full min-h-10 px-2 border-0 outline-none"
                            value={newBudgeted.fy3}
                            onChange={(e) =>
                              setNewBudgeted({
                                ...newBudgeted,
                                fy3: e.target.value,
                              })
                            }
                          />
                        </td>

                        <td className="border p-0">
                          <input
                            type="number"
                            className="w-full h-full min-h-10 px-2 border-0 outline-none"
                            value={newBudgeted.fy4}
                            onChange={(e) =>
                              setNewBudgeted({
                                ...newBudgeted,
                                fy4: e.target.value,
                              })
                            }
                          />
                        </td>

                        <td className="border p-0">
                          <input
                            type="number"
                            className="w-full h-full min-h-10 px-2 border-0 outline-none"
                            value={newBudgeted.fy5}
                            onChange={(e) =>
                              setNewBudgeted({
                                ...newBudgeted,
                                fy5: e.target.value,
                              })
                            }
                          />
                        </td>

                        <td className="border p-0">
                          <input
                            type="number"
                            className="w-full h-full min-h-10 px-2 border-0 outline-none"
                            value={newBudgeted.fy6}
                            onChange={(e) =>
                              setNewBudgeted({
                                ...newBudgeted,
                                fy6: e.target.value,
                              })
                            }
                          />
                        </td>

                        <td className="border p-0">
                          <input
                            type="number"
                            className="w-full h-full min-h-10 px-2 border-0 outline-none"
                            value={newBudgeted.fy7}
                            onChange={(e) =>
                              setNewBudgeted({
                                ...newBudgeted,
                                fy7: e.target.value,
                              })
                            }
                          />
                        </td>

                        <td className="border text-center font-bold">
                          {(
                            Number(newBudgeted.fy3 || 0) +
                            Number(newBudgeted.fy4 || 0) +
                            Number(newBudgeted.fy5 || 0) +
                            Number(newBudgeted.fy6 || 0) +
                            Number(newBudgeted.fy7 || 0)
                          ).toFixed(2)}
                        </td>

                        <td className="border text-center">
                          <button
                            className="btn btn-neutral btn-xs"
                            onClick={handleSaveBudgeted}
                          >
                            Save
                          </button>
                        </td>
                      </tr>

                      {/* Existing Rows */}
                      {budgetedRows.map((row) => {
                        const isEditing = editingId === row.BudgetedId;

                        const total = isEditing
                          ? (
                              Number(editData.fy3 || 0) +
                              Number(editData.fy4 || 0) +
                              Number(editData.fy5 || 0) +
                              Number(editData.fy6 || 0) +
                              Number(editData.fy7 || 0)
                            ).toFixed(2)
                          : (
                              Number(row.Fy3 || 0) +
                              Number(row.Fy4 || 0) +
                              Number(row.Fy5 || 0) +
                              Number(row.Fy6 || 0) +
                              Number(row.Fy7 || 0)
                            ).toFixed(2);

                        return (
                          <tr key={row.BudgetedId}>
                            {/* Budgeted */}
                            <td className="border p-0">
                              {isEditing ? (
                                <input
                                  className="w-full h-full min-h-10 px-2 border-0 outline-none"
                                  value={editData.budgeted}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      budgeted: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <div className="px-2 py-2">{row.Budgeted}</div>
                              )}
                            </td>

                            {/* FY3 */}
                            <td className="border p-0">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-full h-full min-h-10 px-2 border-0 outline-none"
                                  value={editData.fy3}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      fy3: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <div className="px-2 py-2">{row.Fy3}</div>
                              )}
                            </td>

                            {/* FY4 */}
                            <td className="border p-0">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-full h-full min-h-10 px-2 border-0 outline-none"
                                  value={editData.fy4}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      fy4: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <div className="px-2 py-2">{row.Fy4}</div>
                              )}
                            </td>

                            {/* FY5 */}
                            <td className="border p-0">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-full h-full min-h-10 px-2 border-0 outline-none"
                                  value={editData.fy5}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      fy5: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <div className="px-2 py-2">{row.Fy5}</div>
                              )}
                            </td>

                            {/* FY6 */}
                            <td className="border p-0">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-full h-full min-h-10 px-2 border-0 outline-none"
                                  value={editData.fy6}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      fy6: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <div className="px-2 py-2">{row.Fy6}</div>
                              )}
                            </td>

                            {/* FY7 */}
                            <td className="border p-0">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-full h-full min-h-10 px-2 border-0 outline-none"
                                  value={editData.fy7}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      fy7: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <div className="px-2 py-2">{row.Fy7}</div>
                              )}
                            </td>

                            {/* Total */}
                            <td className="border text-center font-bold">
                              {total}
                            </td>

                            {/* Actions */}
                            <td className="border text-center">
                              {isEditing ? (
                                <div className="flex justify-center gap-1">
                                  <button
                                    className="btn btn-neutral btn-xs"
                                    onClick={() => handleUpdate(row.BudgetedId)}
                                  >
                                    Update
                                  </button>

                                  <button
                                    className="btn btn-xs"
                                    onClick={() => {
                                      setEditingId(null);
                                      setEditData({});
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-center gap-1">
                                  <button
                                    className="btn btn-neutral btn-xs"
                                    onClick={() => handleEdit(row)}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    className="btn btn-xs"
                                    onClick={() => handleDelete(row.BudgetedId)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
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
                        <th>SNo</th>
                        <th>Details</th>
                        <th>Total</th>
                        <th>FY 1</th>
                        <th>FY 2</th>
                        <th>FY 3</th>
                        <th>FY 4</th>
                        <th>FY 5</th>
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
                        <th>FY 1</th>
                        <th>FY 2</th>
                        <th>FY 3</th>
                        <th>FY 4</th>
                        <th>FY 5</th>
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
                        <td className="border">0.00</td>
                        <td className="border">0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AFCCSheet;
