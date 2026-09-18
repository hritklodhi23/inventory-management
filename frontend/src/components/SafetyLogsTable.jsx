function SafetyLogsTable({ safetyLogs }) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">
        PPE Issuance History
      </h2>

      <table className="w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">
              Worker ID
            </th>

            <th className="p-3 text-left">
              Worker Name
            </th>

            <th className="p-3 text-left">
              PPE
            </th>

            <th className="p-3 text-left">
              Quantity
            </th>

            <th className="p-3 text-left">
              Date
            </th>

            <th className="p-3 text-left">
              Remarks
            </th>
          </tr>
        </thead>

        <tbody>
          {safetyLogs.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="p-6 text-center text-gray-500"
              >
                No PPE issuance records found
              </td>
            </tr>
          ) : (
            safetyLogs.map((log) => (
              <tr
                key={log.id}
                className="border-t"
              >
                <td className="p-4">
                  {log.workerId}
                </td>

                <td className="p-4">
                  {log.workerName}
                </td>

                <td className="p-4">
                  {log.safetyMaterial?.name || "-"}
                </td>

                <td className="p-4">
                  {log.quantityIssued} pcs
                </td>

                <td className="p-4">
                  {log.issueDate
                    ? new Date(
                        log.issueDate
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-4">
                  {log.remarks || "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SafetyLogsTable;