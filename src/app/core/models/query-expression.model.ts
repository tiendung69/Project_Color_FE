export class QueryExpression {
  IdentityId: string = undefined as any;
  EntitySet: string = undefined as any;
  IsCount: boolean = undefined as any;
  Filter: string = undefined as any;
  Expand: string[] = [];
  Select: string[] = [];
  Skip: number = undefined as any;
  Top: number = undefined as any;
  OrderBy: string[] = [];
  OverrideHeader = true;
}
