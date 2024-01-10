import { TEvent } from "@/interfaces/interfaces";

export const mockedEvents: TEvent[] = [
  {
    id: "123",
    title: "SampleData1",
    description: "SampleDesc1",
    type: "app",
    priority: 1,
  },
  {
    id: "456",
    title: "SampleData2",
    description: "SampleDesc2",
    type: "ads",
    priority: 2,
  },
  {
    id: "789",
    title: "SampleData3",
    description: "SampleDesc3",
    type: "liveops",
    priority: 3,
  },
];
