type NonPDApproverHistoryProps = {
  history: any[];
};

const NonPDApproverHistory = ({ history }: NonPDApproverHistoryProps) => (
  <section className="overflow-hidden rounded border border-slate-200">
    <h2 className="border-b border-slate-200 bg-slate-50 p-4 text-lg font-semibold">
      Approval History
    </h2>
    {history.length ? (
      <div className="overflow-x-auto">
        <table className="table table-xs [&_td]:border-b [&_td]:border-slate-200 [&_th]:border [&_th]:border-slate-200">
          <thead>
            <tr className="bg-red-500 text-white">
              <th>S.No.</th>
              <th>User ID</th>
              <th>Employee</th>
              <th>Action</th>
              <th>Remarks</th>
              <th>Date &amp; Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={item.id || item.Id || index}>
                <td>{index + 1}</td>
                <td>{item.ActionPerformedBy || "-"}</td>
                <td>
                  {item.employeeName ||
                    item.EmployeeName ||
                    item.createdByName ||
                    item.CreatedByName ||
                    "-"}
                </td>
                <td>{item.actionPerformed || item.ActionPerformed || "-"}</td>
                <td>
                  {item.approvalRemarks ||
                    item.ApprovalRemarks ||
                    item.remarks ||
                    item.Remarks ||
                    "-"}
                </td>
                <td>{new Date(item.TDate).toLocaleString("en-IN") || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="mt-2 text-sm opacity-70">No approval history found.</p>
    )}
  </section>
);

export default NonPDApproverHistory;
