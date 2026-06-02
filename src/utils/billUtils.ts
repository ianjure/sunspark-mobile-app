import { SunsparkResult } from '@/src/types/sunspark';

export function parseNumber(value: string): number | null {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = Number(cleaned);

  if (!cleaned || Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

export function roundNumber(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}

export function recomputeEstimate(
  updatedResult: SunsparkResult,
): SunsparkResult {
  const monthlyBillValue = updatedResult.monthly_bill;
  const kwhUsageValue = updatedResult.kwh_usage;
  const effectiveRateValue = updatedResult.effective_rate_per_kwh;
  const pvOutputDaily = updatedResult.solar?.pvout_daily;

  const targetOffsetPercent = 0.7;
  const costPerKwp = 60000;
  const gridEmissionFactor = 0.7;

  if (
    monthlyBillValue === null ||
    kwhUsageValue === null ||
    effectiveRateValue === null ||
    pvOutputDaily === null ||
    pvOutputDaily === undefined ||
    monthlyBillValue <= 0 ||
    kwhUsageValue <= 0 ||
    effectiveRateValue <= 0 ||
    pvOutputDaily <= 0
  ) {
    return {
      ...updatedResult,
      estimate: {
        target_offset_percent: targetOffsetPercent,
        monthly_production_per_kwp: null,
        target_kwh_offset: null,
        recommended_system_size_kwp: null,
        estimated_monthly_solar_kwh: null,
        estimated_monthly_production_kwh: null,
        estimated_monthly_savings: null,
        estimated_annual_savings: null,
        estimated_new_bill: null,
        estimated_install_cost: null,
        cost_per_kwp: costPerKwp,
        payback_years: null,
        grid_emission_factor: gridEmissionFactor,
        monthly_co2_reduction_kg: null,
        annual_co2_reduction_tons: null,
        coverage_percentage: null,
      },
    };
  }

  const monthlyProductionPerKwp = pvOutputDaily * 30;
  const targetKwhOffset = kwhUsageValue * targetOffsetPercent;
  const recommendedSystemSizeKwpRaw = targetKwhOffset / monthlyProductionPerKwp;
  const recommendedSystemSizeKwp =
    Math.ceil(recommendedSystemSizeKwpRaw * 2) / 2;
  const estimatedMonthlySolarKwh =
    recommendedSystemSizeKwp * monthlyProductionPerKwp;
  const estimatedMonthlySavings = estimatedMonthlySolarKwh * effectiveRateValue;
  const estimatedAnnualSavings = estimatedMonthlySavings * 12;
  const estimatedNewBill = monthlyBillValue - estimatedMonthlySavings;
  const estimatedInstallCost = recommendedSystemSizeKwp * costPerKwp;
  const paybackYears = estimatedInstallCost / estimatedAnnualSavings;
  const monthlyCo2ReductionKg = estimatedMonthlySolarKwh * gridEmissionFactor;
  const annualCo2ReductionTons = (monthlyCo2ReductionKg * 12) / 1000;

  return {
    ...updatedResult,
    estimate: {
      target_offset_percent: roundNumber(targetOffsetPercent, 2),
      monthly_production_per_kwp: roundNumber(monthlyProductionPerKwp, 2),
      target_kwh_offset: roundNumber(targetKwhOffset, 2),
      recommended_system_size_kwp: roundNumber(recommendedSystemSizeKwp, 2),
      estimated_monthly_solar_kwh: roundNumber(estimatedMonthlySolarKwh, 2),
      estimated_monthly_production_kwh: roundNumber(
        estimatedMonthlySolarKwh,
        2,
      ),
      estimated_monthly_savings: roundNumber(estimatedMonthlySavings, 2),
      estimated_annual_savings: roundNumber(estimatedAnnualSavings, 2),
      estimated_new_bill: roundNumber(estimatedNewBill, 2),
      estimated_install_cost: roundNumber(estimatedInstallCost, 2),
      cost_per_kwp: costPerKwp,
      payback_years: roundNumber(paybackYears, 1),
      grid_emission_factor: gridEmissionFactor,
      monthly_co2_reduction_kg: roundNumber(monthlyCo2ReductionKg, 2),
      annual_co2_reduction_tons: roundNumber(annualCo2ReductionTons, 2),
      coverage_percentage: roundNumber(targetOffsetPercent * 100, 2),
    },
  };
}
