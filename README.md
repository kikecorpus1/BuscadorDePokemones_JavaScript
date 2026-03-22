# ⚡ Pokédex Web

> Pokédex interactiva construida con tecnologías web nativas. Consume la PokéAPI en tiempo real para mostrar sprite animado, tipos, estadísticas, altura y peso de cualquier Pokémon. Incluye sonidos y música de fondo retro.

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura semántica con `header`, `main` y `footer` |
| **CSS3** | Variables dinámicas, `@keyframes`, gradientes y partículas animadas |
| **JavaScript ES6+** | `async/await`, `fetch`, manipulación del DOM y manejo de errores |
| **PokéAPI** | Fuente de datos: sprite, tipos, stats, altura y peso |
| **PokeAPI Cries** | Archivos `.ogg` con el grito oficial de cada Pokémon |
| **Web Audio API** | Reproducción del cry y música de fondo con control de volumen |
| **Google Fonts** | *Press Start 2P* (pixel retro) + *Rajdhani* (datos y UI) |
| **CSS Custom Properties** | `--poke-color` cambia todo el esquema visual según el tipo |

---

## 📁 Estructura

```
pokedex/
├── index.html    →  Marcado y estructura
├── style.css     →  Estilos, animaciones y theming por tipo
└── script.js     →  Lógica, fetch a la API y audio
```

---

## 📄 HTML5

- Etiquetas semánticas (`header`, `main`, `footer`) sin tablas para layout
- El elemento `<audio loop>` gestiona la música de fondo
- Sin dependencias externas de frameworks

---

## 🎨 CSS3

El color de **toda la interfaz** cambia automáticamente según el tipo del Pokémon gracias a una CSS custom property que JavaScript actualiza en cada carga:

```css
document.documentElement.style.setProperty('--poke-color', dominantColor);
```

### Animaciones `@keyframes`

| Nombre | Efecto |
|---|---|
| `bounce` | El sprite entra desde abajo con rebote |
| `glowPulse` | El halo detrás del sprite respira |
| `shimmer` | Barrido de luz en el header cada 3s |
| `floatUp` | 18 partículas suben por la pantalla |
| `pulse` | La luz indicadora late suavemente |

---

## ⚙️ JavaScript ES6+

Se reemplazó `XMLHttpRequest` por `fetch` con `async/await`. El estado global previene requests simultáneos:

```js
const state = {
  id:      1,      // ID actual del Pokémon
  musicOn: true,   // Estado de la música
  loading: false,  // Bloquea requests paralelos
};
```

### Funciones principales

| Función | Descripción |
|---|---|
| `fetchPokemon(query)` | Llama a la API y gestiona el estado de carga |
| `renderPokemon(data)` | Actualiza el DOM con todos los datos |
| `playCry(id)` | Instancia un `Audio()` con el `.ogg` del Pokémon |
| `showToast(msg)` | Muestra un error flotante si el Pokémon no existe |
| `createParticle()` | Genera partículas CSS animadas en el fondo |

---

## 🌐 PokéAPI

```
GET https://pokeapi.co/api/v2/pokemon/{nombre-o-id}
```

Datos utilizados de la respuesta:

- `sprites.other.showdown.front_default` → sprite animado en pixel art
- `types[].type.name` → tipos del Pokémon
- `stats[].base_stat` → estadísticas base (HP, Ataque, Defensa…)
- `height` / `weight` → convertidos de decímetros y hectogramos

---

## 🔊 Audio

### Cry del Pokémon
Cada cambio de Pokémon dispara un `new Audio()` con su grito oficial:
```
https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/{id}.ogg
```

### Música de fondo
El botón **♪ ON/OFF** permite activar o pausar la música en cualquier momento.

> ⚠️ **Nota de autoplay:** los navegadores modernos bloquean el audio automático. La música inicia tras el primer clic del usuario en la página.

---

## 📸 Capturas de pantalla

![](pokemon.gif) 

## 🚀 Cómo usar

1. Clona el repositorio
2. Abre `index.html` en cualquier navegador moderno
3. Escribe un nombre o número en el buscador y presiona **Enter**
4. Navega con los botones **◀ Prev** y **Next ▶**
5. Controla la música con el botón **♪** en el encabezado

> Requiere conexión a internet (PokéAPI y Google Fonts se cargan en tiempo real).
