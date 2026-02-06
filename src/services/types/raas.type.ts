export interface Product {
  amazon_profile_name: string
  hanna_org_name: string
  asin_list: string[]
  category_name: string
  raas_plan: string
  start_date: string
  end_date: string
  baseline_sales_rank?: number | null
  status?: string
}

export interface ProductCreate {
  amazon_profile_name: string
  hanna_org_name: string
  asin_list: string[]
  category_name: string
  raas_plan: string
  start_date: string
  end_date: string
  baseline_sales_rank?: number | null
  status?: string
}

export interface ProductUpdate {
  amazon_profile_name: string
  hanna_org_name: string
  asin_list: string[]
  category_name: string
  raas_plan: string
  start_date: string
  end_date: string
  baseline_sales_rank?: number | null
  status?: string
}

export interface ProductCompositeKey {
  amazon_profile_name: string
  hanna_org_name: string
  asin_list: string[]
  category_name: string
  raas_plan: string
  start_date: string
}

export type AdWindow = '7d' | '14d' | '30d'

export interface ProductFilter {
  amazon_profile_name?: string
  hanna_org_name?: string
  raas_plan?: string
  category_name?: string
  status?: string
  ad_window?: AdWindow
  start_date_from?: string
  start_date_to?: string
  end_date_from?: string
  end_date_to?: string
}

export interface ProductListResponse {
  items: Product[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface BsrFetchRequest {
  asin_list: string[]
  category_name: string
}

export interface BsrFetchResponse {
  baseline_sales_rank?: number | null
  status: 'found' | 'fetching_triggered' | 'error'
  message?: string
}

export interface ProgressItem {
  asin?: string
  img_url?: string
  amazon_profile_name?: string
  hanna_org_name?: string
  category_name?: string
  raas_plan?: string
  status?: string
  start_date?: string
  end_date?: string
  days_remaining?: number
  baseline_sales_rank?: number
  current_sales_rank?: number
  climb_days_met?: number
  days_taken?: number
  datetime_achived?: string
  ad_spend?: number
  ad_sales?: number
  ad_orders?: number
  acos?: number
  cyber_minigun_actions?: number
  cyber_minigun_launch_groups?: number
  campaigns_created_by_cyber_minigun?: number
  adgroups_created_by_cyber_minigun?: number
  smart_campaigns?: number
  campaigns_created_by_smart_campaigns?: number
  adgroups_created_by_smart_campaigns?: number
}

export interface ProgressResponse {
  items: ProgressItem[]
  total: number
  query_asin_count: number
}

export interface ProductListParams extends ProductFilter {
  page?: number
  page_size?: number
}
