import dbObject from "../data/db";
import { NewPhoto } from "../types/types";

const db = dbObject.Connector;
const { photosTable } = dbObject.Tables;

export default class PhotoRepository {
  static async savePhoto(newPhoto: NewPhoto): Promise<void> {
    await db.insert(photosTable).values(newPhoto);
  }
}
