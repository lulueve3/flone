import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ currentPage, pageSize, searchText, orderBy }) => {
    const response = await axiosClient.get(
      `/orders/pagination?skip=${
        currentPage * pageSize
      }&limit=${pageSize}&orderBy=${orderBy}&displayName%7B%7Bsearch%7D%7D=${searchText}`
    );
    console.log(response);

    return response;
  }
);

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id) => {
  await axiosClient.delete(`/orders/${id}`);
  return id;
});

export const acceptOrder = createAsyncThunk('orders/acceptOrder', async (id) => {
  const response = await axiosClient.patch(`/orders/${id}/update-confirm`, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const cancelOrder = createAsyncThunk('orders/cancelOrder', async (id) => {
  const response = await axiosClient.patch(`/orders/${id}/update-cancel`, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const doneOrder = createAsyncThunk('orders/doneOrder', async (id) => {
  const response = await axiosClient.patch(`/orders/${id}/update-success`, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const updateOrder = createAsyncThunk('orders/updateOrder', async (order) => {
  const response = await axiosClient.patch(`/orders/${order.Id}`, order, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    data: [],
    pagination: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(acceptOrder.fulfilled, (state) => {})
      .addCase(cancelOrder.fulfilled, (state) => {})
      .addCase(doneOrder.fulfilled, (state) => {})
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.data = state.data.filter((order) => order.Id !== action.payload.data);
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.data.findIndex((order) => order.Id === action.payload.data.Id);
        state.data[index] = action.payload.data;
      });
  },
});

export const selectOrders = (state) => state.orders;

export default ordersSlice.reducer;
