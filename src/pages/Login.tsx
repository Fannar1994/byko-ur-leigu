
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <PageLayout>
      <LoginHeader />
      <LoginForm />
    </PageLayout>
  );
};

export default Login;
