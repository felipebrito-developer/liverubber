import { join, dirname } from "path";

const currentDir = dirname(__filename);

export const schemasDir = join(currentDir, "../schemas");
export const mobileGenDir = join(currentDir, "../../ui/mobile/gen");
export const serviceGenDir = join(currentDir, "../../service/gen");
