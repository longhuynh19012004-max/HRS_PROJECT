import { HomeOverview } from "../types/employee";

const overview: HomeOverview = {
  metrics: [
    { label: "Total Employees", value: "0", trend: "", icon: "people" },
    { label: "Requests Pending", value: "0", trend: "", icon: "time" },
    { label: "Not Arrived Today", value: "0", trend: "", icon: "people" },
    { label: "Monthly Payroll", value: "$0", trend: "", icon: "payroll" },

  ],
  departments: [],
  employees: [],
  activities: [],
};

export const getHomeOverview = async (): Promise<HomeOverview> => overview;
