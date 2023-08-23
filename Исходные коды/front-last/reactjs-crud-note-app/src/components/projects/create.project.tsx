import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNoteFn } from "../../api/noteApi";
import NProgress from "nprogress";
import {createProjectFn} from "../../api/projectApi";

type ICreateNoteProps = {
  setOpenNoteModal: (open: boolean) => void;
};

const createNoteSchema = object({
    title: string().min(1, "Обязательное поле"),
    P: string().min(1, "Обязательное поле"),
    T: string().min(1, "Обязательное поле"),
    E: string().min(1, "Обязательное поле"),
    R: string().min(1, "Обязательное поле"),
});

export type CreateNoteInput = TypeOf<typeof createNoteSchema>;

const CreateProject: FC<ICreateNoteProps> = ({ setOpenNoteModal }) => {
  const methods = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const queryClient = useQueryClient();

  const { mutate: createProject } = useMutation({
    mutationFn: (note: CreateNoteInput) => createProjectFn(note),
    onMutate() {
      NProgress.start();
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["getNotes"]);
      setOpenNoteModal(false);
      NProgress.done();
      toast("Проект успешно создан", {
        type: "success",
        position: "top-right",
      });
    },
    onError(error: any) {
      setOpenNoteModal(false);
      NProgress.done();
      const resMessage =
        error.response.data.message ||
        error.response.data.detail ||
        error.message ||
        error.toString();
      toast(resMessage, {
        type: "error",
        position: "top-right",
      });
    },
  });

  const onSubmitHandler: SubmitHandler<CreateNoteInput> = async (data) => {
      createProject(data);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
        <h2 className="text-2xl text-ct-dark-600 font-semibold">Создание нового проекта</h2>
        <div
          onClick={() => setOpenNoteModal(false)}
          className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
        >
          <i className="bx bx-x"></i>
        </div>
      </div>
      <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Название
          </label>
          <input
              placeholder="Разработка сайта"
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
              `${errors["title"] && "border-red-500"}`
            )}
            {...methods.register("title")}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2 invisible`,
              `${errors["title"] && "visible"}`
            )}
          >
            {errors["title"]?.message as string}
          </p>
        </div>

          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
              Весовые коэффициенты характеристик
              <span className="text-sm"> (в сумме равные 1)</span>
          </label>

          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
              <span className="text-sm">Важность стоимости проекта</span>
          </label>

          <div className="mb-2">
              <input
                  placeholder="0.4"
                  className={twMerge(
                      `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
                      `${errors["P"] && "border-red-500"}`
                  )}
                  {...methods.register("P")}
              />
              <p
                  className={twMerge(
                      `text-red-500 text-xs italic mb-2 invisible`,
                      `${errors["P"] && "visible"}`
                  )}
              >
                  {errors["P"]?.message as string}
              </p>
          </div>

          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
              <span className="text-sm">Важность сроков выполнения</span>
          </label>

          <div className="mb-2">

              <input
                  placeholder="0.2"
                  className={twMerge(
                      `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
                      `${errors["T"] && "border-red-500"}`
                  )}

                  {...methods.register("T")}
              />
              <p
                  className={twMerge(
                      `text-red-500 text-xs italic mb-2 invisible`,
                      `${errors["T"] && "visible"}`
                  )}
              >
                  {errors['T']?.message as string}
              </p>
          </div>

          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
              <span className="text-sm">Важность компетенции исполнителей</span>
          </label>

          <div className="mb-2">

              <input
                  placeholder="0.2"
                  className={twMerge(
                      `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
                      `${errors["E"] && "border-red-500"}`
                  )}

                  {...methods.register('E')}
              />
              <p
                  className={twMerge(
                      `text-red-500 text-xs italic mb-2 invisible`,
                      `${errors['E'] && 'visible'}`
                  )}
              >
                  {errors['E']?.message as string}
              </p>
          </div>

          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
              <span className="text-sm">Важность степени риска </span>
          </label>

          <div className="mb-2">
              <input
                  placeholder="0.2"
                  className={twMerge(
                      `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
                      `${errors["R"] && "border-red-500"}`
                  )}
                  {...methods.register('R')}
              />
              <p
                  className={twMerge(
                      `text-red-500 text-xs italic mb-2 invisible`,
                      `${errors['R'] && 'visible'}`
                  )}
              >
                  {errors['R']?.message as string}
              </p>
          </div>


        <LoadingButton btnColor="bg-blue-500"  loading={false}>Создать проект</LoadingButton>
      </form>
    </section>
  );
};

export default CreateProject;
