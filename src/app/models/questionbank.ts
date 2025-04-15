
export enum QuestionBankTypeEnum {
    TrueFalse = 'TrueFalse',
    SingleChoice = 'SingleChoice',
    MultipleChoice = 'MultipleChoice',
    Dictation = 'Dictation',
    FillInTheBlank = 'FillInTheBlank',
    ShortAnswer = 'ShortAnswer',
    Essay = 'Essay',
}

export type QuestionBankTypeKeys = keyof typeof QuestionBankTypeEnum;

export enum QuestionBankContentFormatEnum {
    Text = 'Text',
    Markdown = 'Markdown',
}

export type QuestionBankContentFormatKeys = keyof typeof QuestionBankContentFormatEnum;

export const VALID_OPTION_KEYS = {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    E: 'E',
    F: 'F',
    G: 'G',
    H: 'H',
    I: 'I',
    J: 'J',
    K: 'K',
    L: 'L',
    M: 'M',
    N: 'N',
    O: 'O',
    P: 'P',
    Q: 'Q',
    R: 'R',
    S: 'S',
    T: 'T',
    U: 'U',
    V: 'V',
    W: 'W',
    X: 'X',
    Y: 'Y',
    Z: 'Z',
    0: '0',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
} as const;
  
export type ValidOptionKeys = keyof typeof VALID_OPTION_KEYS;

// Options
export type QuestionBankItemOption = Partial<Record<ValidOptionKeys, string>>;

export interface QuestionBankItem {
    id: string;
    // Type of the item.
    type: QuestionBankTypeKeys;
    // Title, only available for Dictation.
    title?: string;
    // Question text.
    // For Dictation, the question will be splited by the following characters: ；。？！：
    // For FillInTheBlank, the answer is surrounded with character '@' in the question text.
    // Specially, the `\n` will split the question text into multiple lines.
    question: string;
    // Question text format. Default is Text.
    optionsFormat?: QuestionBankContentFormatKeys;
    // If latex is true, the question text will be rendered as LaTeX.
    latex?: boolean;
    // Options. Available for MultipleChoice and SingleChoice.
    options?: QuestionBankItemOption;
    // Answer: available for all types except FillInTheBlank and Dictation.
    // For Dictation and FillInTheBlank, the answer is in the question text.
    // For MultipleChoice, the answer is an array of option keys.
    // For SingleChoice, the answer is only option key.
    // For TrueFalse, the answer is true or false.
    // For Essay and ShortAnswer, the answer either be the correct answer or the reference.
    answers?: string[];
    // Line of answer: available for Essay and ShortAnswer
    lineofanswer?: number;
}

export interface QuestionBank {
    id: string;
    name: string;
    items?: QuestionBankItem[];
}
