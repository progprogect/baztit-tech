const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Prevent caching of HTML pages — ensures users get fresh forms, not stale Formspree links */
app.use((req, res, next) => {
  if (['/', '/quiz', '/quiz.html', '/index.html', '/solutions'].includes(req.path)) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  }
  next();
});

/* Telegram: заявки приходят в бот. Нужны env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID */
async function sendToTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set. Add them in Railway Variables.');
  }
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: String(chatId).trim(), text, parse_mode: 'HTML' })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('Telegram API error:', res.status, data);
    throw new Error(data.description || 'Telegram API error');
  }
}

app.post('/api/contact', async (req, res) => {
  try {
    const { name, contact, business, task } = req.body;
    const text = `🆕 <b>Contact Form</b>\n\n👤 ${name || '—'}\n📱 ${contact || '—'}\n🏢 ${business || '—'}\n\n📝 ${(task || '—').replace(/</g, '&lt;')}`;
    await sendToTelegram(text);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

app.post('/api/quiz', async (req, res) => {
  try {
    const { name, contact, description, email, quiz_goal, quiz_industry, quiz_pain, quiz_timeline, quiz_other } = req.body;
    const text = `🆕 <b>Quiz Lead</b>\n\n👤 ${name || '—'}\n📱 ${contact || '—'}\n📧 ${email || '—'}\n\n🎯 ${quiz_goal || '—'}\n🏢 ${quiz_industry || '—'}\n😤 ${quiz_pain || '—'}\n⏱ ${quiz_timeline || '—'}\n📌 ${quiz_other || '—'}\n\n📝 ${(description || '—').replace(/</g, '&lt;')}`;
    await sendToTelegram(text);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

app.get('/quiz.html', (req, res) => res.render('quiz'));
app.get('/index.html', (req, res) => res.render('index'));

app.get('/solutions', (req, res) => res.render('solutions'));
app.get('/quiz', (req, res) => res.render('quiz'));
app.get('/', (req, res) => res.render('index'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => res.render('index'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
