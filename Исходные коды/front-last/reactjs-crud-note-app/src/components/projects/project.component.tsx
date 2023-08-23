import React, {FC, useEffect, useState} from "react";
import {format, parseISO} from "date-fns";
import {twMerge} from "tailwind-merge";

import {toast} from "react-toastify";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import NProgress from "nprogress";
import {INote, IProject} from "../../api/types";
import {deleteNoteFn, restoreProjectFn} from "../../api/projectApi";
import {ProjectStatuses} from "./types";
import {Link} from "react-router-dom";
import {Icon} from "@iconify/react";
import GlobalModal from "../global.modal";

type NoteItemProps = {
    note: IProject;
};

const NoteItem: FC<NoteItemProps> = ({note}) => {
    const [openSettings, setOpenSettings] = useState(false);
    const [openNoteModal, setOpenNoteModal] = useState(false);

    const queryClient = useQueryClient();
    const {mutate: deleteNote} = useMutation({
        mutationFn: (noteId: string) => deleteNoteFn(noteId),
        onMutate() {
            NProgress.start();
        },
        onSuccess() {
            queryClient.invalidateQueries(["getNotes"]);
            toast("Проект успешно удален", {
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

    const {mutate: restoreProject} = useMutation({
        mutationFn: (projectId: string) => restoreProjectFn(projectId),
        onMutate() {
            NProgress.start();
        },
        onSuccess() {
            queryClient.invalidateQueries(["getNotes"]);
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

    const currentStatusProject = {
        [ProjectStatuses.STARTED]: <Icon icon="bx:time" color="#0000ff"/>,
        [ProjectStatuses.DELETED]: <Icon icon="bx:trash" color="#ff0000"/>,
        [ProjectStatuses.FINISHED]: <Icon icon="bx:check" color="#006400"/>,
    }

    const onDeleteHandler = (noteId: string) => {
        if (window.confirm("Подтверждаете?")) {
            deleteNote(noteId);
        }
    };

    const onRestoreProjectHandler = (projectId: string) => {
        if (window.confirm("Подтверждаете?")) {
            restoreProject(projectId);
        }
    }

    return (
        <>
            <div
                className="p-4 bg-white rounded-lg border border-gray-200 shadow-md flex flex-col justify-between overflow-hidden">
                <div className="details">
                    <h4 className="mb-2 pb-2 text-2xl font-semibold tracking-tight text-gray-900">
                        {note.title.length > 40
                            ? note.title.substring(0, 40) + "..."
                            : note.title}

                        <p>{currentStatusProject[note.status]}</p>

                    </h4>
                </div>

                <Link
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    to={`/projects/${note.id}`}
                >
                    Перейти в проект
                </Link>

                <div className="relative flex justify-between items-center p-4">
                  <span className="text-ct-dark-100 text-sm">
                    {format(parseISO(String(note.updated_at)), "PPP")}
                  </span>
                    {
                        note.status !== ProjectStatuses.FINISHED
                            ? (
                                note.status === ProjectStatuses.DELETED
                                ? (
                                        <>
                                            <button onClick={() => onRestoreProjectHandler(note.id)}
                                                    className="text-ct-dark-100 text-lg cursor-pointer">
                                                <Icon icon="bx:rotate-left" color="#3b82f6"/>
                                            </button>
                                        </>
                                    ) :
                                    (
                                        <>
                                            <button onClick={() => onDeleteHandler(note.id)}
                                                    className="text-ct-dark-100 text-lg cursor-pointer">
                                                <Icon icon="bx:trash" color="#ff0000"/>
                                            </button>
                                        </>
                                    )
                            )
                            : ''
                    }

                </div>
            </div>
            {/*<GlobalModal*/}
            {/*    openNoteModal={openNoteModal}*/}
            {/*    setOpenNoteModal={setOpenNoteModal}*/}
            {/*>*/}
            {/*    /!*<UpdateProject note={note} setOpenNoteModal={setOpenNoteModal}/>*!/*/}
            {/*</GlobalModal>*/}
        </>
    );
};

export default NoteItem;
