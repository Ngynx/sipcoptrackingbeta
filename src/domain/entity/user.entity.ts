export class UserEntity {
    constructor(
        private user_name: string,
        private user_lastname: string,
        private user_username: string,
        private user_document_number: number,
        private user_cellphone_number: number,
        private user_email: string,
        private user_password: string,
        private user_address: string,
        private user_is_root: boolean,
        private user_is_admin: boolean
    ) {}
}