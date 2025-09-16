-- Doctor Dashboard Statistics View
-- This creates a view that provides real-time statistics for each doctor

-- Create or replace a view that calculates doctor statistics
CREATE OR REPLACE VIEW doctor_dashboard_stats AS
SELECT 
    doctor_clerk_id,
    COUNT(*) as total_reports,
    COUNT(DISTINCT worker_health_id) as unique_workers,
    COUNT(CASE WHEN DATE(report_date) = CURRENT_DATE THEN 1 END) as reports_today,
    COUNT(CASE WHEN report_date >= DATE_TRUNC('week', CURRENT_DATE) THEN 1 END) as reports_this_week,
    MAX(report_date) as last_report_date,
    MIN(report_date) as first_report_date,
    COUNT(CASE WHEN follow_up_required = true THEN 1 END) as pending_followups
FROM medical_reports
GROUP BY doctor_clerk_id;

-- Create an index to optimize the view performance
CREATE INDEX IF NOT EXISTS idx_medical_reports_doctor_date 
ON medical_reports (doctor_clerk_id, report_date);

-- Create an index for worker_health_id lookups
CREATE INDEX IF NOT EXISTS idx_medical_reports_worker_health_id 
ON medical_reports (worker_health_id);

-- Create an index for follow-up queries
CREATE INDEX IF NOT EXISTS idx_medical_reports_followup 
ON medical_reports (follow_up_required, follow_up_date) 
WHERE follow_up_required = true;

-- Grant permissions to the view if using row-level security
-- ALTER VIEW doctor_dashboard_stats OWNER TO authenticated;

-- Optional: Create a materialized view for better performance if needed
-- This would need to be refreshed periodically
/*
CREATE MATERIALIZED VIEW doctor_dashboard_stats_mv AS
SELECT 
    doctor_clerk_id,
    COUNT(*) as total_reports,
    COUNT(DISTINCT worker_health_id) as unique_workers,
    COUNT(CASE WHEN DATE(report_date) = CURRENT_DATE THEN 1 END) as reports_today,
    COUNT(CASE WHEN report_date >= DATE_TRUNC('week', CURRENT_DATE) THEN 1 END) as reports_this_week,
    MAX(report_date) as last_report_date,
    MIN(report_date) as first_report_date,
    COUNT(CASE WHEN follow_up_required = true THEN 1 END) as pending_followups,
    CURRENT_TIMESTAMP as last_updated
FROM medical_reports
GROUP BY doctor_clerk_id;

-- Create a unique index on the materialized view
CREATE UNIQUE INDEX ON doctor_dashboard_stats_mv (doctor_clerk_id);

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_doctor_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY doctor_dashboard_stats_mv;
END;
$$ LANGUAGE plpgsql;
*/

-- Comments for documentation
COMMENT ON VIEW doctor_dashboard_stats IS 'Provides real-time statistics for each doctor including total reports, unique workers treated, and time-based metrics';
COMMENT ON COLUMN doctor_dashboard_stats.total_reports IS 'Total number of medical reports created by this doctor';
COMMENT ON COLUMN doctor_dashboard_stats.unique_workers IS 'Number of unique workers this doctor has treated';
COMMENT ON COLUMN doctor_dashboard_stats.reports_today IS 'Number of reports created today';
COMMENT ON COLUMN doctor_dashboard_stats.reports_this_week IS 'Number of reports created this week (Monday to Sunday)';
COMMENT ON COLUMN doctor_dashboard_stats.pending_followups IS 'Number of reports marked as requiring follow-up';