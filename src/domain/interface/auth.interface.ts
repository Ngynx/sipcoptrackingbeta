export interface AuthInterface {
    generateToken(payload: any): string;
    verifyToken(token: string): any;
}