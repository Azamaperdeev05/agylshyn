import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Read API key from .env
let apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey && fs.existsSync(path.join(rootDir, ".env"))) {
  const envContent = fs.readFileSync(path.join(rootDir, ".env"), "utf-8");
  const match = envContent.match(/ELEVENLABS_API_KEY=([^\r\n]+)/);
  if (match) {
    apiKey = match[1].trim();
  }
}

if (!apiKey) {
  apiKey = "sk_2a9a61fb24a06de3c7c4bc8efb18f5b7392a4f6cff2706aa";
}

const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah (Verified ElevenLabs voice)
const MODEL_ID = "eleven_multilingual_v2";

const text1Sentences = [
  "Jill Price was the first person to be diagnosed with HSAM (Highly Superior Autobiographical Memory), a condition which enables someone to remember the events of their life in great detail.",
  "Jill doesn’t make the effort to learn things by heart – it just happens.",
  "However, her ability only functions with things she is interested in.",
  "When asked to recall a long series of numbers or other general information, she loses her perfect recall.",
  "Like the rest of us, things go in one ear and out the other.",
  "Her memory is connected to her individual identity and things that are important to her.",
  "Dr McGaugh has spent half a century researching memory.",
  "He has led numerous experiments on long-term memory and short-term memory.",
  "One conclusion from the research is that people who have HSAM are more likely to enjoy daydreaming, creating fantasies and imagining different worlds.",
  "This may mean they have greater ability to create memorable pictures in their minds, which helps them remember things.",
  "Another conclusion is that having a good memory is aided by the ability to focus completely on what we are doing.",
  "Immersing ourselves deeply in a task means we are more likely to remember the details.",
  "A third finding is the importance of emotional connections.",
  "When we are engaged emotionally in something, we are less likely to forget it.",
  "That’s why our childhood memories are often very powerful.",
  "People in many walks of life – students, teachers, lawyers – need to remember information to be successful.",
  "Even if we can’t recall details in the way Price, Veiseh and Borges’s Funes can, maybe there are things we can learn from McGaugh’s research.",
  "For example, we’re more likely to remember information if we focus deeply on it, or if we can find an emotional connection with it.",
  "Understanding these things might benefit all of us."
];

const text2Sentences = [
  "In Jorge Luis Borges’s story Funes the Memorious, the title character falls off his horse, bangs his head, and suddenly remembers everything he’s ever experienced.",
  "He remembers the changing shapes of clouds and the exact position of a dog at different times of day.",
  "He remembers every leaf on every tree he’s ever seen and reconstructs his dreams at will.",
  "Some people say that truth is stranger than fiction, and sure enough, there are real people with similar abilities to Funes.",
  "The designer, artist and entrepreneur Nima Veiseh can remember every detail of his late teenage years: the clothes he was wearing on any given day, what he ate at every meal, every painting on every wall of every art gallery he’s ever visited.",
  "He can even remember the day he started to remember everything: 15th December, 2000.",
  "But Veiseh wasn’t the first. Before him was Jill Price.",
  "When Price was thirty-four, she contacted Dr James McGaugh, director of the Center for the Neurobiology of Learning and Memory at the University of California, Irvine.",
  "She explained that she had a problem: whenever she saw a date on TV, it brought back memories and she began reliving everything that had happened on that day.",
  "McGaugh invited her to the centre.",
  "To test her memory, McGaugh used a book which contained summaries of the major news stories from every day of the twentieth century.",
  "He quizzed her.",
  "What happened on 16th August, 1977?",
  "Price told him Elvis Presley died that day and it was a Tuesday.",
  "When did the singer Bing Crosby die?",
  "14th October, 1977.",
  "It was a Friday, and Price heard the news on the car radio on her way to football practice.",
  "Asked about the date of one major international event, she got the answer wrong.",
  "McGaugh corrected her, but she insisted.",
  "He checked another source and found that the book was wrong."
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function synthesizeSentence(text, outputPath) {
  if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 1000) {
    console.log(`  [EXISTS] ${path.basename(outputPath)} already generated (${fs.statSync(outputPath).size} bytes)`);
    return;
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to synthesize sentence: ${response.status} ${response.statusText} - ${errText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  console.log(`  [OK] Saved ${path.basename(outputPath)} (${buffer.length} bytes)`);
}

async function run() {
  console.log("=== ElevenLabs Audio Pre-Generator ===");
  console.log(`Voice: Sarah (${VOICE_ID}), Model: ${MODEL_ID}`);

  // Text 1
  const dir1 = path.join(rootDir, "public", "audio", "text-1");
  fs.mkdirSync(dir1, { recursive: true });
  console.log(`\n--- Generating Text 1 (${text1Sentences.length} sentences) ---`);
  for (let i = 0; i < text1Sentences.length; i++) {
    const text = text1Sentences[i];
    const outFile = path.join(dir1, `sentence_${i + 1}.mp3`);
    console.log(`Text 1 [${i + 1}/${text1Sentences.length}]: "${text.slice(0, 40)}..."`);
    await synthesizeSentence(text, outFile);
    await sleep(350);
  }

  // Text 2
  const dir2 = path.join(rootDir, "public", "audio", "text-2");
  fs.mkdirSync(dir2, { recursive: true });
  console.log(`\n--- Generating Text 2 (${text2Sentences.length} sentences) ---`);
  for (let i = 0; i < text2Sentences.length; i++) {
    const text = text2Sentences[i];
    const outFile = path.join(dir2, `sentence_${i + 1}.mp3`);
    console.log(`Text 2 [${i + 1}/${text2Sentences.length}]: "${text.slice(0, 40)}..."`);
    await synthesizeSentence(text, outFile);
    await sleep(350);
  }

  console.log("\n=== ALL AUDIO PRE-GENERATED SUCCESSFULLY! ===");
}

run().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
