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

  export interface Response<T = any> {
    code: number;
    message: string;
    data: T;
  }
}
