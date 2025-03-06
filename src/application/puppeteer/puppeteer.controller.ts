import { Controller, Get, Param, Post, Res } from "@nestjs/common";
import { PuppeteerService } from "./puppeteer.service";
import { existsSync } from "fs";

@Controller("puppeteer")
export class PuppeteerController {
    constructor(
        private readonly puppeteerService: PuppeteerService
    ) {}

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
}