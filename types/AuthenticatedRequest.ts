import { IUser } from "@/app/models/user";

export interface AuthenticatedRequest extends Request {
  user: IUser;
  files?: Express.Multer.File[];
}