import { LitElement, html} from 'lit-element';

export class UserElement extends LitElement {
    static get properties () {
        return {
            name : Object,
            age : Number,
            count : Number,
        }
    }

    constructor(){
        super();
        this.name = {
            firstName : "Hervé",
            lastName : "Dupont"
        };
        this.age = 35;
        this.count = 0;
    }

    _increment(){
        this.count++;
        const event = new CustomEvent("incremented", { detail : { count : this.count}});
        this.dispatchEvent(event);
    }

    render(){
        return html`
            <div>
                <ul>
                    <li>Nom de famille : ${this.name.lastName}</li>
                    <li>Prénom : ${this.name.firstName}</li>
                    <li>Age : ${this.age} ans</li>
                    <li>Compteur : ${this.count}</li>
                </ul>
                <button @click=${this._increment}>Incrementer le compteur</button>
            </div>
        `;
    }
}