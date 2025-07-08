import { SipcopResponse } from "@/domain/interface/response/sipcop.interface";
import { BcryptRepositoryAdapter } from "@/infrastructure/crypto/bcrypt.adapter";
import { CreateUserUsecase } from "@/usecase/user/create.usecase";
import { BadRequestException, Body, Controller, HttpStatus, Inject, Post, Req, Res } from "@nestjs/common";
import { Response } from "express";

@Controller('user')
export class UserController {
    private imei1: number;
    private imei2: number;
    private ipAddress: number;
    private idMunicipal: string;
    private idTransmission: string;
    private idMunicipal2: string;
    constructor(
        @Inject("CreateUserUsecase")
        private readonly createUserUsecase: CreateUserUsecase
    ) {
        this.imei1 = 863238071032538; // POLICE
        this.imei2 = 863238071032538; // SERENO
        // 
        this.ipAddress = 222222;
        this.idMunicipal = "1234567890";  
        this.idTransmission = "1234567890";
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
            console.log("dto: ", dto)
            if(this.idMunicipal != dto.idMunicipalidad) {
                console.log("40* | Identificador de Municipalidad invalido | ", dto.idMunicipalidad);
                res.status(HttpStatus.BAD_REQUEST);               
                return res.json( {
                    success: false,
                    messages: ["Identificador de Municipalidad"],
                    timestamp: newDate.toISOString(),
                    error: "Ingreso Prohibido"
                });
            }; 

            if(this.imei2 != dto.imei) {
                console.log("40* | IMEI invalido | ", dto.imei);
                res.status(HttpStatus.BAD_REQUEST);               
                return res.json( {   
                    success: false,
                    messages: ["Placa e IMEI no validos: 495268a2-acc0-45a8-bf7f-20dc61c64|101115|EAH - 282|359632109283942"],
                    timestamp: newDate.toISOString(),
                    error: "Ingreso Prohibido"
                });
            };

            console.log("State 20*", newDate.toISOString(), ": IMEI: ", dto.imei, " | ", dto.placa, " ID Municipal: ", dto.idMunicipalidad, );
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
                console.log("40* | Identificador de transmision invalido | ", dto.idTransmision);
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

            console.log("State 20*", newDate.toISOString(), ": IMEI: ", dto.imei, " | ", dto.placa, " ID Transmission: ", dto.idTransmision );
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

} 