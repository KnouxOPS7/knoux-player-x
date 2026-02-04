/**
 * Project: KNOUX Player X™
 * Layer: State -> Network Slice
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INetworkState } from "../../types/state";

const initialState: INetworkState = {
    isConnected: true,
    connectionType: "unknown",
    lastChecked: null
};

const networkSlice = createSlice({
    name: "network",
    initialState,
    reducers: {
        setConnectionState(state, action: PayloadAction<Pick<INetworkState, "isConnected" | "connectionType">>) {
            state.isConnected = action.payload.isConnected;
            state.connectionType = action.payload.connectionType;
            state.lastChecked = Date.now();
        },
        markChecked(state) {
            state.lastChecked = Date.now();
        }
    }
});

export const { setConnectionState, markChecked } = networkSlice.actions;

export default networkSlice.reducer;
