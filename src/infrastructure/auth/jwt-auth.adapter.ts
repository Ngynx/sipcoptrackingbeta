import { AuthInterface } from "@/domain/interface/auth.interface";
import * as jwt from "jsonwebtoken";

export class JWTAuthRepositoryAdapter implements AuthInterface {
    private readonly secret: string = "secret";
    private readonly expiresIn: string = "8h";
    constructor() {}
    
    generateToken(payload: any): string {
        // sign(payload: Buffer | object, options?: JwtSignOptions): string;
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }
    verifyToken(token: string) {
        try {
            
        } catch (error) {
            console.log(error);
            
        }
    }

}