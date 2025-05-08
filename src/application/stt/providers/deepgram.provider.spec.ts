import { Test, TestingModule } from '@nestjs/testing';
import { DeepGramProvider } from './deepgram.provider';
import * as fs from 'fs';
import { createClient, DeepgramClient } from '@deepgram/sdk';

jest.mock('fs');
jest.mock('@deepgram/sdk', () => {
    return {
        createClient: jest.fn(() => ({
            listen: {
                prerecorded: {
                    transcribeFile: jest.fn(),
                    transcribeUrl: jest.fn()
                }
            }
        }))
    }
});

describe('DeepGramProvider', () => {
    let provider: DeepGramProvider;
    let mockDeepgramClient;
    let dirname: string;


    // let keyValue = "2345d97027a6ba54e6606033cd94cdfef85f0b43"
    // let mockDeepgramClient: DeepgramClient = createClient(keyValue, {
    //     listen: { fetch: { options: { url: "https://api.deepgram.com/v1/listen" } } },
    // });;

    beforeEach(async () => {
        // Reset all mocks
        jest.clearAllMocks();
        // 
        mockDeepgramClient = {
            listen: {
                prerecorded: {
                    transcribeFile: jest.fn().mockRejectedValue({
                        result: { transcription: 'mocked file transcription' }
                    }),
                    transcribeUrl: jest.fn().mockResolvedValue({
                        result: { transcription: 'mocked url transcription' }
                    })
                }
            }
        };

        (DeepgramClient as unknown as jest.Mock).mockReturnValue(mockDeepgramClient);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                // DeepGramProvider,
                {
                    provide: DeepGramProvider,
                    useFactory: () => new DeepGramProvider("keyValue", {
                        listen: { fetch: { options: { url: "https://api.deepgram.com/v1/listen" } } },
                    })
                }
            ],
        }).compile();

        provider = module.get<DeepGramProvider>(DeepGramProvider);
        dirname = "./src/shared/utils/";
    });

    it('should transcribe audio from file successfully', async () => {
        const mockAudioBuffer = Buffer.from('mock audio data');
        const mockFilePath = "pruebaaudio2.mp3";
        const mockResponse = {
            metadata: {
                request_id: 'dfbdaaac-9cef-4f1a-9fd8-5ce72b8bde12',
                created: '2025-03-10T18:44:35.204Z',
                duration: 2.933313,
                model_info: {
                    "1abfe86b-e047-4eed-858a-35e5625b41ee": {
                        "name": "2-general-nova",
                        "version": "2024-01-06.5664",
                        "arch": "nova-2"
                    }
                },
            },
            results: {
                channels: [{
                    alternatives: [{
                        transcript: 'mock audio data',
                        confidence: 0.95
                    }],
                    detected_language: 'es',
                    language_confidence: 0.99
                }]
            }
        };

        (fs.readFileSync as jest.Mock).mockReturnValue(mockAudioBuffer);
        mockDeepgramClient.listen.prerecorded.transcribeFile.mockImplementation(() => { Promise.resolve(mockResponse) });

        const result = await provider.transcribeAudioFromFile(mockFilePath);

        expect(fs.readFileSync).toHaveBeenCalledWith('./src/shared/utils/' + mockFilePath);
        // expect(mockDeepgramClient.listen.prerecorded.transcribeFile).toHaveBeenCalledWith(mockAudioBuffer, expect.any(Object));
        // expect(result.result.transcript).toBe('mock transcript');
        // expect(result.error).toBeNull();
    });

    // it('should handle errors during transcription from file', async () => {
    //     const mockFilePath = 'test/audio.mp3';
    //     const mockError = new Error('Transcription error');

    //     (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('mock audio data'));
    //     mockDeepgramClient.listen.prerecorded.transcribeFile.mockRejectedValue(mockError);

    //     await expect(provider.transcribeAudioFromFile(mockFilePath)).rejects.toThrow('Transcription error');
    // });

    // it('should transcribe audio from URL successfully', async () => {
    //     const mockAudioUrl = 'https://dpgr.am/spacewalk.wav';
    //     const mockResponse = {
    //         metadata: {
    //             request_id: '12345',
    //             created: '2023-10-01T00:00:00Z',
    //             duration: 60,
    //             model_info: {},
    //         },
    //         results: {
    //             channels: [{
    //                 alternatives: [{
    //                     transcript: "Yeah. As as much as, it's worth celebrating, the first, spacewalk, with an all female team, I think many of us are looking forward to it just being normal. And, I think if it signifies anything, it is, to honor the the women who came before us who, were skilled and qualified, and didn't get, the same opportunities that we have today",
    //                     confidence: 0.9982351
    //                 }],
    //                 detected_language: 'en',
    //                 language_confidence: 0.99292874
    //             }]
    //         }
    //     };

    //     mockDeepgramClient.listen.prerecorded.transcribeUrl.mockResolvedValue({ result: mockResponse, error: null });

    //     const result = await provider.transcribeAudioFromUrl(mockAudioUrl);

    //     expect(mockDeepgramClient.listen.prerecorded.transcribeUrl).toHaveBeenCalledWith({ url: mockAudioUrl }, expect.any(Object));
    //     expect(result.result.transcript).toBe('mock transcript');
    //     expect(result.error).toBeNull();
    // });

    // it('should handle errors during transcription from URL', async () => {
    //     const mockAudioUrl = 'https://dpgr.am/spacewalk.wav';
    //     const mockError = new Error('Transcription error');

    //     mockDeepgramClient.listen.prerecorded.transcribeUrl.mockRejectedValue(mockError);

    //     await expect(provider.transcribeAudioFromUrl(mockAudioUrl)).rejects.toThrow('Transcription error');
    // });
});


//** INTERFACES */
// [General response]

// interface SyncPrerecordedResponse {
//     metadata: {
//       transaction_key: string,
//       request_id: string;
//       created: string;
//       duration: number;
//       sha256: string;
//       channels: number;
//       models: string[];
//       model_info: any;
//       warnings: any;
//     };
//     results: {
//       channels: [
//         {
//           alternatives: [
//             {
//               transcript: string;
//               confidence: number;
//               words: WordBase[];
//               paragraphs?: ParagraphGroup;
//             }
//           ],
//           detected_language: string,
//           language_confidence: number
//         }
//       ]
//     };
//   }
  
  
  
//   interface WordBase {
//     word: string;
//     start: number;
//     end: number;
//     confidence: number;
//     punctuated_word?: string;
//     speaker?: number;
//     speaker_confidence?: number;
//     language?: string;
//   }
  
//   interface ParagraphGroup {
//     transcript: string;
//     paragraphs: Paragraph[];
//   }
  
//   interface Paragraph {
//     sentences: Sentence[];
//     start: number;
//     end: number;
//     num_words: number;
//     speaker?: number;
//   }
  
//   interface Sentence {
//     text: string;
//     start: number;
//     end: number;
//   }
  
  
//   // Example: 
//   const Json: SyncPrerecordedResponse = {
//     "metadata": {
//         "transaction_key": "deprecated",
//         "request_id": "73df9956-fd3b-4d71-95ab-48f355da84e4",
//         "sha256": "17db58fd21c2dd692fa2719b5b76a307660dad6a69f065fa82b5c2275e3e567e",
//         "created": "2025-03-10T16:02:15.267Z",
//         "duration": 2.496,
//         "channels": 1,
//         "models": [ "4f82af92-7749-4465-92ad-3db204bc8e03" ],
//         "model_info": { "4f82af92-7749-4465-92ad-3db204bc8e03": ["Object"] },
//         "warnings": [ ["Object"] ]
//     },
//     "results": {
//         "channels": [
//             {
//                 "alternatives": [
//                     {
//                         "transcript": "Prueba de audio uno dos tres.",
//                         "confidence": 0.99079096,
//                         "words": [
//                             {
//                                 "word": "prueba",
//                                 "start": 0.56,
//                                 "end": 0.96,
//                                 "confidence": 0.81066793,
//                                 "punctuated_word": "Prueba"
//                             },
//                             {
//                                 "word": "de",
//                                 "start": 0.96,
//                                 "end": 1.1999999,
//                                 "confidence": 0.9992305,
//                                 "punctuated_word": "de"
//                             },
//                             {
//                                 "word": "audio",
//                                 "start": 1.1999999,
//                                 "end": 1.4399999,
//                                 "confidence": 0.9975055,
//                                 "punctuated_word": "audio"
//                             },
//                             {
//                                 "word": "uno",
//                                 "start": 1.4399999,
//                                 "end": 1.68,
//                                 "confidence": 0.5747229,
//                                 "punctuated_word": "uno"
//                             },
//                             {
//                                 "word": "dos",
//                                 "start": 1.68,
//                                 "end": 1.92,
//                                 "confidence": 0.9548617,
//                                 "punctuated_word": "dos"
//                             },
//                             {
//                                 "word": "tres",
//                                 "start": 1.92,
//                                 "end": 2.42,
//                                 "confidence": 0.99079096,
//                                 "punctuated_word": "tres."
//                             }
//                         ],
//                         "paragraphs": {
//                             "transcript": "\nPrueba de audio uno dos tres.",
//                             "paragraphs": [
//                                 {
//                                     "sentences": [
//                                         {
//                                             "text": "Prueba de audio uno dos tres.",
//                                             "start": 0.56,
//                                             "end": 2.42
//                                         }
//                                     ],
//                                     "num_words": 6,
//                                     "start": 0.56,
//                                     "end": 2.42
//                                 }
//                             ]
//                         }
//                     }
//                 ],
//                 "detected_language": "es",
//                 "language_confidence": 0.9875478
//             }
//         ]
//     }
//   }


// // [error]
// interface IErrorDeepGram {
//     err_code: string;
//     err_msg: string;
//     request_id: string;
//     status?: number;
//     __dgError: any
// }

// const errorTest = {
//     "err_code": "INVALID_AUTH",
//     "err_msg": "Invalid credentials.",
//     "request_id": "c099569d-75d4-4dc1-b860-0fee0d1bd015"
// }

// // __dgError: true,
// // status: 401