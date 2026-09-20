# English Listening Trainer & Audio Reader 🎧
### Ағылшын тілін тыңдап үйренуге арналған интерактивті қосымша

> **Live Application / Жұмыс істеп тұрған нұсқасы:** [https://agilshinn.vercel.app](https://agilshinn.vercel.app)

---

## Тілді таңдаңыз / Choose Language
- [🇰🇿 Қазақша нұсқасы](#-қазақша)
- [🇬🇧 English Version](#-english)

---

<a name="-қазақша"></a>
## 🇰🇿 Қазақша

**English Listening Trainer** — ағылшын тіліндегі сөйлеуді есту арқылы түсіну (Listening) қабілетін дамытуға арналған заманауи, Apple дизайны стилінде жасалған веб-қосымша. 

Қосымша мәтінді сөйлем бойынша реттеп, ElevenLabs жасанды интеллектісінің табиғи дауысымен оқиды. Тыңдаушының зейінін арттыру үшін сөйлем мәтіні әдепкі бойынша жасырылып тұрады және оны көз батырмасын басу арқылы ғана көруге болады.

### 🌟 Негізгі мүмкіндіктері

1. **👁️ Жасырын сөйлем және Көз батырмасы**:
   - Жаңа сөйлемге өткенде мәтін әдепкі бойынша жабық тұрады.
   - Оқушы алдымен сөйлемді аудиодан тыңдап, түсінуге тырысады.
   - Тексеру немесе бекіту үшін ортадағы немесе үстіңгі көз (Eye) батырмасын басып, мәтінді аша алады.

2. **🎚️ 0.5x — 1.0x Жылдамдық сырғытпасы (Slider)**:
   - Жылдамдықты қалауыңызша 0.5x пен 1.0x аралығында интерактивті сызықты сырғыту арқылы реттеуге болады.
   - Сондай-ақ бір рет басу арқылы `0.5x`, `0.75x`, `1.0x` жылдамдықтарына өту тетіктері бар.

3. **🎙️ Табиғи AI дауысы (ElevenLabs & Pre-generated Audio)**:
   - Сапалы, табиғи адам дауысына жақын интонация.
   - 2 негізгі танымдық мәтінге арналған 39 аудиофайл алдын-ала сақталған (API лимитін жұмсамайды және 0 секунд кідіріспен жылдам қосылады).

4. **⏩ Сөйлем бойынша ыңғайлы басқару**:
   - `← Алдыңғы сөйлем` және `Келесі сөйлем →` батырмалары.
   - Пернетақтамен басқару:
     - `Space` — Ойнату / Тоқтату
     - `R` — Сөйлемді қайталау
     - `→` немесе `N` — Келесі сөйлем
     - `←` немесе `P` — Алдыңғы сөйлем
     - `V` — Мәтінді ашу / жасыру

5. **⏱️ Сөйлемаралық үзіліс және Авто-жалғастыру**:
   - Сөйлем аяқталған соң күту уақыты (0-ден 10 секундқа дейін).
   - Авто-жалғастыру (әдепкі күйінде өшірулі тұрады, қаласаңыз қосуға болады).

6. **🎨 Apple Minimalist Дизайны**:
   - Таза, артық элементтерден ада премиум интерфейс.
   - Толыққанды Ақ (Light) және Қара (Dark) тақырыптарды қолдау.
   - Мобильді құрылғылар мен планшеттерге 100% бейімделген (iOS төменгі навигация панелі).

### 🛠️ Технологиялар
- **Фреймворк**: [Next.js 16](https://nextjs.org/) (App Router, Webpack)
- **Интерфейс**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Дыбыс синтезі**: [ElevenLabs API](https://elevenlabs.io/)
- **Тіл**: TypeScript 5

---

<a name="-english"></a>
## 🇬🇧 English

**English Listening Trainer** is an Apple-inspired interactive web application designed to dramatically improve English listening comprehension and sentence perception using ultra-realistic **ElevenLabs AI voices**.

The application splits passages into structured sentence units, plays crystal-clear speech, keeps text hidden by default to test listening accuracy, and provides intuitive tactile controls like interactive speed sliders and eye-toggle reveals.

### 🌟 Features

1. **👁️ Hidden Sentence Text with Eye Toggle**:
   - Sentences remain concealed by default so learners focus exclusively on acoustic comprehension.
   - Clicking the prominent **Eye button** instantly reveals the English transcript for validation.
   - Automatically re-hides upon advancing to the next sentence.

2. **🎚️ Draggable Speed Slider (0.5x – 1.0x)**:
   - Smoothly adjust speech rate anywhere between half-speed and normal speed using an Apple-styled range slider track.
   - Includes quick-tap presets: `0.5x`, `0.75x`, and `1.0x`.

3. **🎙️ Studio-Grade AI Audio (ElevenLabs & Static Zero-Latency Audio)**:
   - Integrated with ElevenLabs natural neural speech models.
   - Ships with 39 pre-rendered high-fidelity audio sentences for 2 featured cognitive psychology texts (works offline / zero API credits consumed).
   - Custom text tab allows pasting any English passage with on-the-fly speech generation.

4. **⏩ Intuitive Sentence Navigation**:
   - Previous Sentence (`←`) and Next Sentence (`→`) buttons.
   - Comprehensive keyboard shortcuts:
     - `Space`: Play / Pause
     - `R`: Replay current sentence
     - `ArrowRight` / `N`: Next sentence
     - `ArrowLeft` / `P`: Previous sentence
     - `V`: Toggle text visibility

5. **⏱️ Pause Duration & Auto-Advance**:
   - Configurable inter-sentence pause (`0s` to `10s`).
   - Auto-next toggle (default is OFF for self-paced listening, can be enabled anytime).

6. **🎨 Premium Apple Aesthetic & Mobile Optimization**:
   - Minimalist typography and balanced spacing.
   - Full Light and Dark mode support.
   - Responsive iOS bottom tab navigation on smartphones.

---

## 🚀 Quick Start / Бастау нұсқаулығы

### 1. Жобаны көшіріп алу / Clone Repository
```bash
git clone https://github.com/Azamaperdeev05/english-listening-trainer.git
cd english-listening-trainer
npm install
```

### 2. Орта айнымалыларын баптау / Environment Variables
```bash
cp .env.example .env
```
`.env` файлына өзіңіздің ElevenLabs кілтіңізді енгізіңіз:
```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```
*(Ескерту: Негізгі 2 мәтінді тыңдау үшін API кілті қажет емес, өйткені аудио файлдар жергілікті түрде алдын-ала сақталған).*

### 3. Іске қосу / Run Development Server
```bash
npm run dev
```
Браузерден [http://localhost:3000](http://localhost:3000) сілтемесін ашыңыз.

### 4. Тестілеу және Құрастыру / Tests & Build
```bash
npm test        # Тесттерді орындау
npm run build   # Продакшн нұсқаны құрастыру
```

---

## 🌐 Деплой / Deployment (Vercel)

1. Жобаны GitHub репозиторийіне салыңыз.
2. [Vercel](https://vercel.com) платформасына қосыңыз.
3. Қажет болса, Environment Variables бөліміне `ELEVENLABS_API_KEY` қосыңыз.
4. Бір батырмамен деплой жасаңыз!

---

## 📄 Лицензия / License

MIT License © 2026. Designed for English learners and educators.
