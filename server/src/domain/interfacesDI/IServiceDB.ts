export interface IServiceDB {
  findOne(
    entityName: string,
    params: { fieldName: string; fieldValue: string }
  ): Promise<Record<string, any>>;
  findAll(entityName: string): Promise<Record<string, any>[]>;
  saveOne(entityName: string, dto: Record<string, any>): Promise<Record<string, any> & {id: string}> | false;
}
