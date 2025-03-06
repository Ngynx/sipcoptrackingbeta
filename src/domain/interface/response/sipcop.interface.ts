export interface SipcopResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
    error: string;
    messages: string[];
};