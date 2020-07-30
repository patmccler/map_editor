
export class Modal {
  constructor(div, buttonCallback) {
    this.div = div
    this.buttonCallback = buttonCallback
    console.log(div)
    div.querySelector(".modal-button").onclick = this.buttonClicked.bind(this)//buttonCallback
    div.querySelector(".close").onclick = e => this.hide()
  }

  buttonClicked() {
    this.clearErrors()
    this.buttonCallback()
    // hide on success
    .then(() => this.hide())
    // display errors on failure
    .catch(errAttrs => this.displayErrors(errAttrs))
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
        let val = attrs[attr]

        errorDiv.innerText += `${attr.replace("_"," ")}: ${(Array.isArray(val) ? val.join(" ") : val)}\n`
      }
      console.log("errors:", attrs)


  }

  clearErrors() {
  this.div.querySelector("#modal-errors").innerText = ""
  }

}