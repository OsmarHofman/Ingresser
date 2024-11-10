export class ResultMessage {
    public Message: string;
    public Successful: boolean;

    constructor(message: string, successful: boolean){
        this.Message = message;
        this.Successful = successful;
    }   
}