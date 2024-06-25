import { useState } from "react";
import axios from "axios";

interface ConversationData {
  role: string;
  message: string;
}

function App() {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<Array<ConversationData>>([]);

  const sendQuery = async () => {
    if (!query) return;

    setConversation((prev) => [...prev, { role: "user", message: query }]);
    setQuery("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/chat",
        {
          query,
        }
      );

      const agentResponse = response.data.response;

      setConversation((prev) => [
        ...prev,
        { role: "agent", message: agentResponse },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <div className="container">
      <h1>你好，我是电影小顾问</h1>
      <h4>你的忠实电影伴侣</h4>
      <div id="conversation">
        {conversation.map((item, index) => (
          <p key={index} className={item.role}>
            {item.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        id="queryInput"
        placeholder="可以问一下关于电影相关的东西..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={sendQuery}>发送</button>
    </div>
  );
}

export default App;
