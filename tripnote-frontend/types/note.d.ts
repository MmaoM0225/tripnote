export namespace NoteAPI {
  export interface CreateNoteParams {
    title: string;
    content: string;
    location: string;
    season: string;
    duration_days: number;
    cost: number;
    image_urls: string[];
    video_url?: string;
  }

  export interface Author {
    id: number;
    nickname: string;
    avatar: string;
  }

  export interface NoteItem {
    id: number;
    title: string;
    user_id: number;
    video_url: string;
    content: string;
    view_count: number;
    status: string;
    location: string;
    season: string;
    duration_days: number;
    cost: string;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
    image_urls: string[]; // 第一张通常作为封面图使用
    author: Author;
  }

  export interface Response<T = any> {
    code: number;
    message: string;
    data: T;
  }
}
