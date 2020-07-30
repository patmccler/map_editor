
export class Modal {
  constructor(div, buttonCallback) {
    this.div = div
    console.log(div)
    div.querySelector(".modal-button").onclick = buttonCallback
    div.querySelector(".close").onclick = e => this.hide()
  }

  show() {
    this.clearErrors()
    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", e => {if (e.target === this.div) this.hide()})
    this.div.style.display = "block";
  }

  hide() {
    this.div.style.display = "none"
  }

  displayErrors(attrs) {
    const errorDiv = this.div.querySelector("#modal-errors")
    errorDiv.innerText = ""
    for(let attr in attrs) {
      errorDiv.innerText += `${attr}: ${attrs[attr].join(" ")}\n`
    }
  }

  clearErrors() {
    const errorDiv = this.div.querySelector("#modal-errors")
    errorDiv.innerText = ""
  }

}