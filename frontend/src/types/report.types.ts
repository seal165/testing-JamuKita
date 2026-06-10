/**
 * Report Types
 */

export interface Report {
  id: number;
  reporter: {
    id: number;
    nama: string;
    email: string;
  };
  reportedUser: {
    id: number;
    nama: string;
    email: string;
    role: string;
    isBanned: boolean;
  };
  reason: string;
  status: "pending" | "reviewed" | "resolved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportData {
  reportedUserId: number;
  reason: string;
}
