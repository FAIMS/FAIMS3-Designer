import { configureStore } from '@reduxjs/toolkit'
import metadataReducer from './metadata-reducer'
import uiSpecificationReducer from './uiSpec-reducer'

const loggerMiddleware = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

export const store = configureStore({
  reducer: {
    metadata: metadataReducer,
    "ui-specification": uiSpecificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch