export class ChartModel{
  id?: number;
  chartName: string = '';
  normalSide: number = 0;
  category: string = '';
  subCategory: string = '';
  initialBalance: number = 0;
  debit: number = 0;
  credit: number = 0;
  balance: number = 0;
  created: Date = new Date;
  userId: string ='';
  order: string ='';
  statement: string ='';
  comment: string ='';
  deactivated: boolean = false;
}
