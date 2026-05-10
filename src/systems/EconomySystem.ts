import { TowerType, TOWER_CONFIGS } from '../config/towers';
import { Tower, createTower } from '../entities/Tower';
import { REALMS, SELL_REFUND_RATIO, RealmLevel } from '../config/upgrades';

export interface GameStateMoney {
  spirit: number;
  lives: number;
}

export class EconomySystem {
  placeTower(type: TowerType, gridX: number, gridY: number, state: GameStateMoney): Tower | null {
    const config = TOWER_CONFIGS[type];
    if (state.spirit < config.buildCost) return null;
    state.spirit -= config.buildCost;
    return createTower(type, gridX, gridY);
  }

  upgradeTower(tower: Tower, state: GameStateMoney): boolean {
    if (tower.level >= 5) return false;
    const nextRealm = REALMS[tower.level]; // level is 1-indexed, array is 0-indexed
    if (state.spirit < nextRealm.cost) return false;

    state.spirit -= nextRealm.cost;
    tower.totalInvested += nextRealm.cost;
    tower.level = (tower.level + 1) as RealmLevel;

    // Apply new stats
    tower.damage = Math.floor(tower.config.baseDamage * nextRealm.damageMultiplier);
    tower.range = tower.config.baseRange + nextRealm.rangeBonus;
    tower.attackSpeed = tower.config.baseAttackSpeed + nextRealm.attackSpeedBonus;
    return true;
  }

  sellTower(tower: Tower, state: GameStateMoney): number {
    const refund = Math.floor(tower.totalInvested * SELL_REFUND_RATIO);
    state.spirit += refund;
    return refund;
  }

  getUpgradeCost(tower: Tower): number {
    const realm = REALMS.find(r => r.level === tower.level + 1);
    return realm ? realm.cost : 0;
  }

  getRealmInfo(level: RealmLevel) {
    return REALMS[level - 1];
  }
}
