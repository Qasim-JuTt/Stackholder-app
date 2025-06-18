import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AddTransactionModal = ({ open, onClose, editId, refreshData }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [project, setProject] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [projectOptions, setProjectOptions] = useState([]);

  const expenseCategories = ['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Other'];

  // Fetch project options
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/projects/getName')
      .then(res => setProjectOptions(res.data))
      .catch(err => console.error('Failed to fetch projects:', err));
  }, []);

  // Load transaction data for editing
  useEffect(() => {
    if (open && editId) {
      axios
        .get(`http://localhost:5000/api/projectfinance/get/${editId}`)
        .then((res) => {
          const t = res.data;
          setAmount(t.amount || '');
          setDate(t.date ? new Date(t.date) : new Date());
          setCategory(t.category || '');
          setProject(t.project?._id || '');
          setDescription(t.description || '');
          setType('expense'); // Always set to expense
        })
        .catch((err) => console.error('Failed to fetch transaction:', err));
    }

    // Reset when opening in "add" mode
    if (open && !editId) {
      resetForm();
    }
  }, [editId, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transactionData = {
      amount: parseFloat(amount),
      date,
      category,
      project,
      description,
      type
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/projectfinance/update/${editId}`, transactionData);
      } else {
        await axios.post('http://localhost:5000/api/projectfinance/create', transactionData);
      }

      refreshData();
      onClose();
      resetForm();
    } catch (error) {
      console.error(editId ? 'Failed to update transaction:' : 'Failed to add transaction:', error);
    }
  };

  const resetForm = () => {
    setAmount('');
    setDate(new Date());
    setCategory('');
    setProject('');
    setDescription('');
    setType('expense');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '12px',
          overflow: 'visible',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          padding: '32px'
        }
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '16px',
          position: 'relative',
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#4338ca' }}>
          {editId ? 'Edit Transaction' : 'Add Transaction'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={() => {
            onClose();
            resetForm();
          }}
          sx={{
            color: '#9ca3af',
            position: 'absolute',
            right: '8px',
            top: '8px',
            '&:hover': { color: '#ef4444' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent
        dividers
        sx={{
          paddingTop: '12px',
          paddingX: '12px',
          marginTop: '16px',
          '& > * + *': { marginTop: '16px' }
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <form id="add-transaction-form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    label="Type"
                    required
                  >
                    <MenuItem value="expense">Expense</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  inputProps={{ min: 0, step: '0.01' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category"
                    required
                  >
                    {expenseCategories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Project</InputLabel>
                  <Select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    label="Project"
                    required
                  >
                    {projectOptions.map((proj) => (
                      <MenuItem key={proj._id} value={proj._id}>{proj.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </form>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '16px',
          paddingX: '16px',
          paddingBottom: '16px',
          justifyContent: 'flex-end',
          gap: '16px'
        }}
      >
        <Button 
          onClick={() => {
            onClose();
            resetForm();
          }}
          sx={{
            paddingX: '16px',
            paddingY: '8px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            color: '#4b5563',
            '&:hover': { backgroundColor: '#f3f4f6' }
          }}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          form="add-transaction-form"
          sx={{
            paddingX: '16px',
            paddingY: '8px',
            backgroundColor: '#4f46e5',
            color: 'white',
            borderRadius: '8px',
            '&:hover': { backgroundColor: '#4338ca' }
          }}
        >
          {editId ? 'Update' : 'Add'} Transaction
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionModal;
