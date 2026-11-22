/* Formulir janji temu */
(function(){
  'use strict';
  function qs(sel, root){ return (root || document).querySelector(sel); }
  function qsa(sel, root){ return Array.from((root || document).querySelectorAll(sel)); }
  function safeId(id){ return document.getElementById(id); }
  let selectedPsych = '';
  let selectedSlot = '';
  let bookingMode = 'konseling';

  const BOOKING_CONFIG = {
    konseling: {
      title: 'Buat Janji Konseling',
      subtitle: 'Pilih psikolog, jadwal, dan metode sesi yang paling nyaman untuk Anda.',
      note: 'Form ini untuk layanan konseling atau psikoterapi individual, pasangan, keluarga, anak, remaja, dan dewasa.',
      methodLabel: 'Metode sesi',
      methods: ['Tatap muka (di klinik)', 'Online (video call)'],
      showPsych: true,
      showSlot: true,
      showTest: false,
      showEvent: false,
      noteTitle: 'Ceritakan Kondisi Anda (Opsional)',
      notePlaceholder: 'Tuliskan secara singkat apa yang ingin Anda diskusikan. Semua informasi bersifat rahasia.',
      submitText: 'Konfirmasi Janji Konseling →',
      successTitle: 'Janji konseling berhasil dibuat!'
    },
    psikotes: {
      title: 'Buat Jadwal Psikotes',
      subtitle: 'Pilih jenis tes, tanggal pelaksanaan, dan kebutuhan pemeriksaan psikologi Anda.',
      note: 'Form ini untuk psikotes individu, minat bakat, kesiapan sekolah, seleksi kerja, TNI/Polri, dan asesmen psikologi lainnya.',
      methodLabel: 'Metode pelaksanaan',
      methods: ['Tatap muka (di klinik)','Klasikal / rombongan'],
      showPsych: false,
      showSlot: true,
      showTest: true,
      showEvent: false,
      noteTitle: 'Catatan Tambahan (Opsional)',
      notePlaceholder: 'Tambahkan informasi lain yang perlu diketahui admin, misalnya usia peserta, tujuan tes, atau kebutuhan laporan.',
      submitText: 'Konfirmasi Jadwal Psikotes →',
      successTitle: 'Jadwal psikotes berhasil dibuat!'
    },
    seminar: {
      title: 'Permintaan Seminar / Outbound',
      subtitle: 'Isi kebutuhan kegiatan, jumlah peserta, lokasi, dan jadwal rencana kegiatan.',
      note: 'Form ini untuk permintaan seminar, workshop, parenting class, pelatihan, atau outbound berbasis psikologi.',
      methodLabel: 'Format kegiatan',
      methods: ['Tatap muka di lokasi klien', 'Tatap muka di klinik', 'Online', 'Hybrid'],
      showPsych: false,
      showSlot: false,
      showTest: false,
      showEvent: true,
      noteTitle: 'Catatan Tambahan (Opsional)',
      notePlaceholder: 'Tambahkan informasi lain, misalnya target peserta, durasi yang diinginkan, atau anggaran kegiatan.',
      submitText: 'Kirim Permintaan Kegiatan →',
      successTitle: 'Permintaan kegiatan berhasil dikirim!'
    }
  };

  function setOptions(select, options){
    if (!select) return;
    const current = select.value;
    select.innerHTML = '<option value="">-- Pilih --</option>' + options.map(o => '<option>' + o + '</option>').join('');
    if (options.includes(current)) select.value = current;
  }

  window.setBookingMode = function(mode){
    const next = BOOKING_CONFIG[mode] ? mode : 'konseling';
    bookingMode = next;
    const cfg = BOOKING_CONFIG[next];

    const title = safeId('bk-title');
    const subtitle = safeId('bk-subtitle');
    const modeNote = safeId('bk-mode-note');
    const service = safeId('fservice');
    const methodLabel = safeId('bk-method-label');
    const method = safeId('fm');
    const psychCard = safeId('bk-psych-card');
    const slotCard = safeId('bk-slot-card');
    const testCard = safeId('bk-psikotes-card');
    const eventCard = safeId('bk-seminar-card');
    const noteTitle = safeId('bk-note-title');
    const note = safeId('fc');
    const submit = safeId('bk-submit');
    const successTitle = safeId('bk-success-title');

    if (title) title.textContent = cfg.title;
    if (subtitle) subtitle.textContent = cfg.subtitle;
    if (modeNote) modeNote.textContent = cfg.note;
    if (service) service.value = next;
    if (methodLabel) methodLabel.textContent = cfg.methodLabel;
    setOptions(method, cfg.methods);
    if (psychCard) psychCard.hidden = !cfg.showPsych;
    if (slotCard) slotCard.hidden = !cfg.showSlot;
    if (testCard) testCard.hidden = !cfg.showTest;
    if (eventCard) eventCard.hidden = !cfg.showEvent;
    if (noteTitle) {
      var parts = String(cfg.noteTitle).split(/\s*\((Opsional)\)/i);
      noteTitle.textContent = parts[0];
      if (parts.length > 1) {
        var opt = document.createElement('span');
        opt.className = 'opt';
        opt.textContent = '(opsional)';
        noteTitle.appendChild(document.createTextNode(' '));
        noteTitle.appendChild(opt);
      }
    }
    if (note) note.placeholder = cfg.notePlaceholder;
    if (submit) submit.textContent = cfg.submitText;
    if (successTitle) successTitle.textContent = cfg.successTitle;

    if (!cfg.showPsych) {
      selectedPsych = '';
      qsa('.ppick').forEach(c => c.classList.remove('selected'));
    }
    if (!cfg.showSlot) {
      selectedSlot = '';
      qsa('.slot').forEach(s => s.classList.remove('selected'));
    }
  };

  window.pickP = function(el, id){
    qsa('.ppick').forEach(c => c.classList.remove('selected'));
    if (el) el.classList.add('selected');
    selectedPsych = id || (el && el.dataset.pickPsych) || '';
  };

  window.pickS = function(el){
    qsa('.slot').forEach(s => s.classList.remove('selected'));
    if (el) el.classList.add('selected');
    selectedSlot = el ? el.textContent.trim() : '';
  };

  window.submitBk = function(){
    const n = (safeId('fn')?.value || '').trim();
    const w = (safeId('fw')?.value || '').trim();
    const email = (safeId('fe')?.value || '').trim();
    const t = safeId('ft')?.value || '';
    const m = safeId('fm')?.value || '';
    const c = (safeId('fc')?.value || '').trim();
    const mode = bookingMode || safeId('fservice')?.value || 'konseling';

    if (!n || !w || !t) {
      alert('Mohon lengkapi nama, nomor WhatsApp, dan tanggal.');
      return false;
    }

    const names = { DN:'Deta Nurfianti, M.Psi.', DL:'Dita Lestari, M.Psi.', AK:'Asti Kusuma W, M.Psi.', MN:'Media Nasution, M.Psi., Psikolog', AO:'Atina Okta F, M.Psi.', MO:'Moerli Anggia, S.Psi.' };
    const tgl = new Date(t).toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    let summary = '';
    let waMsg = '';

    if (mode === 'konseling') {
      if (!m || !selectedPsych || !selectedSlot) {
        alert('Mohon lengkapi metode sesi, pilih psikolog, dan pilih jam sesi.');
        return false;
      }
      summary = 'Terima kasih, ' + n + '! Janji konseling Anda dengan ' + (names[selectedPsych] || selectedPsych) + ' pada ' + tgl + ' pukul ' + selectedSlot + ' (' + m + ') telah tercatat. Kami akan menghubungi ' + w + ' via WhatsApp dalam 1×24 jam.';
      waMsg = 'Halo Psikologi Ceria, saya ' + n + ' ingin konfirmasi janji konseling dengan ' + (names[selectedPsych] || selectedPsych) + ' pada ' + tgl + ' pukul ' + selectedSlot + ' (' + m + '). WA saya: ' + w + (email ? '. Email: ' + email : '') + (c ? '. Catatan: ' + c : '');
    } else if (mode === 'psikotes') {
      const jenis = (safeId('ftest')?.value || '').trim();
      const peserta = (safeId('fpeserta')?.value || '').trim();
      const tujuan = (safeId('ftujuan')?.value || '').trim();
      if (!m || !selectedSlot || !jenis) {
        alert('Mohon lengkapi metode pelaksanaan, jenis tes, dan jam psikotes.');
        return false;
      }
      summary = 'Terima kasih, ' + n + '! Jadwal psikotes pada ' + tgl + ' pukul ' + selectedSlot + ' telah tercatat. Admin akan menghubungi ' + w + ' untuk konfirmasi jenis tes dan teknis pelaksanaan.';
      waMsg = 'Halo Psikologi Ceria, saya ' + n + ' ingin membuat jadwal psikotes.' +
              '\nJenis tes: ' + jenis +
              '\nTanggal: ' + tgl +
              '\nJam: ' + selectedSlot +
              '\nMetode: ' + m +
              (peserta ? '\nJumlah peserta: ' + peserta : '') +
              (tujuan ? '\nTujuan/kebutuhan: ' + tujuan : '') +
              (c ? '\nCatatan tambahan: ' + c : '') +
              '\nWA: ' + w + (email ? '\nEmail: ' + email : '');
    } else {
      const jenis = (safeId('fevent')?.value || '').trim();
      const peserta = (safeId('feventpeserta')?.value || '').trim();
      const lokasi = (safeId('feventlokasi')?.value || '').trim();
      const catatan = (safeId('feventcatatan')?.value || '').trim();
      if (!m || !jenis || !peserta) {
        alert('Mohon lengkapi format kegiatan, jenis kegiatan, dan jumlah peserta.');
        return false;
      }
      summary = 'Terima kasih, ' + n + '! Permintaan kegiatan ' + jenis + ' untuk tanggal ' + tgl + ' telah tercatat. Admin akan menghubungi ' + w + ' untuk diskusi kebutuhan dan penawaran.';
      waMsg = 'Halo Psikologi Ceria, saya ' + n + ' ingin mengajukan kegiatan.' +
              '\nJenis kegiatan: ' + jenis +
              '\nTanggal rencana: ' + tgl +
              '\nFormat: ' + m +
              '\nJumlah peserta: ' + peserta +
              (lokasi ? '\nLokasi: ' + lokasi : '') +
              (catatan ? '\nTopik/kebutuhan: ' + catatan : '') +
              (c ? '\nCatatan tambahan: ' + c : '') +
              '\nWA: ' + w + (email ? '\nEmail: ' + email : '');
    }

    const smsg = safeId('smsg');
    if (smsg) smsg.textContent = summary;
    const form = safeId('bk-form');
    const ok = safeId('bk-ok');
    if (form) form.style.display = 'none';
    if (ok) ok.style.display = 'block';
    setTimeout(() => window.openWA(waMsg), 500);
    return true;
  };

  window.resetBk = function(){
    const form = safeId('bk-form');
    const ok = safeId('bk-ok');
    if (form) form.style.display = 'block';
    if (ok) ok.style.display = 'none';
    ['fn','fw','fe','fc','ft','fm','ftest','fpeserta','ftujuan','fevent','feventpeserta','feventlokasi','feventcatatan'].forEach(id => { const el = safeId(id); if (el) el.value = ''; });
    qsa('.ppick').forEach(c => c.classList.remove('selected'));
    qsa('.slot').forEach(s => s.classList.remove('selected'));
    selectedPsych = '';
    selectedSlot = '';
    window.setBookingMode(bookingMode || 'konseling');
  };

  document.addEventListener('DOMContentLoaded', function(){
    var ft = safeId('ft');
    if (ft) ft.setAttribute('min', new Date().toISOString().split('T')[0]);
    var q = new URLSearchParams(location.search).get('layanan');
    var mode = ['konseling','psikotes','seminar'].indexOf(q) > -1 ? q : 'konseling';
    window.setBookingMode(mode);
  });
})();
