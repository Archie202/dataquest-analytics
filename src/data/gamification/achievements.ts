export interface AchievementDef {
  id: string
  title: string
  description: string
  category: "curriculum" | "social" | "speed" | "special"
  icon: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  xp_reward: number
  criteria: Record<string, unknown>
}

export const achievementDefs: AchievementDef[] = [
  { id: "ach-first-quest", title: "First Quest", description: "Complete your first quest", category: "curriculum", icon: "Sword", rarity: "common", xp_reward: 50, criteria: { type: "quests_completed", target: 1 } },
  { id: "ach-quest-master", title: "Quest Master", description: "Complete 50 quests", category: "curriculum", icon: "Sword", rarity: "rare", xp_reward: 500, criteria: { type: "quests_completed", target: 50 } },
  { id: "ach-century", title: "Century Club", description: "Complete 100 quests", category: "curriculum", icon: "Sword", rarity: "epic", xp_reward: 1000, criteria: { type: "quests_completed", target: 100 } },
  { id: "ach-phase-1", title: "Phase 1 Complete", description: "Complete all topics in Phase 1", category: "curriculum", icon: "BookOpen", rarity: "uncommon", xp_reward: 200, criteria: { type: "phase_complete", phase: "phase-1" } },
  { id: "ach-phase-2", title: "Phase 2 Complete", description: "Complete all topics in Phase 2", category: "curriculum", icon: "BookOpen", rarity: "rare", xp_reward: 400, criteria: { type: "phase_complete", phase: "phase-2" } },
  { id: "ach-phase-3", title: "Phase 3 Complete", description: "Complete all topics in Phase 3", category: "curriculum", icon: "BookOpen", rarity: "epic", xp_reward: 600, criteria: { type: "phase_complete", phase: "phase-3" } },
  { id: "ach-all-phases", title: "DataQuest Champion", description: "Complete all 4 phases", category: "curriculum", icon: "Trophy", rarity: "legendary", xp_reward: 2000, criteria: { type: "all_phases_complete" } },
  { id: "ach-streak-3", title: "Getting Started", description: "Maintain a 3-day streak", category: "special", icon: "Flame", rarity: "common", xp_reward: 75, criteria: { type: "streak", target: 3 } },
  { id: "ach-streak-7", title: "Weekly Warrior", description: "Maintain a 7-day streak", category: "special", icon: "Flame", rarity: "uncommon", xp_reward: 200, criteria: { type: "streak", target: 7 } },
  { id: "ach-streak-30", title: "Monthly Legend", description: "Maintain a 30-day streak", category: "special", icon: "Flame", rarity: "epic", xp_reward: 1000, criteria: { type: "streak", target: 30 } },
  { id: "ach-level-5", title: "Apprentice Analyst", description: "Reach Level 5", category: "special", icon: "Zap", rarity: "common", xp_reward: 100, criteria: { type: "level_reach", target: 5 } },
  { id: "ach-level-10", title: "Skilled Analyst", description: "Reach Level 10", category: "special", icon: "Zap", rarity: "uncommon", xp_reward: 300, criteria: { type: "level_reach", target: 10 } },
  { id: "ach-level-20", title: "Expert Analyst", description: "Reach Level 20", category: "special", icon: "Zap", rarity: "rare", xp_reward: 800, criteria: { type: "level_reach", target: 20 } },
  { id: "ach-level-35", title: "Data Master", description: "Reach Level 35", category: "special", icon: "Zap", rarity: "legendary", xp_reward: 2000, criteria: { type: "level_reach", target: 35 } },
  { id: "ach-sql-10", title: "SQL Apprentice", description: "Complete 10 SQL practice exercises", category: "curriculum", icon: "Database", rarity: "uncommon", xp_reward: 150, criteria: { type: "practice_complete", skill: "sql", target: 10 } },
  { id: "ach-python-10", title: "Python Apprentice", description: "Complete 10 Python practice exercises", category: "curriculum", icon: "Terminal", rarity: "uncommon", xp_reward: 150, criteria: { type: "practice_complete", skill: "python", target: 10 } },
  { id: "ach-social-profile", title: "Social Butterfly", description: "Complete your profile", category: "social", icon: "Users", rarity: "common", xp_reward: 50, criteria: { type: "profile_complete" } },
  { id: "ach-speed-demon", title: "Speed Demon", description: "Complete a boss fight in under 5 minutes", category: "speed", icon: "Zap", rarity: "rare", xp_reward: 500, criteria: { type: "speed_run" } },
  { id: "ach-boss-slayer", title: "Boss Slayer", description: "Complete 10 boss fights", category: "curriculum", icon: "Swords", rarity: "rare", xp_reward: 500, criteria: { type: "boss_fights", target: 10 } },
  { id: "ach-collector", title: "Achievement Collector", description: "Unlock 10 achievements", category: "social", icon: "Medal", rarity: "epic", xp_reward: 750, criteria: { type: "achievements_unlocked", target: 10 } },
]

export interface UserAchievementState {
  achievementId: string
  progress: number
  target: number
  unlocked: boolean
  claimed: boolean
  unlockedAt?: string
  claimedAt?: string
}

export const rarityColors: Record<string, string> = {
  common: "text-zinc-400 border-zinc-400/30 bg-zinc-400/10",
  uncommon: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  rare: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  epic: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  legendary: "text-orange-400 border-orange-400/30 bg-orange-400/10",
}

export const rarityStars: Record<string, string> = {
  common: "★",
  uncommon: "★★",
  rare: "★★★",
  epic: "★★★★",
  legendary: "★★★★★",
}

export const categoryIcons: Record<string, string> = {
  curriculum: "BookOpen",
  social: "Users",
  speed: "Zap",
  special: "Sparkles",
}
