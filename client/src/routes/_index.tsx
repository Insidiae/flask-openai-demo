import { useEffect, useRef, useState } from "react";
import { json, useFetcher, type ActionFunctionArgs } from "react-router-dom";

type Message = {
  id: string;
  from: "user" | "bot";
  content: string;
};

async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());

  return json({ ok: true, message: response.message });
}

export default function IndexRoute() {
  const fetcher = useFetcher();
  const $form = useRef<HTMLFormElement>(null);

  const [messageHistory, setMessageHistory] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      from: "bot",
      content: "Hi! I'm your AI-Generative Chatbot",
    },
  ]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      setMessageHistory((prevState) => [
        ...prevState,
        { id: crypto.randomUUID(), from: "bot", content: fetcher.data.message },
      ]);
      $form.current?.reset();
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    if (fetcher.formData) {
      const content = fetcher.formData.get("message") as string;
      setMessageHistory((prevState) => [
        ...prevState,
        { id: crypto.randomUUID(), from: "user", content },
      ]);
    }
  }, [fetcher.formData]);

  return (
    <>
      <h1>AI-Gen ChatBot</h1>
      <h4>Please start your personalized interaction with the chatbot</h4>
      <div className="boxed">
        <div>
          <div className="chatbox">
            {messageHistory.map((message) => {
              return (
                <p
                  key={message.id}
                  className={message.from === "bot" ? "botText" : "userText"}
                >
                  <span>{message.content}</span>
                </p>
              );
            })}
          </div>
          <fetcher.Form ref={$form} method="POST" className="userInput">
            <input
              className="textInput"
              type="text"
              name="message"
              placeholder="Message"
            />
            <button type="submit">Send</button>
          </fetcher.Form>
        </div>
      </div>
    </>
  );
}

IndexRoute.action = action;
