import { Module } from "@nestjs/common";
import { DeepGramProvider } from "./providers/deepgram.provider";
import { STTController } from "./stt.controller";

@Module({
    imports: [],
    controllers: [STTController],
    providers: [DeepGramProvider],
    exports: [DeepGramProvider]
})
export class STTModule {}