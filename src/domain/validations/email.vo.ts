export class VOEmail {
    private readonly email: string;

    constructor(email: string) {
        this.ensureIsValidEmail(email);
        this.email = email;
    }

    private ensureIsValidEmail(email: string): void {
        if (!email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
            throw new Error('Invalid email');
        }
    }

    getValue(): string {
        return this.email;
    }
}