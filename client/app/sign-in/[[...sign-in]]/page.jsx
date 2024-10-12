"use client";

import { useEffect } from "react";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const router = useRouter();

  return (
    <>
      <div className="flex justify-center w-full mt-6">
        <SignIn afterSignIn={router.push("/dashboard")} />
      </div>
    </>
  );
};

export default SignInPage;
