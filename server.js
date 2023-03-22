import express from "express";
import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";
import cors from "cors";

config();
const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let allow = [
  "http://localhost:3000",
  "https://chatgpt-clone-leehour99.web.app",
];
function options(req, res) {
  let temp;
  let origin = req.header("Origin");
  if (allow.indexOf(origin) > -1) {
    temp = { origin: true, optionSuccessStatus: 200 };
    return res(null, temp);
  }
  temp = {
    origin: "nope",
  };
  return res(null, temp);
}
// options();
app.use(cors(options));

export const askChatGpt = async (input) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `${input}` }],
  });
  return response;
};

app.get("/", async (req, res) => {
  res.status(200).json({
    stat: "ok",
  });
});

app.post("/", async (req, res) => {
  try {
    const input = req.body.question;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `${input}` }],
    });
    return res
      .status(200)
      .json({ data: response.data.choices[0].message.content });
  } catch (err) {
    return res.json({ stat: 400, data: err });
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  //   console.log("server is runninng on port" + port);
  //   console.log(process.env.OPENAI_API_KEY);
});
