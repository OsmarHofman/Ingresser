export class Refnum {

    public domainName: string;
    public xid: string;
    public value: string;

    constructor(domainName: string, xid: string, value: string) {
        this.domainName = domainName;
        this.xid = xid;
        this.value = value;
    }

}