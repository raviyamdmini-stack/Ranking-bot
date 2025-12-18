import fs from 'fs';
import moment from 'moment-timezone';
import { TIMEZONE, RANKING_FOLDER } from './config.js';

export const ensureDirs = () => {
  if (!fs.existsSync('data')) fs.mkdirSync('data');
  if (!fs.existsSync(RANKING_FOLDER)) fs.mkdirSync(RANKING_FOLDER, { recursive: true });
  if (!fs.existsSync('data/sessions')) fs.mkdirSync('data/sessions', { recursive: true });
};

export const getDayKey = () => moment().tz(TIMEZONE).format('YYYY-MM-DD');
export const getWeekKey = () => moment().tz(TIMEZONE).format('YYYY-WW');

export const safeReadJson = path => {
  if (!fs.existsSync(path)) return null;
  try {
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
};

export const safeWriteJson = (path, obj) => {
  try {
    fs.writeFileSync(path, JSON.stringify(obj, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
};

export const jidToNumber = jid => (jid || '').split('@')[0];
export const numberToJid = num => `${num}@s.whatsapp.net`;

export const formatName = (userName, jid) => {
  const id = jidToNumber(jid);
  return userName ? userName : `@${id}`;
};
