/**
 * Created by tanasecosminromeo on 10/12/2016.
 */
import React from "react";
import ReactDOM from "react-dom";
import "./troll.css"


class Troll extends React.Component {
    constructor(props) {
        super(props);

        let trollAscii = ['༼∵༽','༼⍨༽','༼⍢༽','༼⍤༽'];
        let maxLife    = Math.floor(Math.random() * 16)+5

        this.state = {
            troll: trollAscii[Math.floor(Math.random()*4)],
            maxLife: maxLife,
            currentLife: maxLife
        }
    }

    render() {
        let extraClass = '';
        if (this.state.maxLife===this.state.currentLife){
            extraClass = 'well';
        } else if (this.state.maxLife>this.state.currentLife && this.state.currentLife>0){
            extraClass = 'wounded';
        } else {
            extraClass = 'dead';
        }

        return (
            <span className={"troll " + extraClass}>
                <div className="ascii">{this.state.troll}</div>
                <div className="name">{this.props.name}</div>
                <div className="life">{this.state.currentLife}</div>
            </span>
        )
    }
}

class ForbiddenForest extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            trolls: ['Kazraz', 'Wonulkaz', 'Trezumike', 'Zol\'Sora', 'Raknanju', 'Mugnanlai', 'Zaliznay', 'Uthelumijo', 'Anoji', 'Gul\'Ojin']
        }
    }

    render (){
        console.log('Available Trolls', this.state.trolls);

        let trollsInForest = this.state.trolls.map((name) => <Troll key={name} name={name} />)

        return (
            <div>
                <h5>This is the forbidden forest</h5>
                <div>{trollsInForest}</div>
            </div>
        )
    }
}

class HeroComponent extends React.Component {
    componentWillUnmount(){
        let heroName = this.form.name.value; //Folosim referinta pentru ca nu exista inca componenta [sau ceva]
        alert(`Good luck ${heroName}!`)
    }

    render() {
        return (
            <div>
                <div>{this.props.children}</div>
                <form
                    ref={(ref) => { this.form = ref; }}
                    onSubmit={this.props.createHero}>
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
                <button onClick={this.props.resetGame}>Reset Game</button>
                <div>Name: {heroData.name}</div>
                <div>Class: {heroData.type}</div>
                <div>Life: {heroData.life}</div>

                <button onClick={this.props.sendHeroToForrest}>goto forest;</button>
            </div>
        );
    }

}

class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            name: '',
            isInForrest: false
        }
    }

    componentWillMount(){
        let heroData = localStorage.getItem('heroData');

        if (heroData){
            heroData = JSON.parse(heroData);
            this.setState(heroData);
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

    resetGame = () => {
        this.setState({name: ''});
        localStorage.removeItem("heroData");
    }

    sendHeroToForrest = () => {
        this.setState({isInForrest: true});
    }

    render() { //Singura functie mandatory
        console.log('heroData', this.state);

        return (
            <div>
                <h1 className="hello">Heroes and Trolls</h1>

                {
                    this.state.name
                    ? <HeroDetails
                        heroData={this.state}
                        resetGame={this.resetGame}
                        sendHeroToForrest={this.sendHeroToForrest}
                    ></HeroDetails>
                    : <HeroComponent
                        createHero={this.createHero}
                        resetGame={this.resetGame}
                      ><h2>Create hero:</h2></HeroComponent>
                }

                {
                    this.state.isInForrest
                    ? <ForbiddenForest
                      ></ForbiddenForest>
                    : null
                }
            </div>
        );
    }
}


ReactDOM.render(<App/>, document.getElementById("root"));