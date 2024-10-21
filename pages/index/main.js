console.log("Hello World!")
const forms = ["sql","exec"]

forms.forEach(name => {
    let form = document.querySelector(`.form-${name}`);
    let ans  = document.querySelector(`.ans-${name}`);
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        var object = {};
        formData.forEach((value, key) => {
            // Reflect.has in favor of: object.hasOwnProperty(key)
            if(!Reflect.has(object, key)){
                object[key] = value;
                return;
            }
            if(!Array.isArray(object[key])){
                object[key] = [object[key]];    
            }
            object[key].push(value);
        });
        var json = JSON.stringify(object);
        fetch(`/${name}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: json,
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            ans.style.color="limegreen";
            ans.innerHTML = data;
        })
        .catch((error) => {
            console.error('Error:', error);
            ans.style.color="coral";
            ans.innerHTML = error;

        });
    })
})
