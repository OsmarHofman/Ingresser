export class Configs {
    public port: number;
    public enterpriseId: string;
    public token: string;

    constructor(port: number, enterpriseId: string, token: string) {
        this.port = port;
        this.enterpriseId = enterpriseId;
        this.token = token;
    }
}