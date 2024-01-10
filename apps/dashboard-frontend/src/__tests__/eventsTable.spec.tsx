import "@/__config__/setup";
import "@testing-library/jest-dom";

import { getColumnDefinitions } from "@/eventsTable/columns";
import { DataTable } from "@/eventsTable/dataTable";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import fetchMock from "jest-fetch-mock";
import { mockedEvents } from "@/mockedData";
fetchMock.enableMocks();

const writeText = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

const updateRow = jest.fn();
const deleteRow = jest.fn();

const columns = getColumnDefinitions(updateRow, deleteRow);

const successData = {
  data: { id: mockedEvents[0].id },
  statusCode: 201,
};

describe("DataTable Component", () => {
  const loading = false;
  const error = false;

  test("renders table with data and columns", () => {
    const { getByText, getAllByText } = render(
      <DataTable
        columns={columns}
        data={mockedEvents}
        loading={loading}
        error={error}
      />
    );

    expect(getByText("Name")).toBeInTheDocument();
    expect(getByText("Type")).toBeInTheDocument();
    expect(getByText("Description")).toBeInTheDocument();
    expect(getByText("Priority")).toBeInTheDocument();

    expect(getByText("SampleData1")).toBeInTheDocument();
    expect(getByText("SampleData2")).toBeInTheDocument();
    expect(getByText("SampleData3")).toBeInTheDocument();

    expect(getByText("SampleDesc1")).toBeInTheDocument();
    expect(getByText("SampleDesc2")).toBeInTheDocument();
    expect(getByText("SampleDesc3")).toBeInTheDocument();

    expect(getByText("app")).toBeInTheDocument();
    expect(getByText("ads")).toBeInTheDocument();
    expect(getByText("liveops")).toBeInTheDocument();

    expect(getByText("1")).toBeInTheDocument();
    expect(getByText("2")).toBeInTheDocument();
    expect(getByText("3")).toBeInTheDocument();

    expect(getAllByText("Open menu")).toHaveLength(3);
  });

  test("handles loading state", () => {
    const { getByText } = render(
      <DataTable columns={columns} data={[]} loading={true} error={false} />
    );

    expect(getByText("Loading...")).toBeInTheDocument();
  });

  test("handles error state", async () => {
    const { getByText } = render(
      <DataTable columns={columns} data={[]} loading={false} error={true} />
    );

    expect(
      getByText("Something went wrong, please try again later")
    ).toBeInTheDocument();
  });

  test("handle delete event", async () => {
    const { getAllByText } = render(
      <DataTable
        columns={columns}
        data={mockedEvents}
        loading={false}
        error={false}
      />
    );

    const firstMenuButton = getAllByText("Open menu")[0];

    userEvent.click(firstMenuButton);

    await waitFor(() => {
      expect(screen.getByText("Delete event")).toBeInTheDocument();
    });

    fetchMock.mockResponseOnce(JSON.stringify(successData));

    const deleteButton = screen.getByText("Delete event");

    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteButton).not.toBeInTheDocument();
    });

    expect(deleteRow).toHaveBeenCalledWith(mockedEvents[0].id);
  });

  test("handle copy event id", async () => {
    const { getAllByText } = render(
      <DataTable
        columns={columns}
        data={mockedEvents}
        loading={false}
        error={false}
      />
    );

    const firstMenuButton = getAllByText("Open menu")[0];

    userEvent.click(firstMenuButton);

    await waitFor(() => {
      expect(screen.getByText("Copy event ID")).toBeInTheDocument();
    });

    const copyButton = screen.getByText("Copy event ID");

    userEvent.click(copyButton);

    await waitFor(() => {
      expect(copyButton).not.toBeInTheDocument();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      mockedEvents[0].id
    );
  });

  test("handle edit event", async () => {
    const { getAllByText } = render(
      <DataTable
        columns={columns}
        data={mockedEvents}
        loading={false}
        error={false}
      />
    );

    const firstMenuButton = getAllByText("Open menu")[0];

    userEvent.click(firstMenuButton);

    await waitFor(() => {
      expect(screen.getByText("Edit event")).toBeInTheDocument();
    });

    const editButton = screen.getByText("Edit event");

    userEvent.click(editButton);

    await waitFor(() => {
      expect(
        screen.getByText("Edit the form below to update the event.")
      ).toBeInTheDocument();
    });
  });
});
