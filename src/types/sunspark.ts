export type AssessmentAnswers = {
  sunlight?: string;
  roof_space?: string;
  payment_preference?: string;
  installation_timeline?: string;
};

export type SunsparkResult = {
  success: boolean;
  monthly_bill: number | null;
  kwh_usage: number | null;
  rate_per_kwh_found_on_bill: number | null;
  effective_rate_per_kwh: number | null;
  assessment_answers?: AssessmentAnswers;
  solar: {
    lat: number;
    lon: number;
    atlas_url: string;
    pvout_daily: number | null;
    pvout_source: string;
    ghi_annual: number | null;
    ghi_daily: number | null;
    dni_annual: number | null;
    dif_annual: number | null;
    gti_annual: number | null;
    optimal_tilt_angle: number | null;
    temperature: number | null;
  };
  estimate: {
    recommended_system_size_kwp: number | null;
    estimated_monthly_production_kwh: number | null;
    estimated_monthly_savings: number | null;
    estimated_annual_savings: number | null;
    coverage_percentage: number | null;
  };
};