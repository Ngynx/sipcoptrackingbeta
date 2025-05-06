import { Body, Controller, Post, Res, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { DeepGramProvider } from "./providers/deepgram.provider";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { fileExtFilter, RandomName } from "./utils/multer.utils";
import { DeepgramResponse } from "@deepgram/sdk";
import { IResponseDeepGramService } from "./interface/response.interface";
import { Response } from "express";

@Controller("STT")
export class STTController {
    constructor(
        private readonly deepGramService: DeepGramProvider
    ) {}


    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'audio', maxCount: 1 }
        ], {
            storage: diskStorage({
            destination: './src/shared/utils/',
            filename: RandomName,
        }),
        fileFilter: fileExtFilter,
        })
    )
    @Post('transcribeFile')
	async transcribeFile(
        @UploadedFiles() files: { audio: Express.Multer.File },
		@Res() res: Response<object>
	) {
		try {
			// console.log("file: ", files);
			const data = await this.deepGramService.transcribeAudioFromFile(files.audio[0].filename);
			res.status(data.result ? 200 : data.error["status"]);
			return res.json({
				success: data.result ? true : false,
				data: data.result ? data : data.error,
				message: data.result ? "Transcripted" : data.error.message
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


	@Post('transcribeUrlAudioFile')
	async transcribeUrlAudioFile<T>(
		@Body() dto: { url: string },
		@Res() res: Response<object>
	) {
		try {
			const data = await this.deepGramService.transcribeAudioFromUrl(dto.url);
			res.status(data.result ? 200 : data.error["status"]);
			return res.json({
				success: data.result ? true : false,
				data: data.result ? data.result : data.error.message,
				message: data.result ? "Transcripted" : data.error.message
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