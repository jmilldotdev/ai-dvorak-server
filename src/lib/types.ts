export enum CardType {
  Action = "Action",
  Thing = "Thing",
  ThingProject = "Thing - Project",
  ThingDistraction = "Thing - Distraction",
  ThingAI = "Thing - AI",
  ThingMartian = "Thing - Martian",
}

export interface Card {
  name: string;
  type: CardType;
  rules: string;
}
