export interface MouseState {
  x: number;
  y: number;
  clicked: boolean;
  justClicked: boolean;
  rightClicked: boolean;
  justRightClicked: boolean;
  gridX: number;
  gridY: number;
}

class InputManagerImpl {
  private canvas: HTMLCanvasElement | null = null;
  private _mouseX = 0;
  private _mouseY = 0;
  private _clicked = false;
  private _justClicked = false;
  private _rightClicked = false;
  private _justRightClicked = false;
  private _prevClicked = false;
  private _prevRightClicked = false;

  get mouse(): MouseState {
    return {
      x: this._mouseX,
      y: this._mouseY,
      clicked: this._clicked,
      justClicked: this._justClicked,
      rightClicked: this._rightClicked,
      justRightClicked: this._justRightClicked,
      gridX: Math.floor(this._mouseX / 64),
      gridY: Math.floor(this._mouseY / 64),
    };
  }

  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this._mouseX = e.clientX - rect.left;
      this._mouseY = e.clientY - rect.top;
    });
    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) this._clicked = true;
      if (e.button === 2) this._rightClicked = true;
    });
    canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) this._clicked = false;
      if (e.button === 2) this._rightClicked = false;
    });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  poll(): void {
    this._justClicked = this._clicked && !this._prevClicked;
    this._justRightClicked = this._rightClicked && !this._prevRightClicked;
    this._prevClicked = this._clicked;
    this._prevRightClicked = this._rightClicked;
  }
}

export const InputManager = new InputManagerImpl();
