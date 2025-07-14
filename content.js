// const getActiveTabURL = async () => {
//   return new Promise((resolve, reject) => {
//     chrome.runtime.sendMessage({ action: "getActiveTabURL" }, (response) => {
//       if (response && response.url) {
//         resolve(response.url);
//       } else {
//         reject("Failed to get active tab URL");
//       }
//     });
//   });
// };

// const start = async () => {
//   // Helper function to get all listed items
//   const getAllListedItems = async () => {
//     return new Promise((resolve) => {
//       chrome.storage.sync.get(["products"], (obj) => {
//         resolve(obj["products"] ? JSON.parse(obj["products"]) : []);
//       });
//     });
//   };

//   // Helper function to check if a product is already in storage
//   const isProductInStorage = async (productName) => {
//     const listedItems = await getAllListedItems();
//     return listedItems.some((product) => product.product_name === productName);
//   };

//   // Create the "Set Price Alert" button
//   const addButton = document.createElement("button");
//   addButton.innerText = "Set Price Alert";
//   addButton.classList.add("price-alert-button");

//   const priceInput = document.createElement("input");
//   priceInput.type = "number";
//   priceInput.placeholder = "Enter your desired price limit";
//   priceInput.classList.add("price-limit-input");

//   const button=document.createElement("button");
//   button.innerText="please work"
//   const adjacentElem = document.querySelector(".VU-ZEz");
//   adjacentElem.insertAdjacentElement("afterend",button)
//   button.onclick=()=>{
//     alert("hello")
//   }
//   const productName = document.querySelector(".VU-ZEz")?.innerText;  
//   const productSrc = document.querySelector(".jLEJ7H")?.src;
//   const productPrice = document.querySelector(".CxhGGd").innerText;

//   // Check if the product is already being monitored
//   const productExists = await isProductInStorage(productName);

//   if (productExists) {
//     // If the product is already being monitored
//     addButton.innerText = "Price Monitoring Enabled";
//     addButton.style.background = "none"; 
//     addButton.style.backgroundColor = "#ffc107"; // Goldish color
//     addButton.disabled = true;
//     adjacentElem.insertAdjacentElement("afterend", addButton);
//   } else {
//     // If the product is not being monitored
//     adjacentElem.insertAdjacentElement("afterend", priceInput);
//     adjacentElem.insertAdjacentElement("afterend", addButton);

//     const getEmail = async () => {
//       const { userEmail } = await chrome.storage.sync.get("userEmail");
//       if (userEmail) {
//         console.log(userEmail);
//         return userEmail;
//       }

//       const email = prompt("Please Enter Your Email to get Alerts");
//       if (!email) throw new Error("no Email provided");
//       await chrome.storage.sync.set({ userEmail: email });
//       return email;
//     };

//     // Add event listener to the button
//     addButton.addEventListener("click", async () => {
//       addButton.innerText = "Enabling alert...";
//       let email;
//       try {
//         email = await getEmail();
//         console.log(email);
//       } catch (error) {
//         console.log(error.message);
//       }
//       const priceLimit = priceInput.value; // Get the price limit entered by the user

//       if (!priceLimit) {
//         alert("Please enter a valid price limit.");
//         return;
//       }

//       const tab_url = await getActiveTabURL();
//       await fetch("http://localhost:3000/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           product_name: productName,
//           product_url: tab_url,
//           price_limit: Number(priceLimit),
//           userEmail: email,
//         }),
//       })
//         .then((response) => response.json()) // Parse the JSON response
//         .then(async (data) => {
//           console.log("Product added successfully", data);
//           priceInput.style.display = "none";
//           addButton.innerText = "Price Monitoring Enabled";
//           addButton.style.background = "none"; // removes gradient
//           addButton.style.backgroundColor = "#ffc107"; // now this works

//           addButton.disabled = true;

//           const newProduct = {
//             product_name: productName,
//             product_src: productSrc,
//             product_price: productPrice,
//             price_limit: priceLimit, // Add the price limit to the product object
//           };
//           const listedItems = await getAllListedItems();
//           console.log("listed items", listedItems);

//           chrome.storage.sync.set({
//             ["products"]: JSON.stringify([...listedItems, newProduct]),
//           });
//         })
//         .catch((error) => {
//           addButton.innerText = "⚠️ Something went wrong";
//           addButton.disabled = true;
//           addButton.style.backgroundColor = "#dc3545"; // danger red

//           setTimeout(() => {
//             addButton.innerText = "🔁 Retry Enabling Alert";
//             addButton.disabled = false;
//             addButton.style.backgroundColor = "#4CAF50"; // green again
//           }, 2500);

//           console.error("There was an error!", error);
//         });

//       // Hide the input field and change button appearance
//     });
//   }
// };

// // Call the start function to initialize
// start();
const getActiveTabURL = async () => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "getActiveTabURL" }, (response) => {
      if (response && response.url) {
        resolve(response.url);
      } else {
        reject("Failed to get active tab URL");
      }
    });
  });
};

const start = async () => {
  // Helper function to get all listed items
  const getAllListedItems = async () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["products"], (obj) => {
        resolve(obj["products"] ? JSON.parse(obj["products"]) : []);
      });
    });
  };

  // Helper function to check if a product is already in storage
  const isProductInStorage = async (productName) => {
    const listedItems = await getAllListedItems();
    return listedItems.some((product) => product.product_name === productName);
  };

  // Create the "Set Price Alert" button
  const addButton = document.createElement("button");
  addButton.innerText = "Set Price Alert";
  addButton.classList.add("price-alert-button");

  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.placeholder = "Enter your desired price limit";
  priceInput.classList.add("price-limit-input");

  const container=document.createElement("div")
  container.classList.add("container")

  container.appendChild(priceInput)
  container.appendChild(addButton)
  const adjacentElem = document.querySelector(".VU-ZEz");
  adjacentElem.insertAdjacentElement("afterend",container)
  const productName = document.querySelector(".VU-ZEz")?.innerText;  
  const productSrc = document.querySelector(".jLEJ7H")?.src;
  const productPrice = document.querySelector(".CxhGGd").innerText;

  // Check if the product is already being monitored
  const productExists = await isProductInStorage(productName);

  if (productExists) {
    // If the product is already being monitored
    addButton.innerText = "Price Monitoring Enabled";
    addButton.style.background = "none"; 
    addButton.style.backgroundColor = "#ffc107"; // Goldish color
    addButton.disabled = true;
    priceInput.classList.add("hidden")
    // adjacentElem.insertAdjacentElement("afterend", addButton);
  } else {
    // If the product is not being monitored
    adjacentElem.insertAdjacentElement("afterend", priceInput);
    adjacentElem.insertAdjacentElement("afterend", addButton);

    const getEmail = async () => {
      const { userEmail } = await chrome.storage.sync.get("userEmail");
      if (userEmail) {
        console.log(userEmail);
        return userEmail;
      }

      const email = prompt("Please Enter Your Email to get Alerts");
      if (!email) throw new Error("no Email provided");
      await chrome.storage.sync.set({ userEmail: email });
      return email;
    };

    // Add event listener to the button
    addButton.addEventListener("click", async () => {
      addButton.innerText = "Enabling alert...";
      let email;
      try {
        email = await getEmail();
        console.log(email);
      } catch (error) {
        console.log(error.message);
      }
      const priceLimit = priceInput.value; // Get the price limit entered by the user

      if (!priceLimit) {
        alert("Please enter a valid price limit.");
        return;
      }

      const tab_url = await getActiveTabURL();
      await fetch("https://alertify-6agi.onrender.com/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_name: productName,
          product_url: tab_url,
          price_limit: Number(priceLimit),
          userEmail: email,
        }),
      })
        .then((response) => response.json()) // Parse the JSON response
        .then(async (data) => {
          console.log("Product added successfully", data);
          priceInput.style.display = "none";
          addButton.innerText = "Price Monitoring Enabled";
          addButton.style.background = "none"; // removes gradient
          addButton.style.backgroundColor = "#ffc107"; // now this works

          addButton.disabled = true;

          const newProduct = {
            product_name: productName,
            product_src: productSrc,
            product_price: productPrice,
            price_limit: priceLimit, // Add the price limit to the product object
          };
          const listedItems = await getAllListedItems();
          console.log("listed items", listedItems);

          chrome.storage.sync.set({
            ["products"]: JSON.stringify([...listedItems, newProduct]),
          });
        })
        .catch((error) => {
          addButton.innerText = "⚠️ Something went wrong";
          addButton.disabled = true;
          addButton.style.backgroundColor = "#dc3545"; // danger red

          setTimeout(() => {
            addButton.innerText = "🔁 Retry Enabling Alert";
            addButton.disabled = false;
            addButton.style.backgroundColor = "#4CAF50"; // green again
          }, 2500);

          console.error("There was an error!", error);
        });

      // Hide the input field and change button appearance
    });
  }
};

// Call the start function to initialize
start();
