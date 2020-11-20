import { spawnBouncingHazards, WaitHazardsClearWave, WaitSecondsWave } from './wave'

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
  }
]