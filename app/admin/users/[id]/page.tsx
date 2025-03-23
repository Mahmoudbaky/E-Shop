import { getUserById } from "@/lib/actions/user.actions";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import UpdateUserForm from "./update-user-form";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Update User",
};

const UesrPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;
  const session = await auth();

  const user = await getUserById(id);

  if (!user) return notFound();

  return (
    <div className="space-y-2 mx-auto max-w-lg">
      <h1 className="h1-bold">Update user info</h1>
      <SessionProvider session={session}>
        <UpdateUserForm user={user} />
      </SessionProvider>
    </div>
  );
};

export default UesrPage;
