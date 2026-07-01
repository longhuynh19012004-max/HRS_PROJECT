export type Department = {
  name: string;
  headcount: number;
  openings: number;
  budget: string;
};

export type Employee = {
  name: string;
  role: string;
  team: string;
  status: "Active" | "Onboarding" | "Leave";
  initials: string;
};

export type Activity = {
  title: string;
  detail: string;
  time: string;
};

export type HomeOverview = {
  metrics: Array<{
    label: string;
    value: string;
    trend: string;
    icon: "people" | "time" | "payroll" | "retention";
  }>;
  departments: Department[];
  employees: Employee[];
  activities: Activity[];
};
