export interface IMailProvider {
    sendMail(message: IMessage): Promise<void>;
}

export interface IMessage {
    to: IAddress;
    from: IAddress;
    subject: string;
    body: string;
}

export interface IAddress {
    email: string;
    name: string;
}