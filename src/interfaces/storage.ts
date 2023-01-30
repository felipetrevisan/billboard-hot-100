import { Charts } from "./chart";

export interface Storage {
  authorize(): void;
  save(data: Charts): Promise<boolean>;
}