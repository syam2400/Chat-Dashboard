"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    // Remove user session and token
    sessionStorage.removeItem("User-Details");
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redirect to login page after logout
    router.replace("/auth/login");
  }, [router]);
  return null;
}
