from network import chat_listener


def test_callback_receives_input(monkeypatch):
    results = []

    def callback(text):
        results.append(text)

    # Replace Thread to avoid starting an infinite loop
    class DummyThread:
        def __init__(self, target, daemon=False):
            self.target = target
            self.daemon = daemon
        def start(self):
            # do not run target
            pass

    monkeypatch.setattr(chat_listener.threading, 'Thread', DummyThread)
    monkeypatch.setattr('builtins.input', lambda _: 'Test message')

    chat_listener.listen_for_chat(callback)
    assert results == []  # Callback never called since thread not started
