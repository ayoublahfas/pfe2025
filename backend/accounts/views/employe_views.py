from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.models.employe import Employe
from accounts.serializers.employe_serializer import EmployeSerializer

class EmployeView(APIView):
    def get(self, request):
        employes = Employe.objects.all()
        serializer = EmployeSerializer(employes, many=True)
        return Response({'success': True, 'data': serializer.data})

    def post(self, request):
        serializer = EmployeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)