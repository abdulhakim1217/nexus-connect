import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  MessageCircle, 
  TrendingUp,
  Target,
  Award,
  Activity,
  Download,
  Sparkles
} from 'lucide-react';
import Layout from '@/components/Layout';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';

interface Metric {
  label: string;
  value: number;
  change: number;
  icon: typeof Users;
  color: string;
}

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  const metrics: Metric[] = [
    { label: 'Total Matches', value: 47, change: 12, icon: Users, color: 'primary' },
    { label: 'Scheduled Meetings', value: 23, change: 8, icon: Calendar, color: 'accent' },
    { label: 'Active Connections', value: 34, change: 15, icon: MessageCircle, color: 'secondary' },
    { label: 'Response Rate', value: 78, change: 5, icon: TrendingUp, color: 'primary' },
  ];

  const chartData = [
    { day: 'Mon', matches: 8, meetings: 4 },
    { day: 'Tue', matches: 12, meetings: 7 },
    { day: 'Wed', matches: 15, meetings: 9 },
    { day: 'Thu', matches: 10, meetings: 6 },
    { day: 'Fri', matches: 6, meetings: 3 },
    { day: 'Sat', matches: 4, meetings: 2 },
    { day: 'Sun', matches: 2, meetings: 1 },
  ];

  const topMatches = [
    { name: 'Anna Chen', score: 94, company: 'DeFi Labs', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face' },
    { name: 'Marcus Rodriguez', score: 87, company: 'Ethereum Foundation', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face' },
    { name: 'Sarah Kim', score: 82, company: 'Web3 Startup', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face' },
    { name: 'David Thompson', score: 78, company: 'AI Research Lab', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face' },
  ];

  const engagementData = [
    { time: '9:00 AM', level: 'medium' },
    { time: '10:00 AM', level: 'high' },
    { time: '11:00 AM', level: 'very-high' },
    { time: '12:00 PM', level: 'low' },
    { time: '1:00 PM', level: 'medium' },
    { time: '2:00 PM', level: 'high' },
    { time: '3:00 PM', level: 'very-high' },
    { time: '4:00 PM', level: 'high' },
    { time: '5:00 PM', level: 'medium' },
  ];

  // Animate numbers on mount
  useEffect(() => {
    metrics.forEach((metric) => {
      let start = 0;
      const end = metric.value;
      const duration = 1500;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setAnimatedValues((prev) => ({ ...prev, [metric.label]: Math.floor(start) }));
      }, 16);
    });
  }, []);

  const getHeatmapColor = (level: string) => {
    switch (level) {
      case 'very-high': return 'bg-accent';
      case 'high': return 'bg-accent/70';
      case 'medium': return 'bg-primary/50';
      case 'low': return 'bg-muted';
      default: return 'bg-muted/50';
    }
  };

  const maxChartValue = Math.max(...chartData.map((d) => d.matches));

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between flex-wrap gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">
              <span className="gradient-text">Analytics</span> Dashboard
            </h1>
            <p className="text-muted-foreground">Track your networking success</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="neon-input w-auto"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <NeonButton variant="secondary">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </NeonButton>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6" glow={metric.color as any}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-${metric.color}/20 flex items-center justify-center`}>
                    <metric.icon className={`w-6 h-6 text-${metric.color}`} />
                  </div>
                  <motion.span
                    className="text-sm font-medium text-accent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    +{metric.change}%
                  </motion.span>
                </div>
                <motion.div
                  className="text-3xl font-bold text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {animatedValues[metric.label] || 0}
                  {metric.label === 'Response Rate' && '%'}
                </motion.div>
                <p className="text-sm text-muted-foreground mt-1">{metric.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold mb-6">Weekly Activity</h3>
              <div className="space-y-4">
                {chartData.map((data, index) => (
                  <div key={data.day} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium w-12">{data.day}</span>
                      <span className="text-muted-foreground">{data.matches} matches</span>
                    </div>
                    <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.matches / maxChartValue) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Top Matches */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold mb-4">Top Matches</h3>
              <div className="space-y-4">
                {topMatches.map((match, index) => (
                  <motion.div
                    key={match.name}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <img
                      src={match.avatar}
                      alt={match.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{match.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{match.company}</p>
                    </div>
                    <div className="text-sm font-bold text-accent">{match.score}%</div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Engagement Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Engagement Heatmap</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-muted" /> Low</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/50" /> Medium</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-accent/70" /> High</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-accent" /> Very High</span>
              </div>
            </div>
            <div className="flex gap-2 justify-center flex-wrap">
              {engagementData.map((slot, index) => (
                <motion.div
                  key={slot.time}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                >
                  <motion.div
                    className={`w-12 h-12 rounded-xl ${getHeatmapColor(slot.level)} transition-colors`}
                    whileHover={{ scale: 1.1 }}
                    animate={slot.level === 'very-high' ? {
                      boxShadow: ['0 0 0px hsl(var(--accent)/0)', '0 0 15px hsl(var(--accent)/0.5)', '0 0 0px hsl(var(--accent)/0)']
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs text-muted-foreground mt-1 block">{slot.time}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* AI Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20" glow="primary">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">AI Recommendations</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Schedule meetings during 10-11 AM for best results</li>
                    <li>• Follow up with matches within 24 hours</li>
                    <li>• Focus on high-score connections (90%+)</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <GlassCard className="p-6 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20" glow="secondary">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-secondary to-primary flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Performance Goals</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 50+ total matches this week ✓</li>
                    <li>• 30+ scheduled meetings ○</li>
                    <li>• 80%+ response rate ○</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
