// =============================================
// FASHION STORE - E-COMMERCE WEBSITE
// Front-end demonstration using HTML, CSS, JS
// =============================================

const $ = (selector) => document.querySelector(selector);
const money = (amount) =>
  "₹" + Number(amount).toLocaleString("en-IN");

const products = [
  {
    id: 1,
    name: "Relaxed Cotton T-Shirt",
    category: "Men",
    type: "Everyday Essentials",
    price: 599,
    oldPrice: 899,
    rating: 4.7,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Minimal Everyday Shirt",
    category: "Men",
    type: "Modern Classics",
    price: 1199,
    oldPrice: 1599,
    rating: 4.6,
    badge: "TRENDING",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Soft Knit Co-ord Set",
    category: "Women",
    type: "Comfort Collection",
    price: 1499,
    oldPrice: 1999,
    rating: 4.8,
    badge: "JUST IN",
    image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Classic Sneakers",
    category: "Footwear",
    type: "Everyday Footwear",
    price: 1799,
    oldPrice: 2499,
    rating: 4.5,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Structured Crossbody Bag",
    category: "Accessories",
    type: "Finishing Touches",
    price: 999,
    oldPrice: 1399,
    rating: 4.4,
    badge: "LIMITED OFFER",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Everyday Sunglasses",
    category: "Accessories",
    type: "Sunny Day Essentials",
    price: 749,
    oldPrice: 1099,
    rating: 4.3,
    badge: "SAVE 32%",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Floral Day Dress",
    category: "Women",
    type: "Occasion Wear",
    price: 1599,
    oldPrice: 2199,
    rating: 4.7,
    badge: "NEW SEASON",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Daily Fresh Fragrance",
    category: "Beauty",
    type: "Personal Care",
    price: 899,
    oldPrice: 1199,
    rating: 4.2,
    badge: "FAVOURITE",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 9,
    name: "Tailored Straight Pants",
    category: "Men",
    type: "Smart Essentials",
    price: 1299,
    oldPrice: 1799,
    rating: 4.5,
    badge: "VERSATILE",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 10,
    name: "Lightweight Shoulder Bag",
    category: "Accessories",
    type: "Everyday Bags",
    price: 1099,
    oldPrice: 1499,
    rating: 4.6,
    badge: "EDITOR'S PICK",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 11,
    name: "Weekend Running Shoes",
    category: "Footwear",
    type: "Sports Collection",
    price: 2199,
    oldPrice: 2999,
    rating: 4.8,
    badge: "TOP RATED",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 12,
    name: "Everyday Skincare Set",
    category: "Beauty",
    type: "Daily Ritual",
    price: 699,
    oldPrice: 999,
    rating: 4.4,
    badge: "GREAT VALUE",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80"
  }
];

// =============================================
// DATA AND BROWSER STORAGE
// =============================================

function loadData(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    showToast("Unable to save data in this browser.");
  }
}

let cart = loadData("fs_cart", []);
let wishlist = loadData("fs_wishlist", []);
let addresses = loadData("fs_addresses", []);
let orders = loadData("fs_orders", []);
let user = loadData("fs_user", null);

let selectedCategory = "All";
let searchTerm = "";
let toastTimer;

// =============================================
// GENERAL HELPERS
// =============================================

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function openModal(content) {
  $("#modalContent").innerHTML = content;
  $("#modalBackdrop").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $("#modalBackdrop").classList.remove("open");
  document.body.style.overflow = "";
}

function openCart() {
  $("#cartOverlay").classList.add("open");
  $("#cartDrawer").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  $("#cartOverlay").classList.remove("open");
  $("#cartDrawer").classList.remove("open");
  document.body.style.overflow = "";
}

function cartQuantity() {
  return cart.reduce((total, item) => total + item.qty, 0);
}

function cartSubtotal() {
  return cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.id);
    return total + (product ? product.price * item.qty : 0);
  }, 0);
}

// =============================================
// PRODUCT CATALOGUE, SEARCH AND FILTERS
// =============================================

function renderProducts() {
  let filtered = products.filter((product) => {
    const categoryMatches =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const text = (
      product.name + " " +
      product.category + " " +
      product.type
    ).toLowerCase();

    return categoryMatches && text.includes(searchTerm.toLowerCase());
  });

  const sort = $("#sortSelect").value;

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  $("#productGrid").innerHTML = filtered.map((product) => {
    const isSaved = wishlist.includes(product.id);
    const discount = Math.round(
      (1 - product.price / product.oldPrice) * 100
    );

    return `
      <article class="product-card">
        <div class="product-image">
          <img
            src="${product.image}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
          >

          <span class="product-badge">
            ${escapeHTML(product.badge)}
          </span>

          <button
            class="wishlist ${isSaved ? "active" : ""}"
            data-wish="${product.id}"
            aria-label="Toggle wishlist"
          >${isSaved ? "♥" : "♡"}</button>
        </div>

        <div class="product-info">
          <p class="product-meta">
            ${escapeHTML(product.category)} · ${escapeHTML(product.type)}
          </p>

          <div class="product-title-row">
            <h3 class="product-title">
              ${escapeHTML(product.name)}
            </h3>
            <span class="rating">★ ${product.rating}</span>
          </div>

          <div class="price-row">
            <span class="price">${money(product.price)}</span>
            <span class="old-price">${money(product.oldPrice)}</span>
            <span class="discount">${discount}% off</span>
          </div>

          <button class="add-button" data-add="${product.id}">
            + Add to cart
          </button>
        </div>
      </article>
    `;
  }).join("");

  $("#emptyState").classList.toggle("hidden", filtered.length > 0);

  document.querySelectorAll(".chip").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.category === selectedCategory
    );
  });

  document.querySelectorAll(".category-links [data-category]")
    .forEach((link) => {
      link.classList.toggle(
        "active",
        link.dataset.category === selectedCategory
      );
    });
}

function chooseCategory(category) {
  selectedCategory = category;
  renderProducts();

  $("#products").scrollIntoView({ behavior: "smooth" });
  $("#categoryNav").classList.remove("mobile-open");
}

// =============================================
// SHOPPING CART
// =============================================

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }

  updateCart();
  showToast("Added to your cart!");
}

function changeQuantity(id, change) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cart = cart.filter((entry) => entry.id !== id);
  }

  updateCart();
}

function updateCart() {
  cart = cart.filter((item) =>
    products.some((product) => product.id === item.id) &&
    Number.isInteger(item.qty) &&
    item.qty > 0
  );

  saveData("fs_cart", cart);

  $("#cartCount").textContent = cartQuantity();
  $("#drawerCount").textContent = cartQuantity();
  $("#cartSubtotal").textContent = money(cartSubtotal());

  $("#cartItems").innerHTML = cart.length
    ? cart.map((item) => {
        const product = products.find((p) => p.id === item.id);

        return `
          <div class="cart-row">
            <img src="${product.image}" alt="${escapeHTML(product.name)}">

            <div>
              <h3>${escapeHTML(product.name)}</h3>
              <p>${money(product.price)}</p>

              <div class="quantity">
                <button data-qty="${product.id}" data-change="-1"
                  aria-label="Decrease quantity">−</button>
                <span>${item.qty}</span>
                <button data-qty="${product.id}" data-change="1"
                  aria-label="Increase quantity">+</button>
              </div>
            </div>

            <button class="remove-item" data-remove="${product.id}"
              aria-label="Remove item">×</button>
          </div>
        `;
      }).join("")
    : `
      <div class="empty-state">
        <p style="font-size:32px">🛍</p>
        <h3>Your cart is empty.</h3>
        <p>Add products you love to get started.</p>
      </div>
    `;

  $("#checkoutOpen").disabled = cart.length === 0;
  $("#checkoutOpen").style.opacity = cart.length ? "1" : ".5";
}

// =============================================
// LOGIN AND PROFILE
// =============================================

function renderHeaderUser() {
  $("#loginOpen").innerHTML = user
    ? `♙ <span>${escapeHTML(user.name.split(" ")[0])}</span>`
    : `♙ <span>Login</span>`;
}

function showLogin() {
  openModal(`
    <p class="eyebrow">WELCOME TO FASHION STORE</p>
    <h2>${user ? "Your profile" : "Login / Create profile"}</h2>
    <p class="modal-intro">
      Enter your name and email to create a local demo profile.
    </p>

    <form id="loginForm">
      <div class="field">
        <label for="loginName">Full name</label>
        <input id="loginName" required
          value="${escapeHTML(user?.name || "")}"
          placeholder="Enter your name">
      </div>

      <div class="field">
        <label for="loginEmail">Email address</label>
        <input id="loginEmail" type="email" required
          value="${escapeHTML(user?.email || "")}"
          placeholder="you@example.com">
      </div>

      <button type="submit" class="primary-button">
        Save profile
      </button>
    </form>

    <div class="notice">
      Demo only: this form does not verify your identity or provide
      secure authentication.
    </div>

    ${user ? `
      <button id="logoutButton" class="modal-link">Sign out</button>
    ` : ""}
  `);
}

// =============================================
// SAVED DELIVERY ADDRESSES
// =============================================

function showAddresses() {
  openModal(`
    <p class="eyebrow">DELIVERY DETAILS</p>
    <h2>Saved addresses</h2>
    <p class="modal-intro">
      Save an address for your demo orders.
    </p>

    <div>
      ${addresses.length ? addresses.map((address, index) => `
        <div class="address-card">
          <strong>${escapeHTML(address.name)} · ${escapeHTML(address.type)}</strong>
          <p>
            ${escapeHTML(address.line)}<br>
            ${escapeHTML(address.city)}, ${escapeHTML(address.state)}
            - ${escapeHTML(address.pin)}<br>
            Phone: ${escapeHTML(address.phone)}
          </p>
          <button data-delete-address="${index}">Remove address</button>
        </div>
      `).join("") : `
        <div class="notice">You have no saved addresses yet.</div>
      `}
    </div>

    <h3 style="font-size:15px;margin:20px 0 12px">Add an address</h3>

    <form id="addressForm">
      ${addressFields("addr")}

      <div class="field">
        <label for="addrType">Address type</label>
        <select id="addrType">
          <option>Home</option>
          <option>Work</option>
          <option>Other</option>
        </select>
      </div>

      <button class="primary-button" type="submit">Save address</button>
    </form>
  `);
}

function addressFields(prefix) {
  return `
    <div class="field">
      <label for="${prefix}Name">Full name</label>
      <input id="${prefix}Name" required
        value="${prefix === "co" ? escapeHTML(user?.name || "") : ""}">
    </div>

    <div class="field">
      <label for="${prefix}Phone">10-digit mobile number</label>
      <input id="${prefix}Phone" required
        inputmode="numeric" pattern="[0-9]{10}"
        maxlength="10" placeholder="9876543210">
    </div>

    <div class="field">
      <label for="${prefix}Line">House number, street and area</label>
      <input id="${prefix}Line" required>
    </div>

    <div class="form-grid">
      <div class="field">
        <label for="${prefix}City">City</label>
        <input id="${prefix}City" required>
      </div>

      <div class="field">
        <label for="${prefix}State">State</label>
        <input id="${prefix}State" required>
      </div>
    </div>

    <div class="field">
      <label for="${prefix}Pin">6-digit PIN code</label>
      <input id="${prefix}Pin" required
        inputmode="numeric" pattern="[0-9]{6}"
        maxlength="6">
    </div>
  `;
}

function readAddress(prefix) {
  const get = (field) => $("#" + prefix + field).value.trim();

  return {
    name: get("Name"),
    phone: get("Phone"),
    line: get("Line"),
    city: get("City"),
    state: get("State"),
    pin: get("Pin"),
    type: prefix === "addr" ? $("#addrType").value : "Home"
  };
}

// =============================================
// CHECKOUT
// =============================================

function showCheckout() {
  if (!cart.length) {
    showToast("Your cart is empty.");
    return;
  }

  const subtotal = cartSubtotal();
  const delivery = subtotal >= 999 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;

  openModal(`
    <p class="eyebrow">ALMOST YOURS</p>
    <h2>Checkout</h2>
    <p class="modal-intro">
      Enter your delivery details and select a demo payment method.
    </p>

    <form id="checkoutForm">
      <h3 style="font-size:14px;margin-bottom:12px">
        1. Delivery address
      </h3>

      ${addresses.length ? `
        <div class="field">
          <label for="savedAddress">Choose a saved address</label>
          <select id="savedAddress" required>
            ${addresses.map((address, index) => `
              <option value="${index}">
                ${escapeHTML(address.name)} —
                ${escapeHTML(address.city)}, ${escapeHTML(address.pin)}
              </option>
            `).join("")}
            <option value="new">Enter a new address</option>
          </select>
        </div>

        <div id="checkoutNewAddress" class="hidden">
          ${addressFields("co")}
        </div>

        <button type="button" class="modal-link" id="manageAddresses">
          Manage saved addresses
        </button>
      ` : `
        <div class="notice">
          Please enter your delivery details below.
        </div>
        ${addressFields("co")}
      `}

      <h3 style="font-size:14px;margin:20px 0 12px">
        2. Payment method
      </h3>

      <div class="payment-options">
        <label class="payment-option">
          <input type="radio" name="payment" value="UPI demo" checked>
          <span><strong>UPI</strong><br>
            <small>Google Pay, PhonePe or Paytm (demo)</small>
          </span>
        </label>

        <label class="payment-option">
          <input type="radio" name="payment" value="Card demo">
          <span><strong>Credit / debit card</strong><br>
            <small>Demo selection only</small>
          </span>
        </label>

        <label class="payment-option">
          <input type="radio" name="payment" value="Cash on delivery">
          <span><strong>Cash on delivery</strong><br>
            <small>Simulated order placement</small>
          </span>
        </label>
      </div>

      <h3 style="font-size:14px;margin:20px 0 12px">
        3. Order summary
      </h3>

      <div class="checkout-summary">
        <div><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div><span>Delivery</span><span>${delivery ? money(delivery) : "FREE"}</span></div>
        <div><span>Estimated tax (5%)</span><span>${money(tax)}</span></div>
        <div class="total"><span>Total</span><span>${money(total)}</span></div>
      </div>

      <div class="notice">
        This is a front-end demo. No real payment is processed,
        and no real order is sent to a delivery company.
      </div>

      <button type="submit" class="primary-button">
        Place demo order · ${money(total)}
      </button>
    </form>
  `);

  const savedAddress = $("#savedAddress");

  if (savedAddress) {
    const toggleNewAddress = () => {
      const useNew = savedAddress.value === "new";
      const section = $("#checkoutNewAddress");

      section.classList.toggle("hidden", !useNew);

      section.querySelectorAll("input").forEach((input) => {
        input.disabled = !useNew;
      });
    };

    savedAddress.addEventListener("change", toggleNewAddress);
    toggleNewAddress();
  }

  $("#manageAddresses")?.addEventListener("click", showAddresses);
}

function placeDemoOrder(event) {
  event.preventDefault();

  let address;

  const savedAddress = $("#savedAddress");

  if (savedAddress && savedAddress.value !== "new") {
    address = addresses[Number(savedAddress.value)];
  } else {
    address = readAddress("co");
    address.type = "Home";

    if (!addresses.some((item) =>
      item.phone === address.phone && item.line === address.line
    )) {
      addresses.push(address);
      saveData("fs_addresses", addresses);
    }
  }

  if (!address) {
    showToast("Please select a valid delivery address.");
    return;
  }

  const subtotal = cartSubtotal();
  const delivery = subtotal >= 999 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;

  const payment = new FormData(event.target).get("payment");

  const order = {
    id: "FS-" + Date.now().toString().slice(-8),
    date: new Date().toLocaleDateString("en-IN"),
    total,
    items: cartQuantity(),
    payment,
    address,
    status: "Order placed",
    stage: 0,
    products: cart.map((item) => ({ ...item }))
  };

  orders.push(order);
  saveData("fs_orders", orders);

  cart = [];
  updateCart();

  showOrderConfirmation(order);
}

// =============================================
// ORDER CONFIRMATION AND ORDER TRACKING
// =============================================

function showOrderConfirmation(order) {
  openModal(`
    <div class="success-icon">✓</div>
    <p class="eyebrow">ORDER CONFIRMED · DEMO</p>
    <h2>Thank you for shopping!</h2>

    <p class="modal-intro">
      Your demo order has been created successfully.
    </p>

    <div class="order-card">
      <div class="order-top">
        <span>Order ID: ${escapeHTML(order.id)}</span>
        <span class="status-pill">Order placed</span>
      </div>

      <p>Date: ${escapeHTML(order.date)}</p>
      <p>Items: ${order.items}</p>
      <p>Total: ${money(order.total)}</p>
      <p>Payment: ${escapeHTML(order.payment)}</p>
    </div>

    <div class="notice">
      Save your order ID to test the demo tracking feature.
      No real payment or shipment has been created.
    </div>

    <button class="primary-button" id="trackNewOrder">
      Track this order →
    </button>

    <button class="secondary-button full-width" id="continueAfterOrder">
      Continue shopping
    </button>
  `);
}

function showOrders() {
  openModal(`
    <p class="eyebrow">YOUR PURCHASES</p>
    <h2>Track your orders</h2>
    <p class="modal-intro">
      Enter the order ID shown in your demo checkout confirmation.
    </p>

    <form id="trackForm">
      <div class="field">
        <label for="trackOrderId">Order ID</label>
        <input id="trackOrderId" required
          placeholder="Example: FS-12345678"
          value="${orders.length ? escapeHTML(orders[orders.length - 1].id) : ""}">
      </div>
      <button type="submit" class="primary-button">Track order →</button>
    </form>

    <div id="orderResults">
      ${orders.length ? renderOrderHistory() : `
        <div class="notice">
          No orders yet. Your demo orders will appear here after checkout.
        </div>
      `}
    </div>
  `);
}

function renderTrackingSteps(stage) {
  const steps = ["Order placed", "Packed", "Shipped", "Delivered"];

  return `
    <div class="tracking-steps">
      ${steps.map((step, index) => `
        <div class="track-step ${index > stage ? "pending" : ""}">
          ${step}
        </div>
      `).join("")}
    </div>
  `;
}

function renderOrderHistory() {
  return orders.slice().reverse().map((order) => `
    <div class="order-card">
      <div class="order-top">
        <span>${escapeHTML(order.id)}</span>
        <span class="status-pill">${escapeHTML(order.status)}</span>
      </div>

      <p>Placed ${escapeHTML(order.date)}</p>
      <p>${order.items} item(s) · ${money(order.total)}</p>

      ${renderTrackingSteps(order.stage || 0)}

      <button class="modal-link" data-track="${escapeHTML(order.id)}">
        View tracking
      </button>
    </div>
  `).join("");
}

function trackOrder(orderId) {
  const order = orders.find(
    (item) => item.id.toUpperCase() === orderId.toUpperCase()
  );

  if (!order) {
    $("#orderResults").innerHTML = `
      <div class="notice">
        No demo order found for <strong>${escapeHTML(orderId)}</strong>.
        Please check the order ID.
      </div>
    `;
    return;
  }

  $("#orderResults").innerHTML = `
    <div class="order-card">
      <div class="order-top">
        <span>${escapeHTML(order.id)}</span>
        <span class="status-pill">${escapeHTML(order.status)}</span>
      </div>

      <p>Placed ${escapeHTML(order.date)}</p>
      <p>Total: ${money(order.total)}</p>

      <h3 style="font-size:13px;margin-top:18px">Delivery progress</h3>

      ${renderTrackingSteps(order.stage || 0)}

      <div class="notice">
        This is locally stored demo tracking. Real tracking requires
        a backend and delivery carrier integration.
      </div>
    </div>
  `;
}

// =============================================
// WISHLIST
// =============================================

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter((item) => item !== id);
    showToast("Removed from wishlist.");
  } else {
    wishlist.push(id);
    showToast("Added to wishlist!");
  }

  saveData("fs_wishlist", wishlist);
  renderProducts();
}

// =============================================
// EVENT LISTENERS
// =============================================

// Search products.
$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  searchTerm = $("#searchInput").value.trim();
  renderProducts();
  $("#products").scrollIntoView({ behavior: "smooth" });
});

$("#searchInput").addEventListener("input", () => {
  searchTerm = $("#searchInput").value.trim();
  renderProducts();
});

// Sorting.
$("#sortSelect").addEventListener("change", renderProducts);

// Product cards, cart actions and category navigation.
document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    addToCart(Number(addButton.dataset.add));
    return;
  }

  const wishlistButton = event.target.closest("[data-wish]");
  if (wishlistButton) {
    toggleWishlist(Number(wishlistButton.dataset.wish));
    return;
  }

  const quantityButton = event.target.closest("[data-qty]");
  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.qty),
      Number(quantityButton.dataset.change)
    );
    return;
  }

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    cart = cart.filter(
      (item) => item.id !== Number(removeButton.dataset.remove)
    );
    updateCart();
    showToast("Item removed from cart.");
    return;
  }

  const categoryLink = event.target.closest("[data-category]");
  if (categoryLink) {
    event.preventDefault();
    chooseCategory(categoryLink.dataset.category);
    return;
  }

  const deleteAddress = event.target.closest("[data-delete-address]");
  if (deleteAddress) {
    addresses.splice(Number(deleteAddress.dataset.deleteAddress), 1);
    saveData("fs_addresses", addresses);
    showAddresses();
    showToast("Address removed.");
    return;
  }

  const trackButton = event.target.closest("[data-track]");
  if (trackButton) {
    trackOrder(trackButton.dataset.track);
  }
});

// Cart controls.
$("#cartOpen").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
$("#cartOverlay").addEventListener("click", closeCart);
$("#continueShopping").addEventListener("click", closeCart);

$("#checkoutOpen").addEventListener("click", () => {
  if (!cart.length) return;
  closeCart();
  showCheckout();
});

// Login and order navigation.
$("#loginOpen").addEventListener("click", showLogin);
$("#ordersOpen").addEventListener("click", showOrders);

$("#footerOrders").addEventListener("click", (event) => {
  event.preventDefault();
  showOrders();
});

$("#footerAddress").addEventListener("click", (event) => {
  event.preventDefault();
  showAddresses();
});

$("#footerReturns").addEventListener("click", (event) => {
  event.preventDefault();

  openModal(`
    <p class="eyebrow">CUSTOMER CARE</p>
    <h2>Returns & refunds</h2>
    <p class="modal-intro">
      Sample return policy for this demonstration store.
    </p>
    <div class="notice">
      Eligible products may be requested for return within seven days
      of delivery under this sample policy. No real return request
      is submitted by this demo website.
    </div>
    <button class="primary-button" id="closeReturns">Got it</button>
  `);
});

// Modal close buttons.
$("#modalClose").addEventListener("click", closeModal);

$("#modalBackdrop").addEventListener("click", (event) => {
  if (event.target === $("#modalBackdrop")) closeModal();
});

// Mobile navigation.
$("#menuToggle").addEventListener("click", () => {
  $("#categoryNav").classList.toggle("mobile-open");
});

// Newsletter demo.
$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Thanks for subscribing! (Demo only)");
  event.target.reset();
});

// Forms generated inside the modal.
$("#modalContent").addEventListener("submit", (event) => {
  const form = event.target;

  if (form.id === "loginForm") {
    event.preventDefault();

    user = {
      name: $("#loginName").value.trim(),
      email: $("#loginEmail").value.trim()
    };

    saveData("fs_user", user);
    renderHeaderUser();
    closeModal();
    showToast("Demo profile saved.");
    return;
  }

  if (form.id === "addressForm") {
    event.preventDefault();

    const address = readAddress("addr");
    address.type = $("#addrType").value;

    addresses.push(address);
    saveData("fs_addresses", addresses);

    showAddresses();
    showToast("Address saved.");
    return;
  }

  if (form.id === "checkoutForm") {
    placeDemoOrder(event);
    return;
  }

  if (form.id === "trackForm") {
    event.preventDefault();
    trackOrder($("#trackOrderId").value.trim());
  }
});

// Buttons inside dynamically generated modal content.
$("#modalContent").addEventListener("click", (event) => {
  if (event.target.id === "logoutButton") {
    user = null;

    try {
      localStorage.removeItem("fs_user");
    } catch {}

    renderHeaderUser();
    closeModal();
    showToast("Signed out on this device.");
  }

  if (event.target.id === "trackNewOrder") {
    closeModal();
    showOrders();
  }

  if (event.target.id === "continueAfterOrder") {
    closeModal();
    $("#products").scrollIntoView({ behavior: "smooth" });
  }

  if (event.target.id === "closeReturns") {
    closeModal();
  }
});

// Escape key closes overlays.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeModal();
  }
});

// =============================================
// INITIALISE THE WEBSITE
// =============================================

renderProducts();
updateCart();
renderHeaderUser();
