/* Pelacakan peristiwa GA4 (tanpa data pribadi: tidak ada isi formulir, nama, atau nomor telepon) */
(function(){
  'use strict';
  var posisi = '';
  function ev(name, params){
    if (typeof window.gtag !== 'function') return;
    params = params || {};
    params.lokasi = location.pathname;
    if (posisi) params.posisi = posisi;
    params.transport_type = 'beacon';
    try { window.gtag('event', name, params); } catch(e) {}
  }
  function label(el){ return (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g,' ').trim().slice(0,40); }

  document.addEventListener('click', function(e){
    var el = e.target && e.target.closest ? e.target.closest('a,button,[onclick],[data-booking-mode]') : null;
    if (!el) return;
    posisi = (el.closest && el.closest('.cta-dock')) ? 'dock' : '';
    var href = el.getAttribute('href') || '';
    if (el.classList && el.classList.contains('share-wa')) return ev('bagikan_artikel', { metode: 'whatsapp' });
    if (el.classList && el.classList.contains('share-copy')) return ev('bagikan_artikel', { metode: 'salin_tautan' });
    if (el.closest && el.closest('.jalur')) return ev('klik_jalur_cepat', { teks: label(el), tujuan: href });
    if (el.classList && el.classList.contains('mtag')) return ev('klik_masalah', { teks: label(el), tujuan: href });
    var oc = el.getAttribute('onclick') || '';
    if (/wa\.me|api\.whatsapp\.com/.test(href) || /openWA\s*\(/.test(oc)) return ev('klik_whatsapp', { teks: label(el) });
    if (/^tel:/i.test(href)) return ev('klik_telepon', { teks: label(el) });
    if (/^mailto:/i.test(href)) return ev('klik_email', { teks: label(el) });
    if (/maps\.app\.goo\.gl|google\.com\/maps/.test(href)) return ev('klik_peta', { teks: label(el) });
    if (/\/janji-temu/.test(href) || /openBooking\s*\(/.test(oc) || el.hasAttribute('data-booking-mode')) return ev('klik_janji_temu', { teks: label(el) });
  }, true);

  // kirim formulir janji temu: hanya jenis layanan, tanpa isi formulir
  document.addEventListener('DOMContentLoaded', function(){
    if (typeof window.submitBk !== 'function') return;
    var asli = window.submitBk;
    window.submitBk = function(){
      var hasil = asli.apply(this, arguments);
      if (hasil) {
        var t = (document.getElementById('bk-title') || {}).textContent || '';
        var mode = /psikotes/i.test(t) ? 'psikotes' : /seminar|outbound/i.test(t) ? 'seminar' : 'konseling';
        ev('kirim_formulir_janji', { jenis_layanan: mode });
      }
      return hasil;
    };
  });
})();
