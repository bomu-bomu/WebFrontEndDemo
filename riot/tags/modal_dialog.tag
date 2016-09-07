<ModalDialog>
  <div class="dialog" onclick={stopPropagate}>
    <span class="close" onclick={close}>x</span>
    <p>no data select</p>
  </div>
stopPropagate(e) {
  e.stopPropagation()
}
close(e) {
  this.parent.parent.hideModal()
}
</ModalDialog>

