import { Component, Input, OnDestroy } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Refnum, RefnumGridColumns } from '../../model/refnum'
import { Subscription } from 'rxjs';

@Component({
  selector: 'grid',
  templateUrl: './grid.html',
  styleUrls: ['./grid.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: GridComponent
    }
  ]
})
export class GridComponent implements ControlValueAccessor, OnDestroy {
  @Input() headerLabel: string = '';

  //#region Grid properties

  displayedColumns: string[] = RefnumGridColumns.map((col) => col.key)
  columnsSchema: any = RefnumGridColumns;
  dataSource = new MatTableDataSource<Refnum>()
  valid: any = {}

  //#endregion

  //#region Form properties

  gridForm: FormGroup = this.formBuilder.group({
    rowValue: [''],
  });

  onTouched: Function = () => { };

  onChangeSubs: Subscription[] = [];

  //#endregion

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder) { }

  public ngOnInit() {

  }

  //#region Grid methods

  public editRow(row: Refnum) {
    row.isEdit = false;
    this.gridForm.controls['rowValue'].setValue(row);
  }

  public addRow() {
    const newRow: Refnum = new Refnum('', '', '');
    this.dataSource.data = [newRow, ...this.dataSource.data]
  }

  public removeRow(xid: string) {
    this.dataSource.data = this.dataSource.data.filter(
      (r: Refnum) => r.xid !== xid,
    )
  }

  public removeSelectedRows() {
    if (confirm('Deseja realmente remover os itens selecionados?')) {
      this.dataSource.data = this.dataSource.data.filter(
        (r: Refnum) => !r.isSelected,
      )
    }
  }

  public inputHandler(e: any, element: any, key: string) {
    if (element && key) {
      const property = element[key];

      if (!this.valid[property]) {
        this.valid[property] = {}
      }

      this.valid[property][key] = e.target.validity.valid
    }

  }

  public disableSubmit(xid: string) {
    if (this.valid[xid]) {
      return Object.values(this.valid[xid]).some((item) => item === false)
    }
    return false
  }

  public isAllSelected() {
    return this.dataSource.data.every((item) => item.isSelected)
  }

  public isAnySelected() {
    return this.dataSource.data.some((item) => item.isSelected)
  }

  public selectAll(event: any) {
    this.dataSource.data = this.dataSource.data.map((item) => ({
      ...item,
      isSelected: event.checked,
    }))
  }

  //#endregion

  //#region Form methods

  ngOnDestroy(): void {
    this.onChangeSubs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  registerOnChange(onChange: any): void {
    const sub = this.gridForm.valueChanges.subscribe(onChange);
    this.onChangeSubs.push(sub);
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled)
      this.gridForm.disable();
    else
      this.gridForm.enable();
  }

  writeValue(value: any): void {
    if (value)
      this.gridForm.setValue(value, { emitEvent: false });
  }

  //#endregion

}
