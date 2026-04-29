import React from "react";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const Categories = {
  TO_DO: "TO_DO",
  DOING: "DOING",
  DONE: "DONE",
} as const;

export type Category = string;

export interface IToDo {
  text: string;
  id: number;
  category: Category;
}

export const toDoState = atomWithStorage<IToDo[]>("toDos", [], {
  getItem(key, initialValue) {
    try {
      const stored = localStorage.getItem(key);
      const parsed = stored ? JSON.parse(stored) : initialValue;
      return Array.isArray(parsed) ? parsed : initialValue;
    } catch {
      return initialValue;
    }
  },
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
});

export const customCategoriesState = atomWithStorage<string[]>("customCategories", [], {
  getItem(key, initialValue) {
    try {
      const stored = localStorage.getItem(key);
      const parsed = stored ? JSON.parse(stored) : initialValue;
      return Array.isArray(parsed) ? parsed : initialValue;
    } catch {
      return initialValue;
    }
  },
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
});

export const categoryState = atom<Category>(Categories.TO_DO);

export const allCategoriesSelector = atom((get) => {
  const custom = get(customCategoriesState);
  return [...Object.values(Categories), ...custom];
});

export const toDoSelector = atom((get) => {
  const toDos = get(toDoState);
  const category = get(categoryState);
  return toDos.filter((toDo) => toDo.category === category);
});
