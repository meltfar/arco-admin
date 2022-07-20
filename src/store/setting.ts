import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface GlobalState {
  settings?: {
    colorWeek?: boolean;
    navbar?: boolean;
    menu?: boolean;
    footer?: boolean;
    themeColor?: string;
    menuWidth?: number;
  };
  userInfo?: {
    name?: string;
    avatar?: string;
    job?: string;
    organization?: string;
    location?: string;
    email?: string;
    permissions: Record<string, string[]>;
  };
  userLoading?: boolean;
}

const initialState: GlobalState = {
  settings: {
    colorWeek: false,
    navbar: true,
    menu: true,
    footer: true,
    themeColor: '#165DFF',
    menuWidth: 220,
  },
  userInfo: {
    permissions: {},
  },
};

export const fetchUserInfo = createAsyncThunk<
  GlobalState['userInfo'],
  number
>('users/fetchUserInfo', async (params, thunkApi) => {
  const resp = await axios.get('/api/user/userInfo');
  return resp.data;
});

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<GlobalState>) => {
      return { ...state, settings: action.payload.settings };
    },
    updateUserInfo: (state, action: PayloadAction<GlobalState>) => {
      const { userInfo = state.userInfo, userLoading = state.userLoading } =
        action.payload;
      return { ...state, userInfo, userLoading };
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      return { ...state, userInfo: action.payload, userLoading: false };
    });
    builder.addCase(fetchUserInfo.pending, (state) => {
      return { ...state, userLoading: true };
    });
    builder.addCase(fetchUserInfo.rejected, (state) => {
      return { ...state, userLoading: false };
    });
  },
});

export const { updateSettings, updateUserInfo } = settingSlice.actions;
