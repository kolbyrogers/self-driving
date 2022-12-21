class Controls {
  constructor(type) {
    this.forward = false;
    this.reverse = false;
    this.left = false;
    this.right = false;
    switch (type) {
      case "KEYS":
        this.#addKeyListeners();
        break;
      case "DUMMY":
        this.forward = true;
        break;
    }
  }

  #addKeyListeners() {
    document.onkeydown = (e) => {
      switch (e.key) {
        case "w":
          this.forward = true;
          break;
        case "s":
          this.reverse = true;
          break;
        case "a":
          this.left = true;
          break;
        case "d":
          this.right = true;
          break;
      }
    };
    document.onkeyup = (e) => {
      switch (e.key) {
        case "w":
          this.forward = false;
          break;
        case "s":
          this.reverse = false;
          break;
        case "a":
          this.left = false;
          break;
        case "d":
          this.right = false;
          break;
      }
    };
  }
}
