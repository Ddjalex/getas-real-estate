import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { adminMe } from "@/lib/api";

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    adminMe().then((user) => {
      if (user) {
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
        navigate("/staff-portal");
      }
    });
  }, [navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-[#1C4C3B] font-serif text-lg">Checking credentials…</div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return <>{children}</>;
}
