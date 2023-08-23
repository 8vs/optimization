import axios from "axios";
import {CreateNoteInput} from "../components/projects/create.project";
// import {UpdateNoteInput} from "../components/projects/update.project";
import {INote, INoteResponse, IProjectResponse, IProjectsResponse, ITaskResponse} from "./types";

import {BASE_URL} from './base';
import {CreateTaskInput} from "../components/projects/create.task";
import {UpdateTaskInput} from "../components/projects/update.task";

export const projectApi = axios.create({
    baseURL: BASE_URL,
});

export const createProjectFn = async (project: CreateNoteInput) => {
    let {title, ...all} = project;
    let { P, T, E, R } = all;
    let characteristic = { P: +P, T: +T, E: +E, R: +R};
    let obj = {title, characteristic: JSON.stringify(characteristic)};
    const response = await projectApi.post<IProjectResponse>('projects/add', obj);
    return response.data;
};

export const createTaskFn = async (projectId: string, task: CreateTaskInput) => {
    let {name, ...all} = task;
    let { P, T, E, R } = all;
    let characteristic = [+P, +T, +E, +R];

    const response = await projectApi.post<ITaskResponse>('tasks/add', {
        project_id: projectId,
        name,
        characteristic: JSON.stringify(characteristic),
    });
    return response.data;
};

export const createPerformerFn = async (taskId: string, performer: CreateTaskInput) => {
    let {name, ...all} = performer;
    let { P, T, E, R } = all;
    let characteristic = [+P, +T, +E, +R];
    console.log(performer);

    const response = await projectApi.post<ITaskResponse>('performers/add', {
        task_id: taskId,
        name,
        characteristic: JSON.stringify(characteristic),
    });
    return response.data;
};

export const deletePerformerFn = async (performerId: string) => {
    return projectApi.put<IProjectsResponse>('performers/delete/', {id: +performerId});
};

export const completeProjectFn = async (projectId: string) => {
    const response = await projectApi.post<IProjectsResponse>('projects/complete/', {id: +projectId});
    return response.data;
};

export const deleteTaskFn = async (taskId: string) => {
    return projectApi.put<IProjectsResponse>('tasks/delete/', {id: +taskId});
};

// export const updateNoteFn = async (noteId: string, note: UpdateNoteInput) => {
//     const response = await projectApi.put<IProjectsResponse>(`projects/edit`, {...note, id: noteId});
//     return response.data;
// };

export const updateTaskFn = async (taskId: number|string, task: UpdateTaskInput) => {
    console.log('task', task, taskId);
    // const response = await projectApi.put<IProjectsResponse>(`projects/edit`, {...task, id: +taskId});
    // return response.data;
};

export const deleteNoteFn = async (noteId: string) => {
    return projectApi.put<IProjectsResponse>('projects/delete/', {id: noteId});
};

export const getSingleProjectFn = async (projectId: string) => {
    const response = await projectApi.get<IProjectResponse>(`projects/view?id=${projectId}`);
    return response.data;
};

export const restoreProjectFn = async (projectId: number | string) => {
    const response = await projectApi.put<IProjectsResponse>(`projects/restore`, {id: projectId});
    return response.data;
}

export const getNotesFn = async () => {
    const response = await projectApi.get<IProjectsResponse>('projects');
    return response.data;
};

