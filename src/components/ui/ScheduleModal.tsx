import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Video, MapPin, Users } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import NeonButton from './NeonButton';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendeeId: string;
  attendeeName: string;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

const durations = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
];

const meetingTypes = [
  { value: 'video', label: 'Video Call', icon: Video },
  { value: 'in_person', label: 'In Person', icon: Users },
];

const ScheduleModal = ({ isOpen, onClose, attendeeId, attendeeName }: ScheduleModalProps) => {
  const { session } = useAuth();
  const [title, setTitle] = useState(`Meeting with ${attendeeName}`);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState(30);
  const [meetingType, setMeetingType] = useState('video');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Generate next 7 days
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleSubmit = async () => {
    if (!session?.user?.id || !selectedTime) {
      toast({ title: 'Error', description: 'Please select a time slot', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(hours, minutes, 0, 0);

      const { error } = await supabase.from('meetings').insert({
        organizer_id: session.user.id,
        attendee_id: attendeeId,
        title,
        description,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: duration,
        meeting_type: meetingType,
        location: meetingType === 'in_person' ? location : null,
        meeting_url: meetingType === 'video' ? `https://meet.lovable.app/${crypto.randomUUID().slice(0, 8)}` : null,
      });

      if (error) throw error;

      toast({ title: 'Meeting Scheduled!', description: `Your meeting with ${attendeeName} has been scheduled.` });
      onClose();

    } catch (err) {
      console.error('Error scheduling meeting:', err);
      toast({ title: 'Error', description: 'Failed to schedule meeting. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-background border border-border/50 rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm p-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-xl font-bold">Schedule Meeting</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Meeting Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-primary/50 focus:outline-none"
            />
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Select Date
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {days.map((day) => (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl border transition-colors ${
                    selectedDate.toDateString() === day.toDateString()
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted border-border/50 hover:border-primary/50'
                  }`}
                >
                  <div className="text-xs opacity-70">{format(day, 'EEE')}</div>
                  <div className="text-lg font-bold">{format(day, 'd')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Select Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTime === time
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <div className="flex gap-2">
              {durations.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    duration === d.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Meeting Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Meeting Type</label>
            <div className="flex gap-2">
              {meetingTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setMeetingType(type.value)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    meetingType === type.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location (for in-person) */}
          {meetingType === 'in_person' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter meeting location"
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-primary/50 focus:outline-none"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add any notes or agenda..."
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-primary/50 focus:outline-none resize-none"
            />
          </div>

          {/* Submit */}
          <NeonButton
            onClick={handleSubmit}
            disabled={!selectedTime || submitting}
            className="w-full"
          >
            {submitting ? 'Scheduling...' : 'Schedule Meeting'}
          </NeonButton>
        </div>
      </motion.div>
    </div>
  );
};

export default ScheduleModal;
