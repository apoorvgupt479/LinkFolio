import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function POST(request: Request) {
  let browser = null;
  try {
    const { linkedinUrl } = await request.json();
    console.log('Received request for LinkedIn URL:', linkedinUrl);

    if (!linkedinUrl) {
      console.log('Error: LinkedIn URL is required');
      return NextResponse.json({ error: 'LinkedIn URL is required' }, { status: 400 });
    }

    if (!linkedinUrl.startsWith('https://www.linkedin.com/in/')) {
      console.log('Error: Invalid LinkedIn profile URL:', linkedinUrl);
      return NextResponse.json({ error: 'Invalid LinkedIn profile URL' }, { status: 400 });
    }

    console.log('Launching browser...');
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
      defaultViewport: { width: 1920, height: 1080 },
    });
    console.log('Browser launched. Navigating to page...');

    const page = await browser.newPage();
    await page.goto(linkedinUrl, { waitUntil: 'networkidle2', timeout: 60000 }); // Increased timeout
    console.log('Page navigated. Starting scraping...');
    await page.waitForSelector('h1', { timeout: 10000 }); // Wait for a common element to appear

    const profileData = await page.evaluate(() => {
      // Attempt to find name using multiple common selectors
      const nameElement = document.querySelector('h1.text-heading-xl') ||
                          document.querySelector('h1[data-test-id="entity-name"]') ||
                          document.querySelector('.top-card-layout__title'); // Keep original as fallback

      // Attempt to find headline
      const headlineElement = document.querySelector('.text-body-medium.break-words') ||
                              document.querySelector('.top-card-layout__headline');

      // Attempt to find location
      const locationElement = document.querySelector('span.text-body-small.inline.t-black--light.break-words') ||
                              document.querySelector('.top-card-layout__first-subline .top-card-layout__highlight');

      const name = nameElement ? nameElement.textContent?.trim() : null;
      const headline = headlineElement ? headlineElement.textContent?.trim() : null;
      const location = locationElement ? locationElement.textContent?.trim() : null;

      return { name, headline, location };
    });
    console.log('Scraping complete. Profile data:', profileData);

    return NextResponse.json(profileData);
  } catch (error: unknown) {
    console.error('Scraping error caught:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during scraping.';
    // Check for specific Puppeteer errors
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json({ error: 'Scraping timed out. LinkedIn might be blocking access or the page took too long to load.' }, { status: 500 });
    }
    if (error instanceof Error && error.message && error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
      return NextResponse.json({ error: 'Could not resolve host for LinkedIn URL. Check your internet connection or URL.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to scrape LinkedIn profile: ' + errorMessage }, { status: 500 });
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
      console.log('Browser closed.');
    }
  }
}
