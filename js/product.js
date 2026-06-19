/* ============================================================
   Trường Thành Travel - Tour detail page
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- GALLERY (thumbnail là HTML tĩnh) ---------- */
  const galMain = document.getElementById('galMain');
  const galThumbs = document.getElementById('galThumbs');
  const galPlay = document.getElementById('galPlay');
  const thumbs = [...galThumbs.querySelectorAll('img')];
  let galIndex = 0;

  function showImage(i) {
    galIndex = (i + thumbs.length) % thumbs.length;
    galMain.src = thumbs[galIndex].dataset.full || thumbs[galIndex].src;
    thumbs.forEach((t, k) => t.classList.toggle('active', k === galIndex));
    galPlay.hidden = galIndex !== 0; // nút video chỉ hiện ở ảnh đầu tiên
  }
  galThumbs.addEventListener('click', e => {
    const thumb = e.target.closest('img');
    if (thumb) showImage(thumbs.indexOf(thumb));
  });
  document.getElementById('galPrev').addEventListener('click', () => showImage(galIndex - 1));
  document.getElementById('galNext').addEventListener('click', () => showImage(galIndex + 1));

  /* ---------- VIDEO POPUP ---------- */
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoFrame');

  function openVideo(id) {
    frame.innerHTML =
      `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0"
        title="Video giới thiệu" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>`;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeVideo() {
    modal.hidden = true;
    frame.innerHTML = ''; // gỡ iframe để dừng video
    document.body.style.overflow = '';
  }

  galPlay.addEventListener('click', () => openVideo(galPlay.dataset.video));
  modal.addEventListener('click', e => { if (e.target.dataset.close !== undefined) closeVideo(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeVideo(); });

  /* ---------- BOOKING (quantity + total) ---------- */
  const rows = [...document.querySelectorAll('.qty-row')];
  const totalEl = document.getElementById('bookingTotal');
  const money = n => n.toLocaleString('vi-VN') + '₫';

  function calcTotal() {
    let total = 0;
    rows.forEach(r => {
      total += (+r.dataset.price) * (+r.querySelector('.qty-val').value);
    });
    totalEl.textContent = money(total);
  }

  rows.forEach(r => {
    const input = r.querySelector('.qty-val');
    r.querySelector('.qty-plus').addEventListener('click', () => {
      input.value = +input.value + 1; calcTotal();
    });
    r.querySelector('.qty-minus').addEventListener('click', () => {
      if (+input.value > 0) { input.value = +input.value - 1; calcTotal(); }
    });
  });
  calcTotal();

  document.getElementById('bookBtn').addEventListener('click', () => {
    const adults = +rows[0].querySelector('.qty-val').value;
    const c1 = +rows[1].querySelector('.qty-val').value;
    const c2 = +rows[2].querySelector('.qty-val').value;
    if (adults + c1 + c2 === 0) { alert('Vui lòng chọn số lượng khách.'); return; }
    alert(`Đặt tour thành công!\n- Người lớn: ${adults}\n- Trẻ 5-11: ${c1}\n- Trẻ 3-4: ${c2}\nTổng: ${totalEl.textContent}\nNhân viên sẽ liên hệ xác nhận trong giây lát.`);
  });

  /* ---------- TABS ---------- */
  const tabBtns = [...document.querySelectorAll('.tabs__btn')];
  const panels = [...document.querySelectorAll('.tabs__panel')];
  tabBtns.forEach(btn => btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  }));

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
  document.querySelectorAll('.has-sub > a').forEach(a => a.addEventListener('click', e => {
    if (window.innerWidth <= 960) { e.preventDefault(); a.parentElement.classList.toggle('open'); }
  }));

  /* ---------- BACK TO TOP ---------- */
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => backTop.classList.toggle('show', window.scrollY > 400));
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- NEWSLETTER ---------- */
  document.getElementById('newsForm')?.addEventListener('submit', e => {
    e.preventDefault(); alert('Cảm ơn bạn đã đăng ký nhận tin!'); e.target.reset();
  });

});
