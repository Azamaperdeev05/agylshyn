export interface FeaturedText {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  level: string;
  cefr: "B1" | "B2" | "C1";
  topic: string;
  description: string;
  sentencesCount: number;
  wordCount: number;
  text: string;
}

export const FEATURED_TEXTS: FeaturedText[] = [
  {
    id: "text-1",
    number: 1,
    title: "1-Мәтін: The Science of Memory",
    subtitle: "Jill Price, HSAM & Dr. McGaugh's Research",
    level: "Intermediate / B2",
    cefr: "B2",
    topic: "Cognitive Psychology",
    description:
      "Jill Price-тің ерекше жады (HSAM), доктор МакГоның зерттеулері және есте сақтауды жақсартудың құпиялары туралы мәтін.",
    sentencesCount: 19,
    wordCount: 254,
    text: `Jill Price was the first person to be diagnosed with HSAM (Highly Superior Autobiographical Memory), a condition which enables someone to remember the events of their life in great detail. Jill doesn’t make the effort to learn things by heart – it just happens. However, her ability only functions with things she is interested in. When asked to recall a long series of numbers or other general information, she loses her perfect recall. Like the rest of us, things go in one ear and out the other. Her memory is connected to her individual identity and things that are important to her.

Dr McGaugh has spent half a century researching memory. He has led numerous experiments on long-term memory and short-term memory. One conclusion from the research is that people who have HSAM are more likely to enjoy daydreaming, creating fantasies and imagining different worlds. This may mean they have greater ability to create memorable pictures in their minds, which helps them remember things. Another conclusion is that having a good memory is aided by the ability to focus completely on what we are doing. Immersing ourselves deeply in a task means we are more likely to remember the details. A third finding is the importance of emotional connections. When we are engaged emotionally in something, we are less likely to forget it. That’s why our childhood memories are often very powerful.

People in many walks of life – students, teachers, lawyers – need to remember information to be successful. Even if we can’t recall details in the way Price, Veiseh and Borges’s Funes can, maybe there are things we can learn from McGaugh’s research. For example, we’re more likely to remember information if we focus deeply on it, or if we can find an emotional connection with it. Understanding these things might benefit all of us.`,
  },
  {
    id: "text-2",
    number: 2,
    title: "2-Мәтін: The Reality of Total Recall",
    subtitle: "Borges's Funes, Nima Veiseh & Testing Memory",
    level: "Upper-Intermediate / B2",
    cefr: "B2",
    topic: "Literature & Memory",
    description:
      "Хорхе Луис Борхестің кейіпкері Фунес, суретші Нима Вейсе және доктор МакГоның есте сақтау қабілетін тексеру эксперименттері.",
    sentencesCount: 20,
    wordCount: 285,
    text: `In Jorge Luis Borges’s story Funes the Memorious, the title character falls off his horse, bangs his head, and suddenly remembers everything he’s ever experienced. He remembers the changing shapes of clouds and the exact position of a dog at different times of day. He remembers every leaf on every tree he’s ever seen and reconstructs his dreams at will.

Some people say that truth is stranger than fiction, and sure enough, there are real people with similar abilities to Funes. The designer, artist and entrepreneur Nima Veiseh can remember every detail of his late teenage years: the clothes he was wearing on any given day, what he ate at every meal, every painting on every wall of every art gallery he’s ever visited. He can even remember the day he started to remember everything: 15th December, 2000.

But Veiseh wasn’t the first. Before him was Jill Price. When Price was thirty-four, she contacted Dr James McGaugh, director of the Center for the Neurobiology of Learning and Memory at the University of California, Irvine. She explained that she had a problem: whenever she saw a date on TV, it brought back memories and she began reliving everything that had happened on that day. McGaugh invited her to the centre.

To test her memory, McGaugh used a book which contained summaries of the major news stories from every day of the twentieth century. He quizzed her. What happened on 16th August, 1977? Price told him Elvis Presley died that day and it was a Tuesday. When did the singer Bing Crosby die? 14th October, 1977. It was a Friday, and Price heard the news on the car radio on her way to football practice. Asked about the date of one major international event, she got the answer wrong. McGaugh corrected her, but she insisted. He checked another source and found that the book was wrong.`,
  },
];
