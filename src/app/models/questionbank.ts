
export enum QuestionBankTypeEnum {
    TrueFalse = 'TrueFalse',
    SingleChoice = 'SingleChoice',
    MultipleChoice = 'MultipleChoice',
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
    type: QuestionBankTypeKeys;
    question: string;
    optionsFormat?: QuestionBankContentFormatKeys;
    latex?: boolean;
    options?: QuestionBankItemOption;
    answers?: string[];
}

export interface QuestionBank {
    id: string;
    name: string;
    items?: QuestionBankItem[];
}
