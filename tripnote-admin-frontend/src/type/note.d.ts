declare namespace NoteAPI {
    type Status = 'pending' | 'approved' | 'rejected';

    interface AuthorInfo {
        id: number;
        nickname: string;
        avatar: string;
    }

    interface NoteItem {
        id: number;
        title: string;
        content: string;
        status: Status;
        location: string;
        season: string;
        duration_days: number;
        cost: string;
        view_count: number;
        image_urls: string[];
        video_url?: string;
        createdAt: string;
        updatedAt: string;
        author: AuthorInfo;
        reject_reason?: string;
    }

    interface Response<T = any> {
        code: number;
        message: string;
        data: T;
    }
}
