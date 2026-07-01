import { HomeOverview } from "../types/employee";

const overview: HomeOverview = {
  metrics: [
    { label: "Total Employees", value: "248", trend: "+12 this quarter", icon: "people" },
    { label: "Avg. Time to Hire", value: "18d", trend: "3 days faster", icon: "time" },
    { label: "Monthly Payroll", value: "$482K", trend: "+4.2% vs last month", icon: "payroll" },
    { label: "Retention Rate", value: "94%", trend: "+1.8% YoY", icon: "retention" },
  ],
  departments: [
    { name: "Engineering", headcount: 82, openings: 6, budget: "$176K" },
    { name: "Operations", headcount: 46, openings: 3, budget: "$84K" },
    { name: "Sales", headcount: 58, openings: 5, budget: "$112K" },
    { name: "People", headcount: 18, openings: 1, budget: "$38K" },
  ],
  employees: [
    { name: "Maya Chen", role: "Product Designer", team: "Experience", status: "Active", initials: "MC" },
    { name: "Ethan Brooks", role: "Backend Engineer", team: "Platform", status: "Onboarding", initials: "EB" },
    { name: "Sophia Patel", role: "People Partner", team: "People", status: "Active", initials: "SP" },
    { name: "Liam Carter", role: "Account Executive", team: "Sales", status: "Leave", initials: "LC" },
  ],
  activities: [
    { title: "Quarterly review cycle opened", detail: "Managers can submit feedback until Friday.", time: "09:20" },
    { title: "New hire paperwork completed", detail: "Ethan Brooks is ready for IT provisioning.", time: "10:45" },
    { title: "Payroll export prepared", detail: "June payroll summary is ready for finance.", time: "12:10" },
  ],
};

export const getHomeOverview = async (): Promise<HomeOverview> => overview;
