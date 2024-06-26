import express from "express";
import julep from "@julep/sdk";
import bodyParser from "body-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// eslint-disable-next-line no-undef
const apiKey = process.env.JULEP_API_KEY; // Replace with your actual API key
const client = new julep.Client({ apiKey });

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.post("/chat", async (req, res) => {
  try {
    const query = req.body.query;

    const user = await client.users.create({
      name: "Xiaoxu",
      about: "前端开发工程师",
    });

    const agent = await client.agents.create({
      name: "Movie suggesting assistant",
      model: "gpt-4-turbo",
    });

    const session = await client.sessions.create({
      agentId: agent.id,
      userId: user.id,
      situation:
        "你是一个电影伴侣。告诉人们他们想要的电影，并向用户推荐电影。",
    });

    const chatParams = {
      messages: [
        {
          role: "user",
          name: "Ayush",
          content: query,
        },
      ],
    };
    const chatResponse = await client.sessions.chat(session.id, chatParams);
    const responseMessage = chatResponse.response[0][0].content;
    res.json({ response: responseMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
