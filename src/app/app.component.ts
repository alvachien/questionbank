import { AfterViewInit, Renderer2, ElementRef, Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

import { QuestionBank, QuestionBankContentFormatEnum, QuestionBankItem, QuestionBankTypeEnum, 
  QuestionBankTypeKeys, 
  VALID_OPTION_KEYS, ValidOptionKeys } from './models/questionbank';
import { NgxPrintModule } from 'ngx-print';
import katex from 'katex';

declare const renderMathInElement: any; // 声明 KaTeX 的渲染函数

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NgxPrintModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit {
  private readonly render = inject(Renderer2);
  @ViewChild('print_container', {static: true}) print_container!: ElementRef;
  @ViewChild('print_question_container', {static: true}) print_question_container!: ElementRef;
  @ViewChild('print_answer_container', {static: true}) print_answer_container!: ElementRef;

  private sampleData: QuestionBank = {
    "id": "1",
    "name": "Sample Question Bank",
    "items": [
      {
        "id": "1",
        "type": "SingleChoice",
        "question": "中国的首都是哪个城市？",
        "optionsFormat": "Text",
        "options": {
          "A": "上海",
          "B": "北京",
          "C": "广州",
          "D": "深圳",
        },
        "answers": [
          "B"
        ]
      },
      {
        "id": "2",
        "type": "MultipleChoice",
        "question": "以下哪些是编程语言？",
        "options": {
          "A": "Java",
          "B": "HTML",
          "C": "Python",
          "D": "CSS"
        },
        "answers": [
          "A",
          "C"
        ]
      },
      {
        "id": "3",
        "type": "FillInTheBlank",
        "question": "《静夜思》的作者是@李白@，字@太白@，号@青莲居士@。",
      },
      {
        "id": "4",
        "type": "Dictation",
        "title": "《劝学》，作者：(战国)·荀子。",
        "question": "君子曰：学不可以已。\n青，取之于蓝，而青于蓝；冰，水为之，而寒于水。木直中绳，𫐓以为轮，其曲中规。虽有槁暴，不复挺者，𫐓使之然也。故木受绳则直，金就砺则利，君子博学而日参省乎己，则知明而行无过矣。吾尝终日而思矣，不如须臾之所学也；吾尝跂而望矣，不如登高之博见也。登高而招，臂非加长也，而见者远；顺风而呼，声非加疾也，而闻者彰。假舆马者，非利足也，而致千里；假舟楫者，非能水也，而绝江河。君子生非异也，善假于物也。",
      },
      // {
      //   "id": "5",
      //   "type": "FillInTheBlank",
      //   "latex": true,
      //   "question": "0度角弧度数为@0@；30度角弧度数为@$\\frac{\\pi}{6}$@；45度角弧度数为@$\\frac{\\pi}{4}$@；60度角弧度数为@$\\frac{\\pi}{3}$@；90度角弧度数为@$\\frac{\\pi}{2}$@；120度角弧度数为@$\\frac{2\\pi}{3}$@；135度角弧度数为@$\\frac{3\\pi}{4}$@；150度角弧度数为@$\\frac{5\\pi}{6}$@；180度角弧度数为@$\\pi$@；210度角弧度数为@$\\frac{7\\pi}{6}$@；225度角弧度数为@$\\frac{5\\pi}{4}$@；240度角弧度数为@$\\frac{4\\pi}{3}$@；270度角弧度数为@$\\frac{3\\pi}{2}$@；300度角弧度数为@$\\frac{5\\pi}{3}$@；315度角弧度数为@$\\frac{7\\pi}{4}$@；330度角弧度数为@$\\frac{11\\pi}{6}$@；360度角弧度数为@$2\\pi$@。",
      // },
      {
        "id": "6",
        "type": "FillInTheBlank",
        "latex": true,
        "question": "已知$a^2+b^2=c^2$，则$a^2+b^2$的平方根为@$\\sqrt{a^2+b^2}=c$@。",
      },
      {
        "id": "7",
        "type": "FillInTheBlank",
        "latex": true,
        "question": "重要不等式：如果$a, b \\isin R$。那么@$\\frac{a^2+b^2}{2} \\ge ab$@，其中，该不等式取等号时，a @=@ b。基本不等式：如果$a, b \\isin R_+$。那么@$\\frac{a+b}{2} \\ge \\sqrt{ab}$@，其中，该不等式取等号时，a @=@ b。通常，我们将$\\frac{a+b}{2}$称为@算术平均数@，将$\\sqrt{ab}$称为@几何平均数@，所以，基本不等式可以表述为两个正数的@算术平均数@不小于@几何平均数@。",
      },
      {
        "id": "8",
        "type": "ShortAnswer",
        "question": "请简要说明一下什么是机器学习？",
        "lineofanswer": 5,
        "answers": [
          "机器学习是一种通过模拟人类智能来实现任务的人工智能。它可以进行视觉识别、语音识别、语言理解和决策等任务。人工智能的发展已经取得了显著的进展，未来有望在各个领域发挥重要作用。"
        ]
      },
      {
        "id": "9",
        "type": "TrueFalse",
        "question": "机器学习是人工智能的一个子集。",
        "answers": [
          "True"
        ]
      },
      {
        "id": "10",
        "type": "Essay",
        "question": "请写一篇关于人工智能的议论文",
        "lineofanswer": 50,
        "answers": [
          "人工智能是一种通过模拟人类智能来实现任务的人工智能。它可以进行视觉识别、语音识别、语言理解和决策等任务。人工智能的发展已经取得了显著的进展，未来有望在各个领域发挥重要作用。"
        ]
      }
    ]
  };

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log('Entering AfterViewInit');

    this.sampleData.items!.forEach((question, index) => {
      this.print_question_container!.nativeElement.appendChild(this.createQuestionElement(question, index)!);
    });

    this.print_answer_container!.nativeElement.appendChild(this.createAnswerSection());

    let uselatex = this.sampleData.items!.some((item) => {
      return item.latex === true;
    });
    if (uselatex) {
      renderMathInElement(this.print_container.nativeElement, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          // { left: '\\(', right: '\\)', display: false },
          // { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
      });
    }
  }

  private createAnswerSection() {
    const answerSection = this.render.createElement('div');
    answerSection.className = 'answer-section';
    answerSection.innerHTML = '<h2>参考答案</h2>';

    this.sampleData.items!.forEach((question, index) => {
      const answerDiv = this.render.createElement('div');
      answerDiv.className = 'answer-item';
      if (question.type === QuestionBankTypeEnum.FillInTheBlank) {

        let subcontents = question.question?.split('@');
        let answers: string[] = [];
        subcontents.forEach((sstr, idx) => {
          if (idx % 2 === 0) {
          } else {
            answers.push(sstr);
          }
        });
        answerDiv.innerHTML = `<strong>第${index + 1}题</strong>（${this.getTypeName(question.type)}）：${answers.join(' ')}`;
      } else {
        answerDiv.innerHTML = `<strong>第${index + 1}题</strong>（${this.getTypeName(question.type)}）：${this.formatAnswer(question)}`;
      }
      answerSection.appendChild(answerDiv);
    });

    return answerSection;
  }

  private formatAnswer(item: QuestionBankItem) {
    switch (item.type) {
      case QuestionBankTypeEnum.SingleChoice:
      case QuestionBankTypeEnum.MultipleChoice:
        return `答案：${item.answers!.join(', ')}`;
      case QuestionBankTypeEnum.TrueFalse:
        return `答案：${item.answers![0] === 'True' ? '正确' : '错误'}`;
      case QuestionBankTypeEnum.Dictation:
        return `答案：${item.question}`;
      case QuestionBankTypeEnum.FillInTheBlank:
        return item.answers ? `答案：${item.answers!.join(', ')}` : '';
      case QuestionBankTypeEnum.ShortAnswer:
      case QuestionBankTypeEnum.Essay:
        if (item.answers && item.answers.length > 0) {
          return `答案：${item.answers.join(' ')}`;
        }
        return '略';
      default:
        return '';
    }
  }

  private getTypeName(type: QuestionBankTypeKeys) {
    const typeMap = {
      [QuestionBankTypeEnum.SingleChoice]: '单选',
      [QuestionBankTypeEnum.MultipleChoice]: '多选',
      [QuestionBankTypeEnum.FillInTheBlank]: '填空',
      [QuestionBankTypeEnum.Essay]: '作文',
      [QuestionBankTypeEnum.ShortAnswer]: '简答',
      [QuestionBankTypeEnum.TrueFalse]: '判断',
      [QuestionBankTypeEnum.Dictation]: '默写',
    };
    return typeMap[type] || '未知题型';
  }

  private createQuestionDictationLine(strline: string, lineDiv: HTMLElement) {
    let nprv = 0;
    for (let i = 0; i < strline.length; i++) {
      if (strline[i] === '，' ||
        strline[i] === '。' ||
        strline[i] === '；' ||
        strline[i] === '！' ||
        strline[i] === '：' ||
        strline[i] === '？') {
        let orgval = strline.slice(nprv, i);

        const subinput = this.render.createElement('input');
        subinput.className = 'print-input';
        subinput.type = 'text';
        subinput.style.width = `${orgval.length * 16}px`;
        lineDiv.appendChild(subinput);
        const label = this.render.createElement('span');
        label.textContent = strline[i];
        lineDiv.appendChild(label);

        nprv = i + 1;
      }
    }
  }
  private createQuestionFillInTheBlankLine(strline: string, lineDiv: HTMLElement) {
    let subcontents = strline.split('@');
    subcontents.forEach((scontr, idx) => {
      if (idx % 2 === 0) {
        const label = this.render.createElement('span');
        label.textContent = scontr;
        lineDiv.appendChild(label);
      } else {
        const subinput = this.render.createElement('input');
        subinput.className = 'print-input';
        subinput.type = 'text';
        subinput.style.width = `${scontr.length * 16}px`;
        lineDiv.appendChild(subinput);
      }
    });
  }

  private createQuestionElement(questionData: QuestionBankItem, index: number) {
    const questionDiv = this.render.createElement('div');
    questionDiv.className = `question`;

    // Question: index, title, and answer
    const typeLabel = this.render.createElement('div');
    const spanLabel = this.render.createElement('span');
    spanLabel.textContent = `${index + 1}. 【${this.getTypeName(questionData.type)}】`;
    typeLabel.appendChild(spanLabel);

    if (questionData.type === QuestionBankTypeEnum.Dictation) {
      const label = this.render.createElement('span');
      label.textContent = questionData.title;
      typeLabel.appendChild(label);

      let sublines = questionData.question?.split('\n');
      if(sublines.length === 1) {
        this.createQuestionDictationLine(sublines[0], label);
      } else {
        sublines.forEach((sstr, idx) => {
          const linediv = this.render.createElement('div');          
          this.createQuestionDictationLine(sstr, linediv);
          typeLabel.appendChild(linediv);
        });
      }
    } else if (questionData.type === QuestionBankTypeEnum.FillInTheBlank) {
      let sublines = questionData.question?.split('\n');
      if (sublines.length === 1) {
        this.createQuestionFillInTheBlankLine(sublines[0], typeLabel);
      } else {
        sublines.forEach((sstr, idx) => {
          const linediv = this.render.createElement('div');
          this.createQuestionFillInTheBlankLine(sstr, linediv);
          typeLabel.appendChild(linediv); 
        });
      }
    } else if (questionData.type === QuestionBankTypeEnum.SingleChoice || questionData.type === QuestionBankTypeEnum.MultipleChoice) {
      const questionTitle = this.render.createElement('span');
      questionTitle.className = 'question-title';
      questionTitle.textContent = questionData.question;
      typeLabel.appendChild(questionTitle);

      const answerArea = this.render.createElement('input');
      answerArea.type = 'text';
      answerArea.className = 'print-input';
      answerArea.style.width = '100px';

      typeLabel.appendChild(answerArea);
    } else if(questionData.type === QuestionBankTypeEnum.TrueFalse) {
      const linediv = this.render.createElement('div');
      const checkbox = this.render.createElement('input');
      checkbox.type = 'checkbox';
      linediv.appendChild(checkbox);
      const label = this.render.createElement('span');
      label.textContent = questionData.question;
      linediv.appendChild(label);

      typeLabel.appendChild(linediv); 
    } else {
      const questionTitle = this.render.createElement('span');
      questionTitle.className = 'question-title';
      questionTitle.textContent = questionData.question;
      typeLabel.appendChild(questionTitle);
    }
    questionDiv.appendChild(typeLabel);

    // Options
    if (questionData.type === QuestionBankTypeEnum.SingleChoice || questionData.type === QuestionBankTypeEnum.MultipleChoice) {
      const optionsList = this.render.createElement('ul');
      optionsList.className = 'option-list';

      (Object.keys(VALID_OPTION_KEYS) as ValidOptionKeys[]).forEach((key) => {
        if (questionData.options && questionData.options[key] !== undefined) {  // 检查属性是否存在
          const li = this.render.createElement('li');
          li.innerHTML = `<span>${key}. ${questionData.options[key]}</span>`;
          optionsList.appendChild(li);
        }
      });
      questionDiv.appendChild(optionsList);
    } else if (questionData.type === QuestionBankTypeEnum.FillInTheBlank) {
      // No options for FillInTheBlank
    } else if (questionData.type === QuestionBankTypeEnum.TrueFalse) {
      // No options for TrueFalse
    } else if (questionData.type === QuestionBankTypeEnum.ShortAnswer || questionData.type === QuestionBankTypeEnum.Essay) {
      // No options for ShortAnswer, but it need save spaces for user input
      if (questionData.lineofanswer) {
        const answerBox = this.render.createElement('div');
        for (let i = 0; i < questionData.lineofanswer; i++) {
          const lineDiv = this.render.createElement('div');
          lineDiv.className = 'print-multiple-input';
          const input = this.render.createElement('input');
          input.type = 'text';
          input.className = 'print-input';
          input.style.width = '100%';
          lineDiv.appendChild(input);
          answerBox.appendChild(lineDiv);
        }

        questionDiv.appendChild(answerBox);
      }
    // } else if (questionData.type === QuestionBankTypeEnum.Essay) {
    //   // 处理作文题
    //   const requirements = this.render.createElement('div');
    //   requirements.textContent = `要求：${questionData.question}`;
    //   questionDiv.appendChild(requirements);

    //   const essayBox = this.render.createElement('div');
    //   essayBox.className = 'essay-grid';
    //   essayBox.setAttribute('contenteditable', 'true');
    //   questionDiv.appendChild(essayBox);
    }

    return questionDiv;
  }
}
