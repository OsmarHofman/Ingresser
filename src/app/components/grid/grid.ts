import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Refnum, RefnumGridColumns } from '../../model/refnum'


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
  ],
})
export class GridComponent {
  displayedColumns: string[] = RefnumGridColumns.map((col) => col.key)
  columnsSchema: any = RefnumGridColumns;
  dataSource = new MatTableDataSource<Refnum>()
  valid: any = {}

  constructor(public dialog: MatDialog) { }

  public ngOnInit() {

  }

  public editRow(row: Refnum) {
    // if (row.id === 0) {
    row.isEdit = false;
    // } else {
    //   this.userService.updateUser(row).subscribe(() => (row.isEdit = false))
    // }
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
    if (confirm('Deseja realmente remover esse refnum?')) {
      this.dataSource.data = this.dataSource.data.filter(
        (r: Refnum) => !r.isSelected,
      )
    }
  }

  public inputHandler(e: any, xid: string, key: string) {
    if (!this.valid[xid]) {
      this.valid[xid] = {}
    }
    this.valid[xid][key] = e.target.validity.valid
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
}
