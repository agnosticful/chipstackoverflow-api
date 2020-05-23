export default interface GameStreetAction {
  type: GameStreetActionType;
  playerIndex: number;
  betSize: number;
}

export enum GameStreetActionType {
  fold = "FOLD",
  check = "CHECK",
  call = "CALL",
  bet = "BET",
  raise = "RAISE",
}

export function gameStreetActionToString({
  type,
  playerIndex,
  betSize,
}: GameStreetAction): string {
  return `${type}#${betSize}#${playerIndex}`;
}

export function stringToGameStreetAction(value: string): GameStreetAction {
  const [type, betSizeString, playerIndexString] = value.split("#");

  return {
    type: type as GameStreetActionType,
    betSize: parseFloat(betSizeString),
    playerIndex: parseInt(playerIndexString),
  };
}
