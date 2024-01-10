import { TCreateEvent, TEvent, TResponse } from "@/interfaces/interfaces";

export const BASE_URL = `/api/events`;
export const IP_API_URL = "http://ip-api.com/json/?fields=countryCode";

export const getEvents = async (
  search: string
): Promise<TResponse<TEvent[]>> => {
  const result = await fetch(`${BASE_URL}/${search}`);

  const response = await result.json();

  return response as TResponse<TEvent[]>;
};

export const deleteEvent = async (id: string) => {
  const result = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await result.json();

  return data as TResponse<{ id: string }>;
};

export const addEvent = async (
  event: TCreateEvent
): Promise<TResponse<TEvent>> => {
  const submitData = event;

  if (event.type === "ads") {
    const countryCode = await getCountryCode();

    if (countryCode) {
      submitData.countryCode = countryCode;
    } else {
      return { data: null, message: "Error occured, please try again later" };
    }
  }

  const result = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submitData),
  });

  const data = await result.json();

  return data as TResponse<TEvent>;
};

export const editEvent = async (
  event: TCreateEvent,
  id: string
): Promise<TResponse<TEvent>> => {
  const submitData = event;

  if (event.type === "ads") {
    const countryCode = await getCountryCode();

    if (countryCode) {
      submitData.countryCode = countryCode;
    } else {
      return { data: null, message: "Error occured, please try again later" };
    }
  }

  const result = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submitData),
  });

  const data = await result.json();

  return data as TResponse<TEvent>;
};

const getCountryCode = async (): Promise<string | null> => {
  const response = await fetch(IP_API_URL, {
    method: "GET",
  });

  const data = await response.json();

  return data.countryCode || null;
};
