/* Skrip bersama halaman statis (psikolog, layanan, kontak) */
(function(){
  'use strict';
  var ROUTE={home:'/',layanan:'/layanan/',psikolog:'/psikolog/',harga:'/harga/',blog:'/artikel/',contact:'/kontak/',booking:'/janji-temu/'};
  var ALIAS={beranda:'home',artikel:'blog',kontak:'contact',lokasi:'contact',janji:'booking'};
  function safeId(id){return document.getElementById(id);}
  window.closeMobileNav = function(){
    const nav = safeId('mobile-nav');
    const overlay = safeId('mob-overlay');
    const btn = safeId('hamburger');
    if (nav) nav.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (btn) btn.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
  };

  window.toggleMobileNav = function(){
    const nav = safeId('mobile-nav');
    const overlay = safeId('mob-overlay');
    const btn = safeId('hamburger');
    if (!nav || !overlay) return;
    const willOpen = !nav.classList.contains('open');
    if (willOpen) {
      nav.classList.add('open');
      overlay.classList.add('open');
      if (btn) btn.classList.add('open');
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
    } else {
      window.closeMobileNav();
    }
  };
  window.showPage=function(n){n=String(n||'home').toLowerCase();n=ALIAS[n]||n;location.href=ROUTE[n]||'/';return false;};
  window.openBooking=function(mode){location.href='/janji-temu/'+(mode&&mode!=='konseling'?'?layanan='+encodeURIComponent(mode):'');};
  window.openWA=function(msg){var c=msg||'Halo Psikologi Ceria, saya ingin bertanya tentang layanan.';window.open('https://wa.me/6285384847854?text='+encodeURIComponent(c),'_blank','noopener,noreferrer');};
  window.showLayanan=function(tab){['konseling','psikotes','seminar'].forEach(function(t){var s=safeId('lsec-'+t),b=safeId('ltab-'+t);if(s)s.style.display=t===tab?'flex':'none';if(b)b.classList.toggle('active',t===tab);});};
  document.addEventListener('DOMContentLoaded',function(){
    var cur=document.body.getAttribute('data-nav');
    document.querySelectorAll('[data-page]').forEach(function(el){var same=el.getAttribute('data-page')===cur;el.classList.toggle('active',same);if(same)el.setAttribute('aria-current','page');});
    if(safeId('lsec-konseling')){var h=(location.hash||'').replace('#','');window.showLayanan(['konseling','psikotes','seminar'].indexOf(h)>-1?h:'konseling');}
    else if(location.hash){var el=safeId(location.hash.slice(1));if(el)setTimeout(function(){el.scrollIntoView({behavior:'smooth',block:'start'});},120);}
    document.querySelectorAll('div[onclick],span[onclick]').forEach(function(el){if(el.getAttribute('role')||el.hasAttribute('data-kb'))return;el.setAttribute('data-kb','1');el.setAttribute('role','button');el.setAttribute('tabindex','0');});
  });
  window.addEventListener('hashchange',function(){var h=(location.hash||'').replace('#','');if(safeId('lsec-konseling')&&['konseling','psikotes','seminar'].indexOf(h)>-1)window.showLayanan(h);});
  document.addEventListener('keydown',function(e){var t=e.target;if((e.key==='Enter'||e.key===' ')&&t&&t.getAttribute&&t.getAttribute('data-kb')==='1'){e.preventDefault();t.click();}});
  window.addEventListener('resize',function(){if(window.innerWidth>960)window.closeMobileNav();});
})();
