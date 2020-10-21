import {Game} from "./game";
import {Robot} from "./robot";
import {GameTypeEnum} from "../enums/game-type.enum";
import {Board} from "./board";
import {Player} from "./player";
import {FieldDiskEnum} from "../enums/field-disk.enum";

export class TesterGame {
  private game: Game;

  constructor(
    private botColor: string,
    private blackhole: string
  ) {
    this.game = new Game(
      [
        new Player('Tester', botColor === 'white' ? FieldDiskEnum.BLACK : FieldDiskEnum.WHITE),
        new Robot(botColor === 'white' ? FieldDiskEnum.WHITE : FieldDiskEnum.BLACK),
      ],
      new Board(),
      GameTypeEnum.PLAYER_WITH_BOT
    )

    return this.game
  }
}
