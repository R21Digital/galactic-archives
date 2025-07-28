import pyautogui


def capture_screen(region=None):
    screenshot = pyautogui.screenshot(region=region)
    return screenshot
