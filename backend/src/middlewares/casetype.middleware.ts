import { Errand } from "@/data-contracts/case-data/data-contracts";
import { HttpException } from "@/exceptions/HttpException";
import { FTCaseType } from "@/interfaces/case-type.interface";

export function validateCaseTypes(errands: Errand[]) {
  const validCaseTypes = Object.values(FTCaseType) as string[];
  errands.forEach((errand, key) => {
    if (!validCaseTypes.includes(errand.caseType)) {
      throw new HttpException(403, `Inga behörigheter för att hämta ärende med ärendetyp: ${errand.caseType}`);
    }
  });
}