/* ==========================================================================
   PYTHOMORI: STORY CONTROLLER & DISTINCT WHITE SPACE INTERACTIONS
   - Laptop: The Central Interactive Python Terminal (Bab 1 s/d Bab 8)
   - Mewo: Pat, Meow, Ask Python tips
   - Tissue Box: Wipe screen / Atmospheric inspect
   - Sketchbook: Read Python doodles & flowcharts
   - Lightbulb & White Door: Py-Space transition
   ========================================================================== */

class PythomoriDialogueManager {
  constructor() {
    this.container = document.getElementById('dialogueContainer');
    this.avatarImg = document.getElementById('dialogueAvatar');
    this.nameEl = document.getElementById('dialogueName');
    this.textEl = document.getElementById('dialogueText');
    this.choicesContainer = document.getElementById('dialogueChoices');
    this.currentList = [];
    this.currentIndex = 0;
    this.typewriterTimer = null;
    this.isTyping = false;
    this.onComplete = null;
  }

  isOpen() {
    return this.container && this.container.classList.contains('active');
  }

  start(dialogueList, onComplete = null) {
    this.currentList = dialogueList;
    this.currentIndex = 0;
    this.onComplete = onComplete;
    this.container.classList.add('active');
    this.showLine();
  }

  showLine() {
    if (this.currentIndex >= this.currentList.length) {
      this.close();
      if (this.onComplete) this.onComplete();
      return;
    }

    const item = this.currentList[this.currentIndex];
    
    if (this.avatarImg) {
      this.avatarImg.src = PythomoriPixelArt.getAvatarSvg(item.speakerId || 'py');
    }
    if (this.nameEl) {
      this.nameEl.innerText = item.speakerName || 'PY';
    }

    if (this.choicesContainer) {
      this.choicesContainer.classList.remove('active');
      this.choicesContainer.innerHTML = '';
    }

    this.typewrite(item.text, item.choices);
  }

  typewrite(fullText, choices) {
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    
    this.textEl.innerHTML = '';
    this.isTyping = true;
    let idx = 0;

    this.typewriterTimer = setInterval(() => {
      if (idx < fullText.length) {
        if (fullText[idx] === '<') {
          const closeIdx = fullText.indexOf('>', idx);
          if (closeIdx !== -1) idx = closeIdx + 1;
        } else {
          idx++;
        }

        this.textEl.innerHTML = fullText.substring(0, idx);
        if (idx % 2 === 0) AudioEngine.playTypewriter();
      } else {
        this.finishTyping(fullText, choices);
      }
    }, 18);
  }

  finishTyping(fullText, choices) {
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    this.isTyping = false;
    this.textEl.innerHTML = fullText;

    if (choices && choices.length > 0 && this.choicesContainer) {
      this.choicesContainer.innerHTML = '';
      choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'dialogue-choice-btn';
        btn.innerHTML = `<span>▶ ${ch.text}</span>`;
        btn.onclick = (e) => {
          e.stopPropagation();
          AudioEngine.playMenuSelect();
          if (ch.callback) ch.callback();
          if (ch.next) {
            this.start(ch.next, this.onComplete);
          } else {
            this.currentIndex++;
            this.showLine();
          }
        };
        this.choicesContainer.appendChild(btn);
      });
      this.choicesContainer.classList.add('active');
    }
  }

  advance() {
    const item = this.currentList[this.currentIndex];
    if (item && item.choices && item.choices.length > 0 && !this.isTyping) {
      return;
    }

    if (this.isTyping) {
      this.finishTyping(item.text, item.choices);
    } else {
      AudioEngine.playMenuSelect();
      this.currentIndex++;
      this.showLine();
    }
  }

  close() {
    if (this.container) this.container.classList.remove('active');
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    this.isTyping = false;
  }
}

const DialogueSystem = new PythomoriDialogueManager();

/* ================= STORY & INTERACTIVE TERMINAL ================= */
class PythomoriStory {
  constructor() {
    this.engine = null;
    this.completedLessons = new Set();
    this.currentChapterIndex = 1;
  }

  init(engine) {
    this.engine = engine;
    this.initTerminalModal();

    setTimeout(() => {
      DialogueSystem.start([
        {
          speakerId: 'py',
          speakerName: 'WHITE SPACE',
          text: 'Selamat datang di <span class="code-inline">WHITE SPACE</span>. Kamu telah berada di sini selama yang kamu ingat.'
        },
        {
          speakerId: 'py',
          speakerName: 'WHITE SPACE',
          text: 'Lampu bohlam hitam tergantung tenang di atasmu. Dekati <span class="code-inline">Laptop</span> lalu tekan <kbd>[E]</kbd> untuk membuka terminal pembelajaran Python!'
        }
      ]);
    }, 500);
  }

  initTerminalModal() {
    this.modal = document.getElementById('terminalModal');
    this.titleEl = document.getElementById('lessonTitle');
    this.descEl = document.getElementById('lessonDesc');
    this.codeEditor = document.getElementById('terminalCodeInput');
    this.consoleOutput = document.getElementById('consoleOutput');
    this.runBtn = document.getElementById('btnRunCode');
    this.closeBtn = document.getElementById('btnCloseTerminal');
    this.hintEl = document.getElementById('lessonHint');

    if (this.closeBtn) {
      this.closeBtn.onclick = () => this.modal.classList.remove('active');
    }

    if (this.runBtn) {
      this.runBtn.onclick = () => this.executeEditorCode();
    }
  }

  // Opens the Python Learning Terminal from the Laptop
  openLaptopMenu() {
    const chapterKeys = [
      { key: 'lesson_1', label: 'Bab 1: Dasar Output — print()' },
      { key: 'lesson_2', label: 'Bab 2: Variabel & 4 Tipe Data' },
      { key: 'lesson_3', label: 'Bab 3: Operator Hitung & Aritmatika' },
      { key: 'lesson_4', label: 'Bab 4: Struktur Data List []' },
      { key: 'lesson_5', label: 'Bab 5: Percabangan if / else' },
      { key: 'lesson_6', label: 'Bab 6: Perulangan for & while' },
      { key: 'lesson_7', label: 'Bab 7: Pembuatan Fungsi def' },
      { key: 'lesson_8', label: 'Bab 8: try...except & Exception' }
    ];

    const currentKey = `lesson_${this.currentChapterIndex}`;
    this.openLesson(currentKey);
  }

  openLesson(lessonKey) {
    const lesson = PythonCurriculum.lessons[lessonKey];
    if (!lesson) return;

    this.activeLesson = lesson;
    this.titleEl.innerText = lesson.title;
    this.descEl.innerHTML = `
      ${lesson.explanation}
      <div style="margin-top: 14px; padding: 12px; background: #21262d; border-radius: 6px; border: 2px solid #388bfd;">
        <b style="color: var(--py-yellow); font-size: 1.05rem;">🎯 TANTANGAN:</b>
        <div style="margin-top: 4px; color: #fff;">${lesson.challenge}</div>
      </div>
    `;

    this.codeEditor.value = lesson.starterCode || '# Tulis kode Python kamu di sini:\n';
    this.consoleOutput.innerText = '>>> Tulis kode di atas lalu klik tombol "RUN CODE"...';
    this.consoleOutput.className = 'console-output-box';

    if (this.hintEl) {
      this.hintEl.innerText = `💡 Petunjuk: ${lesson.hint}`;
    }

    this.modal.classList.add('active');
    AudioEngine.playMenuSelect();
  }

  executeEditorCode() {
    AudioEngine.playMenuSelect();
    const code = this.codeEditor.value;
    const result = PythonEngine.run(code);

    if (result.success) {
      this.consoleOutput.className = 'console-output-box';
      this.consoleOutput.innerText = result.output || '[Program selesai dieksekusi dengan 0 Error]';
      AudioEngine.playTryExcept();

      if (this.activeLesson && this.activeLesson.validate) {
        const isPassed = this.activeLesson.validate(code, result.output);
        if (isPassed) {
          this.completedLessons.add(this.activeLesson.id);
          this.consoleOutput.innerText += `\n\n${this.activeLesson.successMsg}`;
          
          if (this.currentChapterIndex < 8) {
            this.currentChapterIndex++;
          }

          setTimeout(() => {
            this.modal.classList.remove('active');
            DialogueSystem.start([
              {
                speakerId: 'py',
                speakerName: 'PY',
                text: `${this.activeLesson.successMsg} Kamu dapat membuka Laptop lagi untuk melanjutkan bab berikutnya atau melangkah melalui Pintu Putih ke Py-Space!`
              }
            ]);
          }, 1400);
        } else {
          this.consoleOutput.className = 'console-output-box error';
          this.consoleOutput.innerText += `\n\n⚠️ Kode berhasil dijalankan, namun belum memenuhi kriteria tantangan! Periksa petunjuk di bawah.`;
        }
      }
    } else {
      this.consoleOutput.className = 'console-output-box error';
      this.consoleOutput.innerText = result.error;
    }
  }

  // Handle distinct object interactions
  handleInteraction(obj) {
    if (obj.id === 'laptop') {
      // 1. LAPTOP: Central Python Learning Workstation
      this.openLaptopMenu();

    } else if (obj.id === 'mewo') {
      // 2. MEWO CAT: Interactive Pet, Meow, Python Wisdom
      DialogueSystem.start([
        {
          speakerId: 'py',
          speakerName: 'MEWO',
          text: 'Mewo si kucing hitam sedang meringkuk di lantai putih. Matanya menatapmu dengan santai.',
          choices: [
            {
              text: 'Elus Mewo (Pat Mewo)',
              next: [
                {
                  speakerId: 'py',
                  speakerName: 'MEWO',
                  text: 'Kamu mengelus kepala Mewo dengan lembut. Mewo mendengkur: *Purrrrrr...* Kamu merasa lebih tenang dan fokus untuk menulis kode.'
                }
              ]
            },
            {
              text: 'Mengeong pada Mewo (Meow)',
              next: [
                {
                  speakerId: 'py',
                  speakerName: 'MEWO',
                  text: 'Kamu mengeong pada Mewo. Mewo menatapmu datar: *"...Meow."* (Menunggu sesuatu terjadi?)'
                }
              ]
            },
            {
              text: 'Tanya Mewo tips Python',
              next: [
                {
                  speakerId: 'py',
                  speakerName: 'MEWO',
                  text: 'Mewo berkata: *"Meow... Ingat, di Python spasi indentasi sangat penting! Gunakan fungsi def jika kodemu mulai berulang-ulang."*'
                }
              ]
            }
          ]
        }
      ]);

    } else if (obj.id === 'tissue_box') {
      // 3. TISSUE BOX: Atmospheric inspect & wipe screen
      DialogueSystem.start([
        {
          speakerId: 'py',
          speakerName: 'KOTAK TISU',
          text: 'Sebuah kotak tisu putih. Untuk mengusap air mata ketika menghadapi SyntaxError atau IndentationError di jam 3 pagi.',
          choices: [
            {
              text: 'Ambil selembar tisu dan bersihkan layar',
              next: [
                {
                  speakerId: 'py',
                  speakerName: 'KOTAK TISU',
                  text: 'Kamu mengambil selembar tisu lembut dan membersihkan layar Laptop. Layar terminal kini tampak lebih jernih dan bebas debu.'
                }
              ]
            },
            {
              text: 'Biarkan tisu di tempatnya',
              callback: () => {}
            }
          ]
        }
      ]);

    } else if (obj.id === 'sketchbook') {
      // 4. SKETCHBOOK: Read Python flowcharts & doodles
      DialogueSystem.start([
        {
          speakerId: 'py',
          speakerName: 'BUKU SKETSA',
          text: 'Buku sketsa spiral dengan pita merah. Di dalamnya terdapat coretan diagram pemrograman Python.',
          choices: [
            {
              text: 'Buka Halaman 1 (Variabel & Tipe Data)',
              next: [
                {
                  speakerId: 'py',
                  speakerName: 'BUKU SKETSA',
                  text: 'Coretan Halaman 1: Gambar ular melingkari kotak memori <span class="code-inline">x = 10</span> (int) dan <span class="code-inline">nama = "Py"</span> (str).'
                }
              ]
            },
            {
              text: 'Buka Halaman 2 (Flowchart Loop & Function)',
              next: [
                {
                  speakerId: 'py',
                  speakerName: 'BUKU SKETSA',
                  text: 'Coretan Halaman 2: Diagram alur perulangan <span class="code-inline">for i in range(4):</span> dan resep mantra fungsi <span class="code-inline">def mantra(): return ...</span>.'
                }
              ]
            }
          ]
        }
      ]);

    } else if (obj.id === 'lightbulb') {
      // 5. LIGHTBULB: Hanging Bulb inspect
      DialogueSystem.start([
        {
          speakerId: 'py',
          speakerName: 'LAMPU GANTUNG',
          text: 'Lampu bohlam hitam tergantung dari langit-langit yang tak berujung. Menyinari White Space dengan hening dan tenang.'
        }
      ]);

    } else if (obj.id === 'white_door') {
      // 6. WHITE DOOR: Transition to Py-Space
      DialogueSystem.start([
        {
          speakerId: 'py',
          speakerName: 'PINTU PUTIH',
          text: 'Pintu putih mengambang di kehampaan. Gagangnya terasa dingin saat disentuh.',
          choices: [
            {
              text: 'Buka pintu dan masuk ke Py-Space (Dunia Logika)',
              callback: () => {
                AudioEngine.playDoor();
                this.engine.setupRealm('py_space');
                setTimeout(() => {
                  DialogueSystem.start([
                    {
                      speakerId: 'ruby',
                      speakerName: 'RUBY (str)',
                      text: 'Py! Selamat datang di Py-Space! Di sini semua logika dan mantra Python hidup berdampingan!'
                    }
                  ]);
                }, 400);
              }
            },
            {
              text: 'Tetap berada di White Space',
              callback: () => {}
            }
          ]
        }
      ]);

    } else if (obj.type === 'boss') {
      DialogueSystem.start([
        {
          speakerId: 'py',
          speakerName: 'EXCEPTION ABYSS',
          text: 'Glitch merah bergetar hebat! <span class="code-inline">SYNTAX ERROR PHANTOM</span> menyerang dengan tanda kurung yang tidak ditutup!',
          choices: [
            {
              text: 'Lawan Boss Menggunakan try...except!',
              callback: () => {
                BattleEngine.startBattle(
                  {
                    id: 'syntax_error',
                    name: 'SYNTAX ERROR PHANTOM',
                    maxHp: 280,
                    state: 'bugged'
                  },
                  () => {
                    DialogueSystem.start([
                      {
                        speakerId: 'py',
                        speakerName: 'PY',
                        text: '★ SELAMAT! Kamu telah menuntaskan seluruh dasar pemrograman Python dari print(), variabel, list, percabangan if, loop, fungsi (def), hingga exception handling!'
                      }
                    ]);
                  }
                );
              }
            },
            {
              text: 'Persiapkan kode dulu',
              callback: () => {}
            }
          ]
        }
      ]);
    }
  }
}

const GameStory = new PythomoriStory();
