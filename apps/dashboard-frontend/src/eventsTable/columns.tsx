import { TEvent } from "@/interfaces/interfaces";
import { ColumnDef } from "@tanstack/react-table";
import ActionsRenderer from "./actionsRenderer";

export const getColumnDefinitions = (
  updateRow: (row: TEvent) => void,
  deleteRow: (id: string) => void
): ColumnDef<TEvent>[] => {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "priority",
      header: "Priority",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original;

        return (
          <ActionsRenderer
            event={event}
            updateRow={updateRow}
            deleteRow={deleteRow}
          />
        );
      },
    },
  ];
};
