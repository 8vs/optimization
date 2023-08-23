import "react-toastify/dist/ReactToastify.css";
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import React, {FC, useEffect, useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {completeProjectFn, getSingleProjectFn, restoreProjectFn} from "../../api/projectApi";
import {Link, useParams } from "react-router-dom";
import NProgress from "nprogress";
import {format, parseISO} from "date-fns";
import {Header} from "../layout/header";
import {NotFound} from "../not-found";
import {IProject, IProjectsResponse} from "../../api/types";
import {da} from "date-fns/locale";
import {Icon} from "@iconify/react";
import Spinner from "../Spinner";
import {ProjectStatuses} from "./types";
import {BaseTable} from "./table";
import {twMerge} from "tailwind-merge";


export const HorizontalLine = () => {
    return (
        <>
            <div className="inline-flex items-center justify-center w-full mt-4 mb-4">
                <hr className="w-[64rem] h-1 my-0 bg-gray-200 border-0 rounded" />
            </div>
        </>
    )
}

const AppContentS = () => {

    // const [openNoteModal, setOpenNoteModal] = useState(false);
    let { id } = useParams();
    let projectId = parseInt(id ?? '');

    if (!projectId) {
        return (
            <>
                <div className="2xl:max-w-[90rem] max-w-[68rem] mx-auto">
                    <Header
                        title={'КАЛЬКУЛЯТОР ОПТИМИЗАЦИИ'}
                        description={'Данный калькулятор предназначен для решения задачи о назначениях в рамках проектной группы при' +
                            '                    распределённом проектировании программного обеспечения.'}
                    />
                    <div className="m-8 grid grid-cols-[repeat(auto-fill,_320px)] gap-7 grid-rows-[1fr]">
                        <NotFound />
                    </div>
                    <Link to="/">back to all list projects</Link>
                </div>
            </>
        )
    }

    const currentStatusProject = {
        [ProjectStatuses.STARTED]: <Icon icon="bx:time" color="#0000ff"/>,
        [ProjectStatuses.DELETED]: <Icon icon="bx:trash" color="#ff0000"/>,
        [ProjectStatuses.FINISHED]: <Icon icon="bx:check" color="#006400"/>,
    }

    const {
        data: project,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ['getSingleProjectFn'],
        queryFn: () => getSingleProjectFn(''+projectId),
        staleTime: 5 * 1000,
        select: data => data.result,
        onSuccess() {
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
                type: 'error',
                position: 'top-right',
            });
            NProgress.done();
        },
    });

    const queryClient = useQueryClient();
    const {mutate: completeProject} = useMutation({
        mutationFn: (projectId: string) => completeProjectFn(projectId),
        onMutate() {
            NProgress.start();
        },
        async onSuccess() {
            await queryClient.invalidateQueries(['getSingleProjectFn']);
            toast("Вычисление прошло успешно", {
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

    const {
        mutate: restoreProject
    } = useMutation({
        mutationFn: (projectId: string) => restoreProjectFn(projectId),
        onMutate() {
            NProgress.start();
        },
        async onSuccess() {
            await queryClient.invalidateQueries(["getSingleProjectFn"]);
            toast("Проект успешно восстановлен", {
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

    useEffect(() => {
        if (isLoading || isFetching) {
            NProgress.start();
        }
    }, [isLoading, isFetching]);

    if (!project) {
        return <Spinner/>
    }

    const isFinished = project.status === ProjectStatuses.FINISHED;

    const completeProjectHandler = (projectId: string|number) => {
        if (window.confirm("Подтверждаете вычисление?")) {
            completeProject(''+projectId);
        }
    };

    const restoreProjectHandler = (projectId: string|number) => {
        restoreProject(''+projectId);
    };

    const CHAR_PROJECT_DESC = [
        'Важность стоимости выполнения',
        'Важность сроков',
        'Важность компетенции',
        'Важность степени риска',
    ];

    return (
        <div className="2xl:max-w-[90rem] max-w-[90rem] mx-auto">
            <Header
                title={'КАЛЬКУЛЯТОР ОПТИМИЗАЦИИ'}
                description={'Данный калькулятор предназначен для решения задачи о назначениях в рамках проектной группы при' +
                    '                    распределённом проектировании программного обеспечения.'}
            />

            <>
                <section className="text-gray-600 body-font bg-white rounded-lg mb-10">

                    <div className="py-6 ml-4">

                        <Link
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                            to={`/`}
                        >
                            <i className="bx bx-reply"></i> назад
                        </Link>
                    </div>

                    <div className="container px-5 mx-auto flex flex-col">
                        <div className="mx-auto">
                            <div className="flex flex-col sm:flex-row mt-10">
                                <div className="sm:w-1/3 lg:pr-8 sm:py-8">

                                    <div className="flex flex-col items-center ">
                                        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900 mb-10">
                                            { project.title}  { currentStatusProject[project.status] }
                                        </h1>

                                        <HorizontalLine/>

                                        <>
                                            <ul className="list-inside bg-gray-50 rounded-lg p-4">Весовые коэффициенты характеристик:
                                                {
                                                    String(Object.values(project.characteristic))
                                                        .toString()
                                                        .replace('[', '')
                                                        .replace(']', '').split(',')
                                                        .map((item, k) => {
                                                            return <li>- {CHAR_PROJECT_DESC[k]}: {item}</li>
                                                        })
                                                }
                                            </ul>
                                        </>


                                        <HorizontalLine/>

                                        <p className="text-base">
                                            <p>Создан: {format(parseISO(String(project.created_at)), 'PPP')}</p>
                                            <p>Обновлен: {format(parseISO(String(project.updated_at)), 'PPP')}</p>

                                        </p>
                                    </div>

                                    <HorizontalLine/>

                                    {
                                        !isFinished && project.status === ProjectStatuses.STARTED ?
                                            (
                                                <div className="mt-4 title-font text-center ">
                                                    <button
                                                        disabled={!project.canComplete}
                                                        onClick={() => completeProjectHandler(project.id)}
                                                        className={twMerge(
                                                            "px-8 py-3 text-white focus:outline-none rounded-full",
                                                            `${!project.canComplete ? 'bg-sky-300' : 'bg-blue-800'}`
                                                        )}
                                                    >Вычислить</button>
                                                </div>
                                            ) : ''
                                    }

                                    {
                                        isFinished && project.result.length ?
                                            (
                                                <div className="mt-4 pr-6">
                                                    {
                                                        project.performers.map(item => {
                                                            return (<>
                                                                <p>{item}</p>
                                                                <br/>
                                                            </>)
                                                        })
                                                    }

                                                </div>
                                            ) : ''
                                    }

                                </div>
                                <div
                                    className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                                    {
                                        project.status === ProjectStatuses.DELETED
                                        ? (<>
                                                <section className="text-gray-600 body-font">
                                                    <div className="container px-5 py-24 mx-auto">
                                                        <div className="flex flex-col text-center w-full mb-12">
                                                            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Проект удален
                                                            </h1>
                                                            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">К сожалению, просмотр или удаление
                                                            каких-либо данных по задачам и исполнителям недоступны. Сначала нужно восстановить проект.
                                                                <button
                                                                    onClick={() => restoreProjectHandler(project.id)}
                                                                    className="mt-4 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                                                                >
                                                                    Восстановить проект
                                                                </button>

                                                            </p>
                                                        </div>
                                                    </div>
                                                </section>
                                            </>)
                                            : (
                                                <BaseTable tasks={project.links} project={project}/>
                                            )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </>

        </div>
    );
}

function SingleProject() {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <AppContentS/>
                <ToastContainer/>
            </QueryClientProvider>
        </>
    );
}

export default SingleProject;
