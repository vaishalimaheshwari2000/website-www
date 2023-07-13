const puppeteer = require('puppeteer');
const {user} = require('../mock-data/users/index');
const {correctData, incorrectData} = require('../mock-data/join/join');
let browser, page;
let BASE_URL = 'http://localhost:5500/join.html';
describe('testing for the join page', () => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
    });
   
    const page = await browser.newPage();
    await page.goto('http://localhost:5500/join.html');

    await page.setRequestInterception(true);

    
    page.on('request', (interceptedRequest) => {
      const url = interceptedRequest.url();
      console.log(url);
      if (url === `${BASE_URL}`) {
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/json',
          headers,
          body: JSON.stringify({...user}),
        });
      }  else {
        interceptedRequest.continue();
      }
    });

  });   

  it('testing for an input box area of introduction for correct data', async () => {

    let introductionSection = await page.$('#introduction');
    const boundingBox = await introductionSection.boundingBox();
    const x = boundingBox.x + boundingBox.width + 1; 
    const y = boundingBox.y + boundingBox.height + 1;
    await page.mouse.move(x, y);
    expect(countWords(correctData)).toEqual(100);
  
  });
  

 
});