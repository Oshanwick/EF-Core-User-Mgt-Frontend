import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      await register({ email, password, firstName, lastName });
      nav("/");
    } catch (ex: any) {
      setErr(ex.message || "Register failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", fontFamily: "system-ui" }}>
      <h1>Register</h1>
      <form onSubmit={submit}>
        <label>First name<br />
          <input value={firstName} onChange={e => setFirst(e.target.value)} required />
        </label>
        <br /><br />
        <label>Last name<br />
          <input value={lastName} onChange={e => setLast(e.target.value)} required />
        </label>
        <br /><br />
        <label>Email<br />
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </label>
        <br /><br />
        <label>Password<br />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        </label>
        <br /><br />
        <button type="submit">Create account</button>
      </form>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
