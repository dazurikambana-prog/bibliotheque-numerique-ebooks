/* LibraNum — Bibliothèque numérique */

const BOOKS = [
  {
    id: 1,
    title: "L'Écho des Étoiles",
    author: "Camille Verdier",
    price: 9.99,
    category: "science-fiction",
    emoji: "🌌",
    badge: "Nouveau",
    desc: "Dans un futur lointain, une exploratrice découvre un signal provenant d'une civilisation oubliée. Un roman de science-fiction captivant sur l'identité et le cosmos."
  },
  {
    id: 2,
    title: "Les Murs de Minuit",
    author: "Élodie Marchand",
    price: 7.50,
    category: "roman",
    emoji: "🏚️",
    badge: null,
    desc: "Une maison isolée, des secrets de famille et une nuit qui change tout. Thriller psychologique intense et immersif."
  },
  {
    id: 3,
    title: "Réinventez votre matin",
    author: "Thomas Lefèvre",
    price: 12.90,
    category: "developpement",
    emoji: "☀️",
    badge: "Best-seller",
    desc: "Méthodes concrètes pour transformer vos matinées et booster productivité, énergie et sérénité au quotidien."
  },
  {
    id: 4,
    title: "Startup à 20 ans",
    author: "Léa Fontaine",
    price: 14.00,
    category: "business",
    emoji: "🚀",
    badge: null,
    desc: "Le guide pratique pour lancer votre première entreprise sans capital, avec des retours d'expérience réels."
  },
  {
    id: 5,
    title: "Paris 1942",
    author: "Henri Dubois",
    price: 11.50,
    category: "histoire",
    emoji: "📜",
    badge: null,
    desc: "Récit historique poignant sur la vie quotidienne à Paris sous l'Occupation, vu à travers les yeux d'une famille ordinaire."
  },
  {
    id: 6,
    title: "Le Petit Dragon Vert",
    author: "Sophie Renaud",
    price: 6.90,
    category: "jeunesse",
    emoji: "🐉",
    badge: "Jeunesse",
    desc: "Un jeune dragon trop petit pour cracher du feu part à l'aventure pour trouver sa place. Conte magique pour 7-12 ans."
  },
  {
    id: 7,
    title: "Code & Âme",
    author: "Marc Nguyen",
    price: 13.50,
    category: "science-fiction",
    emoji: "🤖",
    badge: null,
    desc: "Quand une IA développe une conscience, où s'arrête le programme et où commence l'être ? Roman philosophique et techno."
  },
  {
    id: 8,
    title: "Les Lettres oubliées",
    author: "Isabelle Moreau",
    price: 8.99,
    category: "roman",
    emoji: "💌",
    badge: null,
    desc: "Une correspondance retrouvée dans un grenier révèle une histoire d'amour interdite des années 1950."
  },
  {
    id: 9,
    title: "Focus profond",
    author: "Nicolas Petit",
    price: 10.90,
    category: "developpement",
    emoji: "🧠",
    badge: null,
    desc: "Techniques de concentration, gestion des distractions et construction d'une attention durable à l'ère numérique."
  },
  {
    id: 10,
    title: "Négocier comme un pro",
    author: "Amélie Rousseau",
    price: 15.00,
    category: "business",
    emoji: "🤝",
    badge: "Best-seller",
    desc: "Stratégies de négociation éprouvées pour le business, le salaire et la vie quotidienne. Cas pratiques inclus."
  },
  {
    id: 11,
    title: "Les Rois de France",
    author: "Pierre Lambert",
    price: 16.50,
    category: "histoire",
    emoji: "👑",
    badge: null,
    desc: "Panorama vivant de la monarchie française, des Capétiens à Louis XVI, avec cartes et chronologies."
  },
  {
    id: 12,
    title: "Aventures au pays des Nuages",
    author: "Clara Blanc",
    price: 5.90,
    category: "jeunesse",
    emoji: "☁️",
    badge: null,
    desc: "Deux enfants découvrent une porte magique vers un monde flottant. Imaginaire, humour et amitié."
  }
];

const CATEGORY_LABELS = {
  roman: "Roman",
  "science-fiction": "Science-fiction",
  developpement: "Développement personnel",
  business: "Business",
  histoire: "Histoire",
  jeunesse: "Jeunesse"
};

let cart = JSON.parse(localStorage.getItem("libranum-cart") || "[]");
let currentSearch = "";
let currentCategory = "all";
let currentSort = "popular";

/* ——— Navigation ——— */
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  const section = document.getElementById(id);
  if (section) section.classList.add("active");
  const link = document.querySelector(`.nav-link[data-section="${id}"]`);
  if (link) link.classList.add("active");
  document.getElementById("nav").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    showSection(link.dataset.section);
  });
});

document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("open");
});

/* ——— Search ——— */
document.getElementById("search-toggle").addEventListener("click", () => {
  document.getElementById("search-bar").classList.toggle("open");
  document.getElementById("search-input").focus();
});

document.getElementById("search-input").addEventListener("input", e => {
  currentSearch = e.target.value.toLowerCase().trim();
  if (document.getElementById("catalogue").classList.contains("active")) {
    renderCatalogue();
  } else {
    showSection("catalogue");
    renderCatalogue();
  }
});

/* ——— Cart ——— */
function saveCart() {
  localStorage.setItem("libranum-cart", JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id) {
  const book = BOOKS.find(b => b.id === id);
  if (!book) return;
  if (!cart.find(i => i.id === id)) {
    cart.push({ id, qty: 1 });
    saveCart();
  }
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function updateCartUI() {
  const countEl = document.getElementById("cart-count");
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  countEl.textContent = cart.length;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="cart-empty">Votre panier est vide.</p>`;
    totalEl.textContent = "0,00 €";
    return;
  }

  let total = 0;
  itemsEl.innerHTML = cart.map(item => {
    const book = BOOKS.find(b => b.id === item.id);
    if (!book) return "";
    total += book.price;
    return `
      <div class="cart-item">
        <div class="cart-item-cover">${book.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-title">${book.title}</div>
          <div class="cart-item-price">${formatPrice(book.price)}</div>
          <button class="cart-item-remove" onclick="removeFromCart(${book.id})">Retirer</button>
        </div>
      </div>
    `;
  }).join("");

  totalEl.textContent = formatPrice(total);
}

function openCart() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
}
function closeCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("open");
}

document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
document.getElementById("cart-overlay").addEventListener("click", closeCart);

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) return;
  alert("Merci pour votre commande !\n\nCeci est une démonstration. Aucun paiement n'a été effectué.\nDans une version réelle, vous seriez redirigé vers un système de paiement sécurisé.");
  cart = [];
  saveCart();
  closeCart();
});

/* ——— Modal ——— */
function openBook(id) {
  const book = BOOKS.find(b => b.id === id);
  if (!book) return;
  const body = document.getElementById("modal-body");
  body.innerHTML = `
    <div class="modal-layout">
      <div class="modal-cover">${book.emoji}</div>
      <div>
        <h2 class="modal-title">${book.title}</h2>
        <p class="modal-author">par ${book.author}</p>
        <p class="modal-price">${formatPrice(book.price)}</p>
        <p class="modal-desc">${book.desc}</p>
        <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem;">
          Catégorie : ${CATEGORY_LABELS[book.category] || book.category}
        </p>
        <div class="modal-actions">
          <button class="btn btn-primary" onclick="addToCart(${book.id}); closeModal();">Ajouter au panier</button>
          <button class="btn btn-outline" onclick="closeModal()">Fermer</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("book-modal").classList.add("open");
  document.getElementById("modal-overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("book-modal").classList.remove("open");
  document.getElementById("modal-overlay").classList.remove("open");
}

document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-overlay").addEventListener("click", closeModal);

/* ——— Render books ——— */
function formatPrice(p) {
  return p.toFixed(2).replace(".", ",") + " €";
}

function bookCardHTML(book) {
  return `
    <article class="book-card" onclick="openBook(${book.id})">
      <div class="book-cover">
        ${book.emoji}
        ${book.badge ? `<span class="badge">${book.badge}</span>` : ""}
      </div>
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">${book.author}</p>
        <div class="book-meta">
          <span class="book-price">${formatPrice(book.price)}</span>
          <span class="book-category">${CATEGORY_LABELS[book.category] || ""}</span>
        </div>
      </div>
    </article>
  `;
}

function getFilteredBooks() {
  let list = [...BOOKS];

  if (currentSearch) {
    list = list.filter(b =>
      b.title.toLowerCase().includes(currentSearch) ||
      b.author.toLowerCase().includes(currentSearch) ||
      (CATEGORY_LABELS[b.category] || "").toLowerCase().includes(currentSearch)
    );
  }

  if (currentCategory !== "all") {
    list = list.filter(b => b.category === currentCategory);
  }

  switch (currentSort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "title":
      list.sort((a, b) => a.title.localeCompare(b.title, "fr"));
      break;
    default:
      break;
  }

  return list;
}

function renderFeatured() {
  const featured = BOOKS.filter(b => b.badge).slice(0, 4);
  if (featured.length < 4) {
    featured.push(...BOOKS.filter(b => !b.badge).slice(0, 4 - featured.length));
  }
  document.getElementById("featured-books").innerHTML = featured.map(bookCardHTML).join("");
}

function renderCatalogue() {
  const list = getFilteredBooks();
  const grid = document.getElementById("all-books");
  const noResults = document.getElementById("no-results");
  if (list.length === 0) {
    grid.innerHTML = "";
    noResults.hidden = false;
  } else {
    noResults.hidden = true;
    grid.innerHTML = list.map(bookCardHTML).join("");
  }
}

document.getElementById("category-filter").addEventListener("change", e => {
  currentCategory = e.target.value;
  renderCatalogue();
});

document.getElementById("sort-filter").addEventListener("change", e => {
  currentSort = e.target.value;
  renderCatalogue();
});

/* ——— Contact ——— */
function handleContact(e) {
  e.preventDefault();
  document.getElementById("form-success").hidden = false;
  e.target.reset();
  setTimeout(() => {
    document.getElementById("form-success").hidden = true;
  }, 4000);
}

/* ——— Init ——— */
renderFeatured();
renderCatalogue();
updateCartUI();
