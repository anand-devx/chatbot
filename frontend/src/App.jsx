import React, { useEffect, useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { Buffer } from "buffer";
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GENAI_API_KEY });
window.Buffer = Buffer;
function App() {
  fetch('https://chatbot-2-k0xs.onrender.com')
  .then((res) => {console.log("fetch")})
    setInterval(async() => {
      await fetch('https://chatbot-2-k0xs.onrender.com')
      console.log("fetch")
    }, 14 * 60 * 1000);



  const [useFileUpload, setUseFileUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [fileName, setFileName] = useState("");
  const [sending, setSending] = useState(false); // for Send button
  const [uploading, setUploading] = useState(false); // for Upload button
  const [errorMsg, setErrorMsg] = useState("");
  const chatEndRef = useRef(null);

  const uploadToServer = async () => {
    setErrorMsg("");
    if (!file) {
      setErrorMsg("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch(
        "https://chatbot-2-k0xs.onrender.com/api/v1/users/upload-file",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!data?.data?.url) {
        setErrorMsg("Upload failed. Please try again.");
        setUploading(false);
        return;
      }
      setFileUrl(data.data.url);
      setErrorMsg("File uploaded successfully!");
      setTimeout(() => setErrorMsg(""), 2000);
    } catch (err) {
      setErrorMsg("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("chat"));
    if (todos && todos.length > 0) setChat(todos);
  }, []);

  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(chat));
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  const downloadImageAsBase64 = async (fileUrl) => {
    const response = await fetch(fileUrl);
    const imageArrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(imageArrayBuffer).toString("base64");
    const contentType = response.headers.get("content-type");
    return { base64, contentType };
  };

  const handleSend = async () => {
    setErrorMsg("");
    if (!input.trim()) {
      setErrorMsg("Please enter a message.");
      return;
    }
    setSending(true);

    // Only treat as image input if fileUrl is present and non-empty
    if (fileUrl) {
      setChat((prev) => [
        ...prev,
        { role: "user", text: input, fileUrl },
      ]);
      setInput("");

      try {
        const { base64, contentType } = await downloadImageAsBase64(fileUrl);
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType: contentType,
                    data: base64,
                  },
                },
                {
                  text: input,
                },
              ],
            },
          ],
        });

        const text = result.text;
        setChat((prev) => [...prev, { role: "model", text }]);
        setFile(null);
        setFileUrl("");
        setFileName("");
      } catch (error) {
        setErrorMsg("Failed to get response from Gemini.");
      } finally {
        setSending(false);
      }
    } else {
      setChat((prev) => [...prev, { role: "user", text: input }]);
      setInput("");

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: "user", parts: [{ text: input }] }],
        });

        const text = response.text;
        setChat((prev) => [...prev, { role: "model", text }]);
      } catch (err) {
        setErrorMsg("Failed to get response from Gemini.");
        setChat((prev) => [
          ...prev,
          { role: "model", text: "Error from Gemini API" },
        ]);
      } finally {
        setSending(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 transition-all duration-700">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-30 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 shadow-lg">
        <div className="max-w-full flex items-center px-6 py-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-white drop-shadow pointer-events-auto select-auto">
            <span className="bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
              Gemini Chatbot
            </span>
          </h1>
        </div>
      </header>

      {/* Chat Section */}
      <main className="flex-1 flex flex-col items-stretch justify-start pt-[4.2rem] pb-[5.2rem] transition-all duration-500">
        <div className="w-full h-full max-w-full mx-auto px-0 flex flex-col flex-1">
          <div className="rounded-none sm:rounded-3xl shadow-2xl bg-white/30 backdrop-blur-md border border-white/40 p-0 sm:p-2 md:p-4 flex flex-col flex-1 min-h-0 max-h-full">
            {/* Error Message */}
            {errorMsg && (
              <div className="mb-2 text-center text-red-600 bg-red-100 border border-red-200 rounded-lg px-4 py-2 animate-fade-in">
                {errorMsg}
              </div>
            )}
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-0 sm:px-2 py-2 sm:py-3 md:py-4 rounded-none sm:rounded-2xl bg-white/60 shadow-inner border border-white/30 mb-0 transition-all duration-500">
              {chat.length === 0 && (
                <div className="text-center text-gray-500 animate-fade-in">
                  Start the conversation!
                </div>
              )}
              {chat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex mb-2 sm:mb-3 md:mb-4 items-end ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  } animate-slide-in`}
                >
                  <div
                    className={`w-full max-w-[99vw] sm:max-w-[97vw] md:max-w-[94vw] lg:max-w-[90vw] xl:max-w-[85vw] px-2 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-xl transition-all duration-300 border-2 ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-500 via-indigo-400 to-purple-400 text-white rounded-br-2xl border-blue-200"
                        : "bg-gradient-to-br from-white via-pink-100 to-purple-100 text-gray-900 rounded-bl-2xl border-pink-200"
                    }`}
                    style={{
                      animationDelay: `${idx * 60}ms`,
                      animationFillMode: "backwards",
                      boxShadow:
                        msg.role === "user"
                          ? "0 4px 24px 0 rgba(99,102,241,0.15)"
                          : "0 4px 24px 0 rgba(236,72,153,0.10)",
                    }}
                  >
                    <div className="flex items-center mb-1">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full shadow ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-blue-400 to-indigo-500"
                            : "bg-gradient-to-br from-pink-300 to-purple-300"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M8 12h8M12 8v8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      <span className={`ml-2 sm:ml-3 font-bold text-xs sm:text-sm md:text-base ${msg.role === "user" ? "text-blue-100" : "text-pink-500"}`}>
                        {msg.role === "user" ? "You" : "Gemini"}
                      </span>
                    </div>
                    <span className="whitespace-pre-line text-xs sm:text-base md:text-lg leading-relaxed flex items-center gap-2">
                      {msg.text}
                    </span>
                    {/* Show uploaded image if present */}
                    {msg.fileUrl && (
                      <img
                        src={msg.fileUrl}
                        alt="uploaded"
                        className="mt-2 rounded-xl max-h-40 border border-indigo-200 shadow"
                      />
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            {/* File Upload Area (remains above footer) */}
            {useFileUpload && (
              <div className="flex flex-col sm:flex-row gap-2 mt-2 items-center px-2 pb-2">
                <input
                  type="file"
                  value={fileName}
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setFileName(e.target.value);
                    setErrorMsg("");
                  }}
                  className="block border border-indigo-200 rounded-lg px-2 py-1 bg-white/80 shadow"
                  disabled={uploading}
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setFileUrl("");
                    setFileName("");
                    setErrorMsg("");
                  }}
                  className="bg-indigo-400 text-white px-4 py-2 rounded-2xl font-semibold shadow hover:bg-indigo-500 transition-all duration-200"
                  disabled={uploading}
                >
                  Remove File
                </button>
                <button
                  type="button"
                  onClick={uploadToServer}
                  className={`flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-2xl font-semibold shadow hover:bg-green-600 transition-all duration-200 ${
                    uploading ? "animate-pulse opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Fixed Footer Input */}
      <footer className="fixed bottom-0 left-0 w-full z-30 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 shadow-lg">
        <form
          className="max-w-full flex flex-col sm:flex-row gap-2 md:gap-3 items-center px-4 py-3"
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border border-indigo-200 bg-white/80 focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none p-2 sm:p-3 md:p-4 rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-200 shadow-lg text-sm sm:text-base md:text-lg"
            placeholder="Ask Gemini anything..."
            disabled={sending || uploading}
          />
          <button
            type="submit"
            disabled={sending || uploading}
            className={`relative bg-gradient-to-br from-pink-500 to-indigo-500 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-2xl font-bold shadow-xl hover:scale-105 hover:from-indigo-500 hover:to-pink-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 active:scale-95 ${
              sending ? "opacity-60 cursor-not-allowed animate-pulse" : ""
            }`}
          >
            {sending ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 md:h-6 md:w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
                <svg
                  className="h-5 w-5 md:h-6 md:w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Send
              </span>
            )}
          </button>
          {/* File Upload Button */}
          <button
            type="button"
            onClick={() => {
              setUseFileUpload(!useFileUpload);
              setErrorMsg("");
              if (!useFileUpload) {
                setFile(null);
                setFileUrl("");
                setFileName("");
              }
            }}
            className="bg-indigo-400 text-white px-4 py-2 rounded-2xl font-semibold shadow hover:bg-indigo-500 transition-all duration-200 flex items-center"
            disabled={sending || uploading}
          >
            {useFileUpload ? (
              <>
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Close
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5 5 5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Upload File
              </>
            )}
          </button>
        </form>
      </footer>
      {/* Animations */}
      <style>
        {`
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-slide-in {
          animation: slideIn 0.5s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        `}
      </style>
    </div>
  );
}

export default App;