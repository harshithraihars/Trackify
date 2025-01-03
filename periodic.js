const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer-core");
const productModel = require("./Schema/productSchema");
const checkPriceDrop = (product) => {
  (async () => {
    // connecting to the browser
    const browser = await puppeteer.launch({
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // Correctly escaped path
    });
    const url = product.product_url;
    const page = await browser.newPage();
    //   goes to the specified url wait untill the browser is loaded
    await page.goto(url, { waitUntil: "load", timeout: 0 });

    const priceSelector = ".CxhGGd";
    const price = await page.$eval(priceSelector, (el) => el.innerText);
    const actual_price = parseFloat(price.replace(/[₹,]/g, ""));
    //   const imageSelector = '.jLEJ7H';
    //   await page.waitForSelector(imageSelector);

    // Get the 'src' attribute of the image
    //   const imageSrc = await page.$eval(imageSelector, img => img.src);
    console.log(
      `The price of the product is ${actual_price}, limit price is ${product.price_limit}`
    );
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

    //   console.log(imageSrc)
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
