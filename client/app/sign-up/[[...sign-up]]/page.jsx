"use client";

import { useEffect } from 'react';
import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SignUp />
    </>
  );
};

export default SignUpPage;
