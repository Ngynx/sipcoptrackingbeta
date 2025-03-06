import { Controller, Post, Res } from "@nestjs/common";
import { PuppeteerService } from "./puppeteer.service";

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
}