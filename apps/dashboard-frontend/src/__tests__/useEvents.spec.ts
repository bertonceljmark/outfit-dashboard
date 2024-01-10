import { renderHook, act, waitFor } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import { mockedEvents } from "@/mockedData";
import useEvents from "@/hooks/useEvents";
import { ChangeEvent } from "react";
import { TEvent } from "@/interfaces/interfaces";
import { getEvents } from "@/api/operations";
import * as operations from "@/api/operations";

fetchMock.enableMocks();

describe("useEvents", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("fetches events based on search value", async () => {
    jest.spyOn(operations, "getEvents");

    const { result } = renderHook(() => useEvents());

    expect(result.current.loading).toBe(true);
    expect(getEvents).toHaveBeenCalledWith("");

    act(() => {
      result.current.onSearchChange({
        target: { value: "searchQuery" },
      } as ChangeEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.searchValue).toBe("searchQuery");
      expect(getEvents).toHaveBeenCalledTimes(2);
    });

    expect(fetchMock.mock.calls[0][0]).toBe(`${operations.BASE_URL}/`);
    expect(fetchMock.mock.calls[1][0]).toBe(
      `${operations.BASE_URL}/searchQuery`
    );
    expect(getEvents).toHaveBeenCalledWith("searchQuery");
    expect(result.current.loading).toBe(false);
  });

  it("updates a specific event", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockedEvents));

    const { result } = renderHook(() => useEvents());

    const eventToUpdate: TEvent = mockedEvents[0];

    act(() => {
      result.current.createRow(mockedEvents[0]);
    });

    const updatedEventData = { ...eventToUpdate, name: "newTitle" };

    act(() => {
      result.current.updateRow(updatedEventData);
    });

    await waitFor(() => {
      expect(result.current.events).toContainEqual(updatedEventData);
    });
  });

  it("deletes a specific event", async () => {
    const { result } = renderHook(() => useEvents());
    const eventToDeleteId = mockedEvents[0].id;

    act(() => {
      result.current.createRow(mockedEvents[0]);
    });

    waitFor(() => {
      expect(
        result.current.events.some((event) => event.id === eventToDeleteId)
      ).toBe(true);
    });

    act(() => {
      result.current.deleteRow(eventToDeleteId);
    });

    await waitFor(() => {
      expect(
        result.current.events.some((event) => event.id === eventToDeleteId)
      ).toBe(false);
    });
  });

  it("creates a new event", async () => {
    const { result } = renderHook(() => useEvents());
    const newEvent: TEvent = {
      id: "someId",
      name: "newTitle",
      description: "newDescription",
      type: "app",
      priority: 1,
    };

    act(() => {
      result.current.createRow(newEvent);
    });

    await waitFor(() => {
      expect(result.current.events).toContainEqual(newEvent);
    });
  });

  it("handles error state", async () => {
    fetchMock.mockRejectOnce();

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.error).toBe(true);
    });
  });

  it("handles loading state", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockedEvents));

    const { result } = renderHook(() => useEvents());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("handles search value state", async () => {
    const { result } = renderHook(() => useEvents());

    expect(result.current.searchValue).toBe("");

    act(() => {
      result.current.onSearchChange({
        target: { value: "searchQuery" },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.searchValue).toBe("searchQuery");
  });
});
