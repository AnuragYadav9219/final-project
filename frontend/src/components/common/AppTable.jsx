export default function AppTable({ columns, data }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">

                <thead className="text-muted-foreground border-b border-white/10">
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i} className="text-left py-3 px-2 font-medium">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row, i) => (
                        <tr
                            key={i}
                            className="border-b border-white/5 hover:bg-white/5 transition"
                        >
                            {columns.map((col, j) => (
                                <td key={j} className="py-3 px-2">
                                    {col.render
                                        ? col.render(row)
                                        : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}