function UsageLogsTable({ usageLogs }) {
  return (
    <div>
      <table className="w-full mt-6 bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Material</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Logged By</th>
            <th className="p-3 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {usageLogs.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="p-6 text-center text-gray-500"
              >
                No usage records found
              </td>
            </tr>
          ) : (
            usageLogs.map((item) => (
              <tr
                key={item.id}
                className="border-t"
              >
                <td className="p-4">
                  {item.constructionMaterial?.name || "Unknown"}
                </td>

                <td className="p-4">
                  {item.quantityUsedKg} kg
                </td>

                <td className="p-4">
                  {item.locationUsed}
                </td>

                <td className="p-4">
                  {item.loggedBy}
                </td>

                <td className="p-4">
                  {item.usedDate
                    ? new Date(item.usedDate).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UsageLogsTable;