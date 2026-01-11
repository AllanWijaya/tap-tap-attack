type InputHandler = () => void;

class InputManager {
  private tapHandlers: InputHandler[] = [];
  private enabled = true;

  init() {
    window.addEventListener("pointerdown", this.handleTap);
  }

  dispose() {
    window.removeEventListener("pointerdown", this.handleTap);
  }

  setEnabled(value: boolean) {
    this.enabled = value;
  }

  onTap(handler: InputHandler) {
    this.tapHandlers.push(handler);
  }

  private handleTap = () => {
    if (!this.enabled) return;
    this.tapHandlers.forEach((h) => h());
  };
}

export const input = new InputManager();
