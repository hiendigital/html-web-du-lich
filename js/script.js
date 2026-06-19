/* ============================================================
   Trường Thành Travel - Static UI scripts
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- HERO SLIDER ---------- */
  const slides = [...document.querySelectorAll('.hero__slide')];
  const dotsBox = document.getElementById('heroDots');
  let current = 0, timer;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    if (i === 0) b.classList.add('active');
    b.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(b);
  });
  const dots = [...dotsBox.children];

  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    restart();
  }
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);
  function restart() { clearInterval(timer); timer = setInterval(next, 5000); }

  document.getElementById('heroNext').addEventListener('click', next);
  document.getElementById('heroPrev').addEventListener('click', prev);
  restart();

  /* ---------- FAVORITE TOGGLE ---------- */
  document.body.addEventListener('click', e => {
    const fav = e.target.closest('.card__fav');
    if (fav) {
      e.preventDefault();
      const icon = fav.querySelector('i');
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
      fav.style.color = icon.classList.contains('fa-solid') ? '#e23' : '';
    }
  });

  /* ---------- MOBILE NAV ---------- */
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  const closeNav = () => { nav.classList.remove('open'); overlay.classList.remove('show'); };
  toggle.addEventListener('click', () => { nav.classList.toggle('open'); overlay.classList.toggle('show'); });
  overlay.addEventListener('click', closeNav);

  document.querySelectorAll('.has-sub > a').forEach(a => {
    a.addEventListener('click', e => {
      if (window.innerWidth <= 960) { e.preventDefault(); a.parentElement.classList.toggle('open'); }
    });
  });
  nav.querySelectorAll('a:not(.has-sub > a)').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth <= 960) closeNav();
  }));

  /* ---------- BACK TO TOP ---------- */
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 400);
  });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- CUSTOM CALENDAR ---------- */
  (function calendar() {
    const dp = document.getElementById('datepicker');
    if (!dp) return;

    const input   = document.getElementById('dpInput');
    const text    = document.getElementById('dpText');
    const value   = document.getElementById('dpValue');
    const cal      = document.getElementById('calendar');
    const titleEl = document.getElementById('calTitle');
    const daysEl  = document.getElementById('calDays');
    const months  = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                     'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

    const today = new Date(); today.setHours(0, 0, 0, 0);
    let view = new Date(today.getFullYear(), today.getMonth(), 1);
    let selected = null;

    // Ngày có tour khởi hành (demo: T3, T5, T7 trong 60 ngày tới)
    const departSet = new Set();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today); d.setDate(today.getDate() + i);
      if ([2, 4, 6].includes(d.getDay())) departSet.add(d.toDateString());
    }

    const fmt = d => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
    const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

    function build() {
      titleEl.textContent = `${months[view.getMonth()]} ${view.getFullYear()}`;
      daysEl.innerHTML = '';

      const firstDay = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7; // T2 = 0
      const total = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();

      for (let i = 0; i < firstDay; i++) {
        const b = document.createElement('button');
        b.className = 'empty'; b.disabled = true; b.tabIndex = -1;
        daysEl.appendChild(b);
      }

      for (let day = 1; day <= total; day++) {
        const date = new Date(view.getFullYear(), view.getMonth(), day);
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = day;

        if (date < today) b.disabled = true;
        if (date.getTime() === today.getTime()) b.classList.add('today');
        if (departSet.has(date.toDateString())) b.classList.add('depart');
        if (selected && date.getTime() === selected.getTime()) b.classList.add('selected');

        b.addEventListener('click', () => {
          selected = date;
          text.textContent = fmt(date);
          text.classList.remove('placeholder');
          value.value = iso(date);
          build();
          close();
        });
        daysEl.appendChild(b);
      }
    }

    const open  = () => { dp.classList.add('open'); cal.hidden = false; build(); };
    const close = () => { dp.classList.remove('open'); setTimeout(() => cal.hidden = true, 180); };

    input.addEventListener('click', () => dp.classList.contains('open') ? close() : open());

    document.getElementById('calPrev').addEventListener('click', () => {
      view.setMonth(view.getMonth() - 1); build();
    });
    document.getElementById('calNext').addEventListener('click', () => {
      view.setMonth(view.getMonth() + 1); build();
    });

    document.addEventListener('click', e => {
      if (!dp.contains(e.target) && dp.classList.contains('open')) close();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  })();

  /* ---------- FORMS (demo) ---------- */
  document.getElementById('searchForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const date = document.getElementById('dpValue')?.value;
    alert(date
      ? `Đang tìm tour khởi hành ngày ${document.getElementById('dpText').textContent}...`
      : 'Vui lòng chọn ngày khởi hành để tìm tour.');
  });
  document.getElementById('newsForm')?.addEventListener('submit', e => {
    e.preventDefault(); alert('Cảm ơn bạn đã đăng ký nhận tin!'); e.target.reset();
  });

});
