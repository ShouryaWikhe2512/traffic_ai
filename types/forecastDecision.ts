export interface ForecastDecision {
    decision_summary: string;
    priority_level: "low" | "medium" | "high";
    signal_actions: {
        junction_area: string;
        east_west_green_time_sec: number;
        north_south_green_time_sec: number;
        reason: string;
        location?: {
            latitude: number;
            longitude: number;
        };
    }[];
    traffic_management_actions: string[];
    public_advisories: string[];
    risk_assessment: {
        choke_probability: number;
        crash_risk: number;
        pedestrian_density: "low" | "moderate" | "high";
    };
    map_visualization_flags: {
        highlight_event_zone: boolean;
        highlight_congestion: boolean;
        show_metro_option: boolean;
        alert_level: "green" | "orange" | "red";
    };
    next_review_in_minutes: number;
    confidence: number;
    location?: {
        latitude: number;
        longitude: number;
    };
}
