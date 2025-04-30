import Link from "next/link";
import { auth } from "@/auth";
import { signOutUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import SignOutForm from "./sign-out-form";
/**
 * UserButton is a component that displays a dropdown menu with user information and actions.
 * If the user is not signed in, it displays a sign in button.
 * If the user is signed in, it displays a dropdown menu with the user's name and email,
 * as well as links to the user's profile, order history, and (if the user is an admin) the admin dashboard.
 * The dropdown menu also includes a sign out button.
 *
 * @returns {JSX.Element} The UserButton component.
 * @example
 * <UserButton />
 */
const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild variant="outline">
        <Link href="/sign-in">
          <UserIcon /> Sign in
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toLocaleUpperCase() ?? "U";
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="relativee w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200"
            >
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
                {session.user?.name}
              </div>
              <div className="text-sm text-muted-foreground leading-none">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href="/user/profile" className="w-full">
              User Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/user/orders" className="w-full">
              Order History
            </Link>
          </DropdownMenuItem>

          {session?.user?.role === "admin" && (
            <DropdownMenuItem>
              <Link href="/admin/overview" className="w-full">
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="p-0 mb-1">
            <SignOutForm />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;

// charAt(0) : returns the character of the string where i entered its index
