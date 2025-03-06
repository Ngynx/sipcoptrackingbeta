import { SipcopResponse } from "@/domain/interface/response/sipcop.interface";
import { BcryptRepositoryAdapter } from "@/infrastructure/crypto/bcrypt.adapter";
import { CreateUserUsecase } from "@/usecase/user/create.usecase";
import { Body, Controller, Inject, Post, Req, Res } from "@nestjs/common";
import { Response } from "express";

@Controller('user')
export class UserController {
    private imei1: number;
    private ipAddress: number;
    constructor(
        @Inject("CreateUserUsecase")
        private readonly createUserUsecase: CreateUserUsecase
    ) {
        this.imei1 = 865266038205390;
        this.ipAddress = 222222;
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
        @Res() res: Response<Partial<SipcopResponse<object>>|any>    
    ): Promise<Response<object>> { 
        const newDate = new Date();
        try {
            console.log();
            console.log(newDate.toISOString(), ": IMEI: ", dto.imei);
            if(dto.imei == (this.imei1.toString())) {
                console.log("200 | 201")
                res.status(200);
                return res.json({
                    success: true, 
                    messages: ["Data received"],
                    data: { status: "OK" },  
                    timestamp: newDate.toISOString()
                })      
            } else {   
                console.log("40*")
                res.status(403)    
                return res.json( {   
                    success: false,
                    messages: ["Identificador de Municipalidad, Ubigeo, Placa e IMEI no validos: 495268a2-acc0-45a8-bf7f-20dc61c64|101115|EAH - 282|359632109283942"],
                    timestamp: newDate.toISOString(),
                    error: "Ingreso Prohibido"
                })
            };
            // res.status(401);
            // return res.json({
            //     success: false,     
            //     data: "Unauthorized",
            //     message: "Unauthorized"   
            // }) 
        } catch (error) {   
            console.log(error);    
            res.status(400); 
            return res.json({
                success: false, 
                data: null,
                error: "Error",
                timestamp: newDate.toISOString(),
                messages: error,
            })   
        }  
    }

} 