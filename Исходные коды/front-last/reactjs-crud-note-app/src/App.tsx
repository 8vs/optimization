import "react-toastify/dist/ReactToastify.css";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import React, {useEffect, useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {getNotesFn} from "./api/projectApi";
import GlobalModal from "./components/global.modal";
import CreateProject from "./components/projects/create.project";
import NoteItem from "./components/projects/project.component";
import NProgress from "nprogress";
import {IProject} from "./api/types";
import {Layout} from "./components/layout";
import {Header} from "./components/layout/header";
import {Icon} from "@iconify/react";
import {ProjectStatuses} from "./components/projects/types";

function AppContent() {
    const [openNoteModal, setOpenNoteModal] = useState(false);

    const {
        data: notes,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["getNotes"],
        queryFn: () => getNotesFn(),
        staleTime: 5 * 1000,
        select: (data) => data.result,
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

    const STARTED_PROJECTS = notes?.filter((item: IProject) => item.status === ProjectStatuses.STARTED);
    const FINISHED_PROJECTS = notes?.filter((item: IProject) => item.status === ProjectStatuses.FINISHED);
    const DELETED_PROJECTS = notes?.filter((item: IProject) => item.status === ProjectStatuses.DELETED);

    return (
        <div className="2xl:max-w-[90rem] max-w-[68rem] mx-auto">
            <Header
                title={'КАЛЬКУЛЯТОР ОПТИМИЗАЦИИ'}
                description={'Данный калькулятор предназначен для решения задачи о назначениях в рамках проектной группы при' +
                    '                    распределённом проектировании программного обеспечения.'}
            />

            <div className="m-8 grid grid-cols-[repeat(auto-fill,_320px)] gap-7 grid-rows-[1fr]">
                <div
                    className="p-4 min-h-[14rem] h-100 bg-white rounded-lg border border-sky-200 shadow-md flex flex-col items-center justify-center">
                    <div
                        onClick={() => setOpenNoteModal(true)}
                        className="flex items-center justify-center h-20 w-20 border-2 border-dashed border-blue-500 rounded-full text-ct-blue-600 text-5xl cursor-pointer"
                    >
                        <Icon icon="bx:plus" color="#3b82f6" />
                    </div>
                    <h4
                        style={{color: "#3b82f6"}}
                        onClick={() => setOpenNoteModal(true)}
                        className="text-lg font-medium text-midnight text-ct-sky-500 mt-5 cursor-pointer"
                    >
                        Добавить проект
                    </h4>
                </div>
                {/* Note Items */}

                {STARTED_PROJECTS?.map((note: IProject) => (
                    <NoteItem key={note.id} note={note}/>
                ))}
                {/* Create Note Modal */}

            </div>

            {
                FINISHED_PROJECTS?.length
                ?
                    (<>
                        <div className="m-8 grid grid-cols-[repeat(auto-fill,_320px)] gap-7 grid-rows-[1fr]">
                            <div
                                className="p-4 min-h-[14rem] h-100 bg-white rounded-lg border border-sky-200 shadow-md flex flex-col items-center justify-center">
                                <div
                                    style={{borderColor: "#006400"}}
                                    // onClick={() => setOpenNoteModal(true)}
                                    className="flex items-center justify-center h-20 w-20 border-2 border-dashed border-blue-500 rounded-full text-ct-blue-600 text-5xl"
                                >
                                    <Icon icon="bx:check" color="#006400" />
                                </div>
                                <h4
                                    style={{color: "#006400"}}
                                    // onClick={() => setOpenNoteModal(true)}
                                    className="text-lg font-medium text-midnight text-ct-sky-500 mt-5 cursor-pointer"
                                >
                                    Завершенные проекты
                                </h4>
                            </div>
                            {/* Note Items */}

                            {notes?.filter((item: IProject) => item.status === ProjectStatuses.FINISHED)?.map((note: IProject) => (
                                <NoteItem key={note.id} note={note}/>
                            ))}
                        </div>
                    </>)
                    : ''
            }

            {
                DELETED_PROJECTS?.length
                    ?
                    (<>
                        <div className="m-8 grid grid-cols-[repeat(auto-fill,_320px)] gap-7 grid-rows-[1fr]">
                            <div
                                className="p-4 min-h-[14rem] h-100 bg-white rounded-lg border border-sky-200 shadow-md flex flex-col items-center justify-center">
                                <div
                                    style={{borderColor: "#ff0000"}}
                                    // onClick={() => setOpenNoteModal(true)}
                                    className="flex items-center justify-center h-20 w-20 border-2 border-dashed border-blue-500 rounded-full text-ct-blue-600 text-5xl"
                                >
                                    <Icon icon="bx:trash" color="#ff0000" />
                                </div>
                                <h4
                                    style={{color: "#ff0000"}}
                                    // onClick={() => setOpenNoteModal(true)}
                                    className="text-lg font-medium text-midnight text-ct-sky-500 mt-5 cursor-pointer"
                                >
                                    Удаленные проекты
                                </h4>
                            </div>
                            {/* Note Items */}

                            {DELETED_PROJECTS?.map((note: IProject) => (
                                <NoteItem key={note.id} note={note}/>
                            ))}
                        </div>
                    </>)
                    : ''
            }

            <GlobalModal
                openNoteModal={openNoteModal}
                setOpenNoteModal={setOpenNoteModal}
            >
                <CreateProject setOpenNoteModal={setOpenNoteModal}/>
            </GlobalModal>
        </div>
    );
}

function App() {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <AppContent/>
                <ToastContainer/>
            </QueryClientProvider>
        </>
    );
}

export default App;
