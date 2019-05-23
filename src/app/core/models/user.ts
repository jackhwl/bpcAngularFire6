import { Injectable } from '@angular/core';

export interface User {
    userId: string;
    userName: string;
    roles: string[];
    isAdmin: boolean;
}
