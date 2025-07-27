import threading


def listen_for_chat(callback):
    # Placeholder: future log scan or socket listen
    def chat_loop():
        while True:
            # simulate input
            text = input('Chat> ')
            callback(text)

    thread = threading.Thread(target=chat_loop, daemon=True)
    thread.start()
