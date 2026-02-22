import { ATCSDecisionSchema } from "../types/atcs";

export const mockATCSDecision: ATCSDecisionSchema = {
    input: {
        venue: {
            name: "AISSMS, Pune",
            type: "college",
            capacity: "5,000"
        },
        event_context: {
            likely_event_today: "Tech Surge 2026, National Robotics Summit",
            date: "22 February 2026",
            estimated_attendance: "2,500"
        },
        traffic_prediction: {
            severity: "MODERATE",
            congestion_index: 65,
            confidence: 60,
            peak_period: {
                start: "10:00",
                end: "12:00",
                label: "10:00 AM – 12:00 PM",
                description: "Morning arrival of students and event attendees."
            }
        },
        impact_zones: [
            {
                radius: "0–500m",
                level: 2,
                roads_affected: "Kennedy Road, Shivajinagar Road"
            },
            {
                radius: "500m–2km",
                level: 1,
                roads_affected: "Pune University Road, Senapati Bapat Road"
            }
        ],
        location: {
            latitude: 18.5313127,
            longitude: 73.8657134,
            google_maps_link: "https://www.google.com/maps?q=18.5313127,73.8657134"
        },
        nearest_metro_station: {
            station_name: "Mangalwar Peth",
            distance_km: 0.14,
            walking_time_mins: 2,
            auto_time_mins: 0,
            lat: 18.5300875,
            lon: 73.8654426,
            osm_id: 7944584974,
            google_maps_link: "https://www.google.com/maps/dir/?api=1&destination=18.5300875,73.8654426"
        },
        weather: {
            condition: "Clear Sky",
            temperature_c: 24.39,
            feels_like_c: 24.09,
            humidity_percent: 46,
            wind_speed_kmh: 5.3,
            wind_direction_deg: 255,
            visibility_km: 10,
            cloud_cover_percent: 10,
            rain_last_1h_mm: 0,
            traffic_weather_impact: "LOW — Weather conditions are favorable for travel"
        },
        mappls_live_traffic: {
            distance_km: 4.31,
            travel_time_min: 8.5,
            traffic_delay_min: 0,
            average_speed_kmh: 30.5,
            congestion_level: "LOW"
        }
    },
    output: {
        decision_summary: "Anticipate moderate congestion due to VIT's Alacrity Fest Day 3, particularly during student departure. Proactive signal adjustments and public advisories are needed to manage traffic flow around Bibwewadi Road and Lullanagar Chowk.",
        priority_level: "medium",
        signal_actions: [
            {
                junction_area: "Bibwewadi Road - VIT Main Gate",
                east_west_green_time_sec: 45,
                north_south_green_time_sec: 60,
                reason: "Prioritize outflow from VIT during peak departure hours (4:00 PM - 6:30 PM) to prevent immediate choke points."
            },
            {
                junction_area: "Lullanagar Chowk",
                east_west_green_time_sec: 50,
                north_south_green_time_sec: 55,
                reason: "Slightly increase green time for traffic moving away from VIT towards Kondhwa Road to facilitate dispersion."
            }
        ],
        traffic_management_actions: [
            "Deploy traffic wardens/police personnel at Bibwewadi Road near VIT and Lullanagar Chowk from 3:30 PM to 7:00 PM.",
            "Monitor real-time traffic conditions via CCTV and Mappls Live Traffic for immediate adjustments.",
            "Ensure clear access for emergency services around VIT and major arterial roads.",
            "Consider temporary 'No Parking' zones on Bibwewadi Road adjacent to VIT if congestion escalates."
        ],
        public_advisories: [
            "ATTENTION: Expect moderate traffic congestion around VIT Pune (Bibwewadi Road, Lullanagar Chowk) between 4:00 PM and 6:30 PM today due to the Alacrity Fest. Please plan your commute accordingly.",
            "Commuters are advised to use alternative routes if possible or allow for extra travel time when passing through Bibwewadi and Kondhwa areas.",
            "Public transport is recommended for those attending or traveling near VIT Pune."
        ],
        risk_assessment: {
            choke_probability: 0.6,
            crash_risk: 0.4,
            pedestrian_density: "high"
        },
        map_visualization_flags: {
            highlight_event_zone: true,
            highlight_congestion: true,
            show_metro_option: false,
            alert_level: "orange"
        },
        next_review_in_minutes: 30,
        confidence: 0.7
    }
};
