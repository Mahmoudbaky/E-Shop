"use client";

import { updateUserSchema } from "@/lib/validators";
import { z } from "zod";

import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

const UpdateUserForm = ({
  user,
}: {
  user: z.infer<typeof updateUserSchema>;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  return <div>UpdateUserForm</div>;
};

export default UpdateUserForm;
