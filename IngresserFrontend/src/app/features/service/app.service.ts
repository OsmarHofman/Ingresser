import { FormGroup } from "@angular/forms";
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, throwError } from "rxjs";

import { ResultMessage } from "../../model/result-message";
import { NFesAndId } from "../../model/nfe";
import { ValuesConfiguration } from "../../model/values-configuration";
import { SendRequest } from "../../model/send-request";
import { EntityType } from "../../model/entityType";
import { Configs } from "../../model/configs";
import { SoapTag } from "../../model/xml-tags";
import { environment } from "../../../environments/environment";

@Injectable()
export class AppService {

    private configuration: ValuesConfiguration = new ValuesConfiguration();

    constructor(private http: HttpClient) {
        this.getConfigurationFromFile();
    }

    private getConfigurationFromFile(): void {
        this.http.get('./assets/values-configuration.json').subscribe(configurationData => {
            if (configurationData) {
                this.configuration = configurationData as ValuesConfiguration;
            } else {
                alert("Erro ao tentar obter configurações do arquivo: values-configuration.json!");
            }
        });
    }

    public sendXmlsToWS(form: FormGroup, entitiesTypes: EntityType[], configs: Configs): void {

        if (!this.configuration) return;

        let xmlsToSend: SendRequest[] = [];

        if (form.controls['entities'].value) {

            for (let index = 0; index < entitiesTypes.length; index++) {

                const formValue = form.controls['entities'].value[index];

                const entityType = entitiesTypes[index];

                switch (entityType) {

                    case EntityType.Shipment:

                        const finalShipmentXml: string = SoapTag.getShipmentXmlByForm(formValue[0]);

                        xmlsToSend.push(new SendRequest(finalShipmentXml, entityType, configs));

                        break;

                    case EntityType.NFe:

                        const nFeXmlAndId: NFesAndId = NFesAndId.convertNFeFormToXml(formValue);

                        const finalNFeXml: string = SoapTag.getNFeXmlByForm(configs, nFeXmlAndId);

                        xmlsToSend.push(new SendRequest(finalNFeXml, entityType, configs));

                        break;

                    default:
                        return;
                }
            }
        }

        xmlsToSend.forEach(async (sendRequest: SendRequest) => {
            this.sendXml(sendRequest);

            await this.sleep(this.configuration.timeoutBetweenEachCall * 1000);
        })
    }

    private sendXml(sendRequest: SendRequest): void {

        this.http.post(environment.apiUrl, sendRequest)
            .pipe(
                catchError((httpErrorResponse: HttpErrorResponse) => {
                    alert(`Erro na requisição:\nURL: ${httpErrorResponse.url}\nStatus: ${httpErrorResponse.status} (${httpErrorResponse.error.title})\nErro: ${httpErrorResponse.error.detail}`);
                    return throwError(() => httpErrorResponse.error.detail);
                })
            )
            .subscribe((response: Object) => {
                if (response) {
                    const result: ResultMessage = response as ResultMessage;

                    if (result) {
                        alert(result.Message);
                        return;
                    }
                }

                alert('Ocorreu algo erro na resposta do backend!');
            });
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}