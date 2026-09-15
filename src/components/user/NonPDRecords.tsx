import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import { GetNonPDRecords } from "../../service/projectmaster";

const NonPDRecords = () => {
  const user = useUserStore((s: any) => s.user);
  const navigate = useNavigate();
  const [records, setRecords] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const nonPDCheckerRole = user?.roles?.find(
    (role: any) =>
      String(role.projectType).trim().toUpperCase() === "NON PD" &&
      String(role.role).trim().toUpperCase() === "CHECKER",
  );
  const nonPDMakerRole = user?.roles?.find(
    (role: any) =>
      String(role.projectType).trim().toUpperCase() === "NON PD" &&
      String(role.role).trim().toUpperCase() === "MAKER",
  );

  const load = async () => {
    const deptId =
      nonPDCheckerRole?.departmentId ||
      nonPDMakerRole?.departmentId ||
      user?.roles?.find(
        (role: any) =>
          String(role.projectType).trim().toUpperCase() === "NON PD",
      )?.departmentId ||
      user?.deptCode;
    if (!deptId) return;
    setLoading(true);
    try {
      setRecords(await GetNonPDRecords(deptId));
    } catch (error) {
      console.error("Unable to load non-PD records", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, [user?.deptCode, user?.roles]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? records.filter((r) => JSON.stringify(r).toLowerCase().includes(q))
      : records;
  }, [records, search]);

  const value = (record: any, ...keys: string[]) =>
    keys
      .map((key) => record[key])
      .find((item) => item != null && item !== "") || "-";

  const formatDate = (date: unknown) => {
    if (!date) return "-";
    const parsed = new Date(String(date));
    return Number.isNaN(parsed.getTime())
      ? String(date)
      : parsed.toLocaleString();
  };

  const open = (record?: any) => {
    const target = nonPDCheckerRole
      ? "/nonpd-project-approver"
      : "/nonpd-project";
    navigate(target, {
      state: record
        ? {
            ...record,
            projectID: record.ProjectId || record.projectId || undefined,
            recordId: record.RecordId || record.recordId,
            deptID:
              record.DeptId ||
              record.deptId ||
              nonPDCheckerRole?.departmentId ||
              user?.deptCode,
            projectName: record.ProjectName || record.projectName,
            FyYear: record.FyYear || record.fyYear,
            status: record.Status || record.status || "OPENED",
          }
        : {
            deptID:
              nonPDCheckerRole?.departmentId ||
              user?.roles?.find(
                (role: any) =>
                  String(role.projectType).trim().toUpperCase() === "NON PD",
              )?.departmentId ||
              user?.deptCode,
            status: "OPENED",
          },
    });
  };

  return (
    <main className="ui-screen min-h-screen p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-sm font-bold">Budget Inputs Non PD</h1>
          <p className="mt-1 text-xs opacity-70">Saved non-PD budget records</p>
        </div>
        {nonPDMakerRole && (
          <button
            className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
            onClick={() => open()}
          >
            Add New
          </button>
        )}
      </div>
      <input
        className="input input-bordered input-sm mb-4 w-full max-w-md"
        placeholder="Search records..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-base-300 bg-base-100 shadow">
          <table className="table table-xs table-zebra min-w-max">
            <thead>
              <tr>
                <th>#</th>
                {/* <th>Record ID</th> */}
                <th>Project ID</th>
                <th>Department</th>
                <th>Financial Year</th>
                <th>Status</th>
                <th>Pending With</th>
                <th>Maker ID</th>
                <th>Checker ID</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={value(r, "RecordId", "recordId") || i}>
                  <td>{i + 1}</td>
                  {/* <td>{value(r, "RecordId", "recordId")}</td> */}
                  <td>{value(r, "ProjectId", "projectId")}</td>
                  <td>{value(r, "DeptId", "deptId")}</td>
                  <td>{value(r, "FyYear", "fyYear")}</td>
                  <td>
                    <span className="badge badge-sm whitespace-nowrap">
                      {value(
                        r,
                        "Status",
                        "status",
                        "DraftStatus",
                        "draftStatus",
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="whitespace-nowrap">
                      {value(r, "PendingWithUserName", "pendingWithUserName")}
                    </div>
                    <div className="text-xs opacity-60">
                      ID: {value(r, "PendingWithUser", "pendingWithUser")}
                    </div>
                  </td>
                  <td>{value(r, "MakerId", "makerId")}</td>
                  <td>{value(r, "CheckerId", "checkerId")}</td>
                  <td>{formatDate(value(r, "CreatedAt", "createdAt"))}</td>
                  <td>{formatDate(value(r, "UpdatedAt", "updatedAt"))}</td>
                  <td>
                    <button
                      className="btn btn-sm bg-red-500 text-white"
                      onClick={() => open(r)}
                    >
                      Non PD Inputs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <p className="p-6 text-center opacity-70">No records found.</p>
          )}
        </div>
      )}
    </main>
  );
};

export default NonPDRecords;
