import { useAuth as useAuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useAuthContext();

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
