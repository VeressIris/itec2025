import fs from 'fs';
import gTTS from 'gtts';

const inputTxt = './text.txt';
const outputMp3 = './output.mp3';

const text = fs.readFileSync(inputTxt, 'utf-8').trim();

if (!text) {
  console.error('❌ Fișierul text este gol.');
  process.exit(1);
}

const gtts = new gTTS(text, 'en'); // sau 'en', 'fr', etc.

gtts.save(outputMp3, (err) => {
  if (err) return console.error('❌ Eroare generare audio:', err);
  console.log('✅ Audio generat:', outputMp3);
});
