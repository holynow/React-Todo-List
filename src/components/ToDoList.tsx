import React from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import CreateToDo from "./CreateToDo";
import {
  categoryState,
  customCategoriesState,
  toDoSelector,
  allCategoriesSelector,
} from "../atoms";
import ToDo from "./ToDo";

interface ICategoryForm {
  categoryName: string;
}

const ToDoList = () => {
  const toDos = useAtomValue(toDoSelector);
  const [category, setCategory] = useAtom(categoryState);
  const allCategories = useAtomValue(allCategoriesSelector);
  const setCustomCategories = useSetAtom(customCategoriesState);
  const { register, handleSubmit, setValue } = useForm<ICategoryForm>();

  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    setCategory(event.currentTarget.value);
  };

  const onAddCategory = ({ categoryName }: ICategoryForm) => {
    setCustomCategories((prev) => [...prev, categoryName]);
    setValue("categoryName", "");
  };

  return (
    <div>
      <h1>To Dos</h1>
      <hr />
      <select value={category} onInput={onInput}>
        {allCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <form onSubmit={handleSubmit(onAddCategory)}>
        <input
          {...register("categoryName", { required: true })}
          placeholder="새 카테고리 이름"
        />
        <button>카테고리 추가</button>
      </form>
      <CreateToDo />
      {toDos?.map((toDo) => (
        <ToDo key={toDo.id} {...toDo} />
      ))}
    </div>
  );
};

export default ToDoList;
