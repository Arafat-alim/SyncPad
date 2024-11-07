import { SignIn } from "@clerk/nextjs";
import React from "react";

const SignInPage = () => {
  return (
    <main className="auth-page">
      <SignIn
        appearance={{
          elements: {
            headerTitle: "text-lg",
          },
        }}
      />
    </main>
  );
};

export default SignInPage;
