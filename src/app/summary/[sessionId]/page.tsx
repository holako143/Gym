"use client";
import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const SessionSummary: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId;

  const session = useLiveQuery(() => db.sessions.get(Number(sessionId)), [sessionId]);

  const stats = useMemo(() => {
    if (!session) return null;

    let totalVolume = 0;
    let totalSets = 0;
    const completedExercises = session.completedExercises.length;

    session.completedExercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        totalVolume += (set.weight || 0) * (set.reps || 0);
        totalSets++;
      });
    });

    return {
      duration: session.duration,
      totalVolume,
      totalSets,
      completedExercises,
    };
  }, [session]);

  if (!session || !stats) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography>جاري تحميل ملخص الجلسة...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          الجلسة مكتملة!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          أداء رائع، إليك ملخص جلستك.
        </Typography>

        <List>
            <ListItem>
                <ListItemText primary="المدة الإجمالية" secondary={`${stats.duration} دقيقة`} />
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary="الحجم التدريبي الكلي" secondary={`${stats.totalVolume} رطل`} />
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary="مجموع المجموعات" secondary={stats.totalSets} />
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary="التمارين المكتملة" secondary={stats.completedExercises} />
            </ListItem>
        </List>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<DoneAllIcon />}
            onClick={() => router.push('/plans')}
          >
            تم
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SessionSummary;