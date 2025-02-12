import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { Clock, Users, Calendar, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from "./ui/button";

const Dashboard = () => {
  // Données enrichies
  const presenceData = [
    { mois: 'Jan', présences: 22, retards: 3, absences: 1, performance: 92 },
    { mois: 'Fév', présences: 20, retards: 2, absences: 0, performance: 95 },
    { mois: 'Mar', présences: 21, retards: 1, absences: 2, performance: 88 },
    { mois: 'Avr', présences: 19, retards: 4, absences: 1, performance: 85 },
    { mois: 'Mai', présences: 23, retards: 2, absences: 0, performance: 94 },
    { mois: 'Juin', présences: 21, retards: 3, absences: 1, performance: 89 }
  ];

  const performanceData = [
    { name: 'Objectifs atteints', value: 85, color: '#4F46E5' },
    { name: 'En cours', value: 15, color: '#E5E7EB' }
  ];

  const COLORS = {
    primary: '#4F46E5',
    secondary: '#818CF8',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    background: '#ffffff'
  };

  const statsCards = [
    {
      title: "Taux de présence",
      value: "95%",
      change: "+2.5%",
      trend: "up",
      icon: Clock,
      color: "text-emerald-500"
    },
    {
      title: "Performance mensuelle",
      value: "89%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-500"
    },
    {
      title: "Retards",
      value: "3",
      change: "-1",
      trend: "down",
      icon: Users,
      color: "text-amber-500"
    },
    {
      title: "Jours travaillés",
      value: "22/23",
      change: "Normal",
      trend: "neutral",
      icon: Calendar,
      color: "text-violet-500"
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="font-medium">{entry.name}:</span>
              <span className="text-gray-600">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500">Vue d'ensemble de vos performances</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Télécharger le rapport
        </Button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    {card.trend === "up" && <ArrowUp className="w-4 h-4 text-emerald-500" />}
                    {card.trend === "down" && <ArrowDown className="w-4 h-4 text-red-500" />}
                    <span className={`text-sm ${card.color}`}>{card.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique de présence */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des présences</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={presenceData}>
              <defs>
                <linearGradient id="colorPresence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="présences" 
                stroke={COLORS.primary} 
                fillOpacity={1} 
                fill="url(#colorPresence)" 
              />
              <Line 
                type="monotone" 
                dataKey="performance" 
                stroke={COLORS.secondary}
                strokeWidth={2}
                dot={{ fill: COLORS.secondary, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique de performance */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des objectifs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique tendances */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendances détaillées</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={presenceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mois" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="présences" fill={COLORS.success} radius={[4, 4, 0, 0]} />
            <Bar dataKey="retards" fill={COLORS.warning} radius={[4, 4, 0, 0]} />
            <Bar dataKey="absences" fill={COLORS.danger} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard; 