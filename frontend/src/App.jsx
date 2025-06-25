import React, { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import UseImage from './components/UseImage.jsx'

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GENAI_API_KEY });

function App() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("chat"))
    if(todos && todos.length > 0) setChat(todos)

  },[])

  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(chat))
    console.log("Set")
  }, [chat])

  



  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setChat(prev => [...prev, { role: "user", text: input }]);
    setInput("");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", 
        contents: [{ role: "user", parts: [{ text: input }] }],
        
      });

      const text = response.text;

      // Add Gemini response
      setChat(prev => [...prev, { role: "model", text }]);
      
    } catch (err) {
      console.error("Gemini error:", err);
      setChat(prev => [...prev, { role: "model", text: "Error from Gemini API" }]);
    }
  };

  

  

  return (
    <div className="bg-amber-600 w-full min-h-screen flex justify-between">
      
      <div className="max-w-xl mx-auto p-4 ">
      
      <h1 className="text-2xl font-bold mb-4">Gemini Chatbot</h1>

      <div className="h-96 overflow-y-auto border rounded p-3 bg-gray-50 mb-4">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 text-sm ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-3 py-2 rounded shadow ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <strong>{msg.role === "user" ? "You" : "Gemini"}:</strong>{" "}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border p-2 rounded"
          placeholder="Ask Gemini anything..."
        />
        <UseImage />
        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
    </div>
  );
}

export default App;






// import React, {useEffect} from 'react'
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: "AIzaSyA-iDqZavUz8V_HASl9Zts8Tgao5MTHq1U" });

// function App() {
//   useEffect(() => {
//     const runAI = async () => {
//       try {
//         const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a 100 words",
//   });
//         console.log("Gemini says:", response.text);
//       } catch (err) {
//         console.error("Error:", err);
//       }
//     };

//     runAI();
//   }, []);
// }

// export default App



