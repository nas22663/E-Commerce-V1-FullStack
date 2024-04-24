document.addEventListener("DOMContentLoaded", () => {
  // Element selectors
  const elements = {
    productTitle: document.getElementById("productTitle"),
    productDescription: document.querySelector(".product-description"),
    price: document.querySelector(".price"),
    discount: document.querySelector(".discount"),
    originalPrice: document.querySelector(".original-price"),
    mainProductImage: document.getElementById("mainProductImage"),
    galleryThumbnailsContainer: document.getElementById(
      "galleryThumbnailsContainer"
    ),
    lightboxMainImage: document.querySelector(".lightbox-main-image"),
    lightbox: document.getElementById("lightbox"),
    lightboxClose: document.querySelector(".lightbox-close"),
    lightboxPrevious: document.querySelector(".lightbox-previous"),
    lightboxNext: document.querySelector(".lightbox-next"),
    lightboxThumbnailsContainer: document.getElementById(
      "lightboxThumbnailsContainer"
    ),
    minusButton: document.querySelector(".minus"),
    plusButton: document.querySelector(".plus"),
    quantityValue: document.querySelector(".quantity-value"),
    menuIcon: document.querySelector(".menu-icon"),
    closeIcon: document.querySelector(".close-icon"),
    navigation: document.querySelector(".navigation"),
    mobilePrev: document.querySelector(".mobile-previous"),
    mobileNext: document.querySelector(".mobile-next"),
    cartIcon: document.querySelector(".cart-icon"),
    cartDetails: document.querySelector(".cart-details"),
    cartItemsContainer: document.querySelector(".cart-items"),

    addToCartButton: document.querySelector(".add-to-cart"),
    checkoutButton: document.querySelector(".checkout-button"),
  };

  let images = []; // This will hold URLs of images
  let currentIndex = 0; // Track the current image index

  setupEventListeners();
  fetchProductData();
  checkCartEmpty();

  let quantity = 1;
  elements.quantityValue.textContent = quantity.toString();

  function setupEventListeners() {
    elements.menuIcon.addEventListener("click", () => toggleNavigation(true));
    elements.closeIcon.addEventListener("click", () => toggleNavigation(false));
    elements.minusButton.addEventListener("click", () => adjustQuantity(-1));
    elements.plusButton.addEventListener("click", () => adjustQuantity(1));
    elements.cartIcon.addEventListener("click", toggleCart);
    elements.addToCartButton.addEventListener("click", handleAddToCart);
    document.addEventListener("keydown", handleKeydown);

    elements.mobilePrev.addEventListener("click", () => navigateSlide(-1));
    elements.mobileNext.addEventListener("click", () => navigateSlide(1));
    elements.lightboxClose.addEventListener("click", closeLightbox);
    elements.lightboxPrevious.addEventListener("click", () =>
      navigateLightbox(-1)
    );

    document.addEventListener("keydown", (event) => {
      if (lightbox.style.display === "flex") {
        switch (event.key) {
          case "Escape":
            closeLightbox();
            break;
          case "ArrowLeft":
            navigateLightbox(-1);
            break;
          case "ArrowRight":
            navigateLightbox(1);
            break;
        }
      }
    });

    elements.lightboxNext.addEventListener("click", () => navigateLightbox(1));

    elements.mainProductImage.addEventListener("click", () => {
      if (window.innerWidth > 375) {
        openLightbox();
      }
    });
  }

  function updateProductDetails(product) {
    const productTitle = document.getElementById("productTitle");
    const productDescription = document.querySelector(".product-description");
    const price = document.querySelector(".price");
    const discount = document.querySelector(".discount");
    const originalPrice = document.querySelector(".original-price");
    const mainProductImage = document.getElementById("mainProductImage");

    productTitle.textContent = product.title;
    productDescription.textContent = product.desc;
    price.textContent = `$${product.appliedPrice.toFixed(2)}`;
    discount.textContent = `${product.discount}%`;
    originalPrice.textContent = `$${product.basePrice.toFixed(2)}`;
    mainProductImage.src = product.images[0].secure_url;
  }

  function fetchProductData() {
    const apiUrl =
      "https://e-commerce-v1-fullstack.onrender.com/product/6627b437f704ad15c15c9617";
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        updateProductDetails(data.product);
        images = data.product.images.map((img) => img.secure_url); // Assuming image URLs are in this path
        currentIndex = 0; // Start with the first image
        updateMainImage(currentIndex); // Set main image
        updateThumbnails(data.product.images); // Create thumbnails
        updateActiveThumbnail(currentIndex);
      })
      .catch((error) => console.error("Error loading product data:", error));
  }

  function toggleNavigation(open) {
    if (open) {
      elements.navigation.classList.add("open");
      elements.closeIcon.classList.add("open");
      elements.menuIcon.style.display = "none";
    } else {
      elements.navigation.classList.remove("open");
      elements.closeIcon.classList.remove("open");
      elements.menuIcon.style.display = "block";
    }
  }

  function adjustQuantity(change) {
    let quantity = parseInt(elements.quantityValue.textContent) + change;
    if (quantity > 0) {
      elements.quantityValue.textContent = quantity.toString();
    }
  }

  function handleAddToCart() {
    const quantity = parseInt(elements.quantityValue.textContent);
    if (quantity > 0) {
      addToCart(
        elements.productTitle.textContent,
        elements.price.textContent,
        elements.mainProductImage.src,
        quantity
      );
      if (
        !elements.cartDetails.style.display ||
        elements.cartDetails.style.display === "none"
      ) {
        toggleCart();
      }
    }
  }

  function addToCart(productName, price, imageUrl, quantity) {
    let existingItem = Array.from(elements.cartItemsContainer.children).find(
      (item) => item.dataset.name === productName
    );
    if (existingItem) {
      updateCartItem(existingItem, quantity, price);
    } else {
      createCartItem(productName, price, imageUrl, quantity);
    }
    checkCartEmpty();
  }

  function updateCartItem(item, quantity, price) {
    let quantityElement = item.querySelector(".item-quantity");
    let totalElement = item.querySelector(".cart-item-total");
    let currentQuantity = parseInt(quantityElement.textContent);
    let newQuantity = currentQuantity + quantity;
    let totalPrice = (parseFloat(price.replace("$", "")) * newQuantity).toFixed(
      2
    );
    quantityElement.textContent = newQuantity.toString();
    totalElement.textContent = `$${totalPrice}`;
  }

  function createCartItem(productName, price, imageUrl, quantity) {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.dataset.name = productName;
    cartItem.innerHTML = `
      <img src="${imageUrl}" alt="${productName}" class="cart-item-image" />
      <div class="cart-item-description">
        <p>${productName}</p>
        <p>${price} x <span class="item-quantity">${quantity}</span> <strong class="cart-item-total">$${(
      parseFloat(price.replace("$", "")) * quantity
    ).toFixed(2)}</strong></p>
      </div>
      <div class="delete-icon" style="cursor: pointer;">
          <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
              <path id="a" d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z"/>
            </defs>
            <use fill="#C3CAD9" fill-rule="nonzero" xlink:href="#a" />
          </svg>
      </div>
    `;
    elements.cartItemsContainer.appendChild(cartItem);

    cartItem.querySelector(".delete-icon").addEventListener("click", () => {
      cartItem.remove();
      checkCartEmpty();
    });
  }

  function checkCartEmpty() {
    const itemsExist =
      elements.cartItemsContainer.querySelectorAll(".cart-item").length;
    if (itemsExist === 0) {
      elements.cartItemsContainer.innerHTML = `<h3>Cart</h3><p class="empty-cart-message" style="color: #69707D; text-align: center;">Your cart is empty.</p>`;
      elements.checkoutButton.style.display = "none";
    } else {
      if (elements.cartDetails.querySelector(".empty-cart-message")) {
        elements.cartDetails.querySelector(".empty-cart-message").remove();
      }
      elements.checkoutButton.style.display = "block";
    }
  }

  function toggleCart() {
    elements.cartDetails.style.display =
      elements.cartDetails.style.display === "none" ? "flex" : "none";
  }

  function handleKeydown(event) {
    if (event.key === "Escape" && elements.lightbox.style.display === "flex") {
      closeLightbox();
    }
  }

  function updateThumbnails(images) {
    galleryThumbnailsContainer.innerHTML = "";
    lightboxThumbnailsContainer.innerHTML = "";
    images.forEach((img, index) => {
      const thumb = createThumbnail(img.secure_url, index);
      thumb.addEventListener("click", () => {
        currentIndex = index;
        updateMainImage(currentIndex);
        updateActiveThumbnail(index);
      });
      elements.galleryThumbnailsContainer.appendChild(thumb);
      elements.lightboxThumbnailsContainer.appendChild(thumb.cloneNode(true));
    });
  }

  function updateActiveThumbnail(index) {
    const thumbnails = document.querySelectorAll(".thumbnail");
    thumbnails.forEach((thumb) => {
      thumb.classList.toggle("active", parseInt(thumb.dataset.index) === index);
    });
  }

  function createThumbnail(imageSrc, index) {
    const thumb = document.createElement("img");
    thumb.className = "thumbnail";
    thumb.src = imageSrc;
    thumb.dataset.index = index;
    return thumb;
  }

  function navigateSlide(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = images.length - 1;
    if (currentIndex >= images.length) currentIndex = 0;
    updateMainImage(currentIndex);
  }

  function openLightbox() {
    elements.lightbox.style.display = "flex";
    elements.lightboxMainImage.src = elements.mainProductImage.src;
    updateMainImage(currentIndex);
  }

  function closeLightbox() {
    elements.lightbox.style.display = "none";
  }

  function navigateLightbox(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = images.length - 1;
    if (currentIndex >= images.length) currentIndex = 0;
    elements.lightboxMainImage.src = images[currentIndex];
    updateActiveThumbnail(currentIndex);
  }

  function updateMainImage(index) {
    elements.mainProductImage.src = images[index];
    updateActiveThumbnail(index);
  }
});
