import { diaryApi } from '@/lib/api';
import { DIARY_API_ROUTES } from '../constants';
import type { Diary, CreateDiaryDTO, UpdateDiaryDTO } from '../types/diary.types';

export const diaryService = {
    fetchDiaries: async (): Promise<Diary[]> => {
        const response = await diaryApi.get<Diary[]>(DIARY_API_ROUTES.LIST);
        return response.data;
    },

    getDiary: async (id: string): Promise<Diary> => {
        const response = await diaryApi.get<Diary>(DIARY_API_ROUTES.DETAIL(id));
        return response.data;
    },

    createDiary: async (data: CreateDiaryDTO): Promise<Diary> => {
        const response = await diaryApi.post<Diary>(DIARY_API_ROUTES.CREATE, data);
        return response.data;
    },

    updateDiary: async (id: string, data: UpdateDiaryDTO): Promise<Diary> => {
        const response = await diaryApi.put<Diary>(DIARY_API_ROUTES.UPDATE(id), data);
        return response.data;
    },

    deleteDiary: async (id: string): Promise<void> => {
        await diaryApi.delete(DIARY_API_ROUTES.DELETE(id));
    },
};
