// === NAVIGATION (hamburger) ===
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// === COUNTDOWN ===
// Target: next exhibition opening — 20. 10. 2026
const targetDate = new Date('2026-09-21T24:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById('countdown-text').textContent = 'Výstava právě probíhá!';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent    = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent   = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// === CAROUSEL ===
const slides = document.querySelectorAll('.carousel-slide');
const dots   = document.querySelectorAll('.carousel-dots span');
const track  = document.querySelector('.carousel-track');
let current  = 0;

function goToSlide(n) {
  current = (n + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

document.querySelector('.carousel-btn.prev').addEventListener('click', () => goToSlide(current - 1));
document.querySelector('.carousel-btn.next').addEventListener('click', () => goToSlide(current + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

setInterval(() => goToSlide(current + 1), 5000);

// === LOAD EXPOSITIONS FROM CSV ===
// Poznámka: fetch() nefunguje při otevření souboru přímo z disku (file://).
// Pokud stránku provozujete na serveru (http://), bude fetch fungovat automaticky.
// Pro lokální vývoj jsou data záložně vložena přímo v kódu níže.

const CSV_FALLBACK = `name,description,category,image
Počítače a internet,Od prvních kalkulátorů po umělou inteligenci – vývoj digitálního světa.,Informatika,https://images.unsplash.com/photo-1518770660439-4636190af475?w=400
Vesmírné dobývání,Rakety, satelity, Mars a sny o hvězdách. Interaktivní průlet kosmem.,Astronomie,https://images.unsplash.com/photo-1518770660439-4636190af475?w=400
Energie budoucnosti,Jaderná fúze, solární revoluce a svět bez fosilních paliv.,Energetika,https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400
Lidské tělo a medicína,Jak funguje náš organismus a kam míří moderní medicína.,Biologie,https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400
Robotika a automatizace,Průmysloví roboti, chirurgické systémy a humanoidní stroje.,Robotika,https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400
Kvantová fyzika,Superpozice, provázanost a počítače budoucnosti.,Fyzika,https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400`;

function parseAndRenderCSV(text) {
  const lines = text.trim().split('\n').slice(1);
  const grid = document.getElementById('expo-grid');
  grid.innerHTML = '';

  lines.forEach(line => {
    // Použijeme regex, který rozdělí řádek podle čárek, 
    // ale v popisu (druhý sloupec) jich může být víc.
    const parts = line.split(',');
    if (parts.length < 4) return;

    const name = parts[0].trim();
    // Spojíme vše mezi jménem a předposledním prvkem (kategorie) zpět do popisu
    const category = parts[parts.length - 2].trim();
    const image = parts[parts.length - 1].trim();
    const desc = parts.slice(1, parts.length - 2).join(',').trim();

    const card = document.createElement('div');
    card.className = 'expo-card';
    card.innerHTML = `
      <img src="${image}" alt="${name}" loading="lazy">
      <div class="expo-card-body">
        <h3>${name}</h3>
        <p>${desc}</p>
        <span class="tag">${category}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

async function loadExpositions() {
  try {
    const resp = await fetch('expositions.csv');
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const text = await resp.text();
    parseAndRenderCSV(text);
  } catch (err) {
    console.warn('CSV fetch se nezdařil, používám záložní data:', err.message);
    parseAndRenderCSV(CSV_FALLBACK);
  }
}

loadExpositions();

// === FAQ ACCORDION ===
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');

    document.querySelectorAll('.faq-question').forEach(b => {
      b.classList.remove('open');
      b.nextElementSibling.classList.remove('open');
    });

    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('open');
    }
  });
});

// === RESERVATION FORM ===
const form = document.getElementById('reservationForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const date   = form.querySelector('#visit-date').value;
  const time   = form.querySelector('#visit-time').value;
  const people = form.querySelector('#people').value;
  const type   = form.querySelector('#ticket-type').value;
  const name   = form.querySelector('#contact-name').value;
  const email  = form.querySelector('#contact-email').value;

  if (!date || !time || !people || !type || !name || !email) {
    alert('Vyplňte prosím všechna povinná pole.');
    return;
  }

  const success = document.getElementById('form-success');
  success.style.display = 'block';
  form.reset();

  setTimeout(() => { success.style.display = 'none'; }, 5000);
});
