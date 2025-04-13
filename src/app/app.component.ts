import { AfterViewInit, Renderer2, ElementRef, Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

import { QuestionBank, QuestionBankContentFormatEnum, QuestionBankItem, QuestionBankTypeEnum, 
  QuestionBankTypeKeys, 
  VALID_OPTION_KEYS, ValidOptionKeys } from './models/questionbank';
import { NgxPrintModule } from 'ngx-print';

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
        "type": "FillInTheBlank",
        "question": "《劝学》，作者：(@战国@)·@荀子@，原文：\n君子曰：@学不可以已@。\n@青，取之于蓝，而青于蓝@；@冰，水为之，而寒于水@。@木直中绳，𫐓以为轮，其曲中规@。@虽有槁暴，不复挺者，𫐓使之然也@。@故木受绳则直，金就砺则利，君子博学而日参省乎己，则知明而行无过矣@。@吾尝终日而思矣，不如须臾之所学也@；@吾尝跂而望矣，不如登高之博见也@。@登高而招，臂非加长也，而见者远@；@顺风而呼，声非加疾也，而闻者彰@。@假舆马者，非利足也，而致千里@；@假舟楫者，非能水也，而绝江河@。@君子生非异也，善假于物也@。",
      },
      // {
      //   "id": "5",
      //   "type": "FillInTheBlank",
      //   "latex": true,
      //   "question": "0度角弧度数为@0@；30度角弧度数为@$\\frac{\\pi}{6}$@；45度角弧度数为@$\\frac{\\pi}{4}$@；60度角弧度数为@$\\frac{\\pi}{3}$@；90度角弧度数为@$\\frac{\\pi}{2}$@；120度角弧度数为@$\\frac{2\\pi}{3}$@；135度角弧度数为@$\\frac{3\\pi}{4}$@；150度角弧度数为@$\\frac{5\\pi}{6}$@；180度角弧度数为@$\\pi$@；210度角弧度数为@$\\frac{7\\pi}{6}$@；225度角弧度数为@$\\frac{5\\pi}{4}$@；240度角弧度数为@$\\frac{4\\pi}{3}$@；270度角弧度数为@$\\frac{3\\pi}{2}$@；300度角弧度数为@$\\frac{5\\pi}{3}$@；315度角弧度数为@$\\frac{7\\pi}{4}$@；330度角弧度数为@$\\frac{11\\pi}{6}$@；360度角弧度数为@$2\\pi$@。",
      // }

      // {
      //     "type": "essay",
      //     "question": "请写一篇关于人工智能的议论文",
      //     "answer": "人工智能是一种通过模拟人类智能来实现任务的人工智能。它可以进行视觉识别、语音识别、语言理解和决策等任务。人工智能的发展已经取得了显著的进展，未来有望在各个领域发挥重要作用。"
      // }
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

    // setTimeout(() => {
    //   window.print();
    // }, 500);
  }

  private createAnswerSection() {
    const answerSection = this.render.createElement('div');
    answerSection.className = 'answer-section';
    answerSection.innerHTML = '<h2>参考答案</h2>';

    this.sampleData.items!.forEach((question, index) => {
      const answerDiv = this.render.createElement('div');
      answerDiv.className = 'answer-item';
      answerDiv.innerHTML = `
        <strong>第${index + 1}题</strong>（${this.getTypeName(question.type)}）：
        ${this.formatAnswer(question)}
      `;
      answerSection.appendChild(answerDiv);
    });

    return answerSection;
  }

  private formatAnswer(item: QuestionBankItem) {
    switch (item.type) {
      case QuestionBankTypeEnum.SingleChoice:
      case QuestionBankTypeEnum.MultipleChoice:
        return `答案：${item.answers!.join(', ')}`;
      case QuestionBankTypeEnum.FillInTheBlank:
        return item.answers ? `答案：${item.answers!.join(', ')}` : '';
      case QuestionBankTypeEnum.ShortAnswer:
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
    };
    return typeMap[type] || '未知题型';
  }

  private createQuestionElement(questionData: QuestionBankItem, index: number) {
    const questionDiv = this.render.createElement('div');
    questionDiv.className = `question`;

    // Question: index, title, and answer
    const typeLabel = this.render.createElement('div');
    const spanLabel = this.render.createElement('span');
    spanLabel.textContent = `${index + 1}. 【${this.getTypeName(questionData.type)}】`;
    typeLabel.appendChild(spanLabel);
    if (questionData.type === QuestionBankTypeEnum.FillInTheBlank) {
      let subcontents = questionData.question?.split('@');
      subcontents.forEach((sstr, idx) => {
        if (idx % 2 === 0) {
          const label = this.render.createElement('span');
          label.textContent = sstr;
          typeLabel.appendChild(label);
        } else {
          const subinput = this.render.createElement('input');
          subinput.className = 'print-input';
          subinput.type = 'text';
          subinput.style.width = `${sstr.length * 16}px`;
          typeLabel.appendChild(subinput);
        }
      });
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
    } else if (questionData.type === QuestionBankTypeEnum.Essay) {
      // 处理作文题
      const requirements = this.render.createElement('div');
      requirements.textContent = `要求：${questionData.question}`;
      questionDiv.appendChild(requirements);

      const essayBox = this.render.createElement('div');
      essayBox.className = 'essay-grid';
      essayBox.setAttribute('contenteditable', 'true');
      questionDiv.appendChild(essayBox);
    }

    return questionDiv;
  }
}
