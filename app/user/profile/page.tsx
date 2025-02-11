import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ProfileForm from "./profile-form";
import { UpdateProfile } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

const ProfilePage = async () => {
  const session = await auth();

  return (
    <>
      <SessionProvider session={session}>
        <ProfileForm />
      </SessionProvider>
    </>
  );
};

export default ProfilePage;
