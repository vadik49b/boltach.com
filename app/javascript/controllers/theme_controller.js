import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["darkToggle", "darkLabel"]

  connect() {
    if (localStorage.getItem("pref:dark") === "1") {
      document.documentElement.classList.add("dark")
    }
    this.sync()
  }

  toggleDark() {
    const el = document.documentElement
    el.classList.toggle("dark")
    localStorage.setItem("pref:dark", el.classList.contains("dark") ? "1" : "0")
    this.sync()
  }

  sync() {
    const isDark = document.documentElement.classList.contains("dark")
    if (this.hasDarkToggleTarget) {
      this.darkToggleTarget.setAttribute("aria-pressed", isDark)
    }
    if (this.hasDarkLabelTarget) {
      this.darkLabelTarget.textContent = isDark ? "☀ light" : "☾ dark"
    }
  }
}
