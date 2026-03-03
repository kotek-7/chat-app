const API_BASE = "https://github.com/kotek-7/chat-app";

const messageListEl = document.getElementById("messageList");
const messageFormEl = document.getElementById("messageForm");
const statusEl = document.getElementById("status");

function escapeHtml(input) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function fetchMessages() {
  const res = await fetch(`${API_BASE}/api/messages?limit=100`);
  if (!res.ok) {
    throw new Error("メッセージ取得に失敗しました");
  }

  const data = await res.json();
  return data.messages;
}

function renderMessages(messages) {
  messageListEl.innerHTML = messages
    .map((msg) => {
      const createdAt = new Date(msg.createdAt).toLocaleString("ja-JP");
      return `
        <li class="message-item">
          <div class="message-meta">${escapeHtml(msg.userName)} / ${createdAt}</div>
          <div>${escapeHtml(msg.text)}</div>
        </li>
      `;
    })
    .join("");

  messageListEl.scrollTop = messageListEl.scrollHeight;
}

async function loadAndRender() {
  try {
    const messages = await fetchMessages();
    renderMessages(messages);
  } catch (err) {
    statusEl.textContent = err.message;
  }
}

messageFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(messageFormEl);
  const userName = String(formData.get("userName") || "").trim();
  const text = String(formData.get("text") || "").trim();

  if (!userName || !text) {
    statusEl.textContent = "名前とメッセージを入力してください";
    return;
  }

  try {
    statusEl.textContent = "投稿中...";
    const res = await fetch(`${API_BASE}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, text }),
    });

    if (!res.ok) {
      throw new Error("投稿に失敗しました");
    }

    messageFormEl.reset();
    statusEl.textContent = "投稿しました";
    await loadAndRender();
  } catch (err) {
    statusEl.textContent = err.message;
  }
});

loadAndRender();
setInterval(loadAndRender, 5000);
