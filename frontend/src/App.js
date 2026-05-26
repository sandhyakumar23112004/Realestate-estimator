import React, { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function App() {
  const [form, setForm] = useState({
    OverallQual: 7,
    GrLivArea: 1500,
    GarageCars: 2,
    TotalBsmtSF: 800,
    FullBath: 2,
    YearBuilt: 2000,
    TotalSF: 2300,
    TotalBath: 2.5,
    HouseAge: 20,
    IsRemodeled: 0,
    LotArea: 8000,
    OverallCond: 5,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I am your Real Estate AI Assistant. Ask me anything about property prices!",
    },
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const predict = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/predict`, form);
      setResult(res.data);
    } catch (e) {
      alert("Error connecting to backend!");
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setChatLoading(true);
    try {
      const res = await axios.post(`${API}/chat`, {
        message: input,
        context: result || {},
      });
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: res.data.response },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, something went wrong!" },
      ]);
    }
    setChatLoading(false);
  };

  const s = styles;

  return (
    <div style={s.app}>
      <div style={s.header}>
        <h1 style={s.headerTitle}>Real Estate Price Estimator</h1>
        <p style={s.headerSub}>AI-powered property valuation</p>
      </div>

      <div style={s.container}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Property Details</h2>
          <div style={s.grid}>
            {[
              { key: "OverallQual", label: "Overall Quality (1-10)" },
              { key: "GrLivArea", label: "Living Area (sqft)" },
              { key: "GarageCars", label: "Garage Cars" },
              { key: "TotalBsmtSF", label: "Basement SF" },
              { key: "FullBath", label: "Full Bathrooms" },
              { key: "YearBuilt", label: "Year Built" },
              { key: "TotalSF", label: "Total SF" },
              { key: "LotArea", label: "Lot Area" },
              { key: "HouseAge", label: "House Age (years)" },
              { key: "OverallCond", label: "Overall Condition" },
            ].map(({ key, label }) => (
              <div key={key} style={s.formGroup}>
                <label style={s.label}>{label}</label>
                <input
                  style={s.input}
                  type="number"
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: parseFloat(e.target.value) })
                  }
                />
              </div>
            ))}
          </div>
          <button style={s.btn} onClick={predict} disabled={loading}>
            {loading ? "Estimating..." : "Estimate Price"}
          </button>

          {result && (
            <div style={s.result}>
              <p style={s.resultPrice}>{result.formatted}</p>
              <p style={s.resultRange}>Range: {result.range}</p>
              <p style={s.resultSub}>Based on AI model prediction</p>
            </div>
          )}
        </div>

        <div style={s.card}>
          <h2 style={s.cardTitle}>AI Assistant</h2>
          <div style={s.chatBox}>
            {messages.map((m, i) => (
              <div key={i} style={m.role === "user" ? s.userMsg : s.botMsg}>
                {m.text}
              </div>
            ))}
            {chatLoading && <div style={s.botMsg}>Thinking...</div>}
          </div>
          <div style={s.chatInput}>
            <input
              style={s.input}
              placeholder="Ask about property prices..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button style={s.sendBtn} onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: { minHeight: "100vh", background: "#0f172a", color: "#e2e8f0" },
  header: {
    background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
    padding: "24px",
    textAlign: "center",
  },
  headerTitle: { fontSize: "28px", fontWeight: "bold", color: "#fff" },
  headerSub: { color: "#93c5fd", marginTop: "4px" },
  container: {
    display: "flex",
    gap: "24px",
    padding: "24px",
    flexWrap: "wrap",
  },
  card: {
    flex: 1,
    minWidth: "320px",
    background: "#1e293b",
    borderRadius: "12px",
    padding: "24px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "#60a5fa",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "16px",
  },
  formGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "12px", color: "#94a3b8" },
  input: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "6px",
    padding: "8px",
    color: "#e2e8f0",
    width: "100%",
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "8px",
  },
  result: {
    marginTop: "16px",
    background: "#0f172a",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center",
  },
  resultPrice: { fontSize: "32px", fontWeight: "bold", color: "#34d399" },
  resultRange: { color: "#94a3b8", marginTop: "4px" },
  resultSub: { fontSize: "12px", color: "#64748b", marginTop: "4px" },
  chatBox: {
    height: "380px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "12px",
  },
  userMsg: {
    background: "#2563eb",
    padding: "10px 14px",
    borderRadius: "12px 12px 0 12px",
    alignSelf: "flex-end",
    maxWidth: "80%",
    fontSize: "14px",
  },
  botMsg: {
    background: "#334155",
    padding: "10px 14px",
    borderRadius: "12px 12px 12px 0",
    alignSelf: "flex-start",
    maxWidth: "80%",
    fontSize: "14px",
  },
  chatInput: { display: "flex", gap: "8px" },
  sendBtn: {
    padding: "8px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
