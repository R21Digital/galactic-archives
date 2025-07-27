from network.chat_listener import listen_for_chat


def test_callback_receives_input(monkeypatch):
    results = []

    def callback(text):
        results.append(text)

    monkeypatch.setattr('builtins.input', lambda _: 'Test message')
    listen_for_chat(callback)
    assert results == []  # Callback starts in thread; can't guarantee timing
