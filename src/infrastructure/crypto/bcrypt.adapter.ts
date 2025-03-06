import { genSalt, hash, compare } from "bcrypt";

export class BcryptRepositoryAdapter {
    private readonly salt: number = 10;

    /**
     * This method can parse a simple string a cripted string
     * @param pass password in string parsed
     * @returns a new string parsed and cripted
     */
    async hashPassword(pass: string): Promise<string> {
        const newPass = genSalt(this.salt)
            .then(salt => { return hash(pass, salt)})
            .then(hash => hash)
            .catch(err => err);
        return newPass;
    };

    /**
     * Compares a plain password with a hashed password
     * @param plainPassword The plain text password
     * @param hashedPassword The hashed password
     * @returns True if they match, otherwise false
     */
    async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return compare(plainPassword, hashedPassword);
    }
}