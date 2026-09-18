import type { Company } from "./types.js";

/**
 * Assignment company tree (API payload + client tests).
 * Branch 2/3 have no employees; only Anna Blackwood has channels.
 */
export const companyClients: Company = {
  id: "d6e00056-dce4-4ef4-b034-d6467db6187d",
  name: "Company",
  values: [250, 267, 284, 301, 317, 334, 350, 250, 250, 250, 250, 350],
  branches: [
    {
      id: "d6b668e1-89a4-4467-bdf6-c9ebaf2cea5f",
      name: "Branch 1",
      values: [147, 157, 166, 156, 188, 201, 214, 147, 147, 147, 147, 214],
      employees: [
        {
          id: "e3c4637b-2f21-4b7e-883e-b13ae1a6df6a",
          name: "Anna Blackwood",
          values: [25, 26, 28, 31, 32, 34, 38, 27, 27, 27, 27, 38],
          channels: [
            {
              id: "716e7c30-b7c3-45c5-aa64-cbcf483917e0",
              name: "Existing clients",
              values: [25, 25, 26, 28, 31, 32, 34, 25, 25, 25, 25, 34],
            },
            {
              id: "bc5cd63a-668b-4c37-854d-69c1bd5fcbcd",
              name: "New organic",
              values: [0, 1, 1, 1, 0, 2, 2, 1, 1, 1, 1, 2],
            },
            {
              id: "abbf873a-a0eb-46b8-b4cf-dc58e5f7a2d7",
              name: "New paid",
              values: [0, 0, 1, 1, 2, 1, 0, 2, 1, 1, 1, 2],
            },
          ],
        },
        {
          id: "afe9ebc0-6c35-4690-80b0-20e9bc0d8c7d",
          name: "James Walker",
          values: [12, 13, 14, 14, 15, 15, 16, 12, 12, 12, 12, 17],
        },
        {
          id: "bb012770-02d3-4999-aa08-c11a9065235d",
          name: "Maria Gutierrez",
          values: [36, 39, 41, 22, 46, 48, 51, 35, 35, 35, 35, 52],
        },
        {
          id: "61cd9425-2d8e-456f-b228-f7e7c6a76e5d",
          name: "Robert Chen",
          values: [42, 43, 46, 47, 51, 55, 58, 41, 41, 41, 41, 54],
        },
        {
          id: "3e4efd29-e7e4-4695-a1dc-6f3b0853c19d",
          name: "Sarah Smith",
          values: [32, 36, 37, 42, 44, 49, 53, 32, 32, 32, 32, 53],
        },
      ],
    },
    {
      id: "71da0b06-5785-4a60-9273-4df2be619ee4",
      name: "Branch 2",
      values: [76, 80, 84, 87, 90, 92, 94, 75, 75, 75, 75, 91],
    },
    {
      id: "63b01d42-922f-43ff-b0f8-2f3484e74c43",
      name: "Branch 3",
      values: [27, 30, 34, 36, 39, 41, 42, 28, 28, 28, 28, 45],
    },
  ],
};
