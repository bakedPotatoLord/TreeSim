let form = document.querySelector('form')
let user = document.getElementById('username')
let pass = document.getElementById('password')
let pass2 = document.getElementById('password2')

form.onsubmit = function(e){
    e.preventDefault()
    if(pass.value != pass2.value){
        alert('the two passwords do not match')
    }else if(user.value.split('').length <= 2 || pass.value.split('').length <= 2){
        alert('username and password must be longer that 2 characters')
    }
}