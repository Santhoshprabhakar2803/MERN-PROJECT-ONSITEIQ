from flask import Flask, jsonify
from flask_cors import CORS
import random
from datetime import datetime

# Updated ConstructionSiteMonitor class with 5 zones
class ConstructionSiteMonitor:
    def __init__(self, site_id):  
        self.site_id = site_id
        self.equipment_types = ['Crane', 'Excavator', 'Bulldozer', 'Concrete Mixer']
        self.project_phases = ['Foundation', 'Structural', 'Interior', 'Finishing']
        self.zones = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4','Zone 5']  # Now 5 zones for noise levels
        self.current_phase = 0
        self.phase_progress = 0
        
    def generate_iot_data(self):
        return {
            'timestamp': datetime.now().isoformat(),
            'structural_integrity': random.uniform(90, 100),
            'air_quality_index': random.uniform(10, 150),
            'noise_data': [
                {'zone': zone, 'noise_level_db': random.uniform(70, 95)} for zone in self.zones  # 5 zones
            ],
            'temperature_c': random.uniform(15, 40),
            'weather': random.choice(['Sunny', 'Cloudy', 'Rainy', 'Snowy']),
            'equipment_in_use': random.sample(self.equipment_types, random.randint(1, len(self.equipment_types)))
        }
    
    def generate_all_metrics(self):
        return {
            'site_id': self.site_id,
            'timestamp': datetime.now().isoformat(),
            'iot_data': self.generate_iot_data()
        }

# Flask App Setup
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
monitor = ConstructionSiteMonitor("SITE_001")

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    metrics = monitor.generate_all_metrics()
    return jsonify(metrics)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
