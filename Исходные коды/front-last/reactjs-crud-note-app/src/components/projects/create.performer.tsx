import { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import {object, optional, string, TypeOf} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IProject} from "../../api/types";
import {createTaskFn, createProjectFn, createPerformerFn} from "../../api/projectApi";
import NProgress from "nprogress";
import {CreateNoteInput} from "./create.project";
import {Icon} from "@iconify/react";
import {TaskInterface} from "./table";
import {Link} from "react-router-dom";

type ICreatePerformersProps = {
    tasks: TaskInterface[];
    // performer: PerformersInterface | undefined;
    setOpenNoteModal: (open: boolean) => void;
};

const createPerformerSchema = object({
    name: string().min(1, "Обязательное поле"),
    P: string().min(1, "Обязательное поле"),
    T: string().min(1, "Обязательное поле"),
    E: string().min(1, "Обязательное поле"),
    R: string().min(1, "Обязательное поле"),
    task_id: string().min(1),
});

export type CreatePerformerInput = TypeOf<typeof createPerformerSchema>;

const CreatePerformer: FC<ICreatePerformersProps> = ({ tasks, setOpenNoteModal }) => {
    const methods = useForm<CreatePerformerInput>({
        resolver: zodResolver(createPerformerSchema),
    });

    const {
        handleSubmit,
        formState: { errors },
    } = methods;

    const queryClient = useQueryClient();

    const { mutate: createPerformer } = useMutation({
        mutationFn: (performer: CreatePerformerInput) => createPerformerFn(performer.task_id, performer),
        onMutate() {
            NProgress.start();
        },
        async onSuccess() {
            await queryClient.invalidateQueries(['getSingleProjectFn']);
            setOpenNoteModal(false);
            NProgress.done();
            toast("Исполнитель успешно добавлен", {
                type: "success",
                position: "top-right",
            });
        },
        onError(error: any) {
            setOpenNoteModal(false);
            NProgress.done();
            const resMessage =
                error.response.data.error ||
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

    const onSubmitHandler: SubmitHandler<CreatePerformerInput> = async (data) => {
        createPerformer(data);
    };

    return (
        <section>
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                <h2 className="text-2xl text-ct-dark-600 font-semibold">Создание исполнителя</h2>
                <div
                    onClick={() => setOpenNoteModal(false)}
                    className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
                >
                    <Icon icon="bx-x"/>
                </div>
            </div>
            <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="mb-2">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
                        Название исполнителя
                    </label>
                    <input
                        placeholder="Андрей"
                        className={twMerge(
                            `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
                            `${errors["name"] && "border-red-500"}`
                        )}
                        {...methods.register("name")}
                    />
                    <p
                        className={twMerge(
                            `name-red-500 text-xs italic mb-2 invisible`,
                            `${errors["name"] && "visible"}`
                        )}
                    >
                        {errors["name"]?.message as string}
                    </p>
                </div>

                <div className="mb-2">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="countries">
                        Выберите задачу из списка
                    </label>
                    <select
                        {...methods.register("task_id")} id="countries"
                        className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        {
                            tasks?.map((item) => {
                                return ( <option value={item.id}>{item.name}</option>)
                            })
                        }
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
                        Стоимость выполнения
                        <span className="text-sm"> (в тыс. руб.)</span>
                    </label>

                    <input
                        placeholder="600"
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

                <div className="mb-2">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
                        Время выполнения
                        <span className="text-sm"> (в месяцах)</span>
                    </label>

                    <input
                        placeholder="4"
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

                <div className="mb-2">

                    <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
                        Компетенция исполнителя
                        <span className="text-sm"> (значение до 4)</span>
                    </label>


                  <div className="relative w-full">
                    <input
                      placeholder="3"
                      className={twMerge(
                        `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
                        `${errors["E"] && "border-red-500"}`
                      )}

                      {...methods.register('E')}
                    />

                    <Link
                      className="absolute top-0 right-0 p-3 text-sm font-medium text-white rounded-r-lg border-gray-400"
                      to={'/form'}
                      style={{borderLeft: '1px solid gray'}}
                    >
                      <i style={{color: 'black'}} className="bx bx-calculator"/>
                    </Link>
                    <p
                      className={twMerge(
                        `text-red-500 text-xs italic mb-2 invisible`,
                        `${errors['E'] && 'visible'}`
                      )}
                    >
                      {errors['E']?.message as string}
                    </p>
                  </div>

                </div>

                <div className="mb-2">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
                        Риск невыполнения
                        <span className="text-sm"> (значение меньше 1)</span>
                    </label>

                    <input
                        placeholder="0.1"
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

                <LoadingButton btnColor="bg-blue-500" loading={false}>Добавить исполнителя</LoadingButton>
            </form>
        </section>
    );
};

export default CreatePerformer;
