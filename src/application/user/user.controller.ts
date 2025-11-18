import { SipcopResponse } from "@/domain/interface/response/sipcop.interface";
import { BcryptRepositoryAdapter } from "@/infrastructure/crypto/bcrypt.adapter";
import { CreateUserUsecase } from "@/usecase/user/create.usecase";
import { BadRequestException, Body, Controller, HttpStatus, Inject, Post, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { GpsGrpcClientService } from "./client.grpc.service";
import { lastValueFrom } from "rxjs";
import { incidentMapper } from "./incident.mapper.helper";

@Controller('user')
export class UserController {
    private imei1: string;
    private imei2: number;
    private ipAddress: number;
    private idMunicipal: string; 
    private idTransmission: string;
    private idMunicipal2: string;

    private license: string;

    constructor(
        @Inject("CreateUserUsecase")
        private readonly createUserUsecase: CreateUserUsecase,

        // gRPC

        private readonly grpcClient: GpsGrpcClientService

    ) {
        this.imei1 = "863238073694293";
        // this.imei2 = 863238071032538;
        // // 
        this.ipAddress = 222222;
        this.idMunicipal = "00d63ea9-06c1-44a2-84f0-a1d7807d4398";  
        this.idTransmission = "1234567890";

        this.license = "EGU-550";


    } 

    @Post()   
    async createUser(
        
        @Res() res: Response, 
        @Body() body: any 
    ):Promise<Response<object>> {
        try { 
            
            res.status(200); 
            const data = await this.createUserUsecase.execute(body);
            return res.json({
                success: true,
                data: data,
                message: "This document has been created successfully",
            })
        } catch (error) {
            console.log(error); 
            res.status(400);
            return res.json({
                success: false,
                data: null, 
                message: error.message, 
            })
        }
    }  
     
    @Post("test/getData")  
     async getDataFromAnotherServer( 
        @Req() req: any,    
        @Body() dto: any,
        // @Res() res: Response<Partial<SipcopResponse<object>>|any> 
        @Res() res: any 
    ): Promise<Response<object>> { 
        const newDate = new Date();
        try {
            if(dto.idMunicipalidad == "" || this.idMunicipal != `${dto.idMunicipalidad}`) {
                console.log("[SERENAZGO] 40* | Identificador de Municipalidad invalido | ", dto.idMunicipalidad);
                res.status(HttpStatus.BAD_REQUEST);               
                return res.json( {
                    success: false,
                    messages: ["Identificador de Municipalidad"],
                    timestamp: newDate.toISOString(),
                    error: "Ingreso Prohibido"
                });  
            };

            if(dto.ubigeo == "" || dto.ubigeo != "040112") {
                console.log("[SERENAZGO] 40* | Ubigeo invalido | ", dto.ubigeo);
                res.status(HttpStatus.BAD_REQUEST);               
                return res.json( {
                    success: false,
                    messages: ["Ubigeo"],
                    timestamp: newDate.toISOString(),
                    error: "Ingreso Prohibido"
                });  
            };

            if(dto.imei == "" || this.imei1 != dto.imei) {
                console.log("[SERENAZGO] 40* | IMEI invalido | ", dto.imei, "type: ", typeof(dto.imei));
                res.status(HttpStatus.BAD_REQUEST);                
                return res.json( {   
                    success: false,
                    messages: ["IMEI no valido: ", dto.imei],
                    timestamp: newDate.toISOString(),
                    error: "Ingreso Prohibido" 
                });
            };

            if(dto.placa == "" || this.license != dto.placa) {
                console.log("[SERENAZGO] 40* | Licencia invalido | ", dto.imei);
                res.status(HttpStatus.BAD_REQUEST);                
                return res.json( {   
                    success: false,
                    messages: ["licencia no valido: ", dto.imei],
                    timestamp: newDate.toISOString(),
                    error: "Ingreso Prohibido"
                });
            };
 
            console.log("[SERENAZGO] State 20*", newDate.toISOString(), "DTO: ", dto);
            return res.status(HttpStatus.CREATED).send();
            // if(dto.imei == (this.imei1.toString())) { 
            // } else {
            //     console.log("40*");
            //     // throw new BadRequestException(); 
            //     res.status(HttpStatus.BAD_REQUEST);               
            //     return res.json( {   
            //         success: false,
            //         messages: ["Identificador de Municipalidad, Ubigeo, Placa e IMEI no validos: 495268a2-acc0-45a8-bf7f-20dc61c64|101115|EAH - 282|359632109283942"],
            //         timestamp: newDate.toISOString(),
            //         error: "Ingreso Prohibido"
            //     });
            // };
            // return res.status(HttpStatus.UNAUTHORIZED).send();
            // res.status(401); 
            // return res.json({ 
            //     success: false,      
            //     data: "Unauthorized", 
            //     message: "Unauthorized"   
            // })   
        } catch (error) {   
            console.log(error);
            throw new BadRequestException();
            // return res.status(HttpStatus.BAD_REQUEST).send();
            // res.status(400);
            // return res.json({
            //     success: false, 
            //     data: null,
            //     error: "Error",
            //     timestamp: newDate.toISOString(),
            //     messages: error,
            // })   
        }  
    }

    @Post("test/policiaData") 
     async getPoliciaDataFromAnotherServer(
        @Req() req: any,   
        @Body() dto: any,
        @Res() res: any 
    ): Promise<Response<object>> { 
        const newDate = new Date();
        try {
            if(this.idTransmission != dto.idTransmision) {
                console.log("[POLICE] 40* | Identificador de transmision invalido | ", dto.idTransmision);
                res.status(HttpStatus.BAD_REQUEST);               
                return res.json( { 
                    success: false,
                    messages: ["Identificador de Municipalidad"],
                    timestamp: newDate.toISOString(),
                    error: "Ingreso Prohibido"
                });
            };

            // if(this.imei2 != dto.imei) {
            //     console.log("40* | IMEI invalido | ", dto.imei);
            //     res.status(HttpStatus.BAD_REQUEST);               
            //     return res.json( {   
            //         success: false,
            //         messages: ["Placa e IMEI no validos: 495268a2-acc0-45a8-bf7f-20dc61c64|101115|EAH - 282|359632109283942"],
            //         timestamp: newDate.toISOString(),
            //         error: "Ingreso Prohibido" 
            //     });
            // };

            console.log("[POLICE] State 20*", newDate.toISOString(), "DTO: ", dto);
            return res.status(HttpStatus.CREATED).send();
            // if(dto.imei == (this.imei1.toString())) {
            // } else {
            //     console.log("40*");
            //     // throw new BadRequestException();  
            //     res.status(HttpStatus.BAD_REQUEST);               
            //     return res.json( {   
            //         success: false,
            //         messages: ["Identificador de Municipalidad, Ubigeo, Placa e IMEI no validos: 495268a2-acc0-45a8-bf7f-20dc61c64|101115|EAH - 282|359632109283942"],
            //         timestamp: newDate.toISOString(),
            //         error: "Ingreso Prohibido"
            //     });
            // };
            // return res.status(HttpStatus.UNAUTHORIZED).send();
            // res.status(401); 
            // return res.json({
            //     success: false,     
            //     data: "Unauthorized",
            //     message: "Unauthorized"   
            // }) 
        } catch (error) {   
            console.log(error);
            throw new BadRequestException();
            // return res.status(HttpStatus.BAD_REQUEST).send();
            // res.status(400);
            // return res.json({
            //     success: false, 
            //     data: null,
            //     error: "Error",
            //     timestamp: newDate.toISOString(),
            //     messages: error,
            // })   
        }  
    }

    @Post('grpc/deltadispatch')
     async sendDataTosipcop(
        @Req() req: any,    
        @Body() dto: any,
        @Res() res: any 
    ): Promise<Response<object>> {
        try { 
            // const result = await this.grpcClient.enviarDatoSimple()
            const incident = incidentMapper.map(dto.payload); 
            const result2 = await this.grpcClient.sendIncidentData(incident);
            return res.json({
                status: true,
                data: "",
                message: "Data sended!"
            })
        } catch (error) {
            console.log(error);
        }
    }

} 