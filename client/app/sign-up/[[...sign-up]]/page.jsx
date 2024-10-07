"use client";

import { useEffect } from 'react';
import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div style={{ marginTop: '-70px' }}> {/* Adjust the negative margin as needed */}
        <SignUp />
      </div>
    </>
  );
};

export default SignUpPage;
