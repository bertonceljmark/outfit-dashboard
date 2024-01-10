import "@testing-library/jest-dom";
import "../__config__/matchMedia.mock";

import { fireEvent, render } from "@testing-library/react";
import App from "../App";
import * as useEventsModule from "@/hooks/useEvents";
import { ChangeEvent } from "react";

jest.mock("@/hooks/useEvents", () => {
  let searchValue = "abc";

  return {
    default: () => ({
      events: [],
      searchValue,
      loading: false,
      error: null,
      updateRow: jest.fn(),
      deleteRow: jest.fn(),
      createRow: jest.fn(),
      onSearchChange: (event: ChangeEvent<HTMLInputElement>) => {
        searchValue = event.target.value;
      },
    }),
  };
});

describe("App Component", () => {
  test("renders without crashing", () => {
    render(<App />);
  });

  test("updates search input value", () => {
    const { getByPlaceholderText } = render(<App />);
    const searchInput = getByPlaceholderText("Search...") as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: "sample search" } });

    expect(useEventsModule.default().searchValue).toBe("sample search");
  });
});
