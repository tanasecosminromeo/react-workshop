/**
 * Created by tanasecosminromeo on 10/12/2016.
 */
import React from 'react';
import ReactDOM from 'react-dom';


//Refactor in Webstorm (sper ca si altele) cand dai rename la o clasa/variabila/etc schimba peste tot
class HeroComponent extends React.Component {
    render() {
        return (
            <div>
                <div>{this.props.children}</div>
                <form onSubmit={this.props.createHero}>
                    <input required
                           name="name"
                           type="text"
                           placeholder="Enter your name" />
                    <select name="herotype">
                        <option value="paladin">Paladin</option>
                        <option value="barbar">Barbar</option>
                        <option value="wizzard">Wizzard</option>
                    </select>
                    <input name="difficultly" type="number" min={1} max={3} defaultValue={3} />

                    <input type="submit" placeholder="Submit" />
                </form>
            </div>
        );
    }

}

class App extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            name: ''
        };
    }

    createHero = (e) => {
        e.preventDefault();

        let hero = e.target;

        const heroData = {
            name: hero.name.value,
            difficultly: hero.difficultly.value,
            type: hero.herotype.value,
            life: Math.floor(100 / hero.difficultly.value)
        }

        this.setState(heroData);
    }

    render() {
        console.log('heroData', this.state);

        return (
            <div>
                <h1 className="hello">Hello, {this.state.name}</h1>
                <div>Is {this.state.name} superman? {this.state.isSuperman?"YES":"No :("}</div>
                <HeroComponent
                    createHero={this.createHero}
                    isSuperman={this.state.isSuperman}
                ><h2>Edit Component:</h2></HeroComponent>
            </div>
        );
    }

}


ReactDOM.render(<App/>, document.getElementById("root"));