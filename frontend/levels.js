import { STAGE_SIZE } from './constants'
import { BossWave, spawnBouncingHazards, spawnRingHazards, spawnVerticalWall, WaitHazardsClearWave, WaitSecondsWave } from './wave'

function range(a, b) {
  return () => a + Math.round(Math.random() * (b - a))
}

export default [
  {
    name: 'LEVEL ONE',
    waves: [
      game => {
        spawnBouncingHazards(game, 5, 1, 1, 1.5)
        return new WaitHazardsClearWave(game)
      },
      game => {
        spawnBouncingHazards(game, 5, 1, 1, 1.5)
        return new WaitHazardsClearWave(game)
      },
    ],
  },
  {
    name: 'LEVEL TWO',
    waves: [
      game => {
        spawnBouncingHazards(game, 5, range(1, 2), 1, 1.5)
        return new WaitHazardsClearWave(game)
      },
      game => {
        spawnBouncingHazards(game, 5, range(1, 2), 1, 1.5)
        return new WaitSecondsWave(game, 5)
      },
      game => {
        spawnBouncingHazards(game, 5, range(1, 2), 1, 1.5)
        return new WaitHazardsClearWave(game, 5)
      },
    ],
  },
  {
    name: 'LEVEL THREE',
    waves: [
      game => {
        spawnBouncingHazards(game, 5, 1, 1, 2)
        return new WaitHazardsClearWave(game)
      },
      game => {
        spawnBouncingHazards(game, 3, 1, 1, 1.5)
        spawnBouncingHazards(game, 4, 2, 2, 1.5)
        return new WaitHazardsClearWave(game)
      },
    ]
  },
  {
    name: 'LEVEL FOUR',
    waves: [
      game => {
        spawnRingHazards(game, 7, 1, 1, STAGE_SIZE.x / 2, STAGE_SIZE.y / 2, 100, 70)
        return new WaitSecondsWave(game, 3)
      },
      game => {
        spawnBouncingHazards(game, 5, range(1, 2), 1, 1.5)
        return new WaitHazardsClearWave(game)
      },
    ]
  },
  {
    name: 'LEVEL FIVE',
    waves: [
      game => {
        spawnRingHazards(game, 4, range(1, 2), 1, STAGE_SIZE.x / 2 - 30, STAGE_SIZE.y / 2, 100, 70)
        spawnRingHazards(game, 4, range(1, 2), 1, STAGE_SIZE.x / 2 + 30, STAGE_SIZE.y / 2, 100, 70)
        return new WaitSecondsWave(game, 4)
      },
      game => {
        spawnBouncingHazards(game, 4, 2, 1, 1.5)
        return new WaitHazardsClearWave(game)
      },
    ]
  },
  {
    name: 'LEVEL SIX',
    waves: [
      game => {
        spawnVerticalWall(game, 4, 2, 1, -10, 1, -0.25)
        spawnVerticalWall(game, 4, 2, 1, STAGE_SIZE.x + 10, -1, 0.25)
        return new WaitSecondsWave(game, 6)
      },
      game => {
        spawnBouncingHazards(game, 5, 3, 1, 1.5)
        return new WaitHazardsClearWave(game)
      },
    ]
  },
  {
    name: 'LEVEL SEVEN',
    waves: [
      game => {
        spawnRingHazards(game, 8, 3, 1, STAGE_SIZE.x / 2, STAGE_SIZE.y / 2, 80, 60)
        spawnVerticalWall(game, 5, range(1, 2), 1, -10, 1, -0.25)
        return new WaitSecondsWave(game, 9)
      },
      game => {
        spawnBouncingHazards(game, 7, range(1, 3), 1, 1.5)
        return new WaitHazardsClearWave(game)
      }
    ]
  },
  {
    name: 'LEVEL EIGHT',
    waves: [
      game => {
        spawnVerticalWall(game, 5, 3, 2, -10, 1, 0)
        return new WaitSecondsWave(game, 5)
      },
      game => {
        spawnBouncingHazards(game, 5, range(2, 3), 1, 1.5)
        return new WaitSecondsWave(game, 3)
      },
      game => {
        spawnRingHazards(game, 6, 3, 2, STAGE_SIZE.x / 2, STAGE_SIZE.y / 2, 100, 70)
        return new WaitHazardsClearWave(game)
      }
    ]
  },
  {
    name: 'LEVEL NINE',
    waves: [
      game => {
        spawnVerticalWall(game, 5, 8, 2, -10, 0.25, 0)
        spawnVerticalWall(game, 5, 8, 2, STAGE_SIZE.x + 10, -0.25, 0)
        return new WaitSecondsWave(game, 10)
      },
      game => {
        spawnRingHazards(game, 5, 4, 1, STAGE_SIZE.x / 2 - 40, STAGE_SIZE.y / 2, 30, 30)
        return new WaitSecondsWave(game, 2)
      },
      game => {
        spawnRingHazards(game, 5, 4, 1, STAGE_SIZE.x / 2 + 40, STAGE_SIZE.y / 2, 30, 30)
        return new WaitSecondsWave(game, 5)
      },
      game => {
        spawnBouncingHazards(game, 6, 3, 1, 2)
        return new WaitHazardsClearWave(game)
      }
    ]
  },
  {
    name: 'FINAL BOSS',
    waves: [game => new BossWave(game)]
  },
]