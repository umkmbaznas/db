const list = document.getElementById("productList");
const productCount = document.getElementById("productCount");

async function tampilkanProduk() {
  list.innerHTML = `<div class="loading">Memuat produk...</div>`;

  const products = await loadProducts();

  const availableProducts = products.filter(p =>
    p.status !== "habis" &&
    p.status !== "tidak tersedia" &&
    p.status !== "nonaktif"
  );

  productCount.textContent = `${availableProducts.length} produk`;

  if (availableProducts.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <h3>Produk belum tersedia</h3>
        <p>Periksa koneksi Internet Kamu.</p>
        <button class="btn btn-primary" onclick="tampilkanProduk()">Coba Lagi</button>
      </div>
    `;
    return;
  }

  list.innerHTML = availableProducts.map(p => `
    <article class="product-card">
      <div class="product-photo product-slider" data-slider>
        <img class="product-slide active"
          src="${escapeHtml((p.images && p.images[0]) || p.image || "no-image.svg/no-image.svg")}"
          alt="${escapeHtml(p.name)}" loading="lazy"
          onerror="this.onerror=null;this.src='no-image.svg/no-image.svg';">
        ${(p.images || []).slice(1,5).map((photo, i) => `
          <img class="product-slide" src="${escapeHtml(photo)}"
            alt="${escapeHtml(p.name)} foto ${i+2}" loading="lazy"
            onerror="this.style.display='none';">
        `).join("")}
        ${((p.images || []).length > 1) ? `
          <button class="slide-arrow prev" type="button" aria-label="Foto sebelumnya" data-dir="-1">‹</button>
          <button class="slide-arrow next" type="button" aria-label="Foto berikutnya" data-dir="1">›</button>
          <div class="slide-dots">${(p.images || []).slice(0,5).map((_,i)=>`<button type="button" class="slide-dot ${i===0?'active':''}" data-index="${i}" aria-label="Foto ${i+1}"></button>`).join("")}</div>
        ` : ""}
      </div>

      <div class="product-info">
        <span class="badge">Produk UMKM</span>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.desc)}</p>

        <div class="price-row">
          <span>Harga</span>
          <strong>${rupiah(p.small)}</strong>
        </div>

        <a class="btn btn-primary"
           href="detail-pesanan.html?produk=${encodeURIComponent(p.id)}">
          Buat Pesanan
        </a>
      </div>
    </article>
  `).join("");

  list.querySelectorAll("[data-slider]").forEach(slider => {
    const slides = [...slider.querySelectorAll(".product-slide")];
    const dots = [...slider.querySelectorAll(".slide-dot")];
    let current = 0;
    const show = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    };
    slider.querySelectorAll(".slide-arrow").forEach(button =>
      button.addEventListener("click", () => show(current + Number(button.dataset.dir))));
    dots.forEach(dot => dot.addEventListener("click", () => show(Number(dot.dataset.index))));
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

tampilkanProduk();
