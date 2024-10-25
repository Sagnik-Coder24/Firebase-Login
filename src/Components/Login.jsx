import React, { useRef } from "react";

function Login({ childReff }) {
  const emailRef = useRef(null);
  const passRef = useRef(null);

  const handleChange = () => {
    childReff(emailRef.current, passRef.current);
  };

  return (
    <>
      <input
        id="email"
        ref={emailRef}
        type="email"
        placeholder="Enter your email"
        onChange={handleChange}
      />
      <br />
      <input
        id="pass"
        ref={passRef}
        type="password"
        placeholder="Enter your password"
        onChange={handleChange}
      />
      <br />
    </>
  );
}

export default Login;
