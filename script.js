const addnewProduct = (product) => {
  const main_element = document.querySelector(".main");
  // Create a container for the product
  const productContainer = document.createElement("div");
  productContainer.classList.add("product-container");

  // Add product image
  const productImage = document.createElement("img");
  productImage.classList.add("product-image");
  productImage.src = product.product_src;
  productImage.alt = product.product_name;

  // Create a div to contain product name and price
  const productDetails = document.createElement("div");
  productDetails.classList.add("product-details");

  // Add product name
  const productName = document.createElement("p");
  productName.classList.add("product-name");
  productName.textContent = truncateProductName(product.product_name);

  // Add product price
  const productPrice = document.createElement("p");
  productPrice.classList.add("product-price");
  productPrice.textContent = `Price: ${product.product_price}`;

  const limit_price = document.createElement("p");
  limit_price.classList.add("product-price");
  limit_price.textContent = `limit: ${product.price_limit}`;

  const priceLimitContainer = document.createElement("div");
  priceLimitContainer.classList.add("price-limit-container");

  // Add product price and limit to the container
  priceLimitContainer.appendChild(productPrice);
  priceLimitContainer.appendChild(limit_price);

  // Append the container to product details
  productDetails.appendChild(priceLimitContainer);
  // Append product name and price to product details
  productDetails.appendChild(productName);
  productDetails.appendChild(priceLimitContainer);

  // add the delete button
  const delete_button = document.createElement("img");
  delete_button.src = "assets/delete.png";
  delete_button.classList.add("delete-button");

  // Append product details and image to the container
  productContainer.appendChild(productImage);
  productContainer.appendChild(productDetails);
  productContainer.appendChild(delete_button);
  // Append the container to the main element
  main_element.appendChild(productContainer);

  //   delete a product
  delete_button.addEventListener("click", async () => {
    productContainer.remove();
  
    // Fetch all stored products
    const all_products = await getAllAlerts();
  
    const remaining_products = all_products.filter(
      (prod) => prod.product_name !== product.product_name
    );
  
    // Update the storage with the remaining products
    chrome.storage.sync.set({ ["products"]: JSON.stringify(remaining_products) });
    await fetch("https://alertify-6agi.onrender.com/api/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_name: product.product_name,
      }),
    })
      .then((response) => response.json())  // Parse the JSON response
      .then((data) => {
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  });
  
};

// Helper function to truncate product name
const truncateProductName = (name) => {
  return name.length > 20
    ? name.split(" ").slice(0, 3).join(" ") + "..."
    : name;
};

const showAllAlert = (currentAlerts = []) => {
  const main_element = document.querySelector(".main");
  main_element.innerHTML = ""; // Clear existing content

  if (currentAlerts.length > 0) {
    for (let i = 0; i < currentAlerts.length; i++) {
      addnewProduct(currentAlerts[i]);
    }
  } else {
    main_element.innerHTML = `<i class="row">No Items Selected for Alerts</i>`;
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const currentAlerts = await getAllAlerts();
  showAllAlert(currentAlerts);
});

const getAllAlerts = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["products"], (data) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        const currentAlerts = data["products"]
          ? JSON.parse(data["products"])
          : [];
        resolve(currentAlerts);
      }
    });
  });
};
