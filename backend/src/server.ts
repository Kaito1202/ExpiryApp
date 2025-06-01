// backend/src/server.ts
import express from 'express';
import { Client } from '@line/bot-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const client = new Client({
  channelAccessToken: process.env.LINE_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
});

app.get('/notify', async (req, res) => {
  try {
    await client.pushMessage(process.env.LINE_USER_ID!, {
      type: 'text',
      text: '🧊「牛乳」の賞味期限が明日です！',
    });
    console.log('✅ 通知送信成功');
    res.send('通知を送りました');
  } catch (err) {
    console.error('❌ 通知失敗:', err);
    res.status(500).send('通知に失敗しました');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 通知サーバー起動中 http://localhost:${PORT}`);
});
