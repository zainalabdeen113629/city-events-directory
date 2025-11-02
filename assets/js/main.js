/* main.js
   يحتوي على:
   - بيانات أحداث مبدئية (مصفوفة)
   - ريندر للصفحات: index, events, event detail
   - فلترة، سلايدر بسيط، حفظ تفضيلات في localStorage
   - فرم التحقق لصفحة Contact
   - حجز وهمي modal
   - Scroll-to-top و Dark Mode
*/

/* -------------------------
   Sample events dataset
   ------------------------- */
   const EVENTS = [
    {
      id: 1,
      title: "مهرجان الموسيقى الصيفي",
      date: "2025-11-15",
      time: "18:00",
      place: "حديقة المدينة",
      category: "music",
      short: "حفلات حية، أسواق، أطعمة محلية.",
      long: "مهرجان موسيقي يجمع فرق محلية ودولية ضمن أجواء ممتعة لجميع العائلة. يتضمن فعاليات للأطفال وأركان أطعمة.",
      img: "assets/img/event-1.jpg",
      featured: true
    },
    {
      id: 2,
      title: "معرض الفن المحلي",
      date: "2025-11-20",
      time: "10:00",
      place: "مركز الفن",
      category: "culture",
      short: "روائع معاصرة لفنانين محليين.",
      long: "معرض يعرض أعمال تشكيلية، نحت وفنون رقمية لفنانين من المدينة والمنطقة.",
      img: "assets/img/event-2.jpg",
      featured: true
    },
    {
      id: 3,
      title: "سباق العائلة الخيري",
      date: "2025-12-01",
      time: "09:00",
      place: "كورنيش المدينة",
      category: "sports",
      short: "سباق مسافات قصيرة للعائلات.",
      long: "سباق ممتع للعائلات، فئات للأطفال والشباب، وجوائز رعاية مجتمعية.",
      img: "assets/img/event-3.jpg",
      featured: false
    }
  ];
  
  /* Utility: get page type by body class */
  function pageType(){
    const b = document.body.className;
    if(b.includes('page-index')) return 'index';
    if(b.includes('page-events')) return 'events';
    if(b.includes('page-event')) return 'event';
    if(b.includes('page-contact')) return 'contact';
    return '';
  }
  
  /* Render helpers */
  function createEventCard(event){
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    col.innerHTML = `
      <div class="card h-100">
        <img src="${event.img}" alt="${event.title}" class="event-card-img w-100">
        <div class="card-body text-end">
          <h5 class="card-title">${event.title}</h5>
          <p class="card-text small text-muted">${formatDate(event.date)} — ${event.place}</p>
          <p class="card-text">${event.short}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div><span class="badge ${badgeClass(event.category)} text-capitalize">${categoryName(event.category)}</span></div>
            <div>
              <a href="event.html?id=${event.id}" class="btn btn-sm btn-outline-primary">التفاصيل</a>
            </div>
          </div>
        </div>
      </div>
    `;
    return col;
  }
  
  /* Display featured on index */
  function renderFeatured(){
    const wrap = document.getElementById('featuredCarousel');
    if(!wrap) return;
    wrap.innerHTML = '';
    const featured = EVENTS.filter(e=>e.featured);
    featured.forEach(ev=>{
      const card = document.createElement('div');
      card.className = 'card featured-card';
      card.style.minWidth = '320px';
      card.innerHTML = `
        <img src="${ev.img}" class="card-img-top" alt="${ev.title}">
        <div class="card-body text-end">
          <h5 class="card-title">${ev.title}</h5>
          <p class="card-text small text-muted">${formatDate(ev.date)} — ${ev.place}</p>
          <a href="event.html?id=${ev.id}" class="btn btn-outline-primary btn-sm">عرض التفاصيل</a>
        </div>
      `;
      wrap.appendChild(card);
    });
  
    // simple prev/next for horizontal scroll
    const prev = document.getElementById('featPrev');
    const next = document.getElementById('featNext');
    if(prev && next){
      prev.onclick = ()=> wrap.scrollBy({left:-340, behavior:'smooth'});
      next.onclick = ()=> wrap.scrollBy({left:340, behavior:'smooth'});
    }
  }
  
  /* Render latest events on index */
  function renderLatest(){
    const grid = document.getElementById('eventsGrid');
    if(!grid) return;
    grid.innerHTML = '';
    EVENTS.slice(0).reverse().forEach(ev=>{
      grid.appendChild(createEventCard(ev));
    });
  }
  
  /* Events page: render all events (filtered) */
  function renderEventsList(filter = {}){
    const list = document.getElementById('eventsList');
    if(!list) return;
    list.innerHTML = '';
    // apply filter: category, search, fromDate
    let res = EVENTS.slice();
    if(filter.category && filter.category !== 'all'){
      res = res.filter(e=>e.category === filter.category);
    }
    if(filter.search){
      const q = filter.search.toLowerCase();
      res = res.filter(e => e.title.toLowerCase().includes(q) || e.place.toLowerCase().includes(q));
    }
    if(filter.fromDate){
      res = res.filter(e => e.date >= filter.fromDate);
    }
    if(res.length === 0){
      list.innerHTML = '<div class="col-12"><div class="alert alert-info text-end">لا توجد فعاليات مطابقّة للفلتر.</div></div>';
      return;
    }
    res.forEach(ev=>{
      const cardCol = document.createElement('div');
      cardCol.className = 'col-md-6';
      cardCol.innerHTML = `
        <div class="card h-100 d-flex flex-row flex-md-column">
          <img src="${ev.img}" class="w-100 w-md-100" style="width:200px;object-fit:cover;height:150px;border-top-left-radius:12px;border-bottom-left-radius:12px;" alt="${ev.title}">
          <div class="card-body text-end">
            <h5 class="card-title">${ev.title}</h5>
            <p class="card-text small text-muted">${formatDate(ev.date)} — ${ev.time} — ${ev.place}</p>
            <p class="card-text">${ev.short}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div><span class="badge ${badgeClass(ev.category)}">${categoryName(ev.category)}</span></div>
              <div>
                <a href="event.html?id=${ev.id}" class="btn btn-sm btn-outline-primary">التفاصيل</a>
              </div>
            </div>
          </div>
        </div>
      `;
      list.appendChild(cardCol);
    });
  }
  
  /* Event detail page render */
  function renderEventDetail(){
    const container = document.getElementById('eventContent');
    if(!container) return;
    const params = new URLSearchParams(location.search);
    const id = parseInt(params.get('id')) || EVENTS[0].id;
    const ev = EVENTS.find(e=>e.id === id) || EVENTS[0];
    container.innerHTML = `
      <div class="card p-3">
        <div class="row g-3 align-items-start">
          <div class="col-lg-6 text-end">
            <h2>${ev.title}</h2>
            <p class="small text-muted">${formatDate(ev.date)} — ${ev.time} — ${ev.place}</p>
            <p>${ev.long}</p>
            <div class="mb-3">
              <button class="btn btn-primary me-2" id="addCalendar">أضف للتقويم</button>
              <button class="btn btn-outline-secondary me-2" id="shareBtn">شارك</button>
              <button class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#bookingModal" id="openBooking">حجز مكان</button>
            </div>
            <h6 class="mt-4">فعاليات ذات صلة</h6>
            <div id="related" class="d-flex gap-2 flex-wrap"></div>
          </div>
          <div class="col-lg-6 text-end">
            <img src="${ev.img}" alt="${ev.title}" class="w-100 rounded mb-3" style="height:300px;object-fit:cover">
            <div class="card p-2">
              <h6 class="mb-1">الموقع</h6>
              <img src="assets/img/map-placeholder.jpg" alt="map" class="w-100 rounded" style="height:200px;object-fit:cover">
              <small class="d-block mt-2 text-muted">${ev.place}</small>
            </div>
          </div>
        </div>
      </div>
    `;
  
    // related events
    const relWrap = document.getElementById('related');
    const related = EVENTS.filter(e => e.category === ev.category && e.id !== ev.id).slice(0,3);
    if(related.length === 0) relWrap.innerHTML = '<small class="text-muted">لا فعاليات ذات صلة حالياً.</small>';
    else{
      related.forEach(r=>{
        const card = document.createElement('a');
        card.href = `event.html?id=${r.id}`;
        card.className = 'card p-2 text-decoration-none text-end';
        card.style.minWidth = '180px';
        card.innerHTML = `<strong>${r.title}</strong><div class="small text-muted">${formatDate(r.date)}</div>`;
        relWrap.appendChild(card);
      });
    }
  
    // Add to calendar (simple download .ics)
    const btnCal = document.getElementById('addCalendar');
    btnCal.addEventListener('click', ()=>{
      const ics = generateICS(ev);
      const blob = new Blob([ics], {type:'text/calendar;charset=utf-8'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${ev.title.replace(/\s+/g,'_')}.ics`;
      link.click();
    });
  
    // Share button (navigator.share fallback)
    const shareBtn = document.getElementById('shareBtn');
    shareBtn.addEventListener('click', async ()=>{
      const shareData = {title: ev.title, text: ev.short, url: location.href};
      if(navigator.share){
        try{ await navigator.share(shareData); }catch(e){ alert('فشل المشاركة'); }
      } else {
        // fallback: copy link
        navigator.clipboard.writeText(location.href).then(()=>
          alert('تم نسخ رابط الفعالية إلى الحافظة')
        );
      }
    });
  
    // Booking modal prefill title
    const openBooking = document.getElementById('openBooking');
    openBooking.addEventListener('click', ()=>{
      document.getElementById('bookEventTitle').textContent = ev.title;
      // clear previous alert
      const alert = document.getElementById('bookingAlert');
      if(alert) alert.innerHTML = '';
    });
  }
  
  /* Booking form handling */
  function initBooking(){
    const form = document.getElementById('bookingForm');
    if(!form) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name').trim();
      const phone = data.get('phone').trim();
      const qty = parseInt(data.get('qty'),10) || 1;
      const alertDiv = document.getElementById('bookingAlert');
  
      if(name.length < 2 || !/^\d{6,15}$/.test(phone)){
        alertDiv.innerHTML = `<div class="alert alert-danger text-end">تأكد من إدخال اسم صحيح ورقم هاتف صالح (6-15 رقم).</div>`;
        return;
      }
      // Simulate success and save in localStorage as "bookings"
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push({name, phone, qty, date: new Date().toISOString()});
      localStorage.setItem('bookings', JSON.stringify(bookings));
      alertDiv.innerHTML = `<div class="alert alert-success text-end">تم تأكيد الحجز — شكراً لك!</div>`;
      form.reset();
      // close modal after short delay
      setTimeout(()=>{ const modalEl = document.getElementById('bookingModal'); const modal = bootstrap.Modal.getInstance(modalEl); modal.hide(); }, 1000);
    });
  }
  
  /* Contact form validation & alerts */
  function initContactForm(){
    const form = document.getElementById('contactForm');
    if(!form) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      if(!form.checkValidity()){
        form.classList.add('was-validated');
        return;
      }
      const data = new FormData(form);
      // Simulate send
      const alertBox = document.getElementById('contactAlert');
      alertBox.innerHTML = `<div class="alert alert-success text-end">تم إرسال الرسالة — سنتواصل معك قريبًا.</div>`;
      form.reset();
      form.classList.remove('was-validated');
    });
  }
  
  /* Simple helpers */
  function formatDate(iso){
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('ar-EG', {day:'numeric',month:'short',year:'numeric'});
  }
  function badgeClass(cat){
    switch(cat){
      case 'music': return 'bg-primary';
      case 'culture': return 'bg-success';
      case 'sports': return 'bg-warning text-dark';
      case 'family': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  }
  function categoryName(cat){
    switch(cat){
      case 'music': return 'موسيقى';
      case 'culture': return 'ثقافة';
      case 'sports': return 'رياضة';
      case 'family': return 'عائلي';
      default: return cat;
    }
  }
  
  /* Generate a simple ICS calendar entry */
  function generateICS(ev){
    // simple date handling: use date + time if available
    const start = (ev.date + 'T' + (ev.time ? ev.time.replace(':','') + '00' : '000000')).replace(/[:\-]/g,'');
    const uid = `ev-${ev.id}@cityevents`;
    return `BEGIN:VCALENDAR
  VERSION:2.0
  PRODID:-//CityEvents//EN
  BEGIN:VEVENT
  UID:${uid}
  DTSTAMP:${start}
  DTSTART:${start}
  SUMMARY:${ev.title}
  LOCATION:${ev.place}
  DESCRIPTION:${ev.long}
  END:VEVENT
  END:VCALENDAR`;
  }
  
  /* Scroll-to-top and show/hide */
  function initScrollTop(){
    const btn = document.getElementById('scrollTop');
    if(!btn) return;
    window.addEventListener('scroll', ()=>{
      if(window.scrollY > 400) btn.style.display = 'block'; else btn.style.display = 'none';
    });
    btn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
  }
  
  /* Dark mode toggle with localStorage */
  function initDarkMode(){
    const toggle = document.getElementById('darkModeToggle');
    if(!toggle) return;
    const saved = localStorage.getItem('darkMode');
    if(saved === 'on') document.body.classList.add('dark');
    toggle.addEventListener('click', ()=>{
      document.body.classList.toggle('dark');
      localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'on' : 'off');
    });
  }
  
  /* Events filtering UI */
  function initFilters(){
    const type = pageType();
    // Elements may exist on index and events page
    document.querySelectorAll('.badge-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const filt = btn.dataset.filter;
        // on index: filter grid
        if(type === 'index'){
          const grid = document.getElementById('eventsGrid');
          if(!grid) return;
          // re-render filtered
          const filtered = (filt === 'all') ? EVENTS : EVENTS.filter(e=>e.category === filt);
          grid.innerHTML = '';
          filtered.reverse().forEach(ev=> grid.appendChild(createEventCard(ev)));
        } else {
          // on events list page: set select & apply
          const sel = document.getElementById('filterCategory');
          if(sel){ sel.value = filt; applyFilters(); }
        }
        // store preference
        localStorage.setItem('lastCategory', filt);
      });
    });
  
    // Events page apply/clear
    const applyBtn = document.getElementById('applyFilters');
    if(applyBtn) applyBtn.addEventListener('click', applyFilters);
    const clearBtn = document.getElementById('clearFilters');
    if(clearBtn) clearBtn.addEventListener('click', ()=>{
      document.getElementById('filterCategory').value = 'all';
      document.getElementById('searchInput').value = '';
      document.getElementById('fromDate').value = '';
      applyFilters();
      localStorage.removeItem('filters');
    });
  
    // load saved filters
    const saved = JSON.parse(localStorage.getItem('filters') || 'null');
    if(saved){
      const sel = document.getElementById('filterCategory');
      if(sel) sel.value = saved.category || 'all';
      const search = document.getElementById('searchInput');
      if(search) search.value = saved.search || '';
      const fromDate = document.getElementById('fromDate');
      if(fromDate) fromDate.value = saved.fromDate || '';
      if(pageType() === 'events') applyFilters();
      if(pageType() === 'index' && saved.category){
        // apply index category
        document.querySelectorAll('.badge-btn').forEach(b=> b.classList.toggle('active', b.dataset.filter === saved.category));
        // filter grid
        const grid = document.getElementById('eventsGrid');
        if(grid){
          const filtered = (saved.category === 'all') ? EVENTS : EVENTS.filter(e=>e.category === saved.category);
          grid.innerHTML = '';
          filtered.reverse().forEach(ev=> grid.appendChild(createEventCard(ev)));
        }
      }
    }
  
    // search enter
    const searchInput = document.getElementById('searchInput');
    if(searchInput) searchInput.addEventListener('keyup', (e)=>{
      if(e.key === 'Enter') applyFilters();
    });
  }
  
  /* applyFilters used by events page UI */
  function applyFilters(){
    const category = document.getElementById('filterCategory') ? document.getElementById('filterCategory').value : 'all';
    const search = document.getElementById('searchInput') ? document.getElementById('searchInput').value.trim() : '';
    const fromDate = document.getElementById('fromDate') ? document.getElementById('fromDate').value : '';
    const filter = {category, search, fromDate};
    localStorage.setItem('filters', JSON.stringify(filter));
    renderEventsList(filter);
  }
  
  /* Initialize contact form validations on page load */
  function initContactValidation(){
    const form = document.querySelector('.needs-validation');
    if(!form) return;
    form.addEventListener('submit', function(event){
      if(!form.checkValidity()){
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  }
  
  /* Initialize everything on DOM ready */
  document.addEventListener('DOMContentLoaded', ()=>{
  
    initScrollTop();
    initDarkMode();
    initFilters();
    initContactForm();
    initContactValidation();
    initBooking();
  
    // Render by page
    const type = pageType();
    if(type === 'index'){
      renderFeatured();
      renderLatest();
    } else if(type === 'events'){
      // apply saved filters or default
      const saved = JSON.parse(localStorage.getItem('filters') || 'null');
      if(saved) renderEventsList(saved); else renderEventsList({});
    } else if(type === 'event'){
      renderEventDetail();
    } else if(type === 'contact'){
      // contact page handled above
    }
  
    // If visitor came with query param category? (optionally)
    const params = new URLSearchParams(location.search);
    const pcat = params.get('category');
    if(pcat){
      // set UI accordingly
      const sel = document.getElementById('filterCategory');
      if(sel){ sel.value = pcat; applyFilters(); }
    }
  });
  