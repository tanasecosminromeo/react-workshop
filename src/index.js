/**
 * Created by tanasecosminromeo on 10/12/2016.
 */
import React from 'react';
import ReactDOM from 'react-dom';


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

class HeroDetails extends React.Component {
    render() {
        let heroData = this.props.heroData;

        return (
            <div>
                <div>Name: {heroData.name}</div>
                <div>Class: {heroData.type}</div>
                <div>Life: {heroData.life}</div>
            </div>
        );
    }

}

class App extends React.Component {

    componentWillMount(){
        let heroData = localStorage.getItem('heroData');

        if (heroData){
            heroData = JSON.parse(heroData);
            this.setState(heroData);
        } else {
            this.setState({});
        }
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

        localStorage.setItem('heroData', JSON.stringify(heroData));

        this.setState(heroData);
    }

    render() { //Singura functie mandatory
        console.log('heroData', this.state);

        return (
            <div>
                <h1 className="hello">Who r u bro?</h1>

                {
                    this.state.name
                    ? <HeroDetails heroData={this.state}></HeroDetails>
                    : <HeroComponent
                        createHero={this.createHero}
                        isSuperman={this.state.isSuperman}
                      ><h2>Create hero:</h2></HeroComponent>
                }
            </div>
        );
    }
}


ReactDOM.render(<App/>, document.getElementById("root"));