let app = document.querySelector('#app');

console.log(app)

const createNode = (type) => document.createElement(type);

const titleCreator = () => {
    let titleContainer = createNode('div');
    let titleText = createNode('h1');
    titleText.innerText = 'ACME User Search';

    titleContainer.append(titleText);

    return titleContainer;
}

const tableCreator = () => {
    let table = createNode('table');

    return table;
}

const formCreator = () => {
    let searchTerm = '';
    let formContainer = createNode('form');
    let submitBar = createNode('input');
    submitBar.placeholder = 'input search term'

    let submitButton = createNode('button');
    submitButton.innerText = 'search'

    
    formContainer.append(submitBar);
    formContainer.append(submitButton);

    formContainer.addEventListener('input', ev => {
        if (ev.inputType === 'insertText') {
            searchTerm += ev.data;
        }
        else {
            searchTerm = searchTerm.slice(0, searchTerm.length-1)
        }
    })

    let table = tableCreator();
    
    formContainer.addEventListener('submit', ev => {
        ev.preventDefault();
        APIfetch(`https://acme-users-api-rev.herokuapp.com/api/users/search/${searchTerm}`)
        .then(data => {
            
            if (data.users == undefined || data.users.length < 1) {
                render();

                let error = createNode('h2');
                error.innerText = 'Sorry, no results :('

                app.appendChild(error)
            }
            
            for (let i = 0; i < data.users.length; i++) {
                
                let user = data.users[i];
                
                let userRow = createNode('tr');

                let userName = createNode('td');
                userName.innerText = user.firstName;

                let userLastName = createNode('td');
                userLastName.innerText = user.lastName;

                let userMail = createNode('td');
                userMail.innerText = user.email;

                let userTitle = createNode('td');
                userTitle.innerText = user.title;

                userRow.append(userName);
                userRow.append(userLastName);
                userRow.append(userMail);
                userRow.append(userTitle);

                table.append(userRow);
            }
        })
    })

    formContainer.append(table);

    return formContainer;
}

const APIfetch = (address) => {
    return fetch(address)
        .then(res => {
            return res.json();
        })
    // .then(res => console.log(res))
}

const render = () => {
    app.innerHTML = '';

    app.append(titleCreator());
    app.append(formCreator());
}

render();