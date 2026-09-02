/**
 * ============================================================================
 * ECO-VALLEY: Educational Scenarios Manager
 * Guided experiments to teach Food Chain, Carrying Capacity, and Trophic Cascades.
 * ============================================================================
 */

class ScenarioManager {
  constructor(sim) {
    this.sim = sim;
  }

  loadScenario(type) {
    const sim = this.sim;
    if (!sim) return;

    if (type === 'balance') {
      sim.weather = 'sunny';
      sim.setGrassCoverage(85);
      sim.setRabbitPopulation(18);
      sim.setFoxPopulation(5);
      sim.setEaglePopulation(2);

      if (window.DialogueSystem) {
        window.DialogueSystem.showDialogue(
          'Demetrius',
          '🧪 [Eksperimen: Harmoni Alami] Perhatikan struktur piramida energi yang seimbang! Rumput melimpah (Tingkat I) mencukupi kebutuhan kelinci (Tingkat II), sedangkan rubah dan elang mengontrol populasi agar tidak terjadi kelebihan populasi.',
          [
            {
              label: '🌿 Apa yang terjadi jika aku menanam rumput lebih banyak?',
              action: () => {
                sim.setGrassCoverage(100);
                window.DialogueSystem.showTemporaryNotice('🌱 Kapasitas dukung meningkat! Kelinci dapat berkembang biak lebih banyak.');
              }
            },
            {
              label: '✨ Minta panduan Junimo',
              action: () => window.DialogueSystem.startJunimoDialogue()
            }
          ]
        );
      }
    } else if (type === 'rabbit_boom') {
      sim.weather = 'sunny';
      sim.setGrassCoverage(60);
      sim.setFoxPopulation(0);
      sim.setEaglePopulation(0);
      sim.setRabbitPopulation(48);

      if (window.DialogueSystem) {
        window.DialogueSystem.showDialogue(
          'Demetrius',
          '⚠️ [Eksperimen: Ledakan Hama Kelinci] Kita telah menyingkirkan semua predator! Amati apa yang terjadi: kelinci melahap rumput sampai tandus gundul. Tanpa rumput tersisa, kelinci akan mengalami kelaparan masal (Starvation Crash)!',
          [
            {
              label: '🦊 Masukkan Rubah untuk menyeimbangkan!',
              action: () => {
                sim.setFoxPopulation(6);
                window.DialogueSystem.showTemporaryNotice('🦊 Reintroduksi Rubah berhasil! Rubah mulai memburu kelinci berlebih.');
              }
            },
            {
              label: '🦅 Panggil Elang Emas!',
              action: () => {
                sim.setEaglePopulation(3);
                window.DialogueSystem.showTemporaryNotice('🦅 Elang menukik dari langit untuk mengendalikan padang rumput!');
              }
            }
          ]
        );
      }
    } else if (type === 'drought') {
      sim.weather = 'drought';
      sim.setGrassCoverage(20);
      sim.setRabbitPopulation(25);
      sim.setFoxPopulation(6);
      sim.setEaglePopulation(2);

      if (window.DialogueSystem) {
        window.DialogueSystem.showDialogue(
          'Demetrius',
          '☀️ [Eksperimen: Krisis Kemarau Ekstrem] Kemarau panjang membuat tanah kering dan rumput sulit beregenerasi. Daya dukung lingkungan (Carrying Capacity) anjlok! Perhatikan bagaimana kelaparan merambat dari kelinci sampai predator teratas.',
          [
            {
              label: '🌧️ Panggil Hujan untuk menyelamatkan lembah!',
              action: () => {
                sim.weather = 'rainy';
                if (window.AudioEngine) window.AudioEngine.playJunimoChime();
                window.DialogueSystem.showTemporaryNotice('🌧️ Hujan berkah membasahi lembah! Rumput mulai bertunas hijau kembali.');
              }
            },
            {
              label: '🌱 Tanam benih darurat dengan [SPASI]',
              action: () => {
                window.DialogueSystem.showTemporaryNotice('Gunakan tombol [SPASI] di dekat tanah cokelat untuk membantu menanam rumput.');
              }
            }
          ]
        );
      }
    }
  }
}

window.ScenarioManagerClass = ScenarioManager;
