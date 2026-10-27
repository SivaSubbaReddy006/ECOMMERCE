
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
  - Never treat this demo as proof of identity.

  Later, replace the demo auth/payment functions with backend API calls.
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

const products = [
  {
    id: "linen-shirt",
    name: "The relaxed linen shirt",
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
    category: "Clothing",
    color: "Soft neutral",
    price: 1890,
    oldPrice: null,
    badge: "",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
    description: "An unfussy silhouette for days when comfort is part of the plan."
  },
  {
    id: "crossbody",
    name: "The little crossbody",
    category: "Accessories",
    color: "Earth brown",
    price: 1190,
    oldPrice: null,
    badge: "",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    description: "A compact everyday bag that keeps the essentials close."
  },
  {
    id: "cotton-tee",
    name: "The good cotton tee",
    category: "Clothing",
    color: "Classic white",
    price: 590,
    oldPrice: null,
    badge: "Under ₹600",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
    description: "The kind of tee you buy once, wear often and reach for without thinking."
  },
  {
    id: "sunglasses",
    name: "The weekend frames",
    category: "Accessories",
    color: "Tortoiseshell",
    price: 690,
    oldPrice: 850,
    badge: "",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80",
    description: "An understated finishing touch for sunny commutes and weekend plans."
  },
  {
    id: "knit-top",
    name: "The soft knit top",
    category: "Clothing",
    color: "Sand",
    price: 1090,
    oldPrice: null,
    badge: "Easy layer",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=700&q=80",
    description: "A simple layer that fits neatly into a well-loved everyday wardrobe."
  }
];

let cart = readStorage(STORAGE.cart, []);
let wishlist = readStorage(STORAGE.wishlist, []);
let profile = readStorage(STORAGE.profile, null);
let addresses = readStorage(STORAGE.addresses, []);
let orders = readStorage(STORAGE.orders, []);

let activeCategory = "All";
let searchTerm = "";
let toastTimeout;
let authChannel = "email";
let authDestination = "";
let authPurpose = "login";
let checkoutAddress = null;
let checkoutStep = 1;
let checkoutPayment = "cod";
let checkoutDraft = null;
let currentAccountTab = "profile";

const grid = $("#productGrid");
const template = $("#productTemplate");
const modalBackdrop = $("#modalBackdrop");
const modalContent = $("#modalContent");
const cartDrawer = $("#cartDrawer");
const cartOverlay = $("#cartOverlay");

function persistCart() {
  saveStorage(STORAGE.cart, cart);
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
}

function getProduct(id) {
  return products.find(product => product.id === id);
}

function cartTotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function visibleProducts() {
  let result = [...products];

  if (activeCategory !== "All") {
    result = result.filter(product => product.category === activeCategory);
  }

  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    result = result.filter(product =>
      `${product.name} ${product.category} ${product.color} ${product.description}`
        .toLowerCase()
        .includes(term)
    );
  }

  const sort = $("#sortSelect").value;
  if (sort === "price-low") result.sort((a, b) => a.price - b.price);
  if (sort === "price-high") result.sort((a, b) => b.price - a.price);
  if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));

  return result;
}

function renderProducts() {
  grid.replaceChildren();
  const result = visibleProducts();

  $("#emptyState").hidden = result.length > 0;
  $("#resultsLabel").textContent =
    searchTerm || activeCategory !== "All"
      ? `${result.length} ${result.length === 1 ? "piece" : "pieces"} found`
      : "Our current favourites";

  result.forEach(product => {
    const fragment = template.content.cloneNode(true);
    const card = $(".product-card", fragment);
    const image = $(".product-image", fragment);
    const badge = $(".product-badge", fragment);
    const wishButton = $(".wishlist-button", fragment);

    card.dataset.productId = product.id;
    image.src = product.image;
    image.alt = product.name;
    image.onerror = () => {
      image.style.opacity = ".35";
      image.alt = `${product.name} — product image unavailable`;
    };

    badge.textContent = product.badge;
    badge.hidden = !product.badge;

    $(".product-category", fragment).textContent = product.category;
    $(".product-color", fragment).textContent = product.color;
    $(".product-name", fragment).textContent = product.name;

    $(".product-price", fragment).innerHTML = "";
    const currentPrice = document.createElement("span");
    currentPrice.textContent = money(product.price);
    $(".product-price", fragment).append(currentPrice);

    if (product.oldPrice) {
      const oldPrice = document.createElement("span");
      oldPrice.className = "old-price";
      oldPrice.textContent = money(product.oldPrice);
      $(".product-price", fragment).append(oldPrice);
    }

    const saved = wishlist.includes(product.id);
    wishButton.classList.toggle("is-saved", saved);
    wishButton.textContent = saved ? "♥" : "♡";
    wishButton.setAttribute(
      "aria-label",
      saved ? "Remove from wishlist" : "Add to wishlist"
    );

    $(".quick-add", fragment).addEventListener("click", () => addToCart(product.id));
    wishButton.addEventListener("click", () => toggleWishlist(product.id));

    image.addEventListener("click", () => openProductDetails(product.id));
    image.style.cursor = "pointer";

    grid.append(fragment);
  });
}

function setCategory(category) {
  activeCategory = category;
  $$(".category-tile").forEach(button => {
    button.classList.toggle("active", button.dataset.category === category);
  });
  renderProducts();
}

function addToCart(id) {
  const product = getProduct(id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + 1, 10);
  } else {
    cart.push({ id, quantity: 1 });
  }

  persistCart();
  renderCart();
  showToast(`${product.name} added to your bag.`);
}

function changeQuantity(id, amount) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity <= 0) {
    cart = cart.filter(entry => entry.id !== id);
  } else {
    item.quantity = Math.min(item.quantity, 10);
  }

  persistCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  persistCart();
  renderCart();
}

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id);
    showToast("Removed from your wishlist.");
  } else {
    wishlist.push(id);
    showToast("Added to your wishlist.");
  }

  saveStorage(STORAGE.wishlist, wishlist);
  renderProducts();
}

function renderCart() {
  const container = $("#cartItems");
  container.replaceChildren();

  const validCart = cart.filter(item => getProduct(item.id));
  if (validCart.length !== cart.length) {
    cart = validCart;
    persistCart();
  }

  if (!cart.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = "<h3>Your bag is taking a break.</h3><p>Find something you'll reach for every day.</p>";
    container.append(empty);
  } else {
    cart.forEach(item => {
      const product = getProduct(item.id);
      const line = document.createElement("div");
      line.className = "cart-line";

      const image = document.createElement("img");
      image.src = product.image;
      image.alt = product.name;

      const info = document.createElement("div");
      info.className = "cart-line-info";

      const name = document.createElement("h3");
      name.textContent = product.name;

      const color = document.createElement("p");
      color.className = "muted";
      color.textContent = product.color;

      const price = document.createElement("div");
      price.className = "cart-line-price";
      price.textContent = money(product.price * item.quantity);

      const quantity = document.createElement("div");
      quantity.className = "quantity-control";

      const minus = document.createElement("button");
      minus.textContent = "−";
      minus.setAttribute("aria-label", "Decrease quantity");
      minus.addEventListener("click", () => changeQuantity(item.id, -1));

      const count = document.createElement("span");
      count.textContent = item.quantity;

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.setAttribute("aria-label", "Increase quantity");
      plus.disabled = item.quantity >= 10;
      plus.addEventListener("click", () => changeQuantity(item.id, 1));

      quantity.append(minus, count, plus);

      const remove = document.createElement("button");
      remove.className = "remove-item";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => removeFromCart(item.id));

      info.append(name, color, price, quantity, remove);
      line.append(image, info);
      container.append(line);
    });
  }

  $("#cartSubtotal").textContent = money(cartTotal());
  $("#checkoutButton").disabled = cart.length === 0;
  updateCartCount();
}

function openCart() {
  renderCart();
  cartOverlay.hidden = false;
  cartDrawer.hidden = false;
  document.body.classList.add("no-scroll");
}

function closeCart() {
  cartOverlay.hidden = true;
  cartDrawer.hidden = true;
  if (modalBackdrop.hidden) document.body.classList.remove("no-scroll");
}

function openModal(html) {
  modalContent.innerHTML = html;
  modalBackdrop.hidden = false;
  document.body.classList.add("no-scroll");
  $("#mainModal").scrollTop = 0;
}

function closeModal() {
  modalBackdrop.hidden = true;
  if (cartDrawer.hidden) document.body.classList.remove("no-scroll");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2800);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function openProductDetails(id) {
  const product = getProduct(id);
  if (!product) return;

  openModal(`
    <p class="eyebrow">${escapeHTML(product.category)} · ${escapeHTML(product.color)}</p>
    <h2 id="modalTitle">${escapeHTML(product.name)}</h2>
    <p>${escapeHTML(product.description)}</p>
    <div class="account-card">
      <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}"
        style="width:100%;max-height:310px;object-fit:cover;background:#e9e6dc" />
      <p>${escapeHTML(product.color)}</p>
      <strong>${money(product.price)}</strong>
    </div>
    <div class="form-actions">
      <button class="button button-dark" id="detailAdd">Add to bag →</button>
      <button class="button button-outline" id="detailWishlist">♡ Wishlist</button>
    </div>
  `);

  $("#detailAdd").addEventListener("click", () => {
    addToCart(id);
    closeModal();
  });

  $("#detailWishlist").addEventListener("click", () => {
    toggleWishlist(id);
    closeModal();
  });
}

/* ---------------- DEMO OTP LOGIN ---------------- */

function showAuthStart(purpose = "login") {
  authPurpose = purpose;
  authChannel = "email";
  authDestination = "";

  openModal(`
    <p class="eyebrow">YOUR SPACE AT STUDIO NILA</p>
    <h2 id="modalTitle">${purpose === "register" ? "Create your space." : "Good to see you."}</h2>
    <p>Use your email or mobile number to continue. Real OTP delivery will be connected when the backend is ready.</p>
    <div class="auth-switch">
      <button type="button" class="active" data-auth-channel="email">Email address</button>
      <button type="button" data-auth-channel="phone">Mobile number</button>
    </div>
    <form id="authStartForm" class="form-stack">
      <div class="field">
        <label for="authDestination" id="authDestinationLabel">Email address</label>
        <input id="authDestination" name="destination" type="email" autocomplete="email"
          placeholder="you@example.com" required />
        <span class="field-error" id="authError"></span>
      </div>
      <button class="button button-dark full-width" type="submit">Continue with OTP →</button>
    </form>
    <div class="demo-note">
      <strong>Frontend demonstration:</strong> no email or SMS is sent. The demo accepts the code <strong>123456</strong>.
      This is not secure authentication. Do not enter real passwords or sensitive information.
    </div>
    <p>${purpose === "register" ? "Already have a demo profile?" : "New here?"}
      <button class="text-button" id="switchAuthPurpose">${purpose === "register" ? "Sign in" : "Create an account"}</button>
    </p>
  `);

  $$("[data-auth-channel]", modalContent).forEach(button => {
    button.addEventListener("click", () => {
      authChannel = button.dataset.authChannel;
      $$("[data-auth-channel]", modalContent).forEach(item =>
        item.classList.toggle("active", item === button)
      );

      const input = $("#authDestination");
      const label = $("#authDestinationLabel");

      if (authChannel === "email") {
        label.textContent = "Email address";
        input.type = "email";
        input.autocomplete = "email";
        input.placeholder = "you@example.com";
      } else {
        label.textContent = "Mobile number";
        input.type = "tel";
        input.autocomplete = "tel";
        input.placeholder = "+91 98765 43210";
      }
      input.value = "";
      $("#authError").textContent = "";
    });
  });

  $("#switchAuthPurpose").addEventListener("click", () => {
    showAuthStart(authPurpose === "register" ? "login" : "register");
  });

  $("#authStartForm").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("#authDestination");
    const value = input.value.trim();
    const error = $("#authError");

    if (authChannel === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error.textContent = "Enter a valid email address.";
      return;
    }

    if (authChannel === "phone" && value.replace(/\D/g, "").length < 10) {
      error.textContent = "Enter a valid phone number.";
      return;
    }

    authDestination = value;
    showOtpVerification();
  });
}

function showOtpVerification() {
  const destinationLabel = authChannel === "email" ? "email address" : "mobile number";

  openModal(`
    <p class="eyebrow">ONE MORE STEP</p>
    <h2 id="modalTitle">Enter your code.</h2>
    <p>In the real version, a one-time code will be sent to your ${destinationLabel}: <strong>${escapeHTML(authDestination)}</strong>.</p>
    <form id="otpForm" class="form-stack">
      <div class="field">
        <label for="otpCode">Six-digit demonstration code</label>
        <input id="otpCode" class="form-input" inputmode="numeric" autocomplete="one-time-code"
          maxlength="6" pattern="[0-9]{6}" placeholder="123456" required />
        <span class="field-error" id="otpError"></span>
      </div>
      <button class="button button-dark full-width" type="submit">Verify and continue →</button>
    </form>
    <div class="demo-note">
      Demo code: <strong>123456</strong>. No code was actually sent. Real OTP verification must be performed by the backend.
    </div>
    <div class="form-actions">
      <button class="button button-outline" id="changeDestination" type="button">Go back</button>
      <button class="button button-outline" id="resendDemo" type="button">Resend demo code</button>
    </div>
  `);

  $("#otpForm").addEventListener("submit", event => {
    event.preventDefault();
    const code = $("#otpCode").value.trim();

    if (code !== "123456") {
      $("#otpError").textContent = "Incorrect demo code. For this prototype, use 123456.";
      return;
    }

    // DEMO ONLY. This does not prove ownership of the email or phone.
    profile = {
      name: profile?.name || "",
      email: authChannel === "email" ? authDestination : (profile?.email || ""),
      phone: authChannel === "phone" ? authDestination : (profile?.phone || ""),
      demoAuthenticated: true
    };

    saveStorage(STORAGE.profile, profile);
    showToast("Demo sign-in complete. Real identity verification is not enabled.");
    renderAccount("profile");
  });

  $("#changeDestination").addEventListener("click", () => showAuthStart(authPurpose));
  $("#resendDemo").addEventListener("click", () => {
    showToast("Demo only: no email or SMS was sent.");
  });

  $("#otpCode").addEventListener("input", event => {
    event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6);
  });
}

/* ---------------- PROFILE AND ACCOUNT ---------------- */

function renderAccount(tab = currentAccountTab) {
  currentAccountTab = tab;

  if (!profile?.demoAuthenticated) {
    showAuthStart("login");
    return;
  }

  let body = "";

  if (tab === "profile") {
    body = `
      <form id="profileForm" class="form-stack">
        <div class="field"><label for="profileName">Your name</label>
          <input id="profileName" value="${escapeHTML(profile.name || "")}" maxlength="80" placeholder="Your name" /></div>
        <div class="field"><label>Email</label>
          <input value="${escapeHTML(profile.email || "")}" readonly />
          <span class="field-note">Demo field. A real account must verify email ownership.</span></div>
        <div class="field"><label>Mobile number</label>
          <input value="${escapeHTML(profile.phone || "")}" readonly />
          <span class="field-note">Demo field. A real account must verify phone ownership.</span></div>
        <button class="button button-dark full-width" type="submit">Save profile</button>
      </form>
    `;
  } else if (tab === "addresses") {
    body = `
      <h2 id="modalTitle">Saved addresses.</h2>
      <p>These addresses are stored in this browser for the prototype.</p>
      <div id="addressList">${renderAddressCards()}</div>
      <h3 style="font-family:var(--serif);font-weight:400;margin-top:26px">Add an address</h3>
      <form id="addressForm" class="form-stack">
        <div class="field"><label for="addressLabel">Address label</label><input id="addressLabel" required maxlength="40" placeholder="Home, College, Work" /></div>
        <div class="field"><label for="addressName">Recipient name</label><input id="addressName" required maxlength="80" /></div>
        <div class="field"><label for="addressPhone">Contact number</label><input id="addressPhone" required type="tel" maxlength="20" /></div>
        <div class="field"><label for="addressLine">Street / house address</label><textarea id="addressLine" required maxlength="250"></textarea></div>
        <div class="field"><label for="addressCity">City</label><input id="addressCity" required maxlength="80" /></div>
        <div class="field"><label for="addressState">State</label><input id="addressState" required maxlength="80" /></div>
        <div class="field"><label for="addressPin">PIN code</label><input id="addressPin" required inputmode="numeric" pattern="[0-9]{6}" maxlength="6" /></div>
        <button class="button button-dark full-width" type="submit">Save address</button>
      </form>
    `;
  } else if (tab === "orders") {
    body = `
      <h2 id="modalTitle">Your orders.</h2>
      <p>Orders shown here are local demonstration records, not confirmed purchases.</p>
      ${orders.length ? orders.slice().reverse().map(order => `
        <div class="order-card">
          <strong>Order ${escapeHTML(order.id)}</strong>
          <p>${escapeHTML(order.date)} · ${money(order.total)}</p>
          <span class="status-pill">${escapeHTML(order.status || "Demo order")}</span>
          <p>${order.items.length} product line(s)</p>
          <button class="button button-outline" data-track-order="${escapeHTML(order.id)}">View demo tracking</button>
        </div>
      `).join("") : `<div class="account-card"><strong>No orders yet.</strong><p>Your demonstration orders will appear here.</p></div>`}
    `;
  }

  openModal(`
    <p class="eyebrow">YOUR STUDIO NILA</p>
    <h2 id="modalTitle">${tab === "profile" ? "Your profile." : tab === "addresses" ? "Your addresses." : "Your orders."}</h2>
    <p>Signed in using the frontend demonstration. This is not a verified secure session.</p>
    <nav class="account-nav" aria-label="Account sections">
      <button data-account-tab="profile" class="${tab === "profile" ? "active" : ""}">Profile</button>
      <button data-account-tab="addresses" class="${tab === "addresses" ? "active" : ""}">Addresses (${addresses.length})</button>
      <button data-account-tab="orders" class="${tab === "orders" ? "active" : ""}">Orders (${orders.length})</button>
    </nav>
    ${body}
    <div class="form-actions">
      <button class="button button-outline" id="logoutButton">Sign out</button>
    </div>
    <div class="demo-note">Do not use this prototype for real customer authentication or sensitive personal information.</div>
  `);

  $$("[data-account-tab]", modalContent).forEach(button => {
    button.addEventListener("click", () => renderAccount(button.dataset.accountTab));
  });

  const profileForm = $("#profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", event => {
      event.preventDefault();
      profile.name = $("#profileName").value.trim();
      saveStorage(STORAGE.profile, profile);
      showToast("Demo profile saved in this browser.");
      renderAccount("profile");
    });
  }

  const addressForm = $("#addressForm");
  if (addressForm) {
    addressForm.addEventListener("submit", event => {
      event.preventDefault();
      const pin = $("#addressPin").value.trim();

      if (!/^\d{6}$/.test(pin)) {
        showToast("Enter a valid six-digit PIN code.");
        return;
      }

      addresses.push({
        id: `addr-${Date.now()}`,
        label: $("#addressLabel").value.trim(),
        name: $("#addressName").value.trim(),
        phone: $("#addressPhone").value.trim(),
        line: $("#addressLine").value.trim(),
        city: $("#addressCity").value.trim(),
        state: $("#addressState").value.trim(),
        pin
      });

      saveStorage(STORAGE.addresses, addresses);
      showToast("Demo address saved.");
      renderAccount("addresses");
    });
  }

  $$("[data-delete-address]", modalContent).forEach(button => {
    button.addEventListener("click", () => {
      addresses = addresses.filter(address => address.id !== button.dataset.deleteAddress);
      saveStorage(STORAGE.addresses, addresses);
      renderAccount("addresses");
    });
  });

  $$("[data-track-order]", modalContent).forEach(button => {
    button.addEventListener("click", () => showDemoTracking(button.dataset.trackOrder));
  });

  $("#logoutButton").addEventListener("click", () => {
    profile = profile ? {
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      demoAuthenticated: false
    } : null;

    saveStorage(STORAGE.profile, profile);
    showToast("Signed out of the frontend demo.");
    showAuthStart("login");
  });
}

function renderAddressCards() {
  if (!addresses.length) {
    return `<div class="account-card"><strong>No saved addresses.</strong><p>Add one below to use it in the demo checkout.</p></div>`;
  }

  return addresses.map(address => `
    <div class="address-card">
      <strong>${escapeHTML(address.label)} · ${escapeHTML(address.name)}</strong>
      <p>${escapeHTML(address.line)}</p>
      <p>${escapeHTML(address.city)}, ${escapeHTML(address.state)} — ${escapeHTML(address.pin)}</p>
      <p>${escapeHTML(address.phone)}</p>
      <button class="text-button" type="button" data-delete-address="${escapeHTML(address.id)}">Remove address</button>
    </div>
  `).join("");
}

function showDemoTracking(orderId) {
  const order = orders.find(item => item.id === orderId);
  if (!order) {
    showToast("Demo order not found.");
    return;
  }

  openModal(`
    <p class="eyebrow">ORDER DETAILS · DEMO</p>
    <h2 id="modalTitle">Your order journey.</h2>
    <p>Order ${escapeHTML(order.id)} · ${escapeHTML(order.date)}</p>
    <div class="account-card">
      <strong>Order received</strong>
      <p>This is a local demonstration status, not a live courier update.</p>
      <span class="status-pill">Demo status: ${escapeHTML(order.status || "Order placed")}</span>
    </div>
    <div class="demo-note">Live courier tracking will require a shipping provider and backend integration.</div>
    <button class="button button-outline full-width" id="backToOrders">Back to orders</button>
  `);

  $("#backToOrders").addEventListener("click", () => renderAccount("orders"));
}

/* ---------------- CHECKOUT DEMO ---------------- */

function startCheckout() {
  if (!cart.length) {
    showToast("Your bag is empty.");
    return;
  }

  closeCart();

  if (!profile?.demoAuthenticated) {
    showAuthStart("login");
    showToast("Use the demo sign-in to continue.");
    return;
  }

  checkoutStep = 1;
  checkoutAddress = addresses[0]?.id || null;
  checkoutPayment = "cod";
  renderCheckout();
}

function renderCheckout() {
  const total = cartTotal();
  const shipping = total >= 1499 ? 0 : 79;
  const grandTotal = total + shipping;

  let content = `
    <p class="eyebrow">A FEW MORE DETAILS</p>
    <h2 id="modalTitle">Checkout.</h2>
    <div class="checkout-steps">
      <span class="${checkoutStep === 1 ? "active" : ""}">01 · Delivery</span>
      <span class="${checkoutStep === 2 ? "active" : ""}">02 · Payment</span>
      <span class="${checkoutStep === 3 ? "active" : ""}">03 · Review</span>
    </div>
  `;

  if (checkoutStep === 1) {
    content += `
      <h3 style="font-family:var(--serif);font-weight:400">Where should we send it?</h3>
      ${addresses.length ? `
        <div class="form-stack">
          ${addresses.map(address => `
            <label class="radio-card">
              <input type="radio" name="deliveryAddress" value="${escapeHTML(address.id)}"
                ${checkoutAddress === address.id ? "checked" : ""} />
              <div><strong>${escapeHTML(address.label)} · ${escapeHTML(address.name)}</strong>
                <span>${escapeHTML(address.line)}, ${escapeHTML(address.city)}, ${escapeHTML(address.state)} ${escapeHTML(address.pin)}</span>
                <span>${escapeHTML(address.phone)}</span>
              </div>
            </label>
          `).join("")}
        </div>
        <button class="text-button" id="addAddressFromCheckout">+ Add another address</button>
      ` : `
        <p>You haven't saved a delivery address yet.</p>
        <button class="button button-outline full-width" id="addAddressFromCheckout">Add a delivery address</button>
      `}
      <div class="form-actions">
        <button class="button button-dark full-width" id="checkoutNext" ${addresses.length ? "" : "disabled"}>Continue to payment →</button>
      </div>
    `;
  } else if (checkoutStep === 2) {
    content += `
      <h3 style="font-family:var(--serif);font-weight:400">Choose a payment method.</h3>
      <div class="form-stack">
        <label class="radio-card"><input type="radio" name="paymentMethod" value="cod" ${checkoutPayment === "cod" ? "checked" : ""} />
          <div><strong>Cash on delivery</strong><span>Demo selection only. No order is sent to a delivery partner.</span></div>
        </label>
        <label class="radio-card"><input type="radio" name="paymentMethod" value="online" ${checkoutPayment === "online" ? "checked" : ""} />
          <div><strong>Online payment (demo)</strong><span>No payment gateway is connected and no money will be charged.</span></div>
        </label>
      </div>
      <div class="form-actions">
        <button class="button button-outline" id="checkoutBack">Back</button>
        <button class="button button-dark" id="checkoutNext">Review order →</button>
      </div>
    `;
  } else {
    const selectedAddress = addresses.find(address => address.id === checkoutAddress);

    content += `
      <h3 style="font-family:var(--serif);font-weight:400">Make sure everything looks right.</h3>
      <div class="account-card">
        <strong>Deliver to</strong>
        <p>${selectedAddress ? `${escapeHTML(selectedAddress.name)} · ${escapeHTML(selectedAddress.line)}, ${escapeHTML(selectedAddress.city)} ${escapeHTML(selectedAddress.pin)}` : "No address selected"}</p>
        <button class="text-button" id="editDelivery">Change address</button>
      </div>
      <div class="account-card">
        <strong>Items</strong>
        ${cart.map(item => {
          const product = getProduct(item.id);
          return `<div class="checkout-summary"><span>${escapeHTML(product.name)} × ${item.quantity}</span><span>${money(product.price * item.quantity)}</span></div>`;
        }).join("")}
        <div class="checkout-summary"><span>Subtotal</span><span>${money(total)}</span></div>
        <div class="checkout-summary"><span>Shipping</span><span>${shipping ? money(shipping) : "Free"}</span></div>
        <div class="checkout-summary total"><span>Total</span><span>${money(grandTotal)}</span></div>
      </div>
      <div class="demo-note">
        ${checkoutPayment === "online"
          ? "Online payment is simulated. No payment provider is connected."
          : "This is a demo cash-on-delivery selection. No courier will receive this order."}
        Confirming creates a local demonstration order only.
      </div>
      <div class="form-actions">
        <button class="button button-outline" id="checkoutBack">Back</button>
        <button class="button button-dark" id="placeDemoOrder">Place demo order →</button>
      </div>
    `;
  }

  content += `
    <div class="account-card">
      <div class="checkout-summary"><span>Bag subtotal</span><span>${money(total)}</span></div>
      <div class="checkout-summary"><span>Shipping</span><span>${shipping ? money(shipping) : "Free"}</span></div>
      <div class="checkout-summary total"><span>Estimated total</span><span>${money(grandTotal)}</span></div>
    </div>
    <div class="demo-note">Frontend prototype only. Real checkout requires server-side inventory and price validation, verified payment, and a backend order record.</div>
  `;

  openModal(content);

  $("#addAddressFromCheckout")?.addEventListener("click", () => renderAccount("addresses"));

  $$('input[name="deliveryAddress"]', modalContent).forEach(input => {
    input.addEventListener("change", () => { checkoutAddress = input.value; });
  });

  $$('input[name="paymentMethod"]', modalContent).forEach(input => {
    input.addEventListener("change", () => { checkoutPayment = input.value; });
  });

  $("#checkoutNext")?.addEventListener("click", () => {
    if (checkoutStep === 1) {
      const selected = $('input[name="deliveryAddress"]:checked', modalContent);
      if (selected) checkoutAddress = selected.value;

      if (!addresses.some(address => address.id === checkoutAddress)) {
        showToast("Choose or add a delivery address first.");
        return;
      }
      checkoutStep = 2;
    } else {
      checkoutStep = 3;
    }
    renderCheckout();
  });

  $("#checkoutBack")?.addEventListener("click", () => {
    checkoutStep = Math.max(1, checkoutStep - 1);
    renderCheckout();
  });

  $("#editDelivery")?.addEventListener("click", () => {
    checkoutStep = 1;
    renderCheckout();
  });

  $("#placeDemoOrder")?.addEventListener("click", placeDemoOrder);
}

function placeDemoOrder() {
  if (!profile?.demoAuthenticated) {
    showToast("Please sign in again.");
    showAuthStart("login");
    return;
  }

  const address = addresses.find(item => item.id === checkoutAddress);
  if (!address || !cart.length) {
    showToast("Your delivery address or bag is missing.");
    return;
  }

  const subtotal = cartTotal();
  const shipping = subtotal >= 1499 ? 0 : 79;

  const order = {
    id: `SN-${Date.now().toString().slice(-8)}`,
    date: new Date().toLocaleDateString("en-IN"),
    items: cart.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price: getProduct(item.id)?.price || 0
    })),
    total: subtotal + shipping,
    address: { ...address },
    paymentMethod: checkoutPayment,
    status: "Demo order placed"
  };

  orders.push(order);
  saveStorage(STORAGE.orders, orders);

  cart = [];
  persistCart();
  renderCart();

  openModal(`
    <p class="eyebrow">THANK YOU · DEMO ORDER</p>
    <h2 id="modalTitle">That's a wrap.</h2>
    <p>Your frontend demo order has been created. No payment was processed and no order was sent to a real store or courier.</p>
    <div class="account-card">
      <strong>Order ${escapeHTML(order.id)}</strong>
      <p>Order total: ${money(order.total)}</p>
      <p>Placed on ${escapeHTML(order.date)}</p>
      <span class="status-pill">Demo order saved in this browser</span>
    </div>
    <div class="form-actions">
      <button class="button button-dark" id="viewNewOrder">View my orders</button>
      <button class="button button-outline" id="continueShopping">Continue shopping</button>
    </div>
  `);

  $("#viewNewOrder").addEventListener("click", () => renderAccount("orders"));
  $("#continueShopping").addEventListener("click", closeModal);
}

/* ---------------- EVENT WIRING ---------------- */

$("#cartButton").addEventListener("click", openCart);
$("#accountButton").addEventListener("click", () => renderAccount("profile"));
$("#closeModal").addEventListener("click", closeModal);
$("#checkoutButton").addEventListener("click", startCheckout);
$("#closeSearch").addEventListener("click", () => {
  $("#searchPanel").hidden = true;
});
$("#searchToggle").addEventListener("click", () => {
  $("#searchPanel").hidden = !$("#searchPanel").hidden;
  if (!$("#searchPanel").hidden) $("#searchInput").focus();
});

$("#searchForm").addEventListener("submit", event => {
  event.preventDefault();
  searchTerm = $("#searchInput").value;
  renderProducts();
  $("#shop").scrollIntoView({ behavior: "smooth" });
});

$("#searchInput").addEventListener("input", event => {
  searchTerm = event.target.value;
  renderProducts();
});

$("#sortSelect").addEventListener("change", renderProducts);
$("#resetFilters").addEventListener("click", () => {
  searchTerm = "";
  activeCategory = "All";
  $("#searchInput").value = "";
  $("#sortSelect").value = "featured";
  setCategory("All");
});

$$("[data-category]").forEach(button => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.category);
    $("#shop").scrollIntoView({ behavior: "smooth" });
  });
});

$$("[data-nav-category]").forEach(link => {
  link.addEventListener("click", () => setCategory(link.dataset.navCategory));
});

$$("[data-footer-category]").forEach(link => {
  link.addEventListener("click", () => setCategory(link.dataset.footerCategory));
});

$$("[data-open-account]").forEach(button => {
  button.addEventListener("click", () => renderAccount(button.dataset.openAccount));
});

$$("[data-close='cart']").forEach(button => button.addEventListener("click", closeCart));
cartOverlay.addEventListener("click", closeCart);

modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) closeModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal();
    closeCart();
    $("#searchPanel").hidden = true;
  }
});

$("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = $("#newsletterEmail").value.trim();
  $("#newsletterMessage").textContent =
    `Thanks for your interest. Newsletter signup is a frontend demo; ${email} has not been subscribed.`;
  $("#newsletterForm").reset();
});

$("#year").textContent = new Date().getFullYear();

function initialize() {
  // Discard malformed or unavailable product references in stored demo cart.
  cart = Array.isArray(cart)
    ? cart.filter(item =>
        getProduct(item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= 10
      )
    : [];

  wishlist = Array.isArray(wishlist)
    ? wishlist.filter(id => getProduct(id))
    : [];

  addresses = Array.isArray(addresses) ? addresses : [];
  orders = Array.isArray(orders) ? orders : [];

  persistCart();
  renderProducts();
  renderCart();
}

initialize();
