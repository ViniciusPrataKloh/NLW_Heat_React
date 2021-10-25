import { FormEvent, useContext, useState } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { AuthContext } from '../../contexts/auth';
import { api } from '../../services/api';
import styles from './styles.module.scss';

export function SendMessageForm() {
    const { user, signOut } = useContext(AuthContext);

    const [message, setMessage] = useState('');

    async function sendMessage(event: FormEvent) {
        event.preventDefault();

        // Não executar se mensagem for vazia
        if (!message.trim()) {
            return;
        }

        await api.post('messages', { message });

        setMessage('');
    }

    return (
        <div className={styles.sendMessageFormWrapper}>
            <button onClick={signOut} className={styles.signOutButton}>
                <VscSignOut size="32" />
            </button>

            <header className={styles.profile}>
                <div className={styles.userImage}>
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>

                <strong className={styles.userName}>
                    {user?.name}
                </strong>

                <span className={styles.userGithub}>
                    <VscGithubInverted size="20" />
                    {user?.login}
                </span>
            </header>

            <form className={styles.form} onSubmit={sendMessage}>
                <label htmlFor="message">
                    Mensagem
                </label>

                <textarea
                    name="message"
                    id="message"
                    placeholder="Qual sua expectativa para o evento?"

                    onChange={event => setMessage(event.target.value)}
                    value={message}
                />

                <button type="submit">Enviar mensagem</button>
            </form>
        </div>
    );
}