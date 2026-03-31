"use client";

import { LogOut } from "lucide-react";
import { authClient } from "../lib/auth-client";
import { useRouter } from "next/navigation";

interface SignOutButtonProps {
  isMobile?: boolean;
}

export default function SignOutButton({ isMobile }: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh(); // Refresh once session is gone
          router.push("/"); // Redirect just in case
        },
      },
    });
  };

  if (isMobile) {
    return (
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-[#ff5b5b] hover:bg-white/5 transition-colors"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      title="Sign Out"
      className="p-2 text-[#ff5b5b] hover:bg-red-500/10 rounded-md transition-colors"
    >
      <LogOut size={18} />
    </button>
  );
}
