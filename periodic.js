const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer-core");
const productModel = require("./Schema/productSchema");

const checkPriceDrop = async (product) => {
  try {
    // Connect to the browser
    const browser = await puppeteer.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // Correct path for Chrome
    });

    const url = product.product_url;
    const page = await browser.newPage();

    // Navigate to the product page and wait until it is loaded
    await page.goto(url, { waitUntil: "load", timeout: 0 });

    const priceSelector = ".CxhGGd"; // CSS selector for price
    const price = await page.$eval(priceSelector, (el) => el.innerText);

    // Clean the price and convert it to a number
    const actual_price = parseFloat(price.replace(/[₹,]/g, ""));

    console.log(`The price of the product is ₹${actual_price}, and the limit price is ₹${product.price_limit}`);

    // Send email if the price is less than or equal to the price limit
    if (actual_price <= product.price_limit) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: "harshithraiharsu@gmail.com", // Change this to the user's email
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
        console.log("Price alert email sent successfully.");
      } catch (error) {
        console.error("Error sending email:", error.message);
      }
    }

    await browser.close(); // Close the browser
  } catch (error) {
    console.error("Error checking price:", error.message);
  }
};

module.exports = checkPriceDrop;
