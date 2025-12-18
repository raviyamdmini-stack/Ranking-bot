import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from 'baileys';
import Pino from 'pino';
import { ensureDirs } from './utils.js';
import { SESSION_FOLDER } from './config.js';

ensureDirs();

const logger = Pino({ level: 'info' });

async function runPair() {
  const phone = process.env.PAIR_NUMBER;
  if (!phone) {
    console.log('Set PAIR_NUMBER=947XXXXXXXX to get a pairing code.');
    process.exit(1);
  }

  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_FOLDER);

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger
  });

  sock.ev.on('creds.update', saveCreds);

  try {
    const code = await sock.requestPairingCode(phone);
    console.log(`Pairing Code for ${phone}: ${code}`);
    console.log('Open WhatsApp > Linked devices > Link with phone number, then enter this code.');
  } catch (e) {
    console.error('Failed to generate pairing code:', e);
  }
}

runPair();
