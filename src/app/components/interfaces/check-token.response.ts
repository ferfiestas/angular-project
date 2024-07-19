import { user } from "./user";


export interface CheckTokenResponse {
    user: user;
    token: string;
}