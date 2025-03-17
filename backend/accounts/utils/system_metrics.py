import psutil
from datetime import datetime

def get_system_metrics():
    try:
        metrics = {
            'cpu': psutil.cpu_percent(interval=1),
            'memory': psutil.virtual_memory().percent,
            'disk': psutil.disk_usage('/').percent,
            'timestamp': datetime.now().isoformat()
        }

        status_level = 'normal'
        if any(value > 80 for value in [metrics['cpu'], metrics['memory'], metrics['disk']]):
            status_level = 'warning'
        if any(value > 90 for value in [metrics['cpu'], metrics['memory'], metrics['disk']]):
            status_level = 'error'

        return {
            'status': status_level,
            'details': {
                'cpu': round(metrics['cpu'], 2),
                'memory': round(metrics['memory'], 2),
                'disk': round(metrics['disk'], 2)
            },
            'timestamp': metrics['timestamp']
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }