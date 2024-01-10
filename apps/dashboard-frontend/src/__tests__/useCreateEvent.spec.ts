import "@/__config__/setup";

import { renderHook } from "@testing-library/react";
import useCreateEvent from "@/hooks/useCreateEvent";
import {
  TCreateEvent,
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

describe("useCreateEvent hook", () => {
  const mockCreateRow = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    fetchMock.doMock();
  });

  test("handles event creation and failure scenario", async () => {
    const mockAppForm: TCreateEvent = {
      name: "Test event",
      description: "Test description",
      type: "app",
      priority: 1,
    };

    const errorResponse: TErrorResponse = {
      error: "ValidationError",
      statusCode: 400,
      message: ["Error message 1", "Error message 2"],
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({ ...errorResponse, statusCode: 400 })
    );

    const { result } = renderHook(() =>
      useCreateEvent({
        createRow: mockCreateRow,
        onOpenChange: mockOnOpenChange,
      })
    );

    await act(async () => {
      await result.current.onSubmit(mockAppForm);
    });

    expect(
      expect(toast.error).toHaveBeenCalledWith(
        "Error message 1, Error message 2"
      )
    );
    expect(result.current.loading).toBe(false);
    expect(mockCreateRow).not.toHaveBeenCalled();
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });

  test("fails with message as string", async () => {
    const mockAppForm: TCreateEvent = {
      name: "Test event",
      description: "Test description",
      type: "app",
      priority: 1,
    };

    const errorResponse: TErrorResponse = {
      error: "ValidationError",
      statusCode: 400,
      message: "string error message",
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({ ...errorResponse, statusCode: 400 })
    );

    const { result } = renderHook(() =>
      useCreateEvent({
        createRow: mockCreateRow,
        onOpenChange: mockOnOpenChange,
      })
    );

    await act(async () => {
      await result.current.onSubmit(mockAppForm);
    });

    expect(toast.error).toHaveBeenCalledWith("string error message");
    expect(result.current.loading).toBe(false);
    expect(mockCreateRow).not.toHaveBeenCalled();
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });

  test("handles event creation and success scenario", async () => {
    const mockAdsForm: TCreateEvent = {
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
      useCreateEvent({
        createRow: mockCreateRow,
        onOpenChange: mockOnOpenChange,
      })
    );

    await act(async () => {
      await result.current.onSubmit(mockAdsForm);
    });

    expect(result.current.loading).toBe(false);
    expect(mockCreateRow).toHaveBeenCalledWith(successResponse.data);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(toast.success).toHaveBeenCalledWith(
      `Event ${mockAdsForm.name} created!`
    );
  });
});
