export interface IResponseDeepGramService {
    request_id: string;
    created: string;
    duration: number;
    model_info: any;
    transcript: string;
    confidence: number;
    detected_language: string;
    language_confidence: number;
}