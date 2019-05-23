export interface Menu {
    name: string;
    order: number;
    enable: boolean;
    id?: string;
    items?: Menu[];
    content?: string;
}
