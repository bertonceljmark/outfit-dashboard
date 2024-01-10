import { getEvents } from "@/api/operations";
import { TEvent } from "@/interfaces/interfaces";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

const useEvents = () => {
  const [searchValue, setSearchValue] = useState("");
  const [events, setEvents] = useState<TEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await getEvents(debouncedSearchValue);

        if (response?.data) {
          setEvents(response.data);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
      }

      setLoading(false);
    };

    fetchEvents();
  }, [debouncedSearchValue]);

  const updateRow = (data: TEvent) => {
    const newEvents = events.map((event) => {
      if (event.id === data.id) {
        return data;
      }

      return event;
    });

    setEvents(newEvents);
  };

  const deleteRow = (id: string) => {
    const newEvents = events.filter((event) => event.id !== id);

    setEvents(newEvents);
  };

  const createRow = (data: TEvent) => {
    const newEvents = [...events, data];

    setSearchValue("");
    setEvents(newEvents);
  };

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return {
    events,
    searchValue,
    loading,
    error,
    updateRow,
    deleteRow,
    createRow,
    onSearchChange,
  };
};

export default useEvents;
