import { useState } from "react";
import toast from "react-hot-toast";
import '../App.css'

function Profile({ user }) {
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: user?.password || "", // This assumes password is stored in localStorage (not recommended in production)
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8000/api/users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Profile updated successfully");
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="profile-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Update Profile</h2>
        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default Profile;
