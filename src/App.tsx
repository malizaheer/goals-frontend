import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "https://goal-backend.invo.zone/goals";

interface Goal {
  id: number;
  text: string;
}

function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newGoal, setNewGoal] = useState<string>("");
  const [error, setError] = useState<string>("");

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setGoals(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch goals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newGoal }),
      });
      if (!res.ok) throw new Error("Failed to add goal.");
      const addedGoal = await res.json();
      setGoals((prev) => [...prev, addedGoal]);
      setNewGoal("");
      setError("");
    } catch (err) {
      setError("Could not add goal.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete goal.");
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
      setError("");
    } catch (err) {
      setError("Could not delete goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={5} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          🎯 My Goals
        </Typography>
        <Box display="flex" justifyContent="center" mb={2}>
          <TextField
            label="Add a new goal"
            variant="outlined"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            sx={{ mr: 2, flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddGoal}
            disabled={loading || !newGoal.trim()}
          >
            Add
          </Button>
        </Box>
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <List>
          {loading ? (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          ) : goals.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No goals yet. Start by adding one!
            </Typography>
          ) : (
            goals.map((goal) => (
              <ListItem
                key={goal.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={goal.text} />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
}

export default App;
