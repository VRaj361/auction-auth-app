import { useState } from 'react';
import toast from 'react-hot-toast';
import '../App.css'

function SupportWidget({ user: userProp }) {
  // Fallback to localStorage user if prop not passed
  const user = userProp || JSON.parse(localStorage.getItem('user'));

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const toggleOpen = () => setOpen(o => !o);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Please fill in both fields.');
      return;
    }
    if (!user?._id) {
      toast.error('No user found. Please sign in again.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}api/queries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          title: form.title.trim(),
          description: form.description.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Support query sent.');
        setForm({ title: '', description: '' });
        setOpen(false);
      } else {
        toast.error(data.message || 'Failed to send.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        className="support-fab"
        aria-label="Support / Help"
        onClick={toggleOpen}
      >
        ?
      </button>

      {open && (
        <div className="support-form-card">
          <h4>Support Query</h4>
          <form onSubmit={handleSubmit}>
            <label htmlFor="supportTitle">Title</label>
            <input
              id="supportTitle"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Short summary"
              required
              style={{"width": "92%"}}
            />

            <label htmlFor="supportDesc">Description</label>
            <textarea
              id="supportDesc"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your issue or request..."
              required
              style={{"width": "92%"}}
            />

            <div className="support-form-actions">
              <button
                type="button"
                className="support-cancel-btn"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="support-send-btn"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default SupportWidget;