/**
 * Lead Types for IGrow Rentals LMS
 */

export interface Lead {
  id: string;
  timestamp: Date;
  name: string;
  email: string;
  phone?: string;
  source: 'facebook' | 'instagram' | 'google' | 'landing_page' | 'chatbot' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  interestedIn?: string;
  message?: string;
  assignedTo?: string;
  notes?: string;
  customFields?: Record<string, any>;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
  conversionRate: number;
}

export interface SourceStats {
  source: Lead['source'];
  count: number;
  percentage: number;
}

export interface TimeSeriesData {
  date: string;
  count: number;
  source?: Lead['source'];
}

export interface DashboardMetrics {
  todayLeads: number;
  weekLeads: number;
  monthLeads: number;
  conversionRate: number;
  avgResponseTime?: number;
  topSource: Lead['source'];
}
