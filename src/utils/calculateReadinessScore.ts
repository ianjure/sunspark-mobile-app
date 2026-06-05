import { SunsparkResult } from '@/src/types/sunspark';

export function calculateReadinessScore(result: SunsparkResult): number {
  let score = 60;

  const coverage = result.estimate?.coverage_percentage ?? 0;
  const pvoutDaily = result.solar?.pvout_daily ?? 0;
  const roofSpace = result.assessment_answers?.roof_space;
  const sunlight = result.assessment_answers?.sunlight;

  if (coverage >= 70) score += 10;
  if (pvoutDaily >= 4) score += 10;

  if (sunlight === 'Mostly sunny') score += 10;
  if (sunlight === 'Partially shaded') score += 5;
  if (sunlight === 'Heavily shaded') score -= 5;

  if (roofSpace === 'Large') score += 10;
  if (roofSpace === 'Medium') score += 5;
  if (roofSpace === 'Small') score -= 5;

  return Math.max(0, Math.min(100, score));
}

export function getReadinessLabel(score: number): string {
  if (score >= 80) return 'GREAT FIT FOR SOLAR';
  if (score >= 60) return 'GOOD FIT FOR SOLAR';
  return 'NEEDS MORE REVIEW';
}
