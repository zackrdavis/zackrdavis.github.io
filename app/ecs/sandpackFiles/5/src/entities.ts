import { makeSquare, makeWall } from "./utils";

type Collision = {
  otherEntId: string;
  xOverlap: number;
  yOverlap: number;
};

export type Entity = {
  // Mandatory
  id: string;

  // Optional Components
  playerControl?: boolean;
  appearance?: {
    color: string;
    width: number;
    height: number;
    text?: string;
  };
  position?: {
    x: number;
    y: number;
  };
  velocity?: {
    x: number;
    y: number;
  };
  friction?: number;
  collisionBox?: {
    width: number;
    height: number;
    collisions: Collision[];
  };
  rigidBody?: {
    stuck: boolean;
  };
  infectable?: boolean;
  infectious?: boolean;
  goal?: boolean;
};

const player = makeSquare({
  id: "player",
  role: "player",
  x: 30,
  y: 100,
});

const civ1 = makeSquare({
  role: "civilian",
  x: 15,
  y: 15,
});

const civ2 = makeSquare({
  role: "civilian",
  x: 40,
  y: 20,
});

const civ3 = makeSquare({
  role: "civilian",
  x: 20,
  y: 50,
});

const zombie1 = makeSquare({
  role: "zombie",
  x: 120,
  y: 140,
  vx: -0,
  vy: 1.5,
});

const zombie2 = makeSquare({
  role: "zombie",
  x: 200,
  y: 200,
  vx: 0.8,
  vy: -1,
});

const wallTop = makeWall({
  orientation: "x",
  length: 280,
  thickness: 20,
  x: 10,
  y: -10,
});

const wallBottom = makeWall({
  orientation: "x",
  length: 280,
  thickness: 20,
  x: 10,
  y: 290,
});

const wallLeft = makeWall({
  orientation: "y",
  length: 280,
  thickness: 20,
  x: -10,
  y: 10,
});

const wallRight = makeWall({
  orientation: "y",
  length: 280,
  thickness: 20,
  x: 290,
  y: 10,
});

const startWall = makeWall({
  orientation: "y",
  length: 90,
  thickness: 10,
  x: 70,
  y: 10,
});

const goalWall = makeWall({
  orientation: "y",
  length: 50,
  thickness: 10,
  x: 200,
  y: 10,
});

const goal = {
  id: "goal",
  goal: true,
  appearance: {
    width: 80,
    height: 50,
    color: "orange",
  },
  position: {
    x: 210,
    y: 10,
  },
  collisionBox: {
    width: 80,
    height: 50,
    collisions: [],
  },
};

export const entities = [
  goal,
  civ1,
  civ2,
  civ3,
  zombie1,
  zombie2,
  player,
  wallTop,
  wallBottom,
  wallLeft,
  wallRight,
  startWall,
  goalWall,
];
