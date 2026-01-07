import React, { useEffect, useState } from "react";

function Events({ token, user }) {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_date: "",
  });
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then(setEvents)
      .catch(() => setError("Failed to fetch events"));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/tickets", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTickets(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to fetch tickets"));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingEvent) {
      setEditingEvent({ ...editingEvent, [name]: value });
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };

  const handleCreateOrUpdate = (e) => {
    e.preventDefault();

    const url = editingEvent
      ? `http://localhost:5000/api/events/${editingEvent.id}`
      : "http://localhost:5000/api/events";

    const method = editingEvent ? "PUT" : "POST";
    const body = editingEvent || newEvent;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (editingEvent) {
          setEvents(events.map((e) => (e.id === data.id ? data : e)));
          setEditingEvent(null);
        } else {
          setEvents([...events, data]);
        }
        setNewEvent({ title: "", description: "", event_date: "" });
      })
      .catch(() => setError("Operation failed"));
  };

  const handleDeleteEvent = (id) => {
    fetch(`http://localhost:5000/api/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => setEvents(events.filter((e) => e.id !== id)))
      .catch(() => setError("Failed to delete event"));
  };

  return (
    <div>
      <h2>Events</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {events.map((event) => (
          <li key={event.id} style={{ marginBottom: "15px" }}>
            <strong>{event.title}</strong> – {event.description}
            <br />
            Date: {event.event_date}
            <br />
            Organizer: {event.organizer_email || "Unknown"}
            <br />

            {(user.role === "admin" || user.id === event.organizer_id) && (
              <>
                <button onClick={() => setEditingEvent(event)}>Edit</button>
                <button onClick={() => handleDeleteEvent(event.id)}>
                  Delete
                </button>
              </>
            )}

            <button>Buy Ticket</button>
          </li>
        ))}
      </ul>

      <h3>{editingEvent ? "Edit Event" : "Create New Event"}</h3>
      <form onSubmit={handleCreateOrUpdate}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={editingEvent ? editingEvent.title : newEvent.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={
            editingEvent ? editingEvent.description : newEvent.description
          }
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="event_date"
          value={
            editingEvent ? editingEvent.event_date : newEvent.event_date
          }
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingEvent ? "Update Event" : "Create Event"}
        </button>
        {editingEvent && (
          <button type="button" onClick={() => setEditingEvent(null)}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default Events;
