const puppeteer = require("puppeteer-core");
const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const DESTINATION_PHONE_NUMBER = process.env.DESTINATION_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);
let list_items = [];

async function main() {
  let browser;
  try {
    const auth = `${process.env.BRIGHTDATA_USER}:${process.env.BRIGHTDATA_PASSWORD}`;
    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://${auth}@brd.superproxy.io:9222`,
    });
    url =
      "https://www.hermes.com/sg/en/category/women/bags-and-small-leather-goods/bags-and-clutches/#|";
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);
    await page.goto(url);
    // const selector = "product-item-name";
    // await page.waitForSelector(selector);
    // const el = await page.$(selector);
    // const text = await el.evaluate((e) => e.innerHTML);
    // console.log(text);

    const data = await page.evaluate(() => {
      const elements = Array.from(
        document.getElementsByClassName("product-item-name")
      );
      return elements.map((element) => element.textContent);
    });
    // console.log(data);
    return data;
  } catch (e) {
    console.error("run failed", e);
  } finally {
    await browser?.close();
  }
}

async function run() {
  let data = await main();
  console.log(data);
  let comparison = data.some((item) => !list_items.includes(item));
  //returns true if there are some items in data that arent inside list_data
  console.log(comparison, "comparison");
  if (comparison == true && list_items.length > 0) {
    client.messages
      .create({
        body: `current item is ${data}, compared to ${list_items} previously`,
        to: DESTINATION_PHONE_NUMBER,
        from: TWILIO_PHONE_NUMBER,
      })
      .then((message) => console.log(message.sid));
    list_items = data;
    return true;
  } else {
    list_items = data;
    return false;
  }
}

run();
