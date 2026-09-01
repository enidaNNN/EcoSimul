/* ==========================================================================
   PYTHOMORI: COMPREHENSIVE PYTHON CURRICULUM
   Structured, deep, and interactive Python learning path from scratch to def/functions
   ========================================================================== */

const PythonCurriculum = {
  lessons: {
    lesson_1: {
      id: 'lesson_1',
      title: 'BAB 1: DASAR OUTPUT — FUNGSI print()',
      concept: 'Fungsi print() & Teks (String)',
      explanation: `
        <h3>💡 Apa itu Python & print()?</h3>
        <p>Python adalah bahasa pemrograman yang mudah dibaca dan kuat. Di Python, komputer berkomunikasi dengan kita melalui <b>output teks</b>.</p>
        <p>Fungsi <code>print()</code> digunakan untuk menampilkan teks atau angka ke layar console.</p>
        
        <h3>📝 Aturan Sintaks:</h3>
        <ul>
          <li>Teks harus diapit oleh tanda kutip ganda <code>"..."</code> atau tanda kutip tunggal <code>'...'</code> (disebut <b>String</b>).</li>
          <li>Contoh: <code>print("Halo Dunia!")</code></li>
          <li>Angka dapat langsung ditulis tanpa tanda kutip: <code>print(42)</code></li>
          <li>Operasi matematika dapat langsung dihitung: <code>print(10 + 5)</code> (menghasilkan 15)</li>
        </ul>
      `,
      challenge: 'Tulis kode Python menggunakan <code>print()</code> untuk mencetak kalimat persis: <code>Halo, White Space!</code>',
      starterCode: '# Tulis kode print kamu di bawah ini:\n',
      hint: 'Gunakan: print("Halo, White Space!") — pastikan tanda kurung dan tanda kutip lengkap!',
      validate: (code, stdout) => {
        return stdout.includes('Halo, White Space!') || stdout.includes('Halo, White Space');
      },
      successMsg: '★ Luar biasa! Kamu berhasil menjalankan fungsi print() pertamamu di White Space!'
    },

    lesson_2: {
      id: 'lesson_2',
      title: 'BAB 2: VARIABEL & TIPE DATA DASAR',
      concept: 'Variabel, str, int, float, dan bool',
      explanation: `
        <h3>💡 Apa itu Variabel?</h3>
        <p><b>Variabel</b> adalah wadah di memori komputer untuk menyimpan data. Di Python, kamu membuat variabel cukup dengan menulis namanya, tanda sama dengan <code>=</code>, lalu nilainya.</p>
        
        <h3>📦 4 Tipe Data Utama di Python:</h3>
        <ol>
          <li><code>str</code> (String / Teks): diapit tanda kutip, misal: <code>nama = "Py"</code></li>
          <li><code>int</code> (Integer / Bilangan Bulat): tanpa kutip, misal: <code>hp = 100</code></li>
          <li><code>float</code> (Desimal): bilangan pecahan, misal: <code>energi = 98.5</code></li>
          <li><code>bool</code> (Boolean): nilai kebenaran, hanya ada <code>True</code> atau <code>False</code></li>
        </ol>

        <h3>📝 Contoh Kode:</h3>
        <pre><code>nama_pemain = "Py"
level = 1
hidup = True

print(nama_pemain)
print(level)</code></pre>
      `,
      challenge: 'Buatlah variabel bernama <code>nama_karakter = "Py"</code> dan variabel <code>hp = 100</code>, lalu cetak nilai <code>nama_karakter</code> menggunakan <code>print(nama_karakter)</code>!',
      starterCode: '# 1. Buat variabel nama_karakter:\n\n# 2. Buat variabel hp:\n\n# 3. Cetak nama_karakter:\n',
      hint: 'nama_karakter = "Py"\nhp = 100\nprint(nama_karakter)',
      validate: (code, stdout) => {
        return code.includes('nama_karakter') && code.includes('hp') && (stdout.includes('Py') || stdout.includes('nama_karakter'));
      },
      successMsg: '★ Sempurna! Kamu memahami bagaimana memori komputer menyimpan variabel!'
    },

    lesson_3: {
      id: 'lesson_3',
      title: 'BAB 3: OPERATOR MATEMATIKA & ARITMATIKA',
      concept: 'Kalkulasi Aritmatika (+, -, *, /, //, %, **)',
      explanation: `
        <h3>💡 Operator Matematika di Python</h3>
        <p>Python adalah kalkulator super canggih! Berikut operator yang sering dipakai:</p>
        <ul>
          <li><code>+</code> (Penjumlahan): <code>10 + 5</code> ➜ 15</li>
          <li><code>-</code> (Pengurangan): <code>20 - 8</code> ➜ 12</li>
          <li><code>*</code> (Perkalian): <code>6 * 7</code> ➜ 42</li>
          <li><code>/</code> (Pembagian Desimal): <code>10 / 2</code> ➜ 5.0</li>
          <li><code>//</code> (Floor Division / Pembagian Bulat): <code>10 // 3</code> ➜ 3</li>
          <li><code>%</code> (Modulo / Sisa Bagi): <code>10 % 3</code> ➜ 1 (karena 10 dibagi 3 bersisa 1)</li>
          <li><code>**</code> (Pangkat / Exponent): <code>2 ** 3</code> ➜ 8 (2 pangkat 3)</li>
        </ul>
      `,
      challenge: 'Hitung kekuatan serangan: buat variabel <code>serangan = 15 * 3</code>, lalu cetak hasilnya menggunakan <code>print(serangan)</code>!',
      starterCode: '# Buat variabel serangan dan kalikan 15 dengan 3:\n\n# Cetak variabel serangan:\n',
      hint: 'serangan = 15 * 3\nprint(serangan)',
      validate: (code, stdout) => {
        return code.includes('serangan') && stdout.includes('45');
      },
      successMsg: '★ Hebat! Kekuatan logika seranganmu terhitung: 45 Damage!'
    },

    lesson_4: {
      id: 'lesson_4',
      title: 'BAB 4: STRUKTUR DATA LIST (DAFTAR)',
      concept: 'List [], Indexing [0], dan .append()',
      explanation: `
        <h3>💡 Apa itu List?</h3>
        <p><b>List</b> adalah wadah untuk menyimpan banyak item sekaligus dalam urutan tertentu. List ditulis menggunakan kurung siku <code>[ ]</code>.</p>
        
        <h3>📝 Fitur Utama List:</h3>
        <ul>
          <li><b>Indexing</b>: Urutan dimulai dari angka <b>0</b>! Item pertama adalah <code>list[0]</code>, item kedua <code>list[1]</code>.</li>
          <li><b>Menambah Data</b>: Gunakan method <code>.append("item_baru")</code></li>
          <li><b>Menghitung Jumlah</b>: Gunakan <code>len(list)</code></li>
        </ul>

        <h3>📝 Contoh Kode:</h3>
        <pre><code>inventory = ["Laptop", "Kopi"]
inventory.append("Belati")  # Sekarang ada 3 item
print(inventory)           # Output: ['Laptop', 'Kopi', 'Belati']
print(inventory[0])        # Output: Laptop</code></pre>
      `,
      challenge: 'Buatlah list bernama <code>party = ["Ruby", "Intel"]</code>. Kemudian tambahkan <code>"Tuple"</code> menggunakan <code>party.append("Tuple")</code>, lalu cetak list <code>party</code>!',
      starterCode: '# 1. Buat list party dengan "Ruby" dan "Intel":\n\n# 2. Tambahkan "Tuple" ke dalam party:\n\n# 3. Cetak party:\n',
      hint: 'party = ["Ruby", "Intel"]\nparty.append("Tuple")\nprint(party)',
      validate: (code, stdout) => {
        return code.includes('party') && code.includes('.append') && (stdout.includes('Tuple') || stdout.includes('Ruby'));
      },
      successMsg: '★ Keren! Ketiga teman data-type kamu telah berkumpul di dalam List!'
    },

    lesson_5: {
      id: 'lesson_5',
      title: 'BAB 5: PERCABANGAN LOGIKA (if, elif, else)',
      concept: 'Pengambilan Keputusan & Aturan Indentasi',
      explanation: `
        <h3>💡 Logika Percabangan (if / else)</h3>
        <p>Komputer mengambil keputusan berdasarkan kondisi benar (<code>True</code>) atau salah (<code>False</code>).</p>
        
        <h3>⚠️ Aturan PENTING di Python: INDENTASI!</h3>
        <p>Di Python, blok kode di dalam <code>if</code> <b>WAJIB dimajukan 4 spasi atau 1 Tab</b>. Jangan lupa tanda titik dua <code>:</code> di akhir baris <code>if</code>!</p>

        <h3>📝 Contoh Kode:</h3>
        <pre><code>kunci = True

if kunci == True:
    print("Pintu terbuka!")
else:
    print("Pintu masih terkunci.")</code></pre>
      `,
      challenge: 'Buka Pintu Hitam: buat variabel <code>kunci_pintu = True</code>. Tulis kondisi <code>if kunci_pintu == True:</code> yang mencetak persis <code>PINTU TERBUKA!</code>',
      starterCode: '# 1. Buat variabel kunci_pintu = True:\n\n# 2. Tulis if statement (ingat titik dua ":" dan indentasi):\n',
      hint: 'kunci_pintu = True\nif kunci_pintu == True:\n    print("PINTU TERBUKA!")',
      validate: (code, stdout) => {
        return code.includes('if') && (stdout.includes('PINTU TERBUKA') || stdout.includes('TERBUKA'));
      },
      successMsg: '★ KLIK! Logika if terpenuhi! The Black Door terbuka menuju Py-Space!'
    },

    lesson_6: {
      id: 'lesson_6',
      title: 'BAB 6: PERULANGAN LOOP (for & while)',
      concept: 'Perulangan Otomatis, range(), dan break',
      explanation: `
        <h3>💡 Mengapa Perulangan (Loop) Diperlukan?</h3>
        <p>Bayangkan kamu ingin menyerang musuh 5 kali. Daripada menulis <code>print("Serang")</code> sebanyak 5 kali, kamu bisa menggunakan <b>Loop</b>!</p>
        
        <h3>🔁 2 Jenis Loop di Python:</h3>
        <ol>
          <li><b>for loop</b> (dengan <code>range(n)</code>): Mengulang sebanyak <code>n</code> kali.
            <pre><code>for i in range(3):
    print("Serangan ke-", i)</code></pre>
          </li>
          <li><b>while loop</b>: Mengulang terus selama kondisi masih bernilai <code>True</code>.
            <pre><code>energi = 3
while energi > 0:
    print("Energi tersisa:", energi)
    energi = energi - 1</code></pre>
          </li>
        </ol>
      `,
      challenge: 'Tulis sebuah perulangan <code>for langkah in range(4):</code> yang di dalamnya mencetak kata <code>"Maju"</code> di setiap putaran!',
      starterCode: '# Tulis for loop menggunakan range(4):\n',
      hint: 'for langkah in range(4):\n    print("Maju")',
      validate: (code, stdout) => {
        return code.includes('for') && (code.includes('range(4)') || code.includes('range(')) && stdout.includes('Maju');
      },
      successMsg: '★ Jembatan Logika bergerak 4 langkah dan terhubung sempurna!'
    },

    lesson_7: {
      id: 'lesson_7',
      title: 'BAB 7: FUNGSI / FUNCTION (def & return)',
      concept: 'Mendefinisikan Fungsi Kustom dengan def dan return',
      explanation: `
        <h3>💡 Apa itu Fungsi (Function)?</h3>
        <p>Fungsi adalah mantra ajaib yang membungkus serangkaian perintah agar bisa dipanggil berkali-kali tanpa menulis ulang.</p>
        
        <h3>📝 Struktur Fungsi Python:</h3>
        <ul>
          <li>Diawali kata kunci <code>def</code> (singkatan dari <i>define</i>).</li>
          <li>Diikuti nama fungsi dan parameter dalam tanda kurung <code>(parameter)</code>.</li>
          <li>Diakhiri titik dua <code>:</code> dan baris selanjutnya diindentasi.</li>
          <li>Kata kunci <code>return</code> digunakan untuk mengembalikan nilai hasil perhitungan.</li>
        </ul>

        <h3>📝 Contoh Kode:</h3>
        <pre><code>def hitung_damage(kekuatan, buff):
    total = kekuatan * buff
    return total

# Memanggil fungsi:
hasil = hitung_damage(20, 2)
print("Total Serangan:", hasil)  # Output: 40</code></pre>
      `,
      challenge: 'Definisikan fungsi bernama <code>def sapa(nama):</code> yang mengembalikan nilai <code>f"Halo {nama}!"</code>. Lalu panggil fungsi tersebut: <code>print(sapa("Py"))</code>!',
      starterCode: '# 1. Definisikan fungsi sapa(nama):\n\n# 2. Panggil dan cetak hasilnya:\n',
      hint: 'def sapa(nama):\n    return f"Halo {nama}!"\n\nprint(sapa("Py"))',
      validate: (code, stdout) => {
        return code.includes('def sapa') && (code.includes('return') || stdout.includes('Halo'));
      },
      successMsg: '★ Luar biasa! Kamu resmi menguasai pembuatan Function (def) di Python!'
    },

    lesson_8: {
      id: 'lesson_8',
      title: 'BAB 8: PENANGANAN ERROR (try ... except) & BOSS BATTLE',
      concept: 'Exception Handling & Anti-Crash Mechanism',
      explanation: `
        <h3>💡 Menghadapi Bug dengan try ... except</h3>
        <p>Programmer hebat bukan yang tidak pernah punya bug, tapi yang tahu cara menangani error dengan tenang!</p>
        <p>Blok <code>try:</code> digunakan untuk mencoba kode yang berpotensi error. Jika error terjadi, blok <code>except:</code> akan menangkapnya sehingga game tidak crash!</p>

        <h3>📝 Contoh Kode:</h3>
        <pre><code>try:
    angka = 10 / 0  # Ini akan memicu ZeroDivisionError!
except ZeroDivisionError:
    print("Perisai aktif: Pembagian nol berhasil ditangani!")</code></pre>
      `,
      challenge: 'Buat perisai penangkal bug: tulis blok <code>try:</code> yang mencoba pembagian <code>10 / 0</code>, lalu tangani dengan <code>except:</code> yang mencetak <code>"BUG TERTANGKAP!"</code>!',
      starterCode: '# Tulis try ... except block:\ntry:\n    hasil = 10 / 0\nexcept:\n    # Cetak pesan di sini:\n',
      hint: 'try:\n    hasil = 10 / 0\nexcept:\n    print("BUG TERTANGKAP!")',
      validate: (code, stdout) => {
        return code.includes('try') && code.includes('except') && (stdout.includes('BUG TERTANGKAP') || stdout.includes('TERTANGKAP') || stdout.includes('Safe') || stdout.includes('Catch'));
      },
      successMsg: '★ PERISAI SIAP! Kamu siap bertarung dan menundukkan SyntaxError Phantom!'
    }
  }
};
