import { useState } from "react";

const CreateDeptAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/create-dept-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to create department admin");
        return;
      }

      setMessage("✅ Department admin created successfully");

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        department: "",
      });
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Create Department Admin</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          <option value="Library">Library</option>
          <option value="Hostel">Hostel</option>
          <option value="Sports">Sports</option>
          <option value="Transport">Transport</option>
          <option value="Canteen">Canteen</option>
        </select>

        <button type="submit">Create Admin</button>
      </form>
    </div>
  );
};

export default CreateDeptAdmin;
