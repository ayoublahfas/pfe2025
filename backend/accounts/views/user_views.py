from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.models.utilisateur import Utilisateur
from accounts.serializers.utilisateur_serializer import UtilisateurSerializer

class UserView(APIView):
    def get(self, request):
        users = Utilisateur.objects.all()
        serializer = UtilisateurSerializer(users, many=True)
        return Response({'success': True, 'data': serializer.data})

    def post(self, request):
        serializer = UtilisateurSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)