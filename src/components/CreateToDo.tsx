import React from "react";
import { useForm } from "react-hook-form";
import { useAtomValue, useSetAtom } from "jotai";
import { categoryState, toDoState } from "../atoms";

interface IForm {
  toDo: string;
}

const CreateToDo = () => {
  const setToDos = useSetAtom(toDoState);
  const category = useAtomValue(categoryState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const handleValid = ({ toDo }: IForm) => {
    setToDos((oldToDos) => [
      { text: toDo, id: Date.now(), category },
      ...oldToDos,
    ]);
    setValue("toDo", "");
  };
  return (
    <form onSubmit={handleSubmit(handleValid)}>
      <input
        {...register("toDo", {
          required: "할 일을 입력해주세요",
        })}
        placeholder="할 일입력"
      />
      <button>추가</button>
    </form>
  );
};

export default CreateToDo;
