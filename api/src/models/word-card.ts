type NounDetails = {
  nominative: string;
  genitive: string;
  declension: number;
  gender: string;
  definition: string;
};

type AdjectiveDetails = {
  masculine: string;
  feminine: string;
  neuter: string;
  declension: number;
  definition: string;
};

type VerbDetails = {
  part1: string;
  part2: string;
  conjugation: number;
  definition: string;
};

export type Word =
  | {
      chapter: number;
      partOfSpeech: "noun";
      details: NounDetails;
    }
  | {
      chapter: number;
      partOfSpeech: "adjective";
      details: AdjectiveDetails;
    }
  | {
      chapter: number;
      partOfSpeech: "verb";
      details: VerbDetails;
    };

type Card = {
  id: string;
  front: string;
  back: string;
  partOfSpeech: "noun" | "adjective" | "verb";
};

const conjugationNames = [
  "", "1st", "2nd", "3rd", "4th"
]

export const wordToCard = (word: Word): Card => {
  switch (word.partOfSpeech) {
    case "noun": {
      const forms = [word.details.nominative, word.details.genitive];
      const front = forms[Math.floor(Math.random() * forms.length)];
      return {
        id: crypto.randomUUID(),
        partOfSpeech: "noun",
        front: front,
        back: [
          word.details.definition,
          "",
          `${word.details.nominative}, ${word.details.genitive} ${word.details.declension}${word.details.gender}`,
        ].join("\n"),
      };
    }

    case "adjective": {
      const forms = [
        word.details.masculine,
        word.details.feminine,
        word.details.neuter,
      ];
      const uniqueForms = forms.filter(
        (form, index) => index === 0 || form !== forms[index - 1],
      );
      const front = uniqueForms[Math.floor(Math.random() * uniqueForms.length)];
      const declension = word.details.declension === 1 ? "1st/2nd" : "3rd";
      return {
        id: crypto.randomUUID(),
        partOfSpeech: "adjective",
        front: front,
        back: [
          word.details.definition,
          "",
          `${uniqueForms.join(", ")} ${declension}`,
        ].join("\n"),
      };
    }

    case "verb": {
      const forms = [word.details.part1, word.details.part2];
      const front = forms[Math.floor(Math.random() * forms.length)];
      const foo = forms.join(", ")
      const conjugation = conjugationNames[word.details.conjugation]
      return {
        id: crypto.randomUUID(),
        partOfSpeech: "verb",
        front: front,
        back: [word.details.definition, "", `${foo} ${conjugation}`].join("\n"),
      };
    }
  }
};
