import { Injectable } from "@nestjs/common";
import * as puppeteer from "puppeteer";
import maxmind, { CityResponse } from 'maxmind';


@Injectable()
export class PuppeteerService {

    private browser: puppeteer.Browser;
	private page: puppeteer.Page;

    private async iniciarPuppeteer() {
		this.browser = await puppeteer.launch({ 
			headless: true,
    		args: ['--no-sandbox', '--disable-setuid-sandbox']
		});
	}

	async getIPAddress(req: any): Promise<{reqBody: {raw: string, formatted: string}}> {
		const ip = req.ip;
		const ipHeaders = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		return {
			reqBody: {
				raw: ip,
				formatted: ip.replace('::ffff:', '')
			},
			// headers: {
			// 	raw: ipHeaders,
			// 	formatted: ipHeaders.replace('::ffff:', '')
			// }
		};
	};
	
	// db local
	async getLocationByIPMaxMindProvider(req: any) {
		const lookup = await maxmind.open<CityResponse>('geolite2city.mmdb');
		const ipAddress = await this.getIPAddress(req);
		const getWithPrefixLength = lookup.getWithPrefixLength(ipAddress.reqBody.formatted);
		return getWithPrefixLength
	}

    async cerrarNavegador() {
		await this.browser.close();
	}

    //#region Test
	async scrapeJobList() {
        const currentDate: Date = new Date();
		await this.iniciarPuppeteer();
		this.page = await this.browser.newPage();
		await this.page.setUserAgent(
			"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36"
		);
		await this.page.setViewport({ width: 1920, height: 1080 });
		const tiempoEsperaMaximo = 320000;
		await this.page.goto("https://www.indeed.com/reclutamiento", {
			timeout: tiempoEsperaMaximo,
			waitUntil: "domcontentloaded",
		});
		// const h1Text = await this.page.$eval('[class*="css-9996wd"]', (el) => el.textContent?.trim());
		// console.log("Texto capturado:", h1Text);

		// const [element] = await this.page.$("//h1[contains(text(), 'hire')]");
		// const h1Text = element ? await this.page.evaluate((el) => el.textContent.trim(), element) : "No encontrado";
		// console.log("Texto capturado:", h1Text);

		await this.page.screenshot({ path: `${currentDate.toISOString()}.png`});

        // waitNSeconds(15);
		await this.cerrarNavegador()
	}
}

export async function waitNSeconds(seconds: number) {
    if(!seconds||typeof(seconds) !== 'number') throw new Error('Seconds must be a number');
    return new Promise(resolve => {
        setTimeout(resolve, (seconds * 1000));
    });
}