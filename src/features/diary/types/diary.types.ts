export interface Diary {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    imageUrl?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDiaryDTO {
    title: string;
    content: string;
    category: string;
    tags: string[];
    imageUrl?: string;
}

export interface UpdateDiaryDTO extends Partial<CreateDiaryDTO> { }
