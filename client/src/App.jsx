import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/notes";

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function App() {
  // Form state (controlled inputs)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Data + UI state
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch all notes once, on initial mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(API_URL);
        setNotes(res.data);
      } catch (err) {
        setError("Couldn't load notes. Check that the server is running on port 5000.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Add both a title and some content before saving.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const res = await axios.post(API_URL, { title, content });
      // Newest note goes to the top, matching the server's sort order
      setNotes((prev) => [res.data, ...prev]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save the note. Try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setError("");
    try {
      await axios.delete(`${API_URL}/${id}`);
      // Remove from local state so the UI updates without a refresh
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      if (err.response?.status === 404) {
        // Already gone on the server; drop it locally too
        setNotes((prev) => prev.filter((note) => note._id !== id));
      } else {
        setError("Couldn't delete the note. Try again.");
      }
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page">
      <header className="masthead">
        <h1>Student Notes</h1>
        <p>Write it down before you forget it.</p>
      </header>

      <form className="composer" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Week 4 – REST verbs"
          maxLength={120}
        />

        <label htmlFor="content">Note</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What do you want to remember?"
          rows={4}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save note"}
        </button>
      </form>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <section className="notes" aria-live="polite">
        <h2>
          Your notes {!loading && <span className="count">({notes.length})</span>}
        </h2>

        {loading ? (
          <div className="status">
            <span className="spinner" aria-hidden="true" />
            Loading notes…
          </div>
        ) : notes.length === 0 ? (
          <p className="status empty">No notes yet — add one above!</p>
        ) : (
          <ul className="note-list">
            {notes.map((note) => (
              <li key={note._id} className="note-card">
                <div className="note-head">
                  <h3>{note.title}</h3>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDelete(note._id)}
                    disabled={deletingId === note._id}
                  >
                    {deletingId === note._id ? "Deleting…" : "Delete"}
                  </button>
                </div>
                <p className="note-body">{note.content}</p>
                <time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;