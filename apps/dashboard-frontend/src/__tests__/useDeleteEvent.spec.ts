import "@/__config__/setup";

import { renderHook } from "@testing-library/react";
import useDeleteEvent from "@/hooks/useDeleteEvent";
import { TErrorResponse } from "@/interfaces/interfaces";
import { act } from "react-dom/test-utils";

import fetchMock from "jest-fetch-mock";
import { toast } from "sonner";

fetchMock.enableMocks();

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockForm = {
  id: "1234",
  name: "Test event",
};

describe("useDeleteEvent hook", () => {
  const mockDeleteRow = jest.fn();

  test("handles event creation and failure scenario", async () => {
    const errorResponse: TErrorResponse = {
      error: "ValidationError",
      statusCode: 400,
      message: ["Error message 1", "Error message 2"],
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({ ...errorResponse, statusCode: 400 })
    );

    const { result } = renderHook(() =>
      useDeleteEvent({
        id: mockForm.id,
        name: mockForm.name,
        deleteRow: mockDeleteRow,
      })
    );

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    expect(mockDeleteRow).not.toHaveBeenCalled();
  });

  test("handles event creation and success scenario", async () => {
    const successResponse = {
      data: { statusCode: 201, id: "1234" },
      statusCode: 201,
    };

    fetchMock.mockResponseOnce(JSON.stringify(successResponse), {
      status: 201,
    });

    const { result } = renderHook(() =>
      useDeleteEvent({
        deleteRow: mockDeleteRow,
        id: mockForm.id,
        name: mockForm.name,
      })
    );

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(mockDeleteRow).toHaveBeenCalledWith(successResponse.data.id);
    expect(toast.success).toHaveBeenCalledWith(
      `Event ${mockForm.name} deleted!`
    );
  });
});
