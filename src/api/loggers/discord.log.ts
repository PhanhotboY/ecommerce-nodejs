import { Client, Colors, GatewayIntentBits, TextChannel } from 'discord.js';
import OpenAI from 'openai';
import {
  ChatSession,
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

class LoggerService {
  private client: Client;
  private channelId: string;
  private chatSession: ChatSession;

  constructor() {
    this.channelId = process.env.DEV_DISCORD_CHANNEL_ID || '';
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 2000,
      responseMimeType: 'text/plain',
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const genAI = new GoogleGenerativeAI(process.env.DEV_GOOGLE_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    this.client.login(process.env.DEV_DISCORD_TOKEN);

    this.client.on('ready', () => {
      if (!this.client.user) return;

      console.log(`Logged in as ${this.client.user.tag}`);
    });

    this.client.on('messageCreate', async (message) => {
      if (message.author.bot) return;

      if (message.channelId === '1245558745745063938') {
        const response = await this.getGeminiResponse(message.content);
        console.log(response.length);

        splitMessage(response).forEach((msg) => {
          message.channel.send(msg);
        });
      }
    });

    this.client.on('messageUpdate', async (oldMessage, newMessage) => {
      if (newMessage?.author?.bot) return;

      if (newMessage.channelId === '1245558745745063938') {
        const response = await this.getGeminiResponse(newMessage.content);
        console.log(response.length);

        splitMessage(response).forEach((msg) => {
          console.log(msg.slice(0, 20));
          newMessage.channel.send(msg);
        });
      }
    });
  }

  async sendFormatLog(logData: {
    title: string;
    code: number;
    message: string;
  }) {
    const { title, code, message } = logData;
    const formattedLog = {
      content: message,
      embeds: [
        {
          color: Colors.Aqua,
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
        },
      ],
    };

    await this.sendLog(formattedLog);
  }

  async sendLog(log: any) {
    if (!this.client.user) return;

    const channel = this.client.channels.cache.get(this.channelId);

    if (!channel) {
      console.log('Channel not found');
      return;
    }

    await (channel as TextChannel).send(log).catch(console.error);
  }

  async getGeminiResponse(message?: string | null) {
    if (!message) return 'Say something! 🤖';

    const result = await this.chatSession.sendMessage(message);
    const response = result.response;

    return response.text();
  }
}

const splitMessage = (message: string) => {
  let msgs = [];
  let msg = message;

  while (msg.length > 2000) {
    const index = msg.lastIndexOf('\n', 2000);
    msgs.push(msg.slice(0, index));
    msg = msg.slice(index);
  }

  msgs.push(msg);
  return msgs;
};

export default new LoggerService();
