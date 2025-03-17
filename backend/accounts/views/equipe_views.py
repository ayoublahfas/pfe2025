from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from accounts.models.equipe import Equipe
from accounts.serializers.equipe_serializer import EquipeSerializer
import logging

class EquipeView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            equipes = Equipe.objects.all()
            serializer = EquipeSerializer(equipes, many=True)
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Exception as e:
            logger = logging.getLogger(__name__)
            logger.error(f"Erreur lors de la récupération des équipes: {str(e)}")
            return Response({
                'success': False,
                'message': str(e)
            }, status=400)

    def post(self, request):
        serializer = EquipeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)