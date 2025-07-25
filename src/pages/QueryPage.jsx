import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../App.css";

function QueryPage() {
  const { id } = useParams(); // purchase order ID
  const location = useLocation();
  const queryType =
    new URLSearchParams(location.search).get("type") || "general";

  const [form, setForm] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}api/purchaseQueries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            purchaseOrderId: id,
            type: queryType,
            ...form,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Query submitted successfully");
        setForm({ title: "", description: "" });
      } else {
        toast.error(data.message || "Failed to submit");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="query-page-container">
      <h2>{queryType === "technical" ? "Technical Query" : "General Query"}</h2>
      <form className="query-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          className="title-query"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter query title"
          required
        />
        <label>Subjects</label>
        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="dropdown-select"
        >
          <option value="">Select a subject</option>
          <option value="UI Bug">Dispatch clearence</option>
          <option value="Login Issue">Mobilisation</option>
          <option value="Performance">Completion certificate</option>
          <option value="API Failure">Others</option>
        </select>
        <label>Description</label>
        <textarea
          name="description"
          rows="4"
          value={form.description}
          onChange={handleChange}
          className="description-query"
          placeholder="Enter query description"
          required
        ></textarea>
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Query"}
        </button>
      </form>
    </div>
  );
}

export default QueryPage;
