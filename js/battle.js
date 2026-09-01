/* ==========================================================================
   PYTHOMORI: BATTLE SYSTEM (OMORI Turn-Based Code Combat)
   Features Logic-States, Python Code Skills, Tag-Team Energy, and Line-Boil Art
   ========================================================================== */

class PythomoriBattle {
  constructor() {
    this.isActive = false;
    this.enemy = null;
    this.onVictoryCallback = null;

    // Party Members
    this.party = [
      {
        id: 'py',
        name: 'PY',
        maxHp: 100,
        hp: 100,
        maxJuice: 50,
        juice: 50,
        state: 'neutral', // 'neutral' | 'optimized' | 'bugged' | 'recursive'
        skills: [
          { id: 'print_attack', name: 'print("Strike!")', cost: 0, desc: 'Basic logical strike. Deals 20 damage.' },
          { id: 'for_loop', name: 'for i in range(3):', cost: 15, desc: 'Triple loop strike! Hits 3 times for 14 damage each.' },
          { id: 'try_except', name: 'try ... except:', cost: 20, desc: 'Shields next enemy bug attack and heals HP.' }
        ]
      },
      {
        id: 'ruby',
        name: 'RUBY (str)',
        maxHp: 85,
        hp: 85,
        maxJuice: 60,
        juice: 60,
        state: 'optimized',
        skills: [
          { id: 'str_split', name: 'text.split()', cost: 12, desc: 'Splits enemy focus. Inflicts BUGGED state.' },
          { id: 'f_string', name: 'f"Cheer {all}"', cost: 18, desc: 'Inspires party with OPTIMIZED state.' }
        ]
      },
      {
        id: 'intel',
        name: 'INTEL (int)',
        maxHp: 90,
        hp: 90,
        maxJuice: 45,
        juice: 45,
        state: 'neutral',
        skills: [
          { id: 'math_sqrt', name: 'math.sqrt(x)', cost: 14, desc: 'Calculates square root of defense. High crit!' }
        ]
      },
      {
        id: 'tuple',
        name: 'TUPLE (list)',
        maxHp: 120,
        hp: 120,
        maxJuice: 40,
        juice: 40,
        state: 'neutral',
        skills: [
          { id: 'list_append', name: 'list.append()', cost: 10, desc: 'Packs defense shield [🛡️].' }
        ]
      }
    ];

    this.shieldActive = false;
    this.initUI();
  }

  initUI() {
    this.layer = document.getElementById('battleLayer');
    this.enemySketch = document.getElementById('enemySketch');
    this.enemyNameEl = document.getElementById('enemyName');
    this.enemyStateEl = document.getElementById('enemyState');
    this.enemyHpFill = document.getElementById('enemyHpFill');
    this.partyGrid = document.getElementById('partyGrid');
    this.battleTicker = document.getElementById('battleTicker');
    this.skillsModal = document.getElementById('skillsModal');
    this.skillsList = document.getElementById('skillsList');

    // Command buttons
    const btnAttack = document.getElementById('cmdAttack');
    const btnSkill = document.getElementById('cmdSkill');
    const btnTryExcept = document.getElementById('cmdTryExcept');

    if (btnAttack) btnAttack.onclick = () => this.executePlayerSkill('print_attack');
    if (btnSkill) btnSkill.onclick = () => this.toggleSkillsMenu();
    if (btnTryExcept) btnTryExcept.onclick = () => this.executePlayerSkill('try_except');
  }

  startBattle(enemyData, onVictory) {
    this.isActive = true;
    this.enemy = {
      id: enemyData.id || 'syntax_error',
      name: enemyData.name || 'SYNTAX ERROR PHANTOM',
      maxHp: enemyData.maxHp || 250,
      hp: enemyData.maxHp || 250,
      state: enemyData.state || 'bugged',
      attacks: enemyData.attacks || [
        { name: 'Missing Colon :', dmg: 18 },
        { name: 'Unclosed Parenthesis )', dmg: 24 },
        { name: 'Indentation Error', dmg: 30 }
      ]
    };
    this.onVictoryCallback = onVictory;
    this.shieldActive = false;

    // Set Enemy UI
    this.enemySketch.src = PythomoriArt.getAvatar(this.enemy.id);
    this.enemyNameEl.innerText = this.enemy.name;
    this.enemyStateEl.innerText = `[ STATE: ${this.enemy.state.toUpperCase()} ]`;
    this.updateEnemyHp();

    // Render Party Cards
    this.renderPartyCards();
    this.setTicker(`A wild ${this.enemy.name} appeared!`);

    AudioEngine.playBattleStart();
    AudioEngine.playBGM('battle');
    this.layer.classList.add('active');
  }

  setTicker(msg) {
    if (this.battleTicker) {
      this.battleTicker.innerText = msg;
    }
  }

  updateEnemyHp() {
    const pct = Math.max(0, (this.enemy.hp / this.enemy.maxHp) * 100);
    if (this.enemyHpFill) this.enemyHpFill.style.width = `${pct}%`;
  }

  renderPartyCards() {
    if (!this.partyGrid) return;
    this.partyGrid.innerHTML = '';

    this.party.forEach(p => {
      const card = document.createElement('div');
      card.className = 'party-card ' + (p.id === 'py' ? 'active-turn' : '');
      card.innerHTML = `
        <div class="party-name">
          <span>${p.name}</span>
          <span class="party-state ${p.state}">${p.state.toUpperCase()}</span>
        </div>
        <div class="stat-row">
          <span class="stat-icon">❤️</span>
          <div class="stat-bar"><div class="stat-fill hp" style="width: ${(p.hp / p.maxHp) * 100}%"></div></div>
          <span>${p.hp}</span>
        </div>
        <div class="stat-row">
          <span class="stat-icon">💧</span>
          <div class="stat-bar"><div class="stat-fill juice" style="width: ${(p.juice / p.maxJuice) * 100}%"></div></div>
          <span>${p.juice}</span>
        </div>
      `;
      this.partyGrid.appendChild(card);
    });
  }

  toggleSkillsMenu() {
    if (!this.skillsModal) return;
    const isVisible = this.skillsModal.classList.contains('active');
    AudioEngine.playMenuSelect();

    if (isVisible) {
      this.skillsModal.classList.remove('active');
    } else {
      this.renderSkillsList();
      this.skillsModal.classList.add('active');
    }
  }

  renderSkillsList() {
    if (!this.skillsList) return;
    this.skillsList.innerHTML = '';

    const py = this.party[0];
    py.skills.forEach(sk => {
      const row = document.createElement('div');
      row.className = 'skill-row';
      row.innerHTML = `
        <div class="skill-title-bar">
          <span>${sk.name}</span>
          <span style="color: var(--headspace-teal);">${sk.cost} JUICE</span>
        </div>
        <div class="skill-desc">${sk.desc}</div>
      `;
      row.onclick = () => {
        this.skillsModal.classList.remove('active');
        this.executePlayerSkill(sk.id);
      };
      this.skillsList.appendChild(row);
    });
  }

  executePlayerSkill(skillId) {
    const py = this.party[0];
    let skill = py.skills.find(s => s.id === skillId) || py.skills[0];

    if (py.juice < skill.cost) {
      this.setTicker('Not enough JUICE/Memory to compile this skill!');
      return;
    }

    py.juice -= skill.cost;
    AudioEngine.playMenuSelect();

    // Damage calculation based on skills
    let dmg = 0;
    if (skillId === 'print_attack') {
      dmg = 24 + Math.floor(Math.random() * 8);
      this.setTicker(`Py executed print("Strike!")! Dealt ${dmg} logic damage!`);
      this.animateEnemyHit();
      AudioEngine.playHit();
      this.applyDamageToEnemy(dmg);
    } else if (skillId === 'for_loop') {
      dmg = 14 + Math.floor(Math.random() * 4);
      this.setTicker(`Py ran for i in range(3): Triple Strike! (${dmg}x3)`);
      this.animateEnemyHit();
      AudioEngine.playHit();
      this.applyDamageToEnemy(dmg * 3);
    } else if (skillId === 'try_except') {
      this.shieldActive = true;
      py.state = 'optimized';
      AudioEngine.playTryExcept();
      this.setTicker(`Py activated try ... except: Catch block ready!`);
    }

    this.renderPartyCards();

    // Check Enemy Defeat
    if (this.enemy.hp <= 0) {
      this.handleVictory();
      return;
    }

    // Enemy Turn after 1.2s delay
    setTimeout(() => this.enemyTurn(), 1200);
  }

  animateEnemyHit() {
    this.enemySketch.classList.add('hit');
    setTimeout(() => this.enemySketch.classList.remove('hit'), 350);
  }

  applyDamageToEnemy(amount) {
    this.enemy.hp = Math.max(0, this.enemy.hp - amount);
    this.updateEnemyHp();
  }

  enemyTurn() {
    if (!this.isActive || this.enemy.hp <= 0) return;

    const atk = this.enemy.attacks[Math.floor(Math.random() * this.enemy.attacks.length)];

    if (this.shieldActive) {
      // Caught by Try-Except!
      this.shieldActive = false;
      AudioEngine.playTryExcept();
      this.party[0].hp = Math.min(this.party[0].maxHp, this.party[0].hp + 25);
      this.setTicker(`★ try...except CAUGHT the ${atk.name}! Healed Py for 25 HP!`);
    } else {
      // Enemy Hits Py
      this.party[0].hp = Math.max(0, this.party[0].hp - atk.dmg);
      AudioEngine.playHit();
      this.setTicker(`${this.enemy.name} triggered ${atk.name}! Dealt ${atk.dmg} error damage!`);
    }

    this.renderPartyCards();

    // Party companions follow-up attack
    setTimeout(() => {
      if (this.enemy.hp > 0) {
        const allyDmg = 16 + Math.floor(Math.random() * 6);
        this.applyDamageToEnemy(allyDmg);
        this.animateEnemyHit();
        AudioEngine.playHit();
        this.setTicker(`Ruby & Intel supported with string.join()! Dealt ${allyDmg} damage!`);

        if (this.enemy.hp <= 0) {
          this.handleVictory();
        }
      }
    }, 1200);
  }

  handleVictory() {
    this.isActive = false;
    AudioEngine.playTryExcept();
    this.setTicker(`★ ${this.enemy.name} was successfully resolved with 0 Syntax Errors!`);

    setTimeout(() => {
      this.layer.classList.remove('active');
      AudioEngine.playBGM('pyspace');
      if (this.onVictoryCallback) this.onVictoryCallback();
    }, 2000);
  }
}

// Global instance
const BattleEngine = new PythomoriBattle();
