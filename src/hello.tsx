import React, { useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const username = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  useEffect(() => {
    const a = async () => {
      const users = await axios.get("/users");
      console.log(users);
    };
    a();
  });

  const login = () => {
    axios.post("/auth/login", { username: "test", password: "password" });
  };
  const signup = () => {
    const user = {
      username,
      email,
      password,
    };
    axios.post("/auth/signup", user);
  };
  return (
    <div className="app">
      <button onClick={() => login}>login</button>
      <br />
      <input
        ref={username}
        name="username"
        type="text"
        placeholder="username"
      />
      <input ref={email} name="email" type="text" placeholder="email" />
      <input
        ref={password}
        name="password"
        type="text"
        placeholder="password"
      />
      <br />
      <button onClick={() => signup}>signup</button>
    </div>
  );
}

export default App;
