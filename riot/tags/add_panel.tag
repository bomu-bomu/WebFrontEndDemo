<AddPanel>
  <div>
    <fieldset>
      <legend>Add new source</legend>
      <input type="text" name="new_name" placeholder="Source"/>
      <br/>
      <input type="checkbox" name="new_prefer"/>Prefer
      <br/>
      <input type="checkbox" name="new_burst"/>Burst
      <br/>
      <input type="button" value="Add" onclick= {add}/>
    </fieldset>
  </div>
    add(e) {
      var address = this.new_name.value
      if (address.trim()  !== '') {
        this.parent.tags.servertable.add({
          address: address,
          type: 'server',
          prefer: this.new_prefer.checked,
          burst: this.new_burst.checked
        })
        this.new_name.value = ""
        this.parent.showNotification("info", "Add source successfully")
      } else {
        this.parent.showNotification("error", "Please Specify Source")
      }
    }
</AddPanel>
