import { ForecastDecision } from "../types/forecastDecision";

export const mockForecastDecision: ForecastDecision = {
    decision_summary: "AI models predict a 45% increase in traffic volume at University Circle due to an upcoming unplanned event. Adaptive signal timing recommended to prevent spillback.",
    priority_level: "medium",
    signal_actions: [
        {
            junction_area: "University Circle",
            east_west_green_time_sec: 45,
            north_south_green_time_sec: 30,
            reason: "Optimize outflow for University Road",
            location: { latitude: 18.5529, longitude: 73.8248 }
        },
        {
            junction_area: "Savitribai Phule Junction",
            east_west_green_time_sec: 40,
            north_south_green_time_sec: 35,
            reason: "Prioritize public transit corridor",
            location: { latitude: 18.5545, longitude: 73.8220 }
        }
    ],
    traffic_management_actions: [
        "Deploy additional Wardens at University Circle",
        "Monitor Kothrud-Shivajinagar corridor for spillback",
        "Standard timings maintained elsewhere"
    ],
    public_advisories: [
        "High congestion expected near University Circle between 18:00 - 19:30",
        "Consider taking the Metro Line 3 for faster transit"
    ],
    risk_assessment: {
        choke_probability: 0.65,
        crash_risk: 0.22,
        pedestrian_density: "high"
    },
    map_visualization_flags: {
        highlight_event_zone: true,
        highlight_congestion: true,
        show_metro_option: true,
        alert_level: "orange"
    },
    next_review_in_minutes: 30,
    confidence: 88,
    location: {
        latitude: 18.5529,
        longitude: 73.8248
    }
};
