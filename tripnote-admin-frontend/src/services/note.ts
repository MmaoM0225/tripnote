// src/services/note.ts
import request from '../utils/request';

export const getNotesByStatus = (status: NoteAPI.Status | 'all') => {
    return request<NoteAPI.Response<NoteAPI.NoteItem[]>>({
        url: '/admin/notes',
        method: 'GET',
        params: { status },
    });
};

export const approveNote = (id: number) => {
    return request<NoteAPI.Response<null>>({
        url: `/admin/notes/${id}/approve`,
        method: 'PUT',
    });
};

export const rejectNote = (id: number, reason: string) => {
    return request<NoteAPI.Response<null>>({
        url: `/admin/notes/${id}/reject`,
        method: 'PUT',
        data: { reason },
    });
};

export const deleteNote = (id: number) => {
    return request<NoteAPI.Response<null>>({
        url: `/admin/notes/${id}`,
        method: 'DELETE',
    });
};

export const getNoteById = (id: number) => {
    return request<NoteAPI.Response<NoteAPI.NoteItem>>({
        url: `/note/${id}`,
        method: 'GET',
    });
};