# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

修仙塔防 (Cultivation Tower Defense) — a browser-based tower defense game with Chinese cultivation themes and cute art style. TypeScript + Canvas + Vite.

## Commands

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # Type-check + production build
npx tsc --noEmit  # Type-check only
```

## Architecture

**Scene-driven game loop** with a lightweight ECS layer for gameplay entities.

```
main.ts → Game (owns Canvas + requestAnimationFrame loop)
        → SceneManager (scene stack: push/pop/replace)
        → Scenes: MenuScene → LevelSelectScene → GameScene → ResultScene
```

### Core (`src/core/`)

Framework layer. `Game.ts` runs the loop: poll input → update scenes → render to canvas. `SceneManager` is a stack — topmost scene receives input, all scenes update/render. `EventBus` is a pub/sub singleton for decoupled system communication. `InputManager` wraps mouse events and exposes per-frame `justClicked` / `justRightClicked` state.

### GameScene composition (`src/scenes/GameScene.ts`)

The main game scene orchestrates systems that each process `GameState`:

| System | Responsibility |
|--------|---------------|
| `WaveSystem` | Timed enemy wave spawning |
| `PathSystem` | Move enemies along pre-defined waypoints |
| `TargetingSystem` | Towers lock onto enemies (prioritize furthest along path) |
| `CombatSystem` | Tower attacks, projectile movement, damage, DOT debuffs |
| `EconomySystem` | Place/upgrade/sell towers, spirit management |
| `EffectSystem` | Particle lifecycle |

### Entities (`src/entities/`)

Plain data objects (not classes). `Tower`, `Enemy`, `Projectile`, `Particle` each have a factory function (`createX`) and an optional render function. Systems mutate entity arrays directly.

### Config-driven design (`src/config/`)

All game data is in config files, not hardcoded:
- `towers.ts` — tower types, stats, special abilities (single/splash/dot/chain)
- `enemies.ts` — enemy types, HP, speed, reward
- `levels.ts` — grid layout, waypoints, wave composition
- `upgrades.ts` — realm levels and stat multipliers (炼气→筑基→金丹→元婴→化神)

### Map system (`src/map/`)

Grid-based map (64px tiles, 15×10 grid). `Grid` wraps a 2D tile array: `0`=buildable, `1`=path, `2`=blocked. Enemy movement follows pre-defined waypoints (grid coords) with linear interpolation — no pathfinding at runtime.

### UI (`src/ui/`)

Hybrid: HUD rendered on Canvas, interactive panels respond to mouse events. `Button` is a generic clickable component with hover states and multi-line label support.

## Key patterns

- **No framework** — vanilla Canvas 2D API for all rendering
- **No external assets** — all visuals are programmatic (shapes, text, particles)
- **Event-driven communication** — systems don't call each other directly; they emit/listen via `EventBus`
- **Mutable state** — systems receive entity arrays and mutate them in-place each frame
- **Config-first** — adding a new tower type or enemy type is just adding a config entry
