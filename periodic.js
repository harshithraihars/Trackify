require("dotenv").config(); // Load environment variables from the .env file
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer"); // Full Puppeteer package
const productModel = require("./Schema/productSchema");

const checkPriceDrop = (product) => {
  (async () => {
    let executablePath = "";

    // If running locally, Puppeteer will automatically use the installed Chromium, no need to specify executablePath
    // If running in Render (or another server), specify the correct executablePath
    // if (process.env.NODE_ENV === "development") {
    //   executablePath = puppeteer.executablePath();  // Automatically fetches the local path
    // } else {
    //   executablePath = "/opt/render/.cache/puppeteer/chrome"; // Custom path for Render
    // }
    executablePath = "/opt/render/.cache/puppeteer/chrome";
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath:'/usr/bin/chromium-browser', // Use the dynamic executablePath
    });

    const url = product.product_url;
    const page = await browser.newPage();

    // Go to the specified URL and wait until the page is loaded
    await page.goto(url, { waitUntil: "load", timeout: 0 });

    const priceSelector = ".CxhGGd";
    const price = await page.$eval(priceSelector, (el) => el.innerText);
    const actual_price = parseFloat(price.replace(/[₹,]/g, ""));

    if (actual_price <= product.price_limit) {
      console.log("Email sent successfully");

      // Configure the email transporters
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL, // Use the email from the .env file
          pass: process.env.PASSWORD, // Use the password from the .env file
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: "sigmaharshrai@gmail.com", // You can customize this to the user’s email
        subject: `Price Alert: ${product.product_name}`,
        text: `Hello,

            The price of "${product.product_name}" has reached your desired limit!

            Current Price: ₹${actual_price}
            Price Limit: ₹${product.price_limit}

            Thank you for using our Price Tracker service.

            Best regards,
            The Price Tracker Team`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
      } catch (error) {
        console.log("Error sending email:", error.message);
      }
    }

    await browser.close();
  })();
};

const periodicCheck = async () => {
  const products = await productModel.find();
  products.map((product) => {
    checkPriceDrop(product);
  });
};

module.exports = { periodicCheck };
