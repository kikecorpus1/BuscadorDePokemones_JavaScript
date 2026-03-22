/* ── Estado global ── */
const state = {
  id: 1,
  musicOn: true,
  loading: false,
};

/* ── Colores por tipo ── */
const TYPE_COLORS = {
  normal:   '#A8A878', fire:     '#F08030', water:    '#6890F0',
  electric: '#F8D030', grass:    '#78C850', ice:      '#98D8D8',
  fighting: '#C03028', poison:   '#A040A0', ground:   '#E0C068',
  flying:   '#A890F0', psychic:  '#F85888', bug:      '#A8B820',
  rock:     '#B8A038', ghost:    '#705898', dragon:   '#7038F8',
  dark:     '#705848', steel:    '#B8B8D0', fairy:    '#EE99AC',
};

/* ── Nombres de stats ── */
const STAT_NAMES = {
  hp:                 'HP',
  attack:             'Ataque',
  defense:            'Defensa',
  'special-attack':   'Sp. Atk',
  'special-defense':  'Sp. Def',
  speed:              'Velocidad',
};

/* ── Referencias DOM ── */
const imgEl      = document.getElementById('imgPokemon');
const idEl       = document.getElementById('pokemonId');
const nameEl     = document.getElementById('pokemonName');
const typesEl    = document.getElementById('typesRow');
const heightEl   = document.getElementById('pokemonHeight');
const weightEl   = document.getElementById('pokemonWeight');
const statsEl    = document.getElementById('statsGrid');
const searchEl   = document.getElementById('searchPokemon');
const prevBtn    = document.getElementById('prev');
const nextBtn    = document.getElementById('next');
const musicBtn   = document.getElementById('musicBtn');
const musicLabel = document.getElementById('musicLabel');
const headerLight= document.getElementById('headerLight');
const spriteGlow = document.getElementById('spriteGlow');
const shell      = document.querySelector('.pokedex-shell');

musicBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  toggleMusic();
});

function toggleMusic() {
  state.musicOn = !state.musicOn;
  if (state.musicOn) {
    musicLabel.textContent = 'ON';
    musicBtn.classList.remove('muted');
  } else {
    // Detener cry si está sonando
    if (currentCry) {
      currentCry.pause();
      currentCry = null;
    }
    musicLabel.textContent = 'OFF';
    musicBtn.classList.add('muted');
  }
}

/* ── Partículas de fondo ── */
const particlesContainer = document.getElementById('bgParticles');
for (let i = 0; i < 18; i++) createParticle();

function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 6 + 3;
  p.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random() * 100}%;
    animation-duration:${Math.random() * 12 + 8}s;
    animation-delay:${Math.random() * 10}s;
  `;
  particlesContainer.appendChild(p);
}

/* ── Fetch principal ── */
async function fetchPokemon(query) {
  if (state.loading) return;
  state.loading = true;
  shell.classList.add('loading');
  prevBtn.disabled = true;
  nextBtn.disabled = true;

  const term = String(query).trim().toLowerCase() || String(state.id);

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${term}`);
    if (!res.ok) throw new Error('No encontrado');

    const data = await res.json();
    state.id = data.id;
    renderPokemon(data);

  } catch (err) {
    showToast(`❌ Pokémon "${term}" no encontrado`);
  } finally {
    state.loading = false;
    shell.classList.remove('loading');
    prevBtn.disabled = state.id <= 1;
    nextBtn.disabled = false;
  }
}

/* ── Renderizado ── */
function renderPokemon(data) {
  // Imagen (animated sprite o fallback)
  const sprite =
    data.sprites?.other?.showdown?.front_default ||
    data.sprites?.other?.['official-artwork']?.front_default ||
    data.sprites?.front_default;

  imgEl.classList.remove('pokemon-enter');
  void imgEl.offsetWidth; // reflow para reiniciar animación
  imgEl.src = sprite || '';
  imgEl.classList.add('pokemon-enter');

  // ID y nombre
  idEl.textContent  = `#${String(data.id).padStart(3, '0')}`;
  nameEl.textContent = data.name;

  // Tipos
  const types = data.types.map(t => t.type.name);
  typesEl.innerHTML = types.map(t => `
    <span class="type-badge" style="background:${TYPE_COLORS[t] || '#888'}">
      ${t}
    </span>
  `).join('');

  // Color dominante (primer tipo) → actualizar CSS variable
  const dominantColor = TYPE_COLORS[types[0]] || '#6890F0';
  document.documentElement.style.setProperty('--poke-color', dominantColor);

  // Medidas
  heightEl.textContent = `${(data.height / 10).toFixed(1)} m`;
  weightEl.textContent = `${(data.weight / 10).toFixed(1)} kg`;

  // Stats
  statsEl.innerHTML = data.stats.map(s => {
    const label = STAT_NAMES[s.stat.name] || s.stat.name;
    const val   = s.base_stat;
    const pct   = Math.min((val / 255) * 100, 100).toFixed(1);
    return `
      <div class="stat-row">
        <span class="stat-name">${label}</span>
        <span class="stat-val">${val}</span>
        <div class="stat-bar-bg">
          <div class="stat-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');

  // Reproducir cry del Pokémon
  playCry(data.id);
}

/* ── Cry del Pokémon ── */
let currentCry = null;

function playCry(id) {
  if (currentCry) {
    currentCry.pause();
    currentCry = null;
  }

  if (!state.musicOn) return;

  currentCry = new Audio(
    `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`
  );
  currentCry.volume = 0.5;
  currentCry.play().catch(() => {});
}

/* ── Toast de error ── */
let toastTimer;
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ── Eventos ── */
searchEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const val = searchEl.value.trim();
    if (!val) return;
    fetchPokemon(val);
    searchEl.value = '';
  }
});

prevBtn.addEventListener('click', () => {
  if (state.id > 1) {
    state.id--;
    fetchPokemon(state.id);
    searchEl.value = '';
  }
});

nextBtn.addEventListener('click', () => {
  state.id++;
  fetchPokemon(state.id);
  searchEl.value = '';
});

/* ── Carga inicial ── */
fetchPokemon(1);
