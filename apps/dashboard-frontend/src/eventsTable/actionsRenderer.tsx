import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditModal from "@/creationModal/editModal";
import useDeleteEvent from "@/hooks/useDeleteEvent";
import { TEvent } from "@/interfaces/interfaces";
import { useState } from "react";

interface IProps {
  event: TEvent;
  updateRow: (row: TEvent) => void;
  deleteRow: (id: string) => void;
}
const ActionsRenderer = ({ event, updateRow, deleteRow }: IProps) => {
  const [open, setOpen] = useState(false);

  const { handleDelete } = useDeleteEvent({
    id: event.id,
    deleteRow,
    name: event.name,
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <div className="h-4 w-4">...</div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(event.id)}
          >
            Copy event ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Edit event
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-700">
            Delete event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditModal
        updateRow={updateRow}
        rowData={event}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

export default ActionsRenderer;
