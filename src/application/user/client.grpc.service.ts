import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom, lastValueFrom, Observable } from "rxjs";
import { TestServiceClient } from "./sipcopservice.grpc.interace";

@Injectable()
export class GpsGrpcClientService implements OnModuleInit {
  // private grpcService: SipcopServiceGrpc;
  // constructor(@Inject('GRPC_SERVICE') private readonly client: ClientGrpc) {}
  // onModuleInit() {
  //   this.grpcService = this.client.getService<SipcopServiceGrpc>('AVLService');
  // }

  // transmitir(data: any): Observable<{ status_code: number; status_text: string }> {
    // console.log("👉 data a enviar a gRPC:", JSON.stringify(data, null, 2));
    //   return this.grpcService.TransmitirAVL("tracker_device_alarm"); 
    // }

  private grpcService: TestServiceClient;  
  constructor(@Inject('GRPC_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.grpcService = this.client.getService<TestServiceClient>('TestService');
  }

  async enviarDatoSimple(payload?: any) { // Observable<{ status_code: number; status_text: string }>
    const mensaje = {
        mensaje: '¡Hola desde el cliente!',
        incident: "esss"
    };
    console.log("message: ", mensaje);
    const response = await lastValueFrom(await this.grpcService.EnviarDatoSimple(mensaje))
    console.log("response: ", response);

    return {};
  }

  async sendIncidentData(payload) {
    console.log("message: ", payload);
    await lastValueFrom(await this.grpcService.EnviarIncidente(payload));
    return {};
  }

}