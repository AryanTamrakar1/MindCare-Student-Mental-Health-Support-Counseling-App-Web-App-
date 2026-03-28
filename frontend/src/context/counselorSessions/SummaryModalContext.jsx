import { createContext, useContext, useState, useEffect } from "react";
import axios from "../../api/axios";

const SummaryModalContext = createContext(null);

export const SummaryModalProvider = ({ children, session, onClose, onSaved }) => {
  const [text, setText] = useState("");
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!session) return;
    const fetchExisting = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`/sessions/summary/${session._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let s = "";
        if (res.data.summary) s = res.data.summary;
        setExisting(s);
        setText(s);
      } catch {
        setExisting(null);
        setText("");
      } finally {
        setLoading(false);
      }
    };
    fetchExisting();
  }, [session]);

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/sessions/summary",
        { appointmentId: session._id, summary: text.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSaved(true);
      setExisting(text.trim());
      if (onSaved) {
        onSaved(session._id, text.trim());
      }
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Could not save summary.");
    } finally {
      setSaving(false);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 600) + "px";
  };

  return (
    <SummaryModalContext.Provider
      value={{
        text,
        setText,
        existing,
        loading,
        saving,
        saved,
        handleSave,
        handleTextChange,
      }}
    >
      {children}
    </SummaryModalContext.Provider>
  );
};

export const useSummaryModalContext = () => {
  const ctx = useContext(SummaryModalContext);
  if (!ctx)
    throw new Error(
      "useSummaryModalContext must be used inside SummaryModalProvider"
    );
  return ctx;
};