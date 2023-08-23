import {CharL, Links} from "../components/projects/table";

export type INote = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IGenericResponse = {
  status: string;
  message: string;
};

export type INoteResponse = {
  status: string;
  note: INote;
};

export type IProject = {
    id: string;
    status: number;
    title: string;
    updated_at: string;
    // chara
}

export type ITask = {
    id: string;
    name: string;
    updated_at: string;
    // chara
}

export type IProjectsResponse = {
  status: string;
  result: IProject[];
};

export type IProjectSingle = {
    id: string;
    status: number;
    title: string;
    updated_at: string;
    created_at: string;
    characteristic: string;
    result: [];
    links: Links | [];
    performers: [];
    idx: [] | undefined;
    canComplete: boolean;
}

export type ITaskSingle = {
    id: string;
    name: string;
    project_id: number;
    characteristic: string;
}

export type IProjectResponse = {
    status: string;
    result: IProjectSingle;
};

export type ITaskResponse = {
    status: string;
    result: ITaskSingle;
}
