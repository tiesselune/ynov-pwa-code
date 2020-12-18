import {LitElement, html} from 'lit-element';
import "./user-element.js";

const users = [
    { firstName : "Axel", lastName : "Ollivier", age : 23},
    { firstName : "Baptiste", lastName : "Lechat", age : 22},
    { firstName : "Pierre", lastName : "Chene", age : 25},
];

export class YnovUser extends LitElement {

    render(){
        let userTemplate = null;
        const id = parseInt(this.location.params.id,10);
        if(id >= 0 && id < users.length){
            userTemplate = html`<user-element .name=${users[this.location.params.id]} .age=${users[this.location.params.id].age}></user-element>`;
        }
        else{
            userTemplate = html`<p>Cet utilisateur n'existe pas.</p>`;
        }
        return html`
        <div>
            <h1>User </h1>
            ${userTemplate}
        </div>
        `;
    }
}