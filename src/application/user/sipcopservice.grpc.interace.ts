import { Observable } from "rxjs";
import { IncidentOutputI } from "./incident.input.interface";

export interface SipcopServiceGrpc {
  TransmitirAVL(data: any): Observable<{ status_code: number; status_text: string }>;
}

export interface TestServiceClient {
  EnviarDatoSimple(data: { mensaje: string, incident: string }): Promise<any>;
  EnviarIncidente(data: any): Promise<any>; 
}
       