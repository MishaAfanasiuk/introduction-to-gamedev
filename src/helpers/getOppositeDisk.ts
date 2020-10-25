import {ColorsEnum} from "../enums/colors.enum";

export const getOppositeDisk = (disk: ColorsEnum) => {
  return disk === ColorsEnum.WHITE ? ColorsEnum.BLACK : ColorsEnum.WHITE
};
