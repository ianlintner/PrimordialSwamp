# Combat Balance Tables

This document contains CSV-formatted balance tables for combat, progression, and resource systems.

---

## 1. Dinosaur Base Stats

```csv
id,name,role,health,attack,defense,speed,stamina,unlock_condition,unlock_value
deinonychus,Deinonychus,hunter,65,12,4,9,70,always,0
ankylosaurus,Ankylosaurus,tank,130,6,12,3,80,always,0
pteranodon,Pteranodon,scout,45,7,2,11,60,always,0
tyrannosaurus,Tyrannosaurus Rex,powerhouse,150,18,8,5,90,depth,5
pachycephalosaurus,Pachycephalosaurus,bruiser,85,10,7,6,75,defensive_wins,10
therizinosaurus,Therizinosaurus,controller,110,11,6,4,85,total_runs,25
parasaurolophus,Parasaurolophus,support,95,6,5,7,100,run_victories,10
```

## 2. Enemy Stats by Tier

```csv
id,name,tier,health,attack,defense,speed,xp_reward,fossil_reward_min,fossil_reward_max
compsognathus,Compsognathus Pack,basic,25,8,2,10,8,3,8
dilophosaurus,Dilophosaurus,basic,45,10,3,8,12,5,12
coelophysis,Coelophysis,basic,35,9,2,9,10,4,10
dimetrodon,Dimetrodon,basic,50,11,5,5,15,6,14
allosaurus,Allosaurus,advanced,80,14,6,7,25,10,20
sarcosuchus,Sarcosuchus,advanced,90,12,8,4,28,12,22
velociraptor,Velociraptor,advanced,55,13,4,11,22,8,18
kentrosaurus,Kentrosaurus,advanced,70,10,10,5,24,10,20
spinosaurus,Spinosaurus,elite,120,16,7,6,45,20,35
carnotaurus,Carnotaurus,elite,95,17,5,9,42,18,32
therizinosaurus_wild,Wild Therizinosaurus,elite,110,15,8,5,48,22,38
mosasaurus,Mosasaurus,boss,180,20,10,8,80,40,60
giganotosaurus,Giganotosaurus,boss,200,22,8,6,90,50,70
tyrannosaurus_boss,Tyrannosaurus Rex,boss,220,25,12,5,100,60,80
```

## 3. Damage Type Effectiveness

```csv
damage_type,vs_armor,vs_flesh,vs_scales,vs_feathers,vs_boss,status_chance
physical,1.0,1.0,1.0,1.0,1.0,0
crushing,1.3,0.9,1.1,1.0,1.1,0.15
slashing,0.8,1.2,0.9,1.3,0.95,0.25
piercing,1.2,1.1,1.0,0.9,1.05,0.10
venom,0.9,1.3,1.0,1.2,0.8,0.40
fire,1.0,1.1,1.1,1.5,0.9,0.20
cold,1.0,1.0,0.8,0.7,0.85,0.15
acid,1.2,1.2,1.3,1.0,0.9,0.30
sonic,0.8,1.0,1.0,1.2,1.0,0.20
```

## 4. Status Effect Parameters

```csv
effect_id,name,damage_per_turn,duration_default,stackable,max_stacks,tick_timing
bleeding,Bleeding,5,3,yes,5,start_of_turn
poisoned,Poisoned,3,4,yes,3,start_of_turn
burning,Burning,4,3,yes,3,start_of_turn
infected,Infected,2,5,yes,2,start_of_turn
stunned,Stunned,0,1,no,1,immediate
frozen,Frozen,0,1,no,1,immediate
rooted,Rooted,0,2,no,1,immediate
blinded,Blinded,0,2,no,1,immediate
confused,Confused,0,2,no,1,immediate
feared,Feared,0,2,no,1,immediate
exhausted,Exhausted,0,3,no,1,immediate
weakened,Weakened,0,3,yes,3,immediate
exposed,Exposed,0,2,no,1,immediate
slowed,Slowed,0,2,no,1,immediate
regenerating,Regenerating,-5,3,yes,3,start_of_turn
fortified,Fortified,0,3,no,1,immediate
empowered,Empowered,0,3,no,1,immediate
hastened,Hastened,0,2,no,1,immediate
hidden,Hidden,0,1,no,1,immediate
camouflaged,Camouflaged,0,3,no,1,immediate
```

## 5. Weather Combat Modifiers

```csv
weather_type,accuracy_mod,fire_damage_mod,cold_damage_mod,sonic_damage_mod,stamina_drain,visibility
clear,0,1.0,1.0,1.0,0,100
rain,-10,0.5,1.2,1.0,0,80
storm,-20,0.3,1.2,1.2,5,60
fog,-30,1.0,1.0,0.8,0,40
volcanic_ash,-15,1.3,0.8,1.0,10,50
heat_wave,-5,1.5,0.6,1.0,15,90
cold_snap,-10,0.8,1.5,1.0,5,85
meteor_shower,-25,1.2,1.0,1.0,0,70
```

## 6. Terrain Combat Modifiers

```csv
terrain_type,movement_penalty,stealth_bonus,accuracy_mod,special_effect
open_ground,0,0,0,none
dense_vegetation,15,20,-15,fire_vulnerability
shallow_water,10,0,-5,aquatic_bonus
deep_water,30,-10,-20,swimming_required
mud,25,10,-10,slow_effect
tar_pit,50,-20,-25,stuck_chance
rocky,10,5,-5,fall_damage
volcanic,20,-10,-10,fire_damage_per_turn
nesting_ground,0,15,0,defensive_buff
cliff,40,0,-15,knockback_hazard
```

## 7. Evolution Point Costs

```csv
tier,min_cost,max_cost,stat_bonus_range,ability_unlock_chance
common,15,25,1-3,0.1
uncommon,25,35,2-4,0.2
rare,35,50,3-6,0.4
epic,50,70,5-8,0.6
legendary,70,100,7-12,0.8
```

## 8. Resource Economy Balance

```csv
source,fossils_min,fossils_max,energy_min,energy_max,nutrients_min,nutrients_max,ep_min,ep_max,xp_min,xp_max
combat_basic,3,8,0,0,0,0,8,15,10,15
combat_advanced,8,15,0,0,0,0,15,25,15,25
combat_elite,15,25,0,0,0,0,25,40,30,45
combat_boss,30,50,0,0,0,0,45,75,50,75
resource_node,0,5,5,15,1,3,0,5,3,8
rest_node,0,0,10,20,0,0,0,0,2,5
discovery_event,5,15,0,0,0,2,5,15,5,12
shrine,0,10,0,0,0,0,15,30,0,0
merchant,0,0,0,0,0,0,0,0,0,0
```

## 9. Trait Rarity Distribution

```csv
rarity,drop_chance,power_budget,synergy_potential,max_per_run
common,60,1.0,low,unlimited
uncommon,25,1.5,medium,5
rare,12,2.0,high,3
epic,2.5,3.0,very_high,2
legendary,0.5,5.0,extreme,1
```

## 10. Experience and Level Curve

```csv
level,xp_required,total_xp,hp_bonus,attack_bonus,defense_bonus,speed_bonus,unlock
1,0,0,0,0,0,0,base
2,100,100,2,1,0,0,none
3,141,241,2,0,1,0,none
4,173,414,2,1,0,0,none
5,200,614,2,0,1,0,trait_slot
6,224,838,3,1,0,0,none
7,245,1083,2,0,1,1,none
8,265,1348,2,1,0,0,none
9,283,1631,2,0,1,0,none
10,300,1931,3,1,1,0,ability_upgrade
11,316,2247,2,1,0,0,none
12,332,2579,2,0,1,0,none
13,346,2925,2,1,0,1,none
14,360,3285,3,0,1,0,none
15,374,3659,2,1,0,0,trait_slot
16,387,4046,2,0,1,0,none
17,400,4446,2,1,0,0,none
18,412,4858,3,0,1,1,none
19,424,5282,2,1,0,0,none
20,436,5718,3,1,1,0,ultimate_ability
```

## 11. Combat Action Costs

```csv
action,stamina_cost,cooldown_turns,base_damage_mult,accuracy_mod,status_chance,notes
basic_attack,10,0,1.0,0,0,standard attack
heavy_attack,25,0,1.5,-10,0.1,-5 defense after
defend,0,0,0,0,0,+50% defense; recover 15 stamina
flee,0,0,0,0,0,speed check
special_ability,30,3,1.5,0,0.5,species-specific
ultimate_ability,50,5,2.5,0,0.8,unlocked at level 20
targeted_strike,15,0,1.0,-20,0,body part targeting
charge,20,2,1.3,0,0.15,skip turn; +30% next attack
counter,15,1,1.2,0,0.1,must defend first
```

## 12. Biome Progression

```csv
biome_id,order,node_count,combat_weight,resource_weight,event_weight,special_weight,difficulty_mult,boss_required
coastal_wetlands,1,15,50,25,15,10,1.0,yes
fern_prairies,2,18,50,20,18,12,1.25,yes
volcanic_highlands,3,20,55,15,15,15,1.5,yes
tar_pits,4,22,60,10,15,15,1.8,yes
```

## 13. Victory/Defeat Rewards

```csv
outcome,fossil_retention,xp_retention,codex_retention,achievement_retention,trait_retention
victory,100,100,100,100,0
defeat,50,0,100,100,0
flee,75,50,100,100,0
```

---

## Usage Notes

1. **Editing Tables**: Copy CSV sections into a spreadsheet for easier editing
2. **Import Format**: Game systems read JSON equivalents; use provided conversion scripts
3. **Balance Testing**: Run simulation scripts against these tables to validate changes
4. **Version Control**: Update the version field in MILESTONE_REWARDS.json when changing values

## Balance Guidelines

### Target Metrics
- Average run duration: 20-30 minutes
- Player win rate (normal enemies): 85-95%
- Player win rate (elite enemies): 60-75%
- Player win rate (boss enemies): 40-60%
- Trait acquisition rate: 1 per 3-5 encounters
- Average combat duration: 5-8 turns

### Scaling Principles
- Enemy difficulty scales with depth (1.1x per depth tier)
- Resource rewards scale proportionally to risk
- Rare events become more common in later biomes
- Boss difficulty jumps 1.5x between biomes
