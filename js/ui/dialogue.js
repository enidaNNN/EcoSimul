/**
 * ============================================================================
 * ECO-VALLEY: Stardew Valley Dialogue & Demetrius Mission Journal System
 * Features two-phase mission progression (Experiment in Valley -> Quiz -> Next Mission),
 * scrollable retro modal, Demetrius thumbs-up, and graduation ceremony.
 * ============================================================================
 */

class StardewDialogueSystem {
  constructor() {
    this.container = document.getElementById('dialogueContainer');
    this.nameEl = document.getElementById('dialogueSpeakerName');
    this.textEl = document.getElementById('dialogueTextBody');
    this.choicesEl = document.getElementById('dialogueChoicesRow');
    this.portraitCanvas = document.getElementById('dialoguePortrait');
    this.portraitCtx = this.portraitCanvas ? this.portraitCanvas.getContext('2d') : null;

    // Demetrius Mission Modal Elements
    this.missionModal = document.getElementById('demetriusMissionModal');
    this.missionPortraitCanvas = document.getElementById('missionDemetriusPortrait');
    this.missionPortraitCtx = this.missionPortraitCanvas ? this.missionPortraitCanvas.getContext('2d') : null;

    this.currentSpeaker = 'Demetrius';
    this.typewriterTimer = null;
    this.isTyping = false;
    this.fullText = '';
    this.charIndex = 0;

    this.initCloseButtons();
  }

  initCloseButtons() {
    const btnCloseDialogue = document.getElementById('btnCloseDialogue');
    if (btnCloseDialogue) {
      btnCloseDialogue.addEventListener('click', () => {
        this.closeDialogue();
      });
    }

    const btnCloseMission = document.getElementById('btnCloseMissionModal');
    if (btnCloseMission) {
      btnCloseMission.addEventListener('click', () => {
        this.closeMissionModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDialogue();
        this.closeMissionModal();
      }
    });
  }

  closeDialogue() {
    if (this.container) {
      this.container.style.display = 'none';
    }
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
  }

  closeMissionModal() {
    if (this.missionModal) {
      this.missionModal.style.display = 'none';
    }
  }

  openMissionModal() {
    this.closeDialogue();
    if (!this.missionModal) return;
    this.missionModal.style.display = 'flex';
    this.renderCurrentMissionUI();
    if (window.AudioEngine) window.AudioEngine.playDialogueBlip(480);
  }

  renderCurrentMissionUI() {
    const mm = window.MissionManager;
    if (!mm) return;

    if (mm.completed) {
      this.renderGraduationScreen();
      return;
    }

    const mission = mm.getCurrentMission();
    if (!mission) {
      this.renderGraduationScreen();
      return;
    }

    const sim = window.sim;
    const pName = window.player ? window.player.name : 'Ranger';
    const vName = window.player && window.player.valleyName ? window.player.valleyName : 'Lembah Greenwood';

    // Verify if simulation currently satisfies experiment condition
    if (mm.phase === 'experiment') {
      if (mm.isExperimentCompleted(sim)) {
        mm.phase = 'quiz';
      }
    }

    // Set Demetrius Portrait
    if (this.missionPortraitCtx) {
      const mood = mm.phase === 'passed' ? 'thumbs_up' : 'normal';
      window.PixelSpriteEngine.drawDemetriusPortrait(this.missionPortraitCtx, mood);
    }

    const titleEl = document.getElementById('missionModalTitle');
    const descEl = document.getElementById('missionModalDesc');
    const statusBadge = document.getElementById('missionStatusBadge');
    const quizCard = document.getElementById('missionQuizCard');
    const hintBox = document.getElementById('missionHintBox');
    const resultBox = document.getElementById('missionResultBox');

    if (titleEl) titleEl.textContent = `${mission.title} (${mm.currentMissionIndex + 1}/10)`;
    if (descEl) {
      descEl.innerHTML = `
        <div style="margin-bottom:8px; font-size:20px; color:#2b1405;">
          ${mission.desc.replace(/{playerName}/g, pName).replace(/{valleyName}/g, vName)}
        </div>
        <div style="background:#fef3c7; border:2px dashed #b45309; border-radius:5px; padding:6px 10px; font-size:18px; color:#78350f;">
          <b>🎯 Target Eksperimen Lapangan:</b> ${mission.goalText}
        </div>
      `;
    }

    // Clear previous feedback
    if (hintBox) hintBox.style.display = 'none';
    if (resultBox) resultBox.style.display = 'none';

    // PHASE 1: EXPERIMENT NOT YET COMPLETED
    if (mm.phase === 'experiment') {
      if (statusBadge) {
        statusBadge.className = 'mission-status-badge status-pending';
        statusBadge.innerHTML = `
          <div style="font-weight:bold; font-size:12px; margin-bottom:2px;">⏳ TAHAP 1: EKSPERIMEN LAPANGAN BELUM DILAKUKAN</div>
          <div style="font-size:10px;">Lakukan eksperimen di atas pada simulasi lembah untuk membuka kunci kuis pemahaman biologi!</div>
        `;
      }

      if (quizCard) {
        quizCard.style.display = 'block';
        quizCard.innerHTML = `
          <div style="text-align:center; padding:14px; background:#f5eed8; border:2px dashed #a88350; border-radius:6px;">
            <div style="font-size:24px; margin-bottom:4px;">🔒</div>
            <div style="font-family:'Silkscreen'; font-size:12px; color:#8c4200; margin-bottom:6px;">KUIS PEMAHAMAN MASIH TERKUNCI</div>
            <p style="font-size:18px; color:#5c3514; margin-bottom:12px;">
              Kamu harus melakukan eksperimen di lembah terlebih dahulu agar dapat melihat dan menjawab kuis ini.
            </p>
            <button class="stardew-btn btn-go-experiment" id="btnGoToValley">
              🚜 PERGI KE LEMBAH & UJI SIMULASI SEKARANG
            </button>
          </div>
        `;

        const btnGo = document.getElementById('btnGoToValley');
        if (btnGo) {
          btnGo.onclick = () => {
            this.closeMissionModal();
            this.showTemporaryNotice(`🎯 Misi ${mm.currentMissionIndex + 1}: ${mission.goalText}`);
          };
        }
      }
      return;
    }

    // PHASE 2: QUIZ UNLOCKED (Experiment Done!)
    if (mm.phase === 'quiz' || mm.phase === 'passed') {
      if (statusBadge) {
        statusBadge.className = 'mission-status-badge status-ready';
        statusBadge.innerHTML = `
          <div style="font-weight:bold; font-size:12px; margin-bottom:2px;">✅ EKSPERIMEN BERHASIL! TAHAP 2: KUIS PEMAHAMAN BIOLOGI</div>
          <div style="font-size:10px;">Jawab pertanyaan di bawah ini berdasarkan hasil observasi eksperimenmu di lembah.</div>
        `;
      }

      if (quizCard) {
        quizCard.style.display = 'block';
        this.renderQuizQuestion(mission.quiz);
      }
    }
  }

  renderQuizQuestion(quiz) {
    const quizCard = document.getElementById('missionQuizCard');
    if (!quizCard) return;

    quizCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span class="quiz-badge">KUIS PEMAHAMAN BIOLOGI</span>
        <button class="stardew-btn" id="btnTestSimulationAgain" style="font-size:9px; padding:3px 7px;">
          🔬 Uji Ulang di Simulasi
        </button>
      </div>
      <div class="quiz-question-text" id="quizQuestionText">${quiz.question}</div>
      <div class="quiz-options-container" id="quizOptionsContainer"></div>
    `;

    const btnTestAgain = document.getElementById('btnTestSimulationAgain');
    if (btnTestAgain) {
      btnTestAgain.onclick = () => {
        this.closeMissionModal();
        this.showTemporaryNotice('Silakan amati kembali ekosistem di lembah.');
      };
    }

    const optionsContainer = document.getElementById('quizOptionsContainer');
    if (!optionsContainer) return;

    quiz.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'stardew-quiz-option-btn';
      btn.textContent = `${String.fromCharCode(65 + idx)}. ${optText}`;
      btn.onclick = () => {
        this.handleQuizSubmit(idx);
      };
      optionsContainer.appendChild(btn);
    });
  }

  handleQuizSubmit(selectedIndex) {
    const mm = window.MissionManager;
    const result = mm.submitAnswer(selectedIndex);

    const hintBox = document.getElementById('missionHintBox');
    const resultBox = document.getElementById('missionResultBox');

    if (result.success) {
      // Correct!
      if (window.AudioEngine) window.AudioEngine.playJunimoChime();
      if (this.missionPortraitCtx) {
        window.PixelSpriteEngine.drawDemetriusPortrait(this.missionPortraitCtx, 'thumbs_up');
      }

      // Disable option buttons to prevent accidental re-clicks
      document.querySelectorAll('.stardew-quiz-option-btn').forEach(b => {
        b.disabled = true;
        b.style.opacity = '0.6';
        b.style.cursor = 'default';
      });

      if (hintBox) hintBox.style.display = 'none';
      if (resultBox) {
        resultBox.style.display = 'block';
        resultBox.className = 'mission-result-box result-success';
        resultBox.innerHTML = `
          <div style="font-size:20px; font-weight:bold; color:#15803d; margin-bottom:4px;">
            🎉 Jawaban Tepat Sekali!
          </div>
          <p style="font-size:19px; line-height:22px; color:#14532d; margin-bottom:8px;">${result.explanation}</p>
          <button class="btn-start-game" id="btnNextMissionStep" style="font-size:14px; padding:8px 18px; width:100%;">
            ${result.finished ? '🎓 LIHAT SERTIFIKAT KELULUSAN & KEPULANGAN' : '➡️ LANJUT KE MISI BERIKUTNYA & UJI DI LEMBAH'}
          </button>
        `;

        const nextBtn = document.getElementById('btnNextMissionStep');
        if (nextBtn) {
          nextBtn.onclick = () => {
            mm.advanceToNextMission();
            this.renderCurrentMissionUI();
          };
        }

        // Scroll into view so user immediately sees the success box and next button!
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    } else {
      // Wrong! Give encouraging scientific hint
      if (window.AudioEngine) window.AudioEngine.playDialogueBlip(320);
      if (resultBox) resultBox.style.display = 'none';
      if (hintBox) {
        hintBox.style.display = 'block';
        hintBox.className = 'mission-result-box result-hint';
        hintBox.innerHTML = `
          <div style="font-size:19px; font-weight:bold; color:#b45309; margin-bottom:3px;">
            ❌ Jawaban Belum Tepat!
          </div>
          <p style="font-size:18px; line-height:21px; color:#7f1d1d; margin-bottom:6px;">
            <b>Petunjuk Demetrius:</b> ${result.hint}
          </p>
          <p style="font-size:16px; color:#78350f;">
            Coba amati kembali eksperimenmu di lembah atau pilih opsi jawaban lain yang paling sesuai dengan prinsip rantai makanan.
          </p>
        `;

        // Scroll into view
        hintBox.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }

  renderGraduationScreen() {
    const modalBody = document.getElementById('missionModalBody');
    if (!modalBody) return;

    if (window.AudioEngine) window.AudioEngine.playJunimoChime();
    if (this.missionPortraitCtx) {
      window.PixelSpriteEngine.drawDemetriusPortrait(this.missionPortraitCtx, 'thumbs_up');
    }

    const pName = window.player ? window.player.name : 'Ranger';
    const vName = window.player && window.player.valleyName ? window.player.valleyName : 'Lembah Greenwood';

    modalBody.innerHTML = `
      <div style="text-align:center; padding:16px; background:#fffdf5; border:3px solid #6d3e16; border-radius:8px;">
        <h2 style="font-family:'Silkscreen'; font-size:19px; color:#15803d; margin-bottom:6px;">
          🎓 SERTIFIKAT KELULUSAN AHLI EKOLOGI SEJATI
        </h2>
        <div style="font-size:24px; color:#b45309; font-weight:bold; margin-bottom:8px;">Selamat, ${pName}!</div>
        <p style="font-size:20px; line-height:24px; color:#3b1d06; margin-bottom:12px;">
          Kamu telah berhasil menyelesaikan seluruh <b>10 Misi Konservasi Alam</b> dan menguasai dinamika rantai makanan di <b>${vName}</b>.
          Keseimbangan antara produsen, herbivora, karnivora, dan predator puncak kini berada dalam harmoni abadi!
        </p>
        <div style="display:flex; justify-content:center; gap:16px; margin:14px 0; flex-wrap:wrap;">
          <div style="background:#fef3c7; border:2px solid #b45309; padding:6px 12px; border-radius:6px; font-size:18px;">
            Predikat: <b>LULUS CUMLAUDE ⭐</b>
          </div>
          <div style="background:#dcfce7; border:2px solid #15803d; padding:6px 12px; border-radius:6px; font-size:18px;">
            Izin Pulang: <b>DIBERIKAN RESMI 🚂</b>
          </div>
        </div>
        <p style="font-size:18px; color:#5c3514; margin-bottom:16px;">
          Kereta pos telah tiba di stasiun desa untuk membawamu pulang. Kamu bebas pulang atau tetap tinggal untuk terus merawat lembah asri ini bersama Demetrius dan para Junimo!
        </p>
        <button class="btn-start-game" id="btnContinueFreeplay" style="font-size:14px; padding:8px 20px;">
          🌾 LANJUT BERMAIN BEBAS DI LEMBAH
        </button>
      </div>
    `;

    const btnCont = document.getElementById('btnContinueFreeplay');
    if (btnCont) {
      btnCont.onclick = () => {
        this.closeMissionModal();
      };
    }
  }

  // --- Dialogue Box (Shown only when explicitly speaking) ---

  drawPortrait(speaker, mood = 'normal') {
    if (!this.portraitCtx) return;
    if (speaker === 'Demetrius') {
      window.PixelSpriteEngine.drawDemetriusPortrait(this.portraitCtx, mood);
    } else {
      const ctx = this.portraitCtx;
      ctx.clearRect(0, 0, 96, 96);
      ctx.fillStyle = '#4a7c59';
      ctx.fillRect(0, 0, 96, 96);
      ctx.fillStyle = '#76ff03';
      ctx.beginPath();
      ctx.arc(48, 52, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b2ff59';
      ctx.beginPath();
      ctx.arc(42, 44, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1c1b18';
      ctx.fillRect(36, 48, 5, 5);
      ctx.fillRect(55, 48, 5, 5);
      ctx.fillStyle = '#ff80ab';
      ctx.fillRect(32, 57, 5, 3);
      ctx.fillRect(59, 57, 5, 3);
      ctx.fillStyle = '#1b5e20';
      ctx.fillRect(46, 16, 4, 10);
      ctx.fillStyle = '#4caf50';
      ctx.beginPath();
      ctx.ellipse(54, 18, 8, 5, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  showDialogue(speaker, text, choices = [], mood = 'normal') {
    this.currentSpeaker = speaker;
    this.drawPortrait(speaker, mood);

    if (this.container) {
      this.container.style.display = 'flex';
    }

    if (this.nameEl) {
      const badge = speaker === 'Demetrius' ? 'Ahli Ekologi' : 'Roh Hutan';
      this.nameEl.innerHTML = `${speaker} <span style="font-size:11px; background:#e8d0a5; padding:1px 6px; border-radius:3px; border:1px solid #7c4c1e; color:#5c3514;">${badge}</span>`;
    }

    const pName = window.player ? window.player.name : 'Ranger';
    const vName = window.player && window.player.valleyName ? window.player.valleyName : 'Lembah Greenwood';
    this.fullText = text.replace(/{playerName}/g, pName).replace(/{valleyName}/g, vName);

    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    this.textEl.innerHTML = '';
    this.choicesEl.innerHTML = '';
    this.charIndex = 0;
    this.isTyping = true;

    this.typewriterTimer = setInterval(() => {
      if (this.charIndex < this.fullText.length) {
        this.textEl.textContent += this.fullText[this.charIndex];
        this.charIndex++;

        if (this.fullText[this.charIndex - 1] !== ' ' && window.AudioEngine) {
          const pitch = speaker === 'Junimo' ? 620 : 380;
          window.AudioEngine.playDialogueBlip(pitch);
        }
      } else {
        clearInterval(this.typewriterTimer);
        this.isTyping = false;
        this.renderChoices(choices);
      }
    }, 22);
  }

  renderChoices(choices) {
    this.choicesEl.innerHTML = '';
    if (!choices || choices.length === 0) return;

    choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'dialogue-choice-btn';
      btn.textContent = ch.label;
      btn.onclick = () => {
        if (window.AudioEngine) window.AudioEngine.playDialogueBlip(480);
        ch.action();
      };
      this.choicesEl.appendChild(btn);
    });
  }

  startDemetriusDialogue() {
    this.showDialogue(
      'Demetrius',
      'Halo, {playerName}! Ada yang bisa kubantu dalam riset ekologimu hari ini?',
      [
        {
          label: 'Buka Buku Tugas & Misi Riset (10 Misi)',
          action: () => this.openMissionModal()
        },
        {
          label: 'Minta evaluasi ekosistem saat ini',
          action: () => this.evaluateEcosystem()
        },
        {
          label: 'Tutup percakapan',
          action: () => this.closeDialogue()
        }
      ],
      'normal'
    );
  }

  evaluateEcosystem() {
    if (!window.sim) return;
    const diag = window.sim.getEcosystemDiagnostics();

    if (diag.isBalanced) {
      if (window.AudioEngine) window.AudioEngine.playJunimoChime();
      this.showDialogue(
        'Demetrius',
        'Luar biasa! Lembah ini berada dalam keseimbangan yang harmonis. Jumlah produsen, herbivora, dan pemangsa berada pada proporsi piramida biomassa yang ideal!',
        [
          {
            label: 'Kembali bekerja',
            action: () => this.closeDialogue()
          }
        ],
        'thumbs_up'
      );
    } else {
      this.showDialogue(
        'Demetrius',
        `Catatan lapanganku menunjukkan: ${diag.clue}`,
        [
          {
            label: 'Baik, aku akan menyeimbangkannya!',
            action: () => this.closeDialogue()
          }
        ],
        'normal'
      );
    }
  }

  startJunimoDialogue() {
    if (window.AudioEngine) window.AudioEngine.playJunimoChime();
    this.showDialogue(
      'Junimo',
      'Pupu! Hutan terasa damai saat pepohonan dan hewan hidup saling melengkapi. Jagalah harmoni lembah ini bersama kami, {playerName}.',
      [
        {
          label: 'Minta berkah kesuburan padang rumput',
          action: () => {
            if (window.sim) window.sim.setGrassCoverage(90);
            if (window.AudioEngine) window.AudioEngine.playJunimoChime();
            this.showTemporaryNotice('Junimo menyebarkan debu bintang, padang rumput menghijau kembali.');
            setTimeout(() => this.closeDialogue(), 2500);
          }
        },
        {
          label: 'Sampai jumpa, Junimo',
          action: () => this.closeDialogue()
        }
      ]
    );
  }

  showTemporaryNotice(text) {
    const notice = document.getElementById('quickNoticeBadge');
    if (notice) {
      notice.textContent = text;
      notice.style.display = 'block';
      clearTimeout(this.noticeTimer);
      this.noticeTimer = setTimeout(() => {
        notice.style.display = 'none';
      }, 5000);
    }
  }
}

window.DialogueSystem = new StardewDialogueSystem();
