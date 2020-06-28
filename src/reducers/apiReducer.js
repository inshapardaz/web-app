import {ENTRY, CATEGORIES, SERIES } from '../actions/actionTypes';

export default function apiReducer(state = {}, action) {
    switch (action.type) {
      case ENTRY:
        return {
          ...state,
          entry: action.payload,
        };
      case CATEGORIES:
        return {
          ... state,
          categories: action.payload,
        }
      case SERIES:
        return {
          ... state,
          series: action.payload,
        }
      default:
        return state;
    }
  }
  