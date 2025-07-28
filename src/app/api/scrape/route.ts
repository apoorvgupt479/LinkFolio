import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function POST(request: Request) {
  let browser = null;
  try {
    const { linkedinUrl } = await request.json();

    if (!linkedinUrl) {
      return NextResponse.json({ error: 'LinkedIn URL is required' }, { status: 400 });
    }

    if (!linkedinUrl.startsWith('https://www.linkedin.com/in/')) {
      return NextResponse.json({ error: 'Invalid LinkedIn profile URL' }, { status: 400 });
    }

    // Configure Chromium for Vercel
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();
    await page.goto(linkedinUrl, { waitUntil: 'networkidle2' });

    // Basic scraping logic (this will need to be expanded based on desired data)
    const profileData = await page.evaluate(() => {
      const nameElement = document.querySelector('.top-card-layout__title');
      const headlineElement = document.querySelector('.top-card-layout__headline');
      const locationElement = document.querySelector('.top-card-layout__first-subline .top-card-layout__highlight');

      const name = nameElement ? nameElement.textContent?.trim() : null;
      const headline = headlineElement ? headlineElement.textContent?.trim() : null;
      const location = locationElement ? locationElement.textContent?.trim() : null;

      // You would add more selectors here for experience, education, skills, etc.
      // This is a simplified example.
      return { name, headline, location };
    });

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ error: 'Failed to scrape LinkedIn profile' }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
