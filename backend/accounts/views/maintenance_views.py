from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.utils.system_metrics import get_system_metrics
import time
from datetime import datetime

class MaintenanceBackupView(APIView):
    def post(self, request):
        try:
            # Simuler une sauvegarde
            time.sleep(2)
            return Response({
                'success': True,
                'message': 'Sauvegarde effectuée avec succès',
                'timestamp': datetime.now().isoformat()
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=500)

class MaintenanceStatusView(APIView):
    def get(self, request):
        try:
            metrics = get_system_metrics()
            return Response(metrics)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=500)