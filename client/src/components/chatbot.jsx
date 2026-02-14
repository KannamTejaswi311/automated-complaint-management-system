import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "student", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post("http://localhost:5000/api/chatbot", {
        message: input,
      });

      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    }

    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white shadow-lg rounded-lg p-3 border">
      <h3 className="font-bold text-lg text-center mb-2">AI Chat Assistant</h3>
      <div className="h-64 overflow-y-auto border p-2 rounded mb-2 bg-gray-50">
        {messages.map((m, i) => (
          <p
            key={i}
            className={`my-1 ${
              m.sender === "student" ? "text-blue-600 text-right" : "text-gray-700"
            }`}
          >
            {m.text}
          </p>
        ))}
      </div>
      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 border rounded-l px-2 py-1"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-3 py-1 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}
