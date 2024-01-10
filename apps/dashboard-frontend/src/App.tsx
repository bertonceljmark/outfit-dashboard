import "./App.css";
import "./globals.css";
import { DataTable } from "./eventsTable/dataTable";
import { getColumnDefinitions } from "./eventsTable/columns";
import useEvents from "@/hooks/useEvents";
import { useMemo } from "react";
import CreationModal from "./creationModal/creationModal";
import { Toaster } from "./components/ui/sonner";
import { Input } from "./components/ui/input";

function App() {
  const {
    events,
    searchValue,
    loading,
    error,
    updateRow,
    deleteRow,
    createRow,
    onSearchChange,
  } = useEvents();

  const columnDefinitions = useMemo(
    () => getColumnDefinitions(updateRow, deleteRow),
    [deleteRow, updateRow]
  );

  return (
    <div className="h-full">
      <div className="flex justify-center flex-col gap-4">
        <div className="text-3xl font-bold text-center">Events</div>
        <div className="flex justify-between gap-64">
          <Input
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search..."
          />
          <CreationModal createRow={createRow} />
        </div>
        <DataTable
          columns={columnDefinitions}
          data={events}
          loading={loading}
          error={error}
        />
      </div>
      <Toaster richColors closeButton />
    </div>
  );
}

export default App;
