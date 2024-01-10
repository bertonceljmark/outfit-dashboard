import "@/__config__/setup";

import { renderHook } from "@testing-library/react";
import useEditEvent from "@/hooks/useEditEvent";
import {
  TErrorResponse,
  TEvent,
  TSuccessResponse,
} from "@/interfaces/interfaces";
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

const mockAppForm: TEvent = {
  id: "1234",
  name: "Test event",
  description: "Test description",
  type: "app",
  priority: 1,
};

describe("useEditEvent hook", () => {
  const mockUpdateRow = jest.fn();
  const mockOnOpenChange = jest.fn();

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
      useEditEvent({
        updateRow: mockUpdateRow,
        onOpenChange: mockOnOpenChange,
        rowData: mockAppForm,
      })
    );

    await act(async () => {
      await result.current.onSubmit(mockAppForm);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Error message 1, Error message 2"
    );
    expect(result.current.loading).toBe(false);
    expect(mockUpdateRow).not.toHaveBeenCalled();
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });

  test("fails with message as string", async () => {
    const errorResponse: TErrorResponse = {
      error: "ValidationError",
      statusCode: 400,
      message: "string error message",
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({ ...errorResponse, statusCode: 400 })
    );

    const { result } = renderHook(() =>
      useEditEvent({
        updateRow: mockUpdateRow,
        onOpenChange: mockOnOpenChange,
        rowData: mockAppForm,
      })
    );

    await act(async () => {
      await result.current.onSubmit(mockAppForm);
    });

    expect(toast.error).toHaveBeenCalledWith("string error message");
    expect(result.current.loading).toBe(false);
    expect(mockUpdateRow).not.toHaveBeenCalled();
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });

  test("handles event creation and success scenario", async () => {
    const mockAdsForm: TEvent = {
      id: "1234",
      name: "Test event",
      description: "Test description",
      type: "ads",
      priority: 1,
    };

    const successResponse: TSuccessResponse<TEvent> = {
      data: { ...mockAdsForm, id: "1234" },
    };

    const countryCodeResponse = {
      countryCode: "US",
    };

    fetchMock.mockResponses(
      [JSON.stringify(countryCodeResponse), { status: 200 }],
      [JSON.stringify(successResponse), { status: 201 }]
    );

    const { result } = renderHook(() =>
      useEditEvent({
        updateRow: mockUpdateRow,
        onOpenChange: mockOnOpenChange,
        rowData: mockAdsForm,
      })
    );

    await act(async () => {
      await result.current.onSubmit(mockAdsForm);
    });

    expect(result.current.loading).toBe(false);
    expect(mockUpdateRow).toHaveBeenCalledWith(successResponse.data);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(toast.success).toHaveBeenCalledWith(
      `Event ${mockAdsForm.name} edited!`
    );
  });
});
