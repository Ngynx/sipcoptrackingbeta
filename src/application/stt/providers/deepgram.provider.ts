import { Injectable } from '@nestjs/common';
import { createClient, DeepgramClient, DeepgramResponse, SyncPrerecordedResponse } from '@deepgram/sdk';
import * as fs from 'fs'; // Necesario para leer archivos locales (opcional)
import { IResponseDeepGramService } from '../interface/response.interface';

@Injectable()
export class DeepGramProvider {
    private deepgram: DeepgramClient;
    private dirname: string;
    constructor() {
        this.dirname = "./src/shared/utils/";
        let keyValue: string = process.env.DEEPGRAM_API_KEY ?? "6dc8c25726c6f0e0d0c3809188a70795a9eb73d8";
        this.deepgram = createClient(keyValue, {
            listen: { fetch: { options: { url: "https://api.deepgram.com/v1/listen" } } },
        });
    }

    /**
     * Transcribes a local audio file using the Deepgram API.
     *
     * @param {string} filePath - The relative path to the audio file to be transcribed.
     * @returns {Promise<DeepgramResponse<IResponseDeepGramService>>} - A promise that resolves to an object containing the transcription result or an error.
     *
     * The function reads an audio file from the specified path, sends it to the Deepgram API for transcription, and returns the transcription result.
     * The transcription includes metadata such as request ID, creation time, duration, model information, transcript text, confidence score, detected language, and language confidence.
     *
     * The function uses the "nova-2-general" model and supports language detection, intents, punctuation, and smart formatting.
     *
     * @throws {Error} - Throws an error if the transcription process fails.
     */
    async transcribeAudioFromFile(filePath: string): Promise<DeepgramResponse<IResponseDeepGramService>> {
        try {
            const audio = fs.readFileSync(this.dirname+filePath);
            const { result, error } = await this.deepgram.listen.prerecorded.transcribeFile(audio, {
                model: "nova-2-general",
                language: "es-419",
                detect_language: true,
                intents: true,
                punctuate: true,
                smart_format: true
            });
            if(error) {
                return { result: null, error };
            };
            return {
                result: {
                    request_id: result ? result.metadata.request_id : null,
                    created: result.metadata.created ? result.metadata.created : null,
                    duration: result.metadata.duration ? result.metadata.duration : null,
                    model_info: result.metadata.model_info ? result.metadata.model_info : null,
                    transcript: result.results.channels[0].alternatives[0].transcript ? result.results.channels[0].alternatives[0].transcript : null,
                    confidence: result.results.channels[0].alternatives[0].confidence ? result.results.channels[0].alternatives[0].confidence : null,
                    detected_language: result.results.channels[0].detected_language ? result.results.channels[0].detected_language : null,
                    language_confidence: result.results.channels[0].language_confidence ? result.results.channels[0].language_confidence : null
                },
                error: null
            };

        } catch (e) {
            console.error('Ocurred an error:', e);
            throw new Error(e);
        }
    };


    async transcribeAudioFromUrl(audioUrl: string): Promise<DeepgramResponse<IResponseDeepGramService>> {
        try {
            const { result, error } = await this.deepgram.listen.prerecorded.transcribeUrl({ url: audioUrl }, {
                model: "nova-2-general",
                language: "es-419",
                detect_language: true,
                intents: true,
                punctuate: true,
                smart_format: true
            });
            if(error) {
                return { result: null, error };
            };
            return {
                result: {
                    request_id: result ? result.metadata.request_id : null,
                    created: result.metadata.created ? result.metadata.created : null,
                    duration: result.metadata.duration ? result.metadata.duration : null,
                    model_info: result.metadata.model_info ? result.metadata.model_info : null,
                    transcript: result.results.channels[0].alternatives[0].transcript ? result.results.channels[0].alternatives[0].transcript : null,
                    confidence: result.results.channels[0].alternatives[0].confidence ? result.results.channels[0].alternatives[0].confidence : null,
                    detected_language: result.results.channels[0].detected_language ? result.results.channels[0].detected_language : null,
                    language_confidence: result.results.channels[0].language_confidence ? result.results.channels[0].language_confidence : null
                },
                error: null
            };

        } catch (e) {
            console.error('Ocurred an error:', e);
            throw new Error(e);
        }
    };
}