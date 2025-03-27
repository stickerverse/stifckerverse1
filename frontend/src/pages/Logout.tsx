import { auth } from "app/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await auth.signOut();
        toast.success("Logged out successfully");
        navigate("/");
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("Error signing out");
        navigate("/");
      }
    };

    performLogout();
  }, [navigate]);

  return null;
}