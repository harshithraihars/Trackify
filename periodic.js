require("dotenv").config(); // Load environment variables
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");
const productModel = require("./Schema/productSchema");

const checkPriceDrop = async (product) => {
  try {
    // Launch Puppeteer with chrome-aws-lambda
    const browser = await puppeteer.launch({
      headless: true,
      args: chrome.args,
      executablePath: await chrome.executablePath(),
      defaultViewport: chrome.defaultViewport,
    });

    const url = product.product_url;
    const page = await browser.newPage();

    // Navigate to the product URL
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });

    const priceSelector = ".CxhGGd"; // Adjust this selector based on your target page
    const price = await page.$eval(priceSelector, (el) => el.innerText);
    const actual_price = parseFloat(price.replace(/[₹,]/g, ""));

    console.log(`Current Price of ${product.product_name}: ₹${actual_price}`);

    if (actual_price <= product.price_limit) {
      console.log(`Price drop detected for ${product.product_name}, sending email...`);

      // Configure Nodemailer transport
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL, // Use the email from the .env file
          pass: process.env.PASSWORD, // Use the password from the .env file
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: "sigmaharshrai@gmail.com", // Change this to the recipient’s email
        subject: `Price Alert: ${product.product_name}`,
        text: `Hello,

        The price of "${product.product_name}" has reached your desired limit!

        Current Price: ₹${actual_price}
        Price Limit: ₹${product.price_limit}

        Thank you for using our Price Tracker service.

        Best regards,
        The Price Tracker Team`,
      };

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);
    }

    await browser.close();
  } catch (error) {
    console.error("Error in checkPriceDrop:", error.message);
  }
};

const periodicCheck = async () => {
  try {
    console.log("Running periodic check...");
    const products = await productModel.find(); // Fetch all products from the database
    products.map((product) => {
      checkPriceDrop(product); // Check price drop for each product
    });
  } catch (error) {
    console.error("Error during periodic check:", error.message);
  }
};

module.exports = { periodicCheck };

