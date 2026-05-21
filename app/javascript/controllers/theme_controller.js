import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["darkToggle"]

  connect() {
    if (localStorage.getItem("pref:dark") === "1") {
      document.documentElement.classList.add("dark")
    }
    this.syncPressed()
  }

  toggleDark() {
    const el = document.documentElement
    el.classList.toggle("dark")
    localStorage.setItem("pref:dark", el.classList.contains("dark") ? "1" : "0")
    this.syncPressed()
  }

  syncPressed() {
    if (this.hasDarkToggleTarget) {
      this.darkToggleTarget.setAttribute(
        "aria-pressed",
        document.documentElement.classList.contains("dark")
      )
    }
  }
}
