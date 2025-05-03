import { Button } from "@/components/ui/button";
import { Mail, X, Check } from "lucide-react";

interface Column {
  header: string;
  accessor: string;
  cell?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onStatusChange?: (id: number, isActive: boolean) => void;
  showActions?: boolean;
}

export default function DataTable({
  columns,
  data,
  onStatusChange,
  showActions = true,
}: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            {columns.map((column, index) => (
              <th key={index} className="text-left py-3 px-4 text-gray-400">
                {column.header}
              </th>
            ))}
            {/* {showActions && (
              <th className="text-left py-3 px-4 text-gray-400">Actions</th>
            )} */}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-800">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="py-3 px-4">
                  {column.cell
                    ? column.cell(row[column.accessor], row)
                    : row[column.accessor]}
                </td>
              ))}
              {/* {showActions && (
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        (window.location.href = `mailto:${row.email}`)
                      }
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${
                        row.isActive
                          ? "text-red-500 hover:text-red-600"
                          : "text-green-500 hover:text-green-600"
                      }`}
                      onClick={() => onStatusChange?.(row._id, !row.isActive)}
                    >
                      {row.isActive ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </td>
              )} */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
