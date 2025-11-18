import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import * as puppeteer from "puppeteer";
import maxmind, { CityResponse } from 'maxmind';
import { IPLocation } from "./dto/iplocation.interface";

// #turf
import bbox from "@turf/bbox";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, points, polygon, polygons } from "@turf/helpers";
import { defaultAPData } from "./seed/prioritizedAreaData";
import { defaultGeofenceData } from "./seed/geofenceData";

@Injectable()
export class PuppeteerService<T = any> implements OnApplicationBootstrap {

	private prioritizedAreas: any;
	private geofence: any;

	private sectors: any[];

	private browser: puppeteer.Browser;
	private page: puppeteer.Page;

	constructor() {
		// this.prioritizedAreas = 
	}


	onApplicationBootstrap() {
		// throw new Error("Method not implemented.");
		const defaultData = defaultAPData();
		

		// poligono general
		const defaultD = defaultGeofenceData();
		this.geofence = defaultD;
		const formattedData = this.preparePolygonFromDB(defaultD['geometry']['coordinates']);
		const myPolygon = polygon(formattedData, {_id: "688bdc10100df03ecb145258"});
		// console.log("myPolygon: ", myPolygon);

		// sectores //
		defaultD["sectoring"].map((sector, index) => {
			const formattedSector = this.preparePolygonFromDB(sector["geometry"]["coordinates"]);
			sector["geometry"]["coordinates"] = formattedSector;
			// console.log("myPolygon: ", sector["geometry"]["coordinates"]);
		});

		const mysectors = this.prepareSectors(defaultD["sectoring"]);
		// console.log("mysectors: ", mysectors);
		this.sectors = mysectors;

		// punto
		const point: [number, number] = [-71.577300, -16.389431]; // -16.389431, -71.577300

		// areas priorizadas
		this.prioritizedAreas = defaultData["area_shifts"];


		// console.time("verify");
		const rslt = this.findSectorForPoint(point);
		// console.timeEnd("verify");
		// console.log("rslt: ", rslt);

		const isInside = booleanPointInPolygon(point, myPolygon);

		// console.log("isInside: ", isInside);
	}

	prepareSectors(rawSectors: any[]): any[] {
		// console.log("rawSectors: ", rawSectors);
		return rawSectors.map(sector => {
			const mypolygon = polygon(sector.geometry.coordinates);
			const mybbox = bbox(mypolygon);
			return {
				id: sector["_id"],
				name: sector.sector_name,
				sector_description: sector.sector_description,
				polygon: mypolygon,
				bbox: mybbox
			};
		});
	}


	preparePolygonFromDB(coordsLatLng: [number, number][][]) {
		// console.log("coordsLatLng: ", coordsLatLng);
		// const coordsLngLat = coordsLatLng.map(([lat, lng]) => [lng, lat]);
		// return coordsLngLat
		const formattedCoords: [number, number][][] = coordsLatLng.map(ring =>
		  ring.map(([lat, lng]) => [lng, lat])
		);
		return formattedCoords;
	}

	findSectorForPoint(mypoint) {
		// console.log("mypoint: ", mypoint);
		const pt = point(mypoint);
		// console.log("pt: ", pt);
		for (const sector of this.sectors) {
			const [minLon, minLat, maxLon, maxLat] = sector.bbox;

			// Prefiltro: punto dentro del bounding box
			if (
				mypoint[0] >= minLon &&
				mypoint[0] <= maxLon &&
				mypoint[1] >= minLat &&
				mypoint[1] <= maxLat
			) {
				// Verificación precisa
				if (booleanPointInPolygon(mypoint, sector.polygon)) {
					return sector;
				}
			}
		}
		return null; // No encontrado
	}




	private async iniciarPuppeteer() {
		this.browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		});
	}

	async getIPAddress(req: any): Promise<{ reqBody: { raw: string, formatted: string } }> {
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
		// console.log("getWithPrefixLength: ", getWithPrefixLength);
		const response: IPLocation = {
			city: getWithPrefixLength && getWithPrefixLength[0] ? getWithPrefixLength[0].city.names.en : null,
			country: getWithPrefixLength && getWithPrefixLength[0] ? getWithPrefixLength[0].country.names.en : null,
			location: {
				latitude: getWithPrefixLength && getWithPrefixLength[0] ? getWithPrefixLength[0].location.latitude : null,
				longitude: getWithPrefixLength && getWithPrefixLength[0] ? getWithPrefixLength[0].location.longitude : null,
				timezone: getWithPrefixLength && getWithPrefixLength[0] ? getWithPrefixLength[0].location.time_zone : null
			},
			subdivision: {
				isoCode: getWithPrefixLength && getWithPrefixLength[0].subdivisions[0] ? getWithPrefixLength[0].subdivisions[0].iso_code : null,
				name: getWithPrefixLength && getWithPrefixLength[0].subdivisions[0] ? getWithPrefixLength[0].subdivisions[0].names.en : null
			},
			ipAddress: ipAddress.reqBody.formatted,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		return response
	}

	async cerrarNavegador() {
		await this.browser.close();
	}

	//#region Test
	async scrapeJobList() {
		// const urlPage = "https://seguridadciudadana.mininter.gob.pe/sipcop-m/";
		const urlPage = "https://antigravity.google/pricing";

		const currentDate: Date = new Date();
		await this.iniciarPuppeteer();
		this.page = await this.browser.newPage();
		await this.page.setUserAgent(
			"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36"
		);
		await this.page.setViewport({ width: 1920, height: 1080 });
		const tiempoEsperaMaximo = 320000;
		await this.page.goto(urlPage, {
			timeout: tiempoEsperaMaximo,
			waitUntil: "domcontentloaded",
		});
		// const h1Text = await this.page.$eval('[class*="css-9996wd"]', (el) => el.textContent?.trim());
		// console.log("Texto capturado:", h1Text);

		// const [element] = await this.page.$("//h1[contains(text(), 'hire')]");
		// const h1Text = element ? await this.page.evaluate((el) => el.textContent.trim(), element) : "No encontrado";
		// console.log("Texto capturado:", h1Text);

		await this.page.screenshot({ path: `${currentDate.toISOString()}.png` });

		// waitNSeconds(15);
		await this.cerrarNavegador()
	}


	// ## turfjs impplementation
	async findMatchingPolygon(pointCoords) {
		console.log("dto: ", pointCoords);
		
		const shifts = this.prioritizedAreas;

		const pt = point(pointCoords["point"]);


		let bestMatch = null;

		for (const shift of shifts) {
			for (const poly of shift.polygons) {
				const turfPoly = polygon(poly.coordinates);
				// console.log('turfPoly', turfPoly);
				// console.log('bbox(turfPoly)', bbox(turfPoly));

				// 1️⃣ Filtro rápido por BBox
				const [minLng, minLat, maxLng, maxLat] = bbox(turfPoly);
				if (
					pointCoords[0] < minLng ||
					pointCoords[0] > maxLng ||
					pointCoords[1] < minLat ||
					pointCoords[1] > maxLat
				) {
					console.log("dto: ", pt);

					continue; // fuera del BBox
				}

				// console.log("booleanPointInPolygon(pt, turfPoly): ", booleanPointInPolygon(pt, turfPoly));

				// 2️⃣ Validación exacta
				if (booleanPointInPolygon(pt, turfPoly)) {
					if (
						!bestMatch ||
						this.getPriorityValue(poly.polygon_priority) >
						this.getPriorityValue(bestMatch.polygon_priority)
					) {
						bestMatch = { shift_id: shift.shift_id, ...poly };
					}
				}
			}
		}

		return bestMatch;
	};


	async raycasting(lng, lat) {
		// Definimos el punto a verificar
		const myPoint = point([lng, lat]);

		// Definimos el polígono (formato GeoJSON)
		const myPolygon = polygons(this.geofence["geometry"]["coordinates"]);
		console.log("myPolygon: ", myPolygon);

		// Verificar si el punto está dentro del polígono
		// const isInside = booleanPointInPolygon(myPoint, myPolygon);
	}

	private getPriorityValue(priority) {
		const map = { Alta: 3, Media: 2, Baja: 1 };
		return map[priority] || 0;
	}
}

export async function waitNSeconds(seconds: number) {
	if (!seconds || typeof (seconds) !== 'number') throw new Error('Seconds must be a number');
	return new Promise(resolve => {
		setTimeout(resolve, (seconds * 1000));
	});
}