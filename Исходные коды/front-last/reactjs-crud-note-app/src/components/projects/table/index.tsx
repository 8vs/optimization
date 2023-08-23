import React, {FC, ReactNode, useState} from "react";
import ReactDom from "react-dom";
import {IProjectSingle} from "../../../api/types";
import {ProjectStatuses} from "../types";
import {Icon} from "@iconify/react";
import CreateTask from "../create.task";

import {useMutation, useQueryClient} from "@tanstack/react-query";
import {
    completeProjectFn,
    createPerformerFn,
    deleteNoteFn,
    deletePerformerFn,
    deleteTaskFn
} from "../../../api/projectApi";
import NProgress from "nprogress";
import {toast} from "react-toastify";
import GlobalModal from "../../global.modal";
import CreatePerformer from "../create.performer";

export type CharL = {
    P: number;
    T: number;
    E: number;
    R: number;
}

type PerformersInterface = {
    id: number;
    name: string;
    task_id: number;
    characteristic: CharL;
    updated_at: string;
    created_at: string;
}

export type TaskInterface = {
    id: number;
    name: string;
    project_id: number;
    updated_at: string;
    created_at: string;
    characteristic: CharL;
    performers: PerformersInterface[] | [];
}

export type Links = {
    tasks: TaskInterface[] | [];
}

export const BaseTable: FC<Links & {project: IProjectSingle}> = ({tasks, project}) => {
    const [openNoteModal, setOpenNoteModal] = useState(false);
    const [openModelCreatePerformer, setOpenModelCreatePerformer] = useState(false);

    const queryClient = useQueryClient();

    const {mutate: deleteTask} = useMutation({
        mutationFn: (noteId: string) => deleteTaskFn(noteId),
        onMutate() {
            NProgress.start();
        },
        async onSuccess() {
            await queryClient.invalidateQueries(['getSingleProjectFn']);
            toast("Задача успешно удалена", {
                type: "success",
                position: "top-right",
            });
            NProgress.done();
        },
        onError(error: any) {
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
            NProgress.done();
        },
    });

    const onTaskDeleteHandler = (taskId: number) => {
        if (window.confirm("Подтверждаете?")) {
            deleteTask(String(taskId));
        }
    };

    if (tasks?.length === 0) {
        return (
            <>
                {project.status === ProjectStatuses.STARTED ? (<>
                    <div className="lg:w-3/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto pb-10">
                        <button
                            onClick={() => setOpenNoteModal(true)}
                            className="flex-shrink-0 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600"
                        >Создать задачу
                        </button>
                    </div>

                    <GlobalModal
                        openNoteModal={openNoteModal}
                        setOpenNoteModal={setOpenNoteModal}
                    >
                        <CreateTask projectId={project.id} setOpenNoteModal={setOpenNoteModal}/>
                    </GlobalModal>

                </>)
                    : ''
                }
            </>
        )
    }

    const CHAR_TASK_DESC = [
        'Максимальная стоимость (в тыс. руб.)',
        'Максимальное время (в месяцах)',
        'Минимальная компетенция',
        'Максимальный риск невыполнения',
    ];

    return (
        <>
            <section className="text-gray-600 body-font">
                {project.status === ProjectStatuses.STARTED ? (<>

                    <div className="lg:w-3/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto pb-10">
                        <button
                            onClick={() => setOpenNoteModal(true)}
                            className="flex-shrink-0 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 mr-4"
                        >Создать задачу
                        </button>

                        <button
                            onClick={() => setOpenModelCreatePerformer(true)}
                            className="flex-shrink-0 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600"
                        >Создать исполнителя
                        </button>
                    </div>

                    <GlobalModal
                        openNoteModal={openNoteModal}
                        setOpenNoteModal={setOpenNoteModal}
                    >
                        <CreateTask projectId={project.id} setOpenNoteModal={setOpenNoteModal}/>
                    </GlobalModal>

                    <GlobalModal
                        openNoteModal={openModelCreatePerformer}
                        setOpenNoteModal={setOpenModelCreatePerformer}
                    >
                        <CreatePerformer tasks={tasks} setOpenNoteModal={setOpenModelCreatePerformer}/>
                    </GlobalModal>

                </>) : ''}

                <div className="container mx-auto flex px-5 py-0 md:flex-row flex-col items-center ">
                    <div
                        className="lg:w-3/3 flex flex-col md:items-start md:text-left md:mb-0 items-center ">
                        { tasks?.map((item: TaskInterface, _key) => {
                                return (
                                    <div className="">
                                        <div>
                                            <h2 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                                                <code className="bg-gray-100 rounded-lg pr-4 pl-4">#{item.id}</code> { item.name }
                                            </h2>

                                            {
                                                project.status === ProjectStatuses.STARTED ? (
                                                    <div className="flex mb-2 py-2 ">
                                                        <button
                                                            onClick={() => onTaskDeleteHandler(item.id)}
                                                            className="inline-flex text-white bg-red-500 border-0 ml-2 py-2 px-6 focus:outline-none  text-white hover:bg-red-600 rounded text-sm"
                                                        >Удалить задачу
                                                        </button>
                                                    </div>
                                                ) : ''
                                            }

                                            <>
                                                <ul className="list-inside bg-gray-50 rounded-lg p-4">Характеристики задачи:
                                                {
                                                    String(item.characteristic)
                                                        .toString()
                                                        .replace('[', '')
                                                        .replace(']', '').split(',')
                                                        .map((item, k) => {
                                                            return <li>- {CHAR_TASK_DESC[k]}: {item}</li>
                                                        })
                                                }
                                                </ul>
                                            </>
                                        </div>

                                        <TablePerform
                                                performers={item.performers}
                                                key={item.id}
                                                canActions={project.status === ProjectStatuses.STARTED}
                                            />

                                        <br/>
                                        <br/>
                                </div>
                                );
                            })
                        }

                        {

                        }

                    </div>
                </div>

            </section>
        </>
    )
}

type PropsTablePerformers = {
    performers: PerformersInterface[] | [];
    canActions: boolean;
    children: React.ReactNode;
}

const TablePerform: FC<PropsTablePerformers>= ({performers, canActions, children}) => {
    const queryClient = useQueryClient();
    const [openNoteModal, setOpenNoteModal] = useState(false);

    const {mutate: deletePerformer} = useMutation({
        mutationFn: (projectId: string) => deletePerformerFn(projectId),
        onMutate() {
            NProgress.start();
        },
        onSuccess() {
            queryClient.invalidateQueries(["getSingleProjectFn"]);
            toast("Исполнитель успешно удален", {
                type: "success",
                position: "top-right",
            });
            NProgress.done();
        },
        onError(error: any) {
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
            NProgress.done();
        },
    });

    if (!performers || performers.length === 0 || Object.keys(performers).length === 0) {
        return;
    }

    const onDeletePerformerHandler = (performerId: string|number) => {
        if (window.confirm("Подтверждаете?")) {
            deletePerformer(''+performerId);
        }
    };

    const CHAR_PERFORMER_DESC = [
        'Стоимость',
        'Сроки',
        'Компетенция',
        'Риск',
    ];

    return (
        <>

            <div
                className="relative overflow-x-auto sm:rounded-lg">
                <table
                    className="w-full text-sm text-left ">
                    <thead
                        className="text-xs uppercase">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            #
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Исполнитель
                        </th>

                        <th scope="col" className="px-6 py-3">
                            Характеристики
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        performers?.map((item: PerformersInterface, _k) => {
                            return (<>
                                    <tr className="bg-white border-b ">
                                        <td className="px-6 py-4">
                                            {_k+1}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <>
                                                <ul className="list-inside bg-gray-50 rounded-lg p-4">
                                                    {
                                                        String(item.characteristic)
                                                            .toString()
                                                            .replace('[', '')
                                                            .replace(']', '').split(',')
                                                            .map((item, k) => {
                                                                return <li>- {CHAR_PERFORMER_DESC[k]}: {item}</li>
                                                            })
                                                    }
                                                </ul>
                                            </>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => onDeletePerformerHandler(item.id)}>
                                                <Icon icon="bx:trash" color="#ff0000"/>
                                            </button>
                                        </td>
                                    </tr>
                                </>
                            )
                        })
                    }

                    </tbody>
                </table>
            </div>


        </>
    )
}
