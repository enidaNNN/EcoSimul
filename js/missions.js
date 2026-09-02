/**
 * ============================================================================
 * ECO-VALLEY: Demetrius 10-Mission Curriculum & State Machine
 * Strictly enforces two-phase progression:
 * Phase 1: Experiment in the valley (Quiz is locked until conditions are met).
 * Phase 2: Biological Quiz (Must be answered correctly to unlock next mission).
 * ============================================================================
 */

class MissionManager {
  constructor() {
    this.currentMissionIndex = 0;
    this.completed = false;

    // Track state of current mission: 'experiment' or 'quiz_unlocked' or 'passed'
    this.phase = 'experiment'; // 'experiment' | 'quiz' | 'passed'
    this.selectedAnswer = null;
    this.lastResult = null;

    this.missions = [
      {
        id: 1,
        title: 'Misi 1: Fondasi Kehidupan (Produsen Primer)',
        goalText: 'Ubah cuaca menjadi "Hujan Subur" pada panel iklim di kiri atas dan pastikan biomassa rumput > 75%.',
        desc: 'Produsen adalah fondasi seluruh rantai makanan. Mereka mengubah energi matahari dan air menjadi energi kimia organik melalui fotosintesis. Untuk memulai riset lapangan, pergilah ke lembah lalu ubah cuaca menjadi "Hujan Subur" pada panel iklim di kiri atas agar rumput bertunas lebat.',
        check: (sim) => sim.weather === 'rainy' && sim.grassBiomass > 75,
        quiz: {
          question: 'Mengapa rumput dan tumbuhan disebut sebagai "Produsen Primer" dalam suatu ekosistem?',
          options: [
            'Karena mereka menghasilkan energi sendiri melalui fotosintesis dengan bantuan sinar matahari dan air.',
            'Karena mereka menghasilkan gas karbon dioksida untuk dihirup oleh hewan pemangsa.',
            'Karena mereka memakan zat hara sisa bangkai hewan yang mati di dalam tanah.'
          ],
          correct: 0,
          hint: 'Ingat konsep fotosintesis: produsen tidak memakan organisme lain, melainkan membuat makanan sendiri dari energi cahaya matahari dan air!',
          explanation: 'Tepat sekali! Tumbuhan hijau memiliki klorofil yang menangkap energi cahaya matahari untuk mengubah air dan CO2 menjadi glukosa (energi kimia).'
        }
      },
      {
        id: 2,
        title: 'Misi 2: Konsumen Tingkat 1 (Herbivora)',
        goalText: 'Naikkan populasi Konsumen I (Kelinci & Rusa) menjadi minimal 25 ekor melalui slider di panel kanan.',
        desc: 'Herbivora mengonsumsi produsen untuk mendapatkan energi. Sekarang, pergilah ke lembah dan naikkan populasi Konsumen I (Kelinci & Rusa) menjadi minimal 25 ekor melalui slider di panel kanan. Amati bagaimana rumput padang mulai berkurang drastis!',
        check: (sim) => (sim.rabbits.length + sim.deers.length) >= 25,
        quiz: {
          question: 'Apa yang akan terjadi pada padang rumput jika populasi herbivora terus bertambah tanpa ada predator yang membatasi?',
          options: [
            'Rumput akan tumbuh semakin subur dan tinggi karena disirami oleh herbivora.',
            'Terjadi overgrazing (penggembalaan berlebih) hingga rumput habis gundul, memicu kelaparan massal.',
            'Rumput akan bermutasi menjadi tanaman beracun agar tidak bisa dimakan lagi.'
          ],
          correct: 1,
          hint: 'Pikirkan daya dukung lingkungan (carrying capacity): jika pemakan rumput terlalu banyak sedangkan rumput terbatas, apa akibatnya pada padang rumput?',
          explanation: 'Benar! Tanpa kendali predator, herbivora akan menghabiskan seluruh vegetasi hingga terjadi starvation crash (kelaparan massal).'
        }
      },
      {
        id: 3,
        title: 'Misi 3: Peran Mesopredator (Konsumen Tingkat 2)',
        goalText: 'Atur populasi Rubah menjadi minimal 5 ekor di panel kanan untuk menyeimbangkan kelinci.',
        desc: 'Karnivora tingkat menengah seperti Rubah Merah berperan mengendalikan herbivora kecil agar tidak menghabiskan rumput. Atur populasi Rubah menjadi minimal 5 ekor di panel kanan dan amati bagaimana mereka memburu kelinci yang berlebih.',
        check: (sim) => sim.foxes.length >= 5,
        quiz: {
          question: 'Secara tidak langsung, bagaimana keberadaan Rubah membantu kelestarian padang rumput?',
          options: [
            'Rubah menanam benih rumput baru setiap kali selesai berburu mangsa.',
            'Rubah mengontrol populasi kelinci sehingga rumput tidak habis dimakan secara berlebihan (Trophic Cascade).',
            'Rubah hanya memakan rumput kering sehingga rumput hijau tetap terjaga.'
          ],
          correct: 1,
          hint: 'Ini adalah konsep Trophic Cascade (efek riak trofik): musuh alami herbivora melindungi tanaman dari kepunahan!',
          explanation: 'Luar biasa! Hubungan ini disebut trophic cascade: predator menekan herbivora, sehingga produsen primer terlindungi secara tidak langsung.'
        }
      },
      {
        id: 4,
        title: 'Misi 4: Adaptasi Musim Gugur & Dingin',
        goalText: 'Ganti musim menjadi "Musim Dingin (Winter)" pada panel iklim di pojok kiri atas.',
        desc: 'Iklim sangat memengaruhi metabolisme dan pasokan makanan. Ubah musim menjadi "Musim Dingin (Winter)" pada panel iklim di pojok kiri atas dan perhatikan bagaimana salju turun dan pertumbuhan tanaman melambat.',
        check: (sim) => sim.season === 'winter',
        quiz: {
          question: 'Mengapa di musim dingin (winter), daya dukung lingkungan bagi herbivora menurun drastis?',
          options: [
            'Suhu dingin dan salju menghambat fotosintesis dan pertumbuhan tunas rumput baru.',
            'Semua herbivora tertidur selamanya dan tidak pernah bangun lagi.',
            'Air membeku sehingga predator tidak bisa mengejar mangsa.'
          ],
          correct: 0,
          hint: 'Tumbuhan membutuhkan panas matahari dan suhu hangat untuk tumbuh aktif. Apa yang terjadi pada tanaman saat bersalju?',
          explanation: 'Tepat! Di musim dingin, pertumbuhan vegetasi melambat sehingga hewan mengandalkan simpanan lemak dan semak berry yang tersisa.'
        }
      },
      {
        id: 5,
        title: 'Misi 5: Penguasa Angkasa (Apex Predator Elang)',
        goalText: 'Hadirkan minimal 2 ekor Elang Emas melalui slider Konsumen Puncak di panel kanan.',
        desc: 'Elang Emas adalah predator puncak yang mengawasi padang rumput dari angkasa. Pastikan populasi Konsumen Puncak memiliki minimal 2 ekor Elang Emas yang terbang melayang mengitari lembah.',
        check: (sim) => sim.eagles.length >= 2,
        quiz: {
          question: 'Mengapa Elang Emas dikategorikan sebagai "Apex Predator" (Konsumen Puncak)?',
          options: [
            'Karena elang adalah hewan yang paling cepat berkembang biak di lembah.',
            'Karena di habitat alaminya, elang dewasa tidak memiliki pemangsa alami lain di atasnya.',
            'Karena elang memakan tumbuhan dan daging secara seimbang.'
          ],
          correct: 1,
          hint: 'Apex predator berada di puncak rantai makanan. Siapa yang memangsa elang dewasa di alam bebas?',
          explanation: 'Benar! Konsumen puncak berada di tingkatan trofik tertinggi dan tidak menjadi mangsa alami bagi organisme lain.'
        }
      },
      {
        id: 6,
        title: 'Misi 6: Keseimbangan Karnivora Darat (Serigala)',
        goalText: 'Hadirkan minimal 2 ekor Serigala Hutan di panel kanan untuk mendampingi rusa.',
        desc: 'Serigala Hutan memburu herbivora besar seperti Rusa dan menjaga kestabilan padang semak. Pastikan ada minimal 2 ekor Serigala Hutan di daratan lembah.',
        check: (sim) => sim.wolves.length >= 2,
        quiz: {
          question: 'Apa yang terjadi dalam sejarah ekologi Taman Yellowstone ketika serigala punah akibat perburuan liar?',
          options: [
            'Populasi rusa meledak, menghancurkan pepohonan tepi sungai, hingga memicu erosi parah (runtuhnya ekosistem).',
            'Hutan menjadi semakin rimbun dan semua hewan hidup damai selamanya.',
            'Rumput tumbuh menjadi pohon raksasa yang menutupi seluruh lembah.'
          ],
          correct: 0,
          hint: 'Studi terkenal reintroduksi serigala di Yellowstone membuktikan peran vital predator puncak dalam mencegah kerusakan bentang alam!',
          explanation: 'Luar biasa! Ketika serigala dihilangkan, rusa merajalela memakan bibit pohon hingga terjadi erosi tepian sungai yang parah.'
        }
      },
      {
        id: 7,
        title: 'Misi 7: Piramida Biomassa & Aturan Aliran Energi 10%',
        goalText: 'Susun piramida ideal: Rumput > 60%, Herbivora 12-25 ekor, Karnivora 3-6 ekor, Apex 1-4 ekor.',
        desc: 'Aturan 10% menyatakan hanya sekitar 10% energi organik yang berpindah ke tingkat trofik di atasnya. Ciptakan proporsi piramida ideal di lembah: Rumput > 60%, Herbivora 12-25 ekor, Karnivora 3-6 ekor, Apex 1-4 ekor.',
        check: (sim) => {
          const h = sim.rabbits.length + sim.deers.length;
          const c = sim.foxes.length;
          const a = sim.wolves.length + sim.eagles.length;
          return sim.grassBiomass >= 60 && h >= 12 && h <= 25 && c >= 3 && c <= 8 && a >= 1 && a <= 5;
        },
        quiz: {
          question: 'Mengapa biomassa produsen (rumput) harus jauh lebih besar daripada jumlah karnivora dan predator puncak?',
          options: [
            'Karena energi berkurang sekitar 90% pada setiap perpindahan tingkatan trofik (hilang sebagai panas & metabolisme).',
            'Karena hewan karnivora tubuhnya lebih kecil dibandingkan sehelai rumput padang.',
            'Karena rumput membutuhkan lebih banyak ruang gerak daripada hewan karnivora.'
          ],
          correct: 0,
          hint: 'Ingat Hukum Termodinamika & Piramida Energi: sebagian besar energi hilang sebagai panas saat hewan bernapas dan bergerak!',
          explanation: 'Sempurna! Karena kehilangan energi pada setiap tingkatan, biomassa harus berbentuk piramida: dasar yang lebar dan puncak yang runcing.'
        }
      },
      {
        id: 8,
        title: 'Misi 8: Intervensi Konservasi (Menanam Rumput Saat Kemarau)',
        goalText: 'Ubah cuaca ke "Kemarau Panjang", lalu gunakan Hotbar [2] (Tanam 🌱) untuk menanam rumput di tanah!',
        desc: 'Ubah cuaca menjadi "Kemarau Panjang (Drought)" pada panel iklim di kiri atas agar tanah mengering, lalu gunakan alat benih di hotbar atas (angka 2 atau icon 🌱) untuk menanam kembali rumput hijau di tanah!',
        check: (sim) => sim.weather === 'drought',
        quiz: {
          question: 'Mengapa intervensi restorasi habitat (seperti penanaman kembali vegetasi) penting saat terjadi degradasi alam?',
          options: [
            'Untuk mengembalikan produsen dasar yang menjadi sumber energi dan oksigen bagi seluruh penghuni ekosistem.',
            'Agar warna tanah di kebun terlihat lebih bagus saat difoto dari udara.',
            'Karena hewan tidak tahu bagaimana cara berjalan di tanah yang tidak ada rumputnya.'
          ],
          correct: 0,
          hint: 'Pikirkan peran produsen primer bagi seluruh rantai makanan di atasnya.',
          explanation: 'Tepat sekali! Restorasi tumbuhan primer adalah langkah pertama dan paling mendasar dalam memulihkan ekosistem yang rusak.'
        }
      },
      {
        id: 9,
        title: 'Misi 9: Fenomena Kepunahan Berantai (Co-Extinction)',
        goalText: 'Turunkan populasi Konsumen I (Herbivora) menjadi 0 ekor melalui slider di panel kanan.',
        desc: 'Turunkan populasi Konsumen I (Herbivora) menjadi 0 ekor melalui slider di panel kanan dan amati apa yang terjadi pada energi dan kelangsungan hidup Rubah serta Serigala.',
        check: (sim) => (sim.rabbits.length + sim.deers.length) === 0,
        quiz: {
          question: 'Jika suatu spesies herbivora kunci punah sepenuhnya dari suatu ekosistem, apa dampaknya bagi pemangsa spesialisnya?',
          options: [
            'Pemangsa akan langsung berganti memakan batu dan pasir.',
            'Pemangsa akan mengalami krisis pangan parah dan terancam ikut punah (co-extinction).',
            'Pemangsa akan bertambah banyak karena tidak ada yang mengganggu wilayahnya.'
          ],
          correct: 1,
          hint: 'Jika sumber makanan utama lenyap dan tidak ada pengganti, apa nasib organisme yang bergantung padanya?',
          explanation: 'Tepat! Hubungan ketergantungan yang erat menyebabkan kepunahan suatu organisme memicu efek domino bagi organisme lain.'
        }
      },
      {
        id: 10,
        title: 'Misi 10: Harmoni Abadi Lembah Greenwood (Ujian Kelulusan)',
        goalText: 'Pulihkan seluruh populasi secara seimbang dan capai Eco-Score minimal 85 poin!',
        desc: 'Pulihkan kembali seluruh spesies ke kondisi seimbang dan capai Eco-Score minimal 85 poin! Jika kamu berhasil, kamu resmi lulus sebagai Ahli Ekologi Sejati dan diizinkan pulang ke rumah!',
        check: (sim) => sim.ecoScore >= 85 && sim.grassBiomass >= 65,
        quiz: {
          question: 'Apa kesimpulan paling penting mengenai konsep Keseimbangan Ekosistem?',
          options: [
            'Semua komponen (produsen, herbivora, karnivora, dan pengurai) saling terhubung dan bergantung untuk menjaga stabilitas dinamis.',
            'Ekosistem terbaik adalah yang hanya berisi satu jenis hewan tanpa ada predator pemangsa sama sekali.',
            'Manusia sebaiknya memusnahkan semua karnivora karena mereka memangsa hewan lain.'
          ],
          correct: 0,
          hint: 'Ingat kembali seluruh eksperimen: keseimbangan bukan berarti tidak ada kematian, melainkan siklus energi yang harmonis dan berkelanjutan.',
          explanation: 'Luar biasa! Keseimbangan ekosistem adalah harmoni dinamis di mana setiap komponen memiliki peran ekologis yang tak tergantikan.'
        }
      }
    ];
  }

  getCurrentMission() {
    if (this.currentMissionIndex >= this.missions.length) return null;
    return this.missions[this.currentMissionIndex];
  }

  // Active check called from game loop to notify user when experiment condition is satisfied
  checkSimulationExperiment(sim) {
    if (this.completed) return false;
    const mission = this.getCurrentMission();
    if (!mission) return false;

    if (this.phase === 'experiment') {
      const isMet = mission.check(sim);
      if (isMet) {
        this.phase = 'quiz';
        return true; // Just became unlocked!
      }
    }
    return false;
  }

  isExperimentCompleted(sim) {
    const mission = this.getCurrentMission();
    if (!mission) return true;
    if (this.phase === 'quiz' || this.phase === 'passed') return true;
    return mission.check(sim);
  }

  submitAnswer(answerIndex) {
    const mission = this.getCurrentMission();
    if (!mission) return { success: true, finished: true };

    const isCorrect = (answerIndex === mission.quiz.correct);
    if (isCorrect) {
      this.phase = 'passed';
      this.lastResult = {
        success: true,
        finished: (this.currentMissionIndex === this.missions.length - 1),
        explanation: mission.quiz.explanation
      };
      return this.lastResult;
    } else {
      this.lastResult = {
        success: false,
        hint: mission.quiz.hint
      };
      return this.lastResult;
    }
  }

  advanceToNextMission() {
    if (this.phase === 'passed') {
      this.currentMissionIndex++;
      if (this.currentMissionIndex >= this.missions.length) {
        this.completed = true;
      } else {
        this.phase = 'experiment'; // Reset to experiment phase for next mission!
        this.lastResult = null;
      }
    }
  }
}

window.MissionManager = new MissionManager();
