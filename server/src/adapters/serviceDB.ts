import { IServiceDB } from "../domain/interfacesDI/IServiceDB";

export const serviceDB: IServiceDB = {
  async findOne(
    entityName: string,
    params: { fieldName: string; fieldValue: string }
  ) {
    return { name: "nikita" };
  },
  async findAll(entityName: string) {
    return [{ name: "nikita" }, { name: "pushin" }];
  },
  async saveOne(entityName: string, dto: Record<string, any>) {
    return { ...dto, id: `1` };
  },
};
