import styles from './styles.module.scss';
import logo from '../../assets/logo.svg';
import io from 'socket.io-client';

import { useEffect, useState } from 'react';
import { api } from '../../services/api';

type Message = {
    id: string,
    text: string,
    user: {
        name: string,
        avatar_url: string
    }
}

/**
 * Fila de mensagens
 */
const messagesQueue: Message[] = [];

/**
 * Web Socket para escutar o evento "new_message"
 */
const socket = io('http://localhost:4000');

socket.on('new_message', newMessage => {
    messagesQueue.push(newMessage);
});

export function MessageList() {
    /**
     * Variáveis de Estado do componente
     */
    const [messages, setMessages] = useState<Message[]>([]);

    /**
     * Integração com a API em Node
     */
    useEffect(() => {
        api.get<Message[]>('messages/last3').then(response => {
            setMessages(response.data);
        })
    }, []);

    useEffect(() => {
        setInterval(() => {
            if (messagesQueue.length > 0) {
                setMessages(prevState => [
                    messagesQueue[0],
                    prevState[0],
                    prevState[1],
                ].filter(Boolean));

                messagesQueue.shift();
            }
        }, 3000);
    }, [])



    return (
        <div className={styles.messageListWrapper}>

            <img src={logo} alt="DoWhile 2021" />

            <ul className={styles.messageList}>

                {messages.map(message => {
                    return (
                        <li key={message.id} className={styles.message}>
                            <p className={styles.messageContent}>{message.text}</p>

                            <div className={styles.messageUser}>
                                <div className={styles.messageImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>

                                <span>{message.user.name}</span>
                            </div>
                        </li>
                    );
                })}

            </ul>

        </div>
    )
}