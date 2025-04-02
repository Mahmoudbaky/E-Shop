"use client";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

const SignOutForm = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutUser(window.location.pathname);
    router.refresh();
  };

  return (
    <form action={handleSignOut} className="w-full">
      <Button className="w-full py-4 px-2 h-4 justify-start" variant="ghost">
        Sign Out
      </Button>
    </form>
  );
};

export default SignOutForm;
