import Chat, { Bubble, useMessages, MessageProps } from "@chatui/core";
import axios from "axios";

const initialMessages = [
  {
    type: "text",
    content: { text: "主人好，我是您的贴心电影伴侣~" },
    user: {
      avatar: "//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg",
    },
  },
];

interface QuickReplie {
  icon?: string;
  name: string;
  isNew?: boolean;
  isHighlight?: boolean;
}

// 默认快捷短语，可选
const defaultQuickReplies: Array<QuickReplie> = [
  {
    icon: "message",
    name: "来一部喜剧电影",
    isNew: true,
    isHighlight: true,
  },
  {
    name: "随便推荐一部电影",
    isNew: true,
  },
];

const App = () => {
  // 消息列表
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);

  // 发送回调
  function handleSend(type: string, val: string) {
    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      });

      setTyping(true);

      axios
        .post("http://127.0.0.1:3000/chat", {
          query:val
        })
        .then((res) => {
          const agentResponse = res.data.response;
          appendMsg({
            type: "text",
            content: { text: agentResponse },
          });
        })
        .catch(() => {
          appendMsg({
            type: "text",
            content: { text: "请求出了点问题，请重试～" },
          });
        });
    }
  }

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  function handleQuickReplyClick(item: QuickReplie) {
    handleSend("text", item.name);
  }

  function renderMessageContent(msg: MessageProps) {
    const { type, content } = msg;

    // 根据消息类型来渲染
    switch (type) {
      case "text":
        return <Bubble content={content.text} />;
      case "image":
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      default:
        return null;
    }
  }

  return (
    <Chat
      navbar={{ title: "电影伴侣" }}
      messages={messages}
      renderMessageContent={renderMessageContent}
      quickReplies={defaultQuickReplies}
      onQuickReplyClick={handleQuickReplyClick}
      onSend={handleSend}
    />
  );
};

export default App;
