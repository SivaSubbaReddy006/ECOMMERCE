"use strict";

/*
  STUDIO NILA — FRONTEND DEMO

  Browser storage:
  - Cart, wishlist, demo profile, addresses, and demo orders.

  Not production authentication:
  - Demo OTP is always 123456.
  - No email or SMS is sent.
  - No real payment is processed.
  - Order tracking is simulated.
*/

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const STORAGE = {
  cart: "studioNila_cart",
  wishlist: "studioNila_wishlist",
  profile: "studioNila_demoProfile",
  addresses: "studioNila_addresses",
  orders: "studioNila_demoOrders"
};

const money = value =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    showToast("Browser storage is unavailable. Your changes may not persist.");
    return false;
  }
}

/* -------------------------------------------------------
   PRODUCT CATALOG
   16 women's products, 16 men's products, 3 unisex items.
------------------------------------------------------- */

const products = [
  {
    id: "linen-shirt",
    name: "The relaxed linen shirt",
    gender: "Women",
    category: "Clothing",
    color: "Natural ivory",
    price: 1290,
    oldPrice: 1590,
    badge: "A favourite",
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=700&q=80",
    description: "An easy, relaxed shirt for slow mornings, long afternoons and everything in between."
  },
  {
    id: "everyday-tote",
    name: "The everyday tote",
    gender: "Unisex",
    category: "Accessories",
    color: "Warm beige",
    price: 890,
    oldPrice: null,
    badge: "Everyday essential",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80",
    description: "A dependable everyday carry-all for the things that come with you."
  },
  {
    id: "classic-sneakers",
    name: "The classic low-top",
    gender: "Unisex",
    category: "Essentials",
    color: "Off white",
    price: 1790,
    oldPrice: 2190,
    badge: "Just right",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    description: "A clean everyday sneaker made to work with the rest of your wardrobe."
  },
  {
    id: "cotton-dress",
    name: "The Sunday dress",
    gender: "Women",
    category: "Clothing",
    color: "Soft neutral",
    price: 1890,
    oldPrice: 2290,
    badge: "New",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
    description: "An effortless dress with a soft silhouette for days that call for comfort."
  },
  {
    id: "wide-leg-trouser",
    name: "The easy wide-leg trouser",
    gender: "Women",
    category: "Clothing",
    color: "Sand",
    price: 1490,
    oldPrice: 1790,
    badge: "Easy favourite",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80",
    description: "A versatile wide-leg silhouette designed for easy movement and everyday styling."
  },
  {
    id: "ribbed-tank",
    name: "The everyday ribbed tank",
    gender: "Women",
    category: "Clothing",
    color: "Cream",
    price: 690,
    oldPrice: 890,
    badge: "Everyday essential",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=80",
    description: "A simple ribbed tank that layers beautifully or stands on its own."
  },
  {
    id: "knit-cardigan",
    name: "The soft knit cardigan",
    gender: "Women",
    category: "Clothing",
    color: "Oatmeal",
    price: 1690,
    oldPrice: 1990,
    badge: "Soft layers",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80",
    description: "A comfortable knit layer for cooler mornings and relaxed evenings."
  },
  {
    id: "pleated-skirt",
    name: "The pleated midi skirt",
    gender: "Women",
    category: "Clothing",
    color: "Charcoal",
    price: 1390,
    oldPrice: null,
    badge: "",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=700&q=80",
    description: "A flowing midi skirt with a timeless shape and an easy-to-style finish."
  },
  {
    id: "summer-blouse",
    name: "The summer cotton blouse",
    gender: "Women",
    category: "Clothing",
    color: "White",
    price: 1190,
    oldPrice: 1490,
    badge: "Lightweight",
    image: "https://images.unsplash.com/photo-1564257577-6a4f9b4e8e13?auto=format&fit=crop&w=700&q=80",
    description: "Light cotton and a relaxed cut make this blouse a warm-weather staple."
  },
  {
    id: "straight-jeans",
    name: "The everyday straight jeans",
    gender: "Women",
    category: "Clothing",
    color: "Classic blue",
    price: 1590,
    oldPrice: 1890,
    badge: "",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80",
    description: "Straight-leg denim that pairs effortlessly with your favourite basics."
  },
  {
    id: "linen-shorts",
    name: "The relaxed linen shorts",
    gender: "Women",
    category: "Clothing",
    color: "Natural beige",
    price: 990,
    oldPrice: null,
    badge: "Warm-weather pick",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=700&q=80",
    description: "Easy linen shorts made for sunny days and casual plans."
  },
  {
    id: "crossbody-bag",
    name: "The minimal crossbody",
    gender: "Women",
    category: "Accessories",
    color: "Tan",
    price: 1290,
    oldPrice: 1590,
    badge: "",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    description: "A compact everyday bag with room for the things you need most."
  },
  {
    id: "ballet-flats",
    name: "The everyday ballet flat",
    gender: "Women",
    category: "Essentials",
    color: "Black",
    price: 1190,
    oldPrice: null,
    badge: "",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80",
    description: "A simple, versatile flat that brings comfort to everyday outfits."
  },
  {
    id: "cotton-maxi",
    name: "The relaxed cotton maxi",
    gender: "Women",
    category: "Clothing",
    color: "Olive",
    price: 1790,
    oldPrice: 2090,
    badge: "New season",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80",
    description: "An easy maxi dress with a relaxed shape for day-to-evening wear."
  },
  {
    id: "lightweight-scarf",
    name: "The lightweight scarf",
    gender: "Women",
    category: "Accessories",
    color: "Muted rose",
    price: 590,
    oldPrice: null,
    badge: "",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=700&q=80",
    description: "A lightweight finishing touch in a soft, versatile colour."
  },
  {
    id: "relaxed-blazer",
    name: "The relaxed everyday blazer",
    gender: "Women",
    category: "Clothing",
    color: "Stone",
    price: 2190,
    oldPrice: 2590,
    badge: "Modern classic",
    image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=700&q=80",
    description: "A relaxed blazer that adds a polished layer without feeling too formal."
  },

  /* MEN'S COLLECTION */

  {
    id: "mens-linen-shirt",
    name: "The men's linen shirt",
    gender: "Men",
    category: "Clothing",
    color: "Natural white",
    price: 1390,
    oldPrice: 1690,
    badge: "Best seller",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=700&q=80",
    description: "A breathable linen shirt with a relaxed fit for everyday wear."
  },
  {
    id: "mens-oxford-shirt",
    name: "The everyday Oxford shirt",
    gender: "Men",
    category: "Clothing",
    color: "Pale blue",
    price: 1290,
    oldPrice: 1590,
    badge: "",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80",
    description: "A dependable button-down shirt for workdays and weekends."
  },
  {
    id: "mens-basic-tee",
    name: "The essential cotton tee",
    gender: "Men",
    category: "Clothing",
    color: "White",
    price: 590,
    oldPrice: 790,
    badge: "Everyday essential",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
    description: "A classic cotton tee that works with almost anything."
  },
  {
    id: "mens-polo",
    name: "The clean-cut polo",
    gender: "Men",
    category: "Clothing",
    color: "Navy",
    price: 890,
    oldPrice: 1090,
    badge: "",
    image: "https://images.unsplash.com/photo-1625910513413-5fc45a6c8f3b?auto=format&fit=crop&w=700&q=80",
    description: "A versatile polo with a clean shape for casual days."
  },
  {
    id: "mens-chinos",
    name: "The tapered chino",
    gender: "Men",
    category: "Clothing",
    color: "Khaki",
    price: 1490,
    oldPrice: 1790,
    badge: "Easy styling",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80",
    description: "A smart-casual chino with a comfortable tapered fit."
  },
  {
    id: "mens-denim",
    name: "The classic straight denim",
    gender: "Men",
    category: "Clothing",
    color: "Indigo",
    price: 1690,
    oldPrice: 1990,
    badge: "",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
    description: "Classic denim designed to be a reliable part of your everyday wardrobe."
  },
  {
    id: "mens-overshirt",
    name: "The relaxed overshirt",
    gender: "Men",
    category: "Clothing",
    color: "Olive",
    price: 1790,
    oldPrice: 2190,
    badge: "Layering favourite",
    image: "https://images.unsplash.com/photo-1618354691229-88d47f285158?auto=format&fit=crop&w=700&q=80",
    description: "An easy layering piece for changing weather and casual outfits."
  },
  {
    id: "mens-knitwear",
    name: "The soft crewneck knit",
    gender: "Men",
    category: "Clothing",
    color: "Beige",
    price: 1590,
    oldPrice: null,
    badge: "",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=80",
    description: "A soft knit layer that feels just as good on a quiet weekend."
  },
  {
    id: "mens-hoodie",
    name: "The everyday hoodie",
    gender: "Men",
    category: "Clothing",
    color: "Heather grey",
    price: 1390,
    oldPrice: 1690,
    badge: "",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80",
    description: "A comfortable hoodie for travel, weekends and relaxed evenings."
  },
  {
    id: "mens-shorts",
    name: "The relaxed cotton shorts",
    gender: "Men",
    category: "Clothing",
    color: "Sand",
    price: 890,
    oldPrice: null,
    badge: "Weekend wear",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=700&q=80",
    description: "Casual cotton shorts made for warm weather and laid-back plans."
  },
  {
    id: "mens-jacket",
    name: "The lightweight jacket",
    gender: "Men",
    category: "Clothing",
    color: "Charcoal",
    price: 2290,
    oldPrice: 2690,
    badge: "New season",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80",
    description: "A versatile outer layer that brings a little structure to casual outfits."
  },
  {
    id: "mens-sneakers",
    name: "The everyday sneaker",
    gender: "Men",
    category: "Essentials",
    color: "White",
    price: 1890,
    oldPrice: 2290,
    badge: "",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    description: "A clean sneaker designed to work with your daily rotation."
  },
  {
    id: "mens-loafers",
    name: "The casual loafer",
    gender: "Men",
    category: "Essentials",
    color: "Brown",
    price: 1790,
    oldPrice: null,
    badge: "",
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=700&q=80",
    description: "A smart-casual shoe for dinners, work and weekend plans."
  },
  {
    id: "mens-backpack",
    name: "The daily backpack",
    gender: "Men",
    category: "Accessories",
    color: "Black",
    price: 1290,
    oldPrice: 1590,
    badge: "",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
    description: "A practical backpack for commuting and carrying your daily essentials."
  },
  {
    id: "mens-belt",
    name: "The everyday leather belt",
    gender: "Men",
    category: "Accessories",
    color: "Dark brown",
    price: 690,
    oldPrice: null,
    badge: "",
    image: "https://images.unsplash.com/photo-1624222247344-550fb8d7b9f7?auto=format&fit=crop&w=700&q=80",
    description: "A simple belt that complements both casual and smart-casual outfits."
  },
  {
    id: "mens-pullover",
    name: "The classic pullover",
    gender: "Men",
    category: "Clothing",
    color: "Forest green",
    price: 1490,
    oldPrice: 1790,
    badge: "",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=80",
    description: "An easy pullover for cool mornings and comfortable layering."
  },

  /* UNISEX COLLECTION */

  {
    id: "canvas-tote",
    name: "The canvas carry-all",
    gender: "Unisex",
    category: "Accessories",
    color: "Natural canvas",
    price: 790,
    oldPrice: null,
    badge: "Reusable favourite",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80",
    description: "A reusable canvas bag for errands, books and everyday essentials."
  },
  {
    id: "everyday-cap",
    name: "The everyday cap",
    gender: "Unisex",
    category: "Accessories",
    color: "Stone",
    price: 490,
    oldPrice: null,
    badge: "",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=80",
    description: "A simple finishing touch for relaxed everyday outfits."
  },
  {
    id: "minimal-socks",
    name: "The everyday sock set",
    gender: "Unisex",
    category: "Essentials",
    color: "Neutral mix",
    price: 390,
    oldPrice: null,
    badge: "Small essential",
    image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=700&q=80",
    description: "Comfortable everyday socks in easy-to-pair neutral tones."
  }
];

/* -------------------------------------------------------
   APP STATE
------------------------------------------------------- */

let cart = readStorage(STORAGE.cart, []);
let wishlist = readStorage(STORAGE.wishlist, []);
let profile = readStorage(STORAGE.profile, null);
let addresses = readStorage(STORAGE.addresses, []);
let orders = readStorage(STORAGE.orders, []);

let activeGender = "All";
let activeCategory = "All";
let searchTerm = "";
let activeProduct = null;
let selectedSize = "";
let selectedColor = "";
let currentModal = "";
let checkoutStep = 1;
let checkoutAddressId = "";
let checkoutPayment = "Cash on Delivery";

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

function getProduct(productId) {
  return products.find(product => product.id === productId);
}

function getProductSize(product) {
  return product.gender === "Unisex"
    ? ["One Size"]
    : DEFAULT_SIZES;
}

function getProductColors(product) {
  const colors = [product.color];

  if (product.gender === "Women") {
    colors.push("Black", "Ivory");
  } else if (product.gender === "Men") {
    colors.push("Navy", "White");
  }

  return [...new Set(colors)];
}

function getCartCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartSubtotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function persistCart() {
  saveStorage(STORAGE.cart, cart);
}

function persistWishlist() {
  saveStorage(STORAGE.wishlist, wishlist);
}

/* -------------------------------------------------------
   TOAST NOTIFICATIONS
------------------------------------------------------- */

let toastTimeout;

function showToast(message) {
  const toast = $("#toast");

  if (!toast) {
    console.log(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

/* -------------------------------------------------------
   IMAGE FALLBACK
   Prevents broken images from leaving empty image areas.
------------------------------------------------------- */

const fallbackImage =
  "https://placehold.co/700x900/f1eee7/292923?text=Studio+Nila";

document.addEventListener("error", event => {
  const image = event.target;

  if (!(image instanceof HTMLImageElement)) return;
  if (!image.closest(".product-card, .product-detail")) return;
  if (image.dataset.fallbackTried === "true") return;

  image.dataset.fallbackTried = "true";
  image.src = fallbackImage;
}, true);

/* -------------------------------------------------------
   PRODUCT RENDERING
------------------------------------------------------- */

function getFilteredProducts() {
  let result = [...products];

  if (activeGender !== "All") {
    result = result.filter(product => product.gender === activeGender);
  }

  if (activeCategory !== "All") {
    result = result.filter(product => product.category === activeCategory);
  }

  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();

    result = result.filter(product =>
      [
        product.name,
        product.category,
        product.gender,
        product.color,
        product.description
      ].join(" ").toLowerCase().includes(term)
    );
  }

  const sortValue = $("#sortSelect")?.value || "featured";

  if (sortValue === "price-low") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-high") {
    result.sort((a, b) => b.price - a.price);
  } else if (sortValue === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}

function renderProducts() {
  const grid = $("#productGrid");
  const template = $("#productTemplate");

  if (!grid) return;

  const filteredProducts = getFilteredProducts();
  grid.innerHTML = "";

  if (!filteredProducts.length) {
    const emptyState = $("#emptyState");
    if (emptyState) emptyState.hidden = false;

    const resultsLabel = $("#resultsLabel");
    if (resultsLabel) resultsLabel.textContent = "No products found";

    return;
  }

  const emptyState = $("#emptyState");
  if (emptyState) emptyState.hidden = true;

  const resultsLabel = $("#resultsLabel");
  if (resultsLabel) {
    resultsLabel.textContent =
      `${filteredProducts.length} ${filteredProducts.length === 1 ? "item" : "items"}`;
  }

  filteredProducts.forEach(product => {
    let card;

    if (template?.content?.firstElementChild) {
      card = template.content.firstElementChild.cloneNode(true);
    } else {
      card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-image">
          <img class="product-photo" alt="">
          <span class="product-badge"></span>
          <button class="wishlist-button" type="button" aria-label="Add to wishlist">♡</button>
        </div>
        <div class="product-info">
          <p class="product-category"></p>
          <p class="product-color"></p>
          <h3 class="product-name"></h3>
          <div class="product-pricing">
            <span class="product-price"></span>
            <span class="product-old-price"></span>
          </div>
          <button class="quick-add" type="button">Quick add</button>
        </div>
      `;
    }

    card.dataset.productId = product.id;

    const image = $(".product-image img, img", card);

    if (image) {
      image.src = product.image;
      image.alt = product.name;
      image.loading = "lazy";
      image.dataset.fallbackTried = "false";
    }

    const badge = $(".product-badge", card);

    if (badge) {
      badge.textContent = product.badge || "";
      badge.hidden = !product.badge;
    }

    const category = $(".product-category", card);

    if (category) {
      category.textContent = `${product.gender} · ${product.category}`;
    }

    const color = $(".product-color", card);

    if (color) {
      color.textContent = product.color;
    }

    const name = $(".product-name", card);

    if (name) {
      name.textContent = product.name;
    }

    const price = $(".product-price", card);

    if (price) {
      price.textContent = money(product.price);
    }

    const oldPrice = $(".product-old-price", card);

    if (oldPrice) {
      oldPrice.textContent = product.oldPrice ? money(product.oldPrice) : "";
      oldPrice.hidden = !product.oldPrice;
    }

    const wishlistButton = $(".wishlist-button", card);

    if (wishlistButton) {
      const isSaved = wishlist.includes(product.id);
      wishlistButton.textContent = isSaved ? "♥" : "♡";
      wishlistButton.classList.toggle("is-active", isSaved);
      wishlistButton.setAttribute(
        "aria-label",
        isSaved ? "Remove from wishlist" : "Add to wishlist"
      );

      wishlistButton.addEventListener("click", event => {
        event.stopPropagation();
        toggleWishlist(product.id);
      });
    }

    const quickAdd = $(".quick-add", card);

    if (quickAdd) {
      quickAdd.addEventListener("click", event => {
        event.stopPropagation();
        openProductModal(product.id);
      });
    }

    card.addEventListener("click", event => {
      if (event.target.closest("button")) return;
      openProductModal(product.id);
    });

    grid.appendChild(card);
  });
}

/* -------------------------------------------------------
   GENDER AND CATEGORY FILTERS
------------------------------------------------------- */

function setGender(gender) {
  activeGender = gender;

  $$("[data-gender]").forEach(button => {
    const selected = button.dataset.gender === gender;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  renderProducts();
}

function setCategory(category) {
  activeCategory = category;

  $$("[data-category]").forEach(button => {
    const selected = button.dataset.category === category;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  renderProducts();
}

function resetFilters() {
  activeGender = "All";
  activeCategory = "All";
  searchTerm = "";

  const searchInput = $("#searchInput");
  if (searchInput) searchInput.value = "";

  setGender("All");
  setCategory("All");
  renderProducts();
}

/* -------------------------------------------------------
   WISHLIST
------------------------------------------------------- */

function toggleWishlist(productId) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
    showToast("Removed from your wishlist");
  } else {
    wishlist.push(productId);
    showToast("Added to your wishlist");
  }

  persistWishlist();
  renderProducts();
}

/* -------------------------------------------------------
   CART
------------------------------------------------------- */

function addToCart(productId, size = "One Size", color = "") {
  const product = getProduct(productId);

  if (!product) {
    showToast("This product could not be found");
    return;
  }

  const chosenColor = color || product.color;

  const existing = cart.find(item =>
    item.productId === productId &&
    item.size === size &&
    item.color === chosenColor
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId,
      size,
      color: chosenColor,
      quantity: 1
    });
  }

  persistCart();
  renderCart();
  showToast("Added to your bag");
}

function updateCartQuantity(productId, size, color, change) {
  const item = cart.find(cartItem =>
    cartItem.productId === productId &&
    cartItem.size === size &&
    cartItem.color === color
  );

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(cartItem => cartItem !== item);
  }

  persistCart();
  renderCart();
}

function removeFromCart(productId, size, color) {
  cart = cart.filter(item =>
    !(
      item.productId === productId &&
      item.size === size &&
      item.color === color
    )
  );

  persistCart();
  renderCart();
  showToast("Item removed from your bag");
}

function renderCart() {
  const count = getCartCount();
  const subtotal = getCartSubtotal();

  const cartCount = $("#cartCount");
  const drawerCount = $("#drawerCount");
  const cartSubtotal = $("#cartSubtotal");
  const cartItems = $("#cartItems");
  const cartTitle = $("#cartTitle");

  if (cartCount) cartCount.textContent = count;
  if (drawerCount) drawerCount.textContent = count;
  if (cartSubtotal) cartSubtotal.textContent = money(subtotal);
  if (cartTitle) cartTitle.textContent = `Your bag (${count})`;

  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <p>Your bag is taking a little break.</p>
        <p>Add something you love to get started.</p>
      </div>
    `;
    return;
  }

  cart.forEach(item => {
    const product = getProduct(item.productId);
    if (!product) return;

    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <img class="cart-item-image" src="${product.image}" alt="">
      <div class="cart-item-info">
        <h4></h4>
        <p class="cart-item-variant"></p>
        <p class="cart-item-price"></p>
        <div class="cart-quantity">
          <button type="button" class="quantity-minus" aria-label="Decrease quantity">−</button>
          <span class="quantity-value"></span>
          <button type="button" class="quantity-plus" aria-label="Increase quantity">+</button>
        </div>
        <button type="button" class="remove-cart-item">Remove</button>
      </div>
    `;

    const image = $("img", row);
    image.alt = product.name;

    image.addEventListener("error", () => {
      if (image.dataset.fallbackTried === "true") return;
      image.dataset.fallbackTried = "true";
      image.src = fallbackImage;
    });

    $("h4", row).textContent = product.name;
    $(".cart-item-variant", row).textContent =
      `${item.color || product.color} · Size ${item.size}`;
    $(".cart-item-price", row).textContent = money(product.price);
    $(".quantity-value", row).textContent = item.quantity;

    $(".quantity-minus", row).addEventListener("click", () => {
      updateCartQuantity(
        item.productId,
        item.size,
        item.color,
        -1
      );
    });

    $(".quantity-plus", row).addEventListener("click", () => {
      updateCartQuantity(
        item.productId,
        item.size,
        item.color,
        1
      );
    });

    $(".remove-cart-item", row).addEventListener("click", () => {
      removeFromCart(
        item.productId,
        item.size,
        item.color
      );
    });

    cartItems.appendChild(row);
  });
}

/* -------------------------------------------------------
   CART DRAWER
------------------------------------------------------- */

function openCart() {
  const drawer = $("#cartDrawer");
  const overlay = $("#cartOverlay");

  if (drawer) {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
  }

  if (overlay) overlay.classList.add("visible");

  document.body.classList.add("no-scroll");
  renderCart();
}

function closeCart() {
  const drawer = $("#cartDrawer");
  const overlay = $("#cartOverlay");

  if (drawer) {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  }

  if (overlay) overlay.classList.remove("visible");

  document.body.classList.remove("no-scroll");
}

/* -------------------------------------------------------
   MODAL HELPERS
------------------------------------------------------- */

function openModal(html) {
  const backdrop = $("#modalBackdrop");
  const content = $("#modalContent");

  if (!backdrop || !content) {
    showToast("This section is unavailable in the current page layout.");
    return;
  }

  content.innerHTML = html;
  backdrop.hidden = false;
  backdrop.classList.add("visible");
  document.body.classList.add("no-scroll");

  const mainModal = $("#mainModal");
  if (mainModal) mainModal.scrollTop = 0;
}

function closeModal() {
  const backdrop = $("#modalBackdrop");

  if (backdrop) {
    backdrop.hidden = true;
    backdrop.classList.remove("visible");
  }

  document.body.classList.remove("no-scroll");
  currentModal = "";
}

/* -------------------------------------------------------
   PRODUCT DETAIL MODAL
------------------------------------------------------- */

function openProductModal(productId) {
  const product = getProduct(productId);
  if (!product) return;

  activeProduct = product;
  selectedSize = getProductSize(product)[0];
  selectedColor = product.color;
  currentModal = "product";

  const sizes = getProductSize(product);
  const colors = getProductColors(product);

  openModal(`
    <div class="product-detail">
      <button class="modal-close" type="button" data-close-modal aria-label="Close">×</button>
      <div class="product-detail-grid">
        <div class="product-detail-image-wrap">
          <img class="product-detail-image" src="${product.image}" alt="">
        </div>
        <div class="product-detail-info">
          <p class="eyebrow">${product.gender} · ${product.category}</p>
          <h2 class="product-detail-title"></h2>
          <p class="product-detail-price"></p>
          <p class="product-detail-description"></p>

          <div class="variant-group">
            <label for="detailColor">Colour</label>
            <select id="detailColor">
              ${colors.map(color => `<option value="${color}">${color}</option>`).join("")}
            </select>
          </div>

          <div class="variant-group">
            <label for="detailSize">Size</label>
            <select id="detailSize">
              ${sizes.map(size => `<option value="${size}">${size}</option>`).join("")}
            </select>
          </div>

          <button class="button button-primary detail-add-to-cart" type="button">
            Add to bag — ${money(product.price)}
          </button>
          <p class="detail-note">Easy everyday style. Thoughtfully selected for your wardrobe.</p>
        </div>
      </div>
    </div>
  `);

  const detailImage = $(".product-detail-image");
  if (detailImage) {
    detailImage.alt = product.name;
    detailImage.addEventListener("error", () => {
      if (detailImage.dataset.fallbackTried === "true") return;
      detailImage.dataset.fallbackTried = "true";
      detailImage.src = fallbackImage;
    });
  }

  const title = $(".product-detail-title");
  if (title) title.textContent = product.name;

  const price = $(".product-detail-price");
  if (price) {
    price.textContent = product.oldPrice
      ? `${money(product.price)}  ${money(product.oldPrice)}`
      : money(product.price);
  }

  const description = $(".product-detail-description");
  if (description) description.textContent = product.description;

  $("#detailColor")?.addEventListener("change", event => {
    selectedColor = event.target.value;
  });

  $("#detailSize")?.addEventListener("change", event => {
    selectedSize = event.target.value;
  });

  $(".detail-add-to-cart")?.addEventListener("click", () => {
    addToCart(product.id, selectedSize, selectedColor);
    closeModal();
    openCart();
  });

  $$("[data-close-modal]").forEach(button => {
    button.addEventListener("click", closeModal);
  });
}

/* -------------------------------------------------------
   SEARCH
------------------------------------------------------- */

function openSearch() {
  const panel = $("#searchPanel");
  if (panel) {
    panel.hidden = false;
    panel.classList.add("visible");
  }

  $("#searchInput")?.focus();
}

function closeSearch() {
  const panel = $("#searchPanel");
  if (panel) {
    panel.hidden = true;
    panel.classList.remove("visible");
  }
}

function handleSearch(value) {
  searchTerm = value;
  renderProducts();
}

/* -------------------------------------------------------
   ACCOUNT AND DEMO LOGIN
------------------------------------------------------- */

function saveProfile(nextProfile) {
  profile = nextProfile;
  saveStorage(STORAGE.profile, profile);
}

function openAccountModal() {
  currentModal = "account";

  if (profile) {
    openModal(`
      <div class="account-panel">
        <button class="modal-close" type="button" data-close-modal aria-label="Close">×</button>
        <p class="eyebrow">Your account</p>
        <h2>Welcome back</h2>
        <p class="account-email"></p>
        <div class="account-actions">
          <button type="button" class="button button-secondary" id="viewAddresses">My addresses</button>
          <button type="button" class="button button-secondary" id="viewOrders">My orders</button>
          <button type="button" class="button button-secondary" id="logoutButton">Log out</button>
        </div>
      </div>
    `);

    const email = $(".account-email");
    if (email) email.textContent = profile.email || profile.phone || "";

    $("#viewAddresses")?.addEventListener("click", openAddressesModal);
    $("#viewOrders")?.addEventListener("click", openOrdersModal);

    $("#logoutButton")?.addEventListener("click", () => {
      profile = null;
      saveStorage(STORAGE.profile, null);
      closeModal();
      showToast("You have been logged out");
    });

    $$("[data-close-modal]").forEach(button => {
      button.addEventListener("click", closeModal);
    });

    return;
  }

  openModal(`
    <div class="account-panel">
      <button class="modal-close" type="button" data-close-modal aria-label="Close">×</button>
      <p class="eyebrow">Studio Nila account</p>
      <h2>Welcome to your space</h2>
      <p>Sign in with your email address to continue.</p>

      <form id="loginForm" class="account-form">
        <label for="loginName">Your name</label>
        <input id="loginName" name="name" type="text" placeholder="Your name" required>

        <label for="loginEmail">Email address</label>
        <input id="loginEmail" name="email" type="email" placeholder="you@example.com" required>

        <button class="button button-primary" type="submit">Continue</button>
      </form>

      <p class="detail-note">Demo mode: no real email or OTP is sent.</p>
    </div>
  `);

  $("#loginForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const name = $("#loginName")?.value.trim();
    const email = $("#loginEmail")?.value.trim();

    if (!name || !email) {
      showToast("Please complete all fields");
      return;
    }

    saveProfile({
      name,
      email,
      createdAt: new Date().toISOString()
    });

    closeModal();
    showToast(`Welcome to Studio Nila, ${name}`);
  });

  $$("[data-close-modal]").forEach(button => {
    button.addEventListener("click", closeModal);
  });
}

/* -------------------------------------------------------
   ADDRESS BOOK
------------------------------------------------------- */

function openAddressesModal() {
  currentModal = "addresses";

  const addressMarkup = addresses.length
    ? addresses.map(address => `
      <div class="address-card">
        <strong class="address-name"></strong>
        <p class="address-details"></p>
        <button type="button" class="remove-address" data-address-id="${address.id}">Remove</button>
      </div>
    `).join("")
    : `<p>You haven't saved an address yet.</p>`;

  openModal(`
    <div class="addresses-panel">
      <button class="modal-close" type="button" data-close-modal aria-label="Close">×</button>
      <p class="eyebrow">Your account</p>
      <h2>Saved addresses</h2>
      <div class="address-list">${addressMarkup}</div>

      <form id="addressForm" class="account-form">
        <h3>Add a new address</h3>
        <label for="addressName">Name</label>
        <input id="addressName" name="name" required>

        <label for="addressPhone">Phone</label>
        <input id="addressPhone" name="phone" type="tel" required>

        <label for="addressLine">Address</label>
        <textarea id="addressLine" name="line" rows="3" required></textarea>

        <label for="addressCity">City</label>
        <input id="addressCity" name="city" required>

        <label for="addressPincode">PIN code</label>
        <input id="addressPincode" name="pincode" inputmode="numeric" required>

        <button class="button button-primary" type="submit">Save address</button>
      </form>
    </div>
  `);

  $$(".address-card").forEach((card, index) => {
    const address = addresses[index];

    const name = $(".address-name", card);
    const details = $(".address-details", card);

    if (name) name.textContent = address.name;
    if (details) {
      details.textContent =
        `${address.line}, ${address.city} - ${address.pincode} · ${address.phone}`;
    }
  });

  $$(".remove-address").forEach(button => {
    button.addEventListener("click", () => {
      addresses = addresses.filter(
        address => address.id !== button.dataset.addressId
      );

      saveStorage(STORAGE.addresses, addresses);
      openAddressesModal();
      showToast("Address removed");
    });
  });

  $("#addressForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const newAddress = {
      id: `address-${Date.now()}`,
      name: $("#addressName").value.trim(),
      phone: $("#addressPhone").value.trim(),
      line: $("#addressLine").value.trim(),
      city: $("#addressCity").value.trim(),
      pincode: $("#addressPincode").value.trim()
    };

    addresses.push(newAddress);
    saveStorage(STORAGE.addresses, addresses);

    openAddressesModal();
    showToast("Address saved");
  });

  $$("[data-close-modal]").forEach(button => {
    button.addEventListener("click", closeModal);
  });
}

/* -------------------------------------------------------
   ORDER HISTORY
------------------------------------------------------- */

function openOrdersModal() {
  currentModal = "orders";

  const orderMarkup = orders.length
    ? orders.slice().reverse().map(order => `
      <div class="order-card">
        <div class="order-heading">
          <strong class="order-number"></strong>
          <span class="order-status"></span>
        </div>
        <p class="order-date"></p>
        <p class="order-total"></p>
        <div class="order-items"></div>
      </div>
    `).join("")
    : `<p>You haven't placed any demo orders yet.</p>`;

  openModal(`
    <div class="orders-panel">
      <button class="modal-close" type="button" data-close-modal aria-label="Close">×</button>
      <p class="eyebrow">Your account</p>
      <h2>Your orders</h2>
      <div class="orders-list">${orderMarkup}</div>
    </div>
  `);

  $$(".order-card").forEach((card, index) => {
    const order = orders.slice().reverse()[index];

    $(".order-number", card).textContent = order.id;
    $(".order-status", card).textContent = order.status || "Confirmed";
    $(".order-date", card).textContent =
      new Date(order.createdAt).toLocaleDateString("en-IN");
    $(".order-total", card).textContent = `Total: ${money(order.total)}`;

    const items = $(".order-items", card);

    if (items) {
      items.textContent = order.items.map(item => {
        const product = getProduct(item.productId);
        return product
          ? `${product.name} × ${item.quantity} · ${item.size} · ${item.color}`
          : "";
      }).filter(Boolean).join(" | ");
    }
  });

  $$("[data-close-modal]").forEach(button => {
    button.addEventListener("click", closeModal);
  });
}

/* -------------------------------------------------------
   CHECKOUT
------------------------------------------------------- */

function openCheckout() {
  if (!cart.length) {
    showToast("Your bag is empty");
    return;
  }

  if (!profile) {
    showToast("Please sign in before checkout");
    closeCart();
    openAccountModal();
    return;
  }

  checkoutStep = 1;
  checkoutAddressId = addresses[0]?.id || "";
  checkoutPayment = "Cash on Delivery";

  closeCart();
  renderCheckout();
}

function renderCheckout() {
  currentModal = "checkout";

  if (checkoutStep === 1) {
    const addressMarkup = addresses.length
      ? addresses.map((address, index) => `
        <label class="checkout-address">
          <input type="radio" name="checkoutAddress" value="${address.id}" ${index === 0 ? "checked" : ""}>
          <span>
            <strong class="checkout-address-name"></strong>
            <span class="checkout-address-details"></span>
          </span>
        </label>
      `).join("")
      : `<p>Please add an address to continue.</p>`;

    openModal(`
      <div class="checkout-panel">
        <button class="modal-close" type="button" data-close-modal aria-label="Close">×</button>
        <p class="eyebrow">Checkout · Step 1 of 3</p>
        <h2>Where should we send it?</h2>
        <div class="checkout-address-list">${addressMarkup}</div>

        <button type="button" class="button button-secondary" id="checkoutAddAddress">
          Add an address
        </button>

        <div class="checkout-footer">
          <span>Subtotal: ${money(getCartSubtotal())}</span>
          <button type="button" class="button button-primary" id="checkoutContinue">
            Continue
          </button>
        </div>
      </div>
    `);

    $$(".checkout-address").forEach((label, index) => {
      const address = addresses[index];
      $(".checkout-address-name", label).textContent = address.name;
      $(".checkout-address-details", label).textContent =
        `${address.line}, ${address.city} - ${address.pincode}`;
    });

    $$('input[name="checkoutAddress"]').forEach(input => {
      input.addEventListener("change", () => {
        checkoutAddressId = input.value;
      });
    });

    $("#checkoutAddAddress")?.addEventListener("click", openAddressesModal);

    $("#checkoutContinue")?.addEventListener("click", () => {
      const selected = $('input[name="checkoutAddress"]:checked');

      if (selected) checkoutAddressId = selected.value;

      if (!checkoutAddressId || !addresses.some(address => address.id === checkoutAddressId)) {
        showToast("Please add and select a delivery address");
        return;
      }

      checkoutStep = 2;
      renderCheckout();
    });
  } else if (checkoutStep === 2) {
    openModal(`
      <div class="checkout-panel">
        <button class="modal-close" type="button" data-close-modal aria-label="Close">×</button>
        <p class="eyebrow">Checkout · Step 2 of 3</p>
        <h2>How would you like to pay?</h2>

        <div class="payment-options">
          <label>
            <input type="radio" name="checkoutPayment" value="Cash on Delivery" checked>
            <span>Cash on Delivery</span>
          </label>
          <label>
            <input type="radio" name="checkoutPayment" value="Demo Online Payment">
            <span>Demo online payment</span>
          </label>
        </div>

        <p class="detail-note">This is a frontend demo. No real payment will be processed.</p>

        <div class="checkout-footer">
          <button type="button" class="button button-secondary" id="checkoutBack">Back</button>
          <button type="button" class="button button-primary" id="checkoutReview">Review order</button>
        </div>
      </div>
    `);

    $$('input[name="checkoutPayment"]').forEach(input => {
      input.addEventListener("change", () => {
        checkoutPayment = input.value;
      });
    });

    $("#checkoutBack")?.addEventListener("click", () => {
      checkoutStep = 1;
      renderCheckout();
    });

    $("#checkoutReview")?.addEventListener("click", () => {
      const selected = $('input[name="checkoutPayment"]:checked');
      if (selected) checkoutPayment = selected.value;

      checkoutStep = 3;
      renderCheckout();
    });
  } else {
    const address = addresses.find(item => item.id === checkoutAddressId);
    const summary = cart.map(item => {
      const product = getProduct(item.productId);
      if (!product) return "";

      return `
        <div class="checkout-summary-item">
          <span>${product.name} × ${item.quantity}<br><small>${item.size} · ${item.color}</small></span>
          <strong>${money(product.price * item.quantity)}</strong>
        </div>
      `;
    }).join("");

    openModal(`
      <div class="checkout-panel">
        <button class="modal-close" type="button" data-close-modal aria-label="Close">×</button>
        <p class="eyebrow">Checkout · Step 3 of 3</p>
        <h2>Review your order</h2>

        <div class="checkout-summary">${summary}</div>

        <div class="checkout-summary-address">
          <h3>Delivery address</h3>
          <p>${address ? `${address.name}, ${address.line}, ${address.city} - ${address.pincode}` : "No address selected"}</p>
        </div>

        <div class="checkout-summary-address">
          <h3>Payment method</h3>
          <p>${checkoutPayment}</p>
        </div>

        <div class="checkout-total">
          <span>Total</span>
          <strong>${money(getCartSubtotal())}</strong>
        </div>

        <p class="detail-note">Demo checkout only. No real payment or shipment is created.</p>

        <div class="checkout-footer">
          <button type="button" class="button button-secondary" id="checkoutBack">Back</button>
          <button type="button" class="button button-primary" id="placeDemoOrder">Place demo order</button>
        </div>
      </div>
    `);

    $("#checkoutBack")?.addEventListener("click", () => {
      checkoutStep = 2;
      renderCheckout();
    });

    $("#placeDemoOrder")?.addEventListener("click", placeDemoOrder);
  }

  $$("[data-close-modal]").forEach(button => {
    button.addEventListener("click", closeModal);
  });
}

function placeDemoOrder() {
  if (!cart.length) {
    closeModal();
    showToast("Your bag is empty");
    return;
  }

  const order = {
    id: `SN-${Date.now().toString().slice(-8)}`,
    createdAt: new Date().toISOString(),
    status: "Confirmed · Demo",
    total: getCartSubtotal(),
    payment: checkoutPayment,
    addressId: checkoutAddressId,
    items: cart.map(item => ({ ...item }))
  };

  orders.push(order);
  saveStorage(STORAGE.orders, orders);

  cart = [];
  persistCart();
  renderCart();

  closeModal();

  openModal(`
    <div class="order-success">
      <button class="modal-close" type="button" data-close-modal aria-label="Close">×</button>
      <p class="eyebrow">Studio Nila</p>
      <h2>Your demo order is confirmed!</h2>
      <p class="success-order-number"></p>
      <p>This is a frontend demonstration. No real payment or delivery has been initiated.</p>
      <button type="button" class="button button-primary" id="continueShopping">Continue shopping</button>
    </div>
  `);

  const orderNumber = $(".success-order-number");
  if (orderNumber) orderNumber.textContent = `Order reference: ${order.id}`;

  $("#continueShopping")?.addEventListener("click", closeModal);

  $$("[data-close-modal]").forEach(button => {
    button.addEventListener("click", closeModal);
  });

  showToast("Demo order placed successfully");
}

/* -------------------------------------------------------
   NEWSLETTER DEMO
------------------------------------------------------- */

function handleNewsletterSubmit(event) {
  event.preventDefault();

  const email = $("#newsletterEmail")?.value.trim();
  const message = $("#newsletterMessage");

  if (!email) {
    if (message) message.textContent = "Please enter your email address.";
    return;
  }

  if (message) {
    message.textContent = "Thank you for joining the Studio Nila list!";
  }

  event.target.reset();
}

/* -------------------------------------------------------
   INITIALISE EVENT LISTENERS
------------------------------------------------------- */

function initialiseGenderFilters() {
  $$("[data-gender]").forEach(button => {
    button.addEventListener("click", () => {
      setGender(button.dataset.gender || "All");
    });
  });
}

function initialiseCategoryFilters() {
  $$("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
      setCategory(button.dataset.category || "All");
    });
  });
}

function initialiseSearch() {
  $("#searchToggle")?.addEventListener("click", openSearch);
  $("#closeSearch")?.addEventListener("click", closeSearch);

  $("#searchForm")?.addEventListener("submit", event => {
    event.preventDefault();
    handleSearch($("#searchInput")?.value || "");
    closeSearch();
  });

  $("#searchInput")?.addEventListener("input", event => {
    handleSearch(event.target.value);
  });
}

function initialiseCart() {
  $("#cartButton")?.addEventListener("click", openCart);
  $("#openCart")?.addEventListener("click", openCart);
  $("#cartOverlay")?.addEventListener("click", closeCart);
  $("#closeCart")?.addEventListener("click", closeCart);
  $("#checkoutButton")?.addEventListener("click", openCheckout);
}

function initialiseAccount() {
  $("#accountButton")?.addEventListener("click", openAccountModal);
}

function initialiseNewsletter() {
  $("#newsletterForm")?.addEventListener("submit", handleNewsletterSubmit);
}

function initialiseOtherControls() {
  $("#sortSelect")?.addEventListener("change", renderProducts);

  $("#resetFilters")?.addEventListener("click", resetFilters);

  $("#modalBackdrop")?.addEventListener("click", event => {
    if (event.target === $("#modalBackdrop")) {
      closeModal();
    }
  });

  $("#closeModal")?.addEventListener("click", closeModal);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal();
      closeCart();
      closeSearch();
    }
  });

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
}

/* -------------------------------------------------------
   APP STARTUP
------------------------------------------------------- */

function init() {
  initialiseGenderFilters();
  initialiseCategoryFilters();
  initialiseSearch();
  initialiseCart();
  initialiseAccount();
  initialiseNewsletter();
  initialiseOtherControls();

  renderProducts();
  renderCart();

  console.log("Studio Nila is ready.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
