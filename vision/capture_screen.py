import pyautogui
from PIL import Image


def capture_screen(region=None):
    screenshot = pyautogui.screenshot(region=region)
    return screenshot
