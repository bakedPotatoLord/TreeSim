let guestForm = document.querySelector('.guestLogin form')
let loginForm = document.querySelector('.login form')
let signUpForm = document.querySelector('.signup form')

guestForm.onsubmit = function(e){
    e.preventDefault()
    console.log(e)
}

loginForm.onsubmit = function(e){
    e.preventDefault()
    const formData = new FormData(this)
    //{}
    console.log('clicked');

    
    fetch('/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        user:formData.get('username'),
        pass:formData.get('pass'),
    }),
    })
    .then(response => response.json())
    .then(data => {
    console.log('Success:', data);
    })
    .catch((error) => {
    console.error('Error:', error);
    });

}

signUpForm.onsubmit = function(e){
    e.preventDefault()
    const formData = new FormData(this)
    console.log('signing up')
    fetch('/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user:formData.get('username'),
            pass:formData.get('pass'),
        }),
        })
        .then(response => response.json())
        .then(data => {
        console.log('Success:', data);
        })
        .catch((error) => {
        console.error('Error:', error);
        });
}