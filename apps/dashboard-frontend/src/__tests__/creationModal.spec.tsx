import "@/__config__/setup";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreationModal from "@/creationModal/creationModal";

import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

const successData = {
  data: {
    name: "Test name",
    description: "Test description",
    type: "app",
    priority: 1,
    id: "659ab825784e268ebdf4f588",
    __v: 0,
  },
  statusCode: 201,
};

describe("CreationModal Component", () => {
  test("renders modal trigger and form correctly", async () => {
    const mockCreateRow = jest.fn();

    const { getByText } = render(<CreationModal createRow={mockCreateRow} />);

    const modalTrigger = getByText("New");
    fireEvent.click(modalTrigger);

    await waitFor(() => {
      expect(getByText("Track new event")).toBeInTheDocument();
    });

    const dialogTitle = getByText("Track new event");

    expect(dialogTitle).toBeInTheDocument();
  });

  test("fills form and submits correctly", async () => {
    const mockCreateRow = jest.fn();

    const { getByText, getByPlaceholderText, getByRole } = render(
      <CreationModal createRow={mockCreateRow} />
    );

    const modalTrigger = getByText("New");
    fireEvent.click(modalTrigger);

    await waitFor(() => {
      expect(getByText("Track new event")).toBeInTheDocument();
    });

    const eventTitleInput = getByPlaceholderText("Event name");
    const eventDescriptionInput = getByPlaceholderText("Event description");
    const eventTypeSelect = getByRole("combobox");

    const submitButton = getByRole("submit");

    fireEvent.click(eventTitleInput);
    fireEvent.change(eventTitleInput, { target: { value: "Sample Event" } });

    expect(eventTitleInput).toHaveValue("Sample Event");

    fireEvent.change(eventDescriptionInput, {
      target: { value: "Sample Description" },
    });

    expect(eventDescriptionInput).toHaveValue("Sample Description");

    fireEvent.click(eventTypeSelect);

    await userEvent.click(eventTypeSelect, {
      pointerState: await userEvent.pointer({ target: eventTypeSelect }),
    });

    await waitFor(() => {
      expect(screen.getAllByRole("option")).toHaveLength(4);
    });

    const appOption = screen.getAllByRole("option")[2];

    userEvent.click(appOption);

    await waitFor(() => {
      expect(appOption).not.toBeInTheDocument();
    });

    fetchMock.mockResponseOnce(JSON.stringify(successData));

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateRow).toHaveBeenCalledTimes(1);
      expect(mockCreateRow).toHaveBeenCalledWith(successData.data);
    });
  });

  test("validation errors display", async () => {
    const mockCreateRow = jest.fn();

    const { getByText, getByRole } = render(
      <CreationModal createRow={mockCreateRow} />
    );

    const modalTrigger = getByText("New");
    fireEvent.click(modalTrigger);

    await waitFor(() => {
      expect(getByText("Track new event")).toBeInTheDocument();
    });

    const submitButton = getByRole("submit");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText("Title required")).toBeInTheDocument();
      expect(getByText("Description required")).toBeInTheDocument();
      expect(getByText("Required")).toBeInTheDocument();
    });
  });
});
