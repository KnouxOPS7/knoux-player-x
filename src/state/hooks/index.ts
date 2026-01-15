/**
 * Project: KNOUX Player X™
 * Author: knoux
 * Purpose: Typed versions of useDispatch and useSelector for usage throughout the app.
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
