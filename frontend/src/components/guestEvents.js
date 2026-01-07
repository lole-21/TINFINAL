import React, { useEffect, useState } from "react";

function GuestEvents() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/events") 
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => setError("Failed to fetch events"));
  }, []);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {events.map((event) => (
          <li key={event.id} style={{ marginBottom: "15px" }}>
            <strong>{event.title}</strong> - {event.description} <br />
            Date: {event.event_date} <br />
            Organizer: {event.organizer_email || "Unknown"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GuestEvents;
