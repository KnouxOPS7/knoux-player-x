/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Purpose: Custom middleware to log state changes in dev, but sanitizes output in production.
 */

import { Middleware } from "@reduxjs/toolkit";

export const knouxLogger: Middleware = (store) => (next) => (action: any) => {
    if (process.env.NODE_ENV !== "production") {
        console.group(`[KNOUX-ACTION] ${action.type}`);
        console.log("Payload:", action.payload);
        // console.log("Prev State:", store.getState());
    }

    const result = next(action);

    if (process.env.NODE_ENV !== "production") {
        // console.log("Next State:", store.getState());
        console.groupEnd();
    }

    return result;
};
