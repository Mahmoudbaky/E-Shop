"use client";

import { APP_NAME } from "@/lib/constants";
import logo from "@/app/favicon.ico";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const NotFound = () => {
  return (
    <div className="flex-center flex-col min-h-screen">
      <Image
        src={logo}
        width={48}
        height={48}
        alt={`${APP_NAME} logo`}
        priority={true}
      />

      <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">could not found the requested page</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Go to home page
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
