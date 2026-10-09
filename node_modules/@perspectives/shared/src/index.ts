export const userRoles = ["PATIENT", "PSYCHOLOGIST", "ADMIN"] as const;
export type UserRole = (typeof userRoles)[number];

export type HealthResponse = {
  status: "ok";
  service: "perspectives-api";
};
