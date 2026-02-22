export interface ATCSDecisionSchema {
    input: {
        venue: {
            name: string
            type: string
            capacity: string
        }
        event_context: {
            likely_event_today: string
            date: string
            estimated_attendance: string
        }
        traffic_prediction: {
            severity: "CLEAR" | "LOW" | "MODERATE" | "HIGH"
            congestion_index: number
            confidence: number
            peak_period: {
                start: string
                end: string
                label: string
                description: string
            }
        }
        impact_zones: {
            radius: string
            level: number
            roads_affected: string
        }[]
        location: {
            latitude: number
            longitude: number
            google_maps_link: string
        }
        nearest_metro_station?: {
            station_name: string
            distance_km?: number
            walking_time_mins?: number
            auto_time_mins?: number
            lat?: number
            lon?: number
            osm_id?: number
            google_maps_link?: string
            error?: string
            note?: string
        }
        weather: {
            condition: string
            temperature_c: number
            feels_like_c?: number
            humidity_percent?: number
            wind_speed_kmh?: number
            wind_direction_deg?: number
            visibility_km?: number
            cloud_cover_percent?: number
            rain_last_1h_mm?: number
            traffic_weather_impact: string
        }
        mappls_live_traffic: {
            "Distance (km)"?: number
            "Travel Time (min)": number
            "Traffic Delay (min)"?: number
            "Average Speed (km/h)": number
            "Congestion Level": string
        }
    }

    output: {
        decision_summary: string
        priority_level: "low" | "medium" | "high"
        signal_actions: {
            junction_area: string
            east_west_green_time_sec: number
            north_south_green_time_sec: number
            reason: string
        }[]
        traffic_management_actions: string[]
        public_advisories: string[]
        risk_assessment: {
            choke_probability: number
            crash_risk: number
            pedestrian_density: string
        }
        map_visualization_flags: {
            highlight_event_zone: boolean
            highlight_congestion: boolean
            show_metro_option?: boolean
            alert_level: "green" | "orange" | "red"
        }
        next_review_in_minutes: number
        confidence: number
    }
}
