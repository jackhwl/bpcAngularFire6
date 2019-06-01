export interface Menu {
    id?: string;
    parentId?: string;
    name: string;
    items?: Menu[];
    content?: string;
    order: number;
    enable: boolean;
}
