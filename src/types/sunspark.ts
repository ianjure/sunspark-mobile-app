export type AssessmentAnswers = {
  home_ownership?: string;
  sunlight?: string;
  roof_space?: string;
  payment_preference?: string;
  installation_timeline?: string;
};

export type SunsparkResult = {
  success: boolean;
  user_name?: string;
  monthly_bill: number | null;
  kwh_usage: number | null;
  avg_monthly_kwh: number | null;
  avg_monthly_bill: number | null;
  rate_per_kwh_found_on_bill: number | null;
  effective_rate_per_kwh: number | null;
  customer_type: string | null;
  assessment_answers?: AssessmentAnswers;
  readiness_score: number;
  readiness_label: string;
  location: {
    barangay: string | null;
    city_or_municipality: string | null;
    province: string | null;
  };
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
    target_offset_percent: number | null;
    monthly_production_per_kwp: number | null;
    target_kwh_offset: number | null;
    recommended_system_size_kwp: number | null;
    estimated_monthly_solar_kwh: number | null;
    estimated_monthly_production_kwh: number | null;
    estimated_monthly_savings: number | null;
    estimated_annual_savings: number | null;
    estimated_new_bill: number | null;
    estimated_install_cost: number | null;
    cost_per_kwp: number | null;
    payback_years: number | null;
    grid_emission_factor: number | null;
    monthly_co2_reduction_kg: number | null;
    annual_co2_reduction_tons: number | null;
    coverage_percentage: number | null;
  };
};
