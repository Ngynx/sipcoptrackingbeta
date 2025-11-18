import { Body, Controller, Get, Param, Post, Req, Res } from "@nestjs/common";
import { PuppeteerService } from "./puppeteer.service";
import { existsSync } from "fs";

@Controller("puppeteer")
export class PuppeteerController {
    constructor(
        private readonly puppeteerService: PuppeteerService
    ) {}

	@Get('getIP')
	async getIPAddress(
		@Req() req: any,
		@Res() res: any
	) {
		try {
			const data = await this.puppeteerService.getIPAddress(req);
			res.status(200);
			return res.json({
				success: true,
				data: data,
				message: "IP address retrieved successfully"
			});
		} catch (error) {
			console.log(error);
			res.status(400);
			return res.json({
				success: false,
				data: null,
				message: 'Error!'
			});
		}
	}

	@Get('getLocationByIP/')
	async getLocationByIP(
		// @Param("id") id: string,
		@Res() res: any,
		@Req() req: any
	) {
		try {
			const data = await this.puppeteerService.getLocationByIPMaxMindProvider(req);
			res.status(200);
			return res.json({
				success: true,
				data: data,
				message: "IP address retrieved successfully"
			});
		} catch (error) {
			console.log(error);
			res.status(400);
			return res.json({
				success: false,
				data: null,
				message: 'Error!'
			});
		}
	}

    @Post('indeedPage')
	async indeedPage(
		@Res() res: any
	) {
		try {
			const data = await this.puppeteerService.scrapeJobList();
			res.status(200);
			return res.json({
				success: true,
				data: true,
				message: "true"
			});
		} catch (error) {
			console.log(error);
			res.status(400);
			return res.json({
				success: false,
				data: null,
				message: 'Error!'
			});
		}
	}

    @Get('getImage/:imgpath')
    getUploadedFile(
        @Param('imgpath') image: string,
        @Res() res
    ){
        try {
            const existFile: boolean = existsSync("./" + image);
            if(!existFile) return res.sendFile('no-image.png', { root: "./" });
            return res.sendFile(image, { root: './' });
        } catch (error) {
            console.log(error);
            return res.sendFile('no-image.png', { root: './' });
        }
    }

	// ## turfjs
	@Post('verifyPointTf')
	async verifyPointTf(
		@Body() dto: {point: any},
		@Res() res: any,
	) {
		try {
			const data = await this.puppeteerService.findMatchingPolygon(dto);
			console.log("rsp: ", data);
			res.status(200);
			return res.json({
				success: true,
				data: data,
				message: "true"
			});
		} catch (error) {
			console.log(error);
			res.status(400);
			return res.json({
				success: false,
				data: null,
				message: 'Error!'
			});
		}
	}
}