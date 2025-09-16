// store/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import { RESET_STATE } from "./reset";
import userReducer from "./slice/userSlice";
import cartReducer from "./slice/cartSlice";
import { api } from "./api";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user", "isEmailVerified", "isLoggedIn"],
};

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items"],
};

const combinedReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
  [api.reducerPath]: api.reducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STATE) {
    storage.removeItem("persist:user");
    storage.removeItem("persist:cart");
    state = undefined;
  }
  return combinedReducer(state, action);
};

export default rootReducer;
