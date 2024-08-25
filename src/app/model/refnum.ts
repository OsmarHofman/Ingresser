export class Refnum {
  public isSelected: boolean;
  public domainName: string;
  public xid: string;
  public value: string;
  public isEdit: boolean;

  constructor(domainName: string, xid: string, value: string) {
    this.domainName = domainName;
    this.xid = xid;
    this.value = value;
    this.isSelected = false;
    this.isEdit = true;
  }
}

export const RefnumGridColumns = [
  {
    key: 'isSelected',
    type: 'isSelected',
    label: '',
  },
  {
    key: 'domainName',
    type: 'text',
    label: 'DomainName',
    required: true,
  },
  {
    key: 'xid',
    type: 'text',
    label: 'Xid',
    required: true,
  },
  {
    key: 'value',
    type: 'text',
    label: 'Valor',
    required: true,
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];