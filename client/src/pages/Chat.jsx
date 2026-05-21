import { useState, useRef, useEffect } from "react";
import { sendChat } from "../api";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! I'm AnimeBot. Tell me what kind of anime you're in the mood for, or ask me to recommend based on your watchlist!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || loading) return;

    const userMessage = { role: "user", content: msg };
    const history = messages.slice(1);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { reply } = await sendChat(msg, history);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Check that the backend is running." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page chat-page">
      <div className="chat-header">
        <h1>AI Recommendations</h1>
        <p>AnimeBot knows your watchlist and will recommend anime tailored to you.</p>
      </div>

      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>
            {m.role === "assistant" && <span className="bot-avatar">⛩</span>}
            <div className="bubble-text">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble assistant">
            <span className="bot-avatar">⛩</span>
            <div className="bubble-text typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Something like Demon Slayer but more psychological..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>Send</button>
      </form>
    </div>
  );
}
