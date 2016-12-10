/**
 * Created by tanasecosminromeo on 10/12/2016.
 */
import React from "react";
import ReactDOM from "react-dom";
import classNames from 'classnames';
import "./troll.css"


class Troll extends React.Component {
    constructor(props) {
        super(props);

        let trollAscii = ['༼∵༽','༼⍨༽','༼⍢༽','༼⍤༽'];
        let maxLife    = Math.floor(Math.random() * 81)+20

        this.state = {
            troll: trollAscii[Math.floor(Math.random()*4)],
            maxLife: maxLife,
            currentLife: maxLife,
            damage: Math.floor(Math.random() * 5) + 1,
            theVictoriousTroll: false
        }
    }

    paladinAttackTroll = () => {
        if (this.interval || this.props.heroData.life<=0) return;

        this.interval = setInterval(() => {
            if (this.props.heroData.life<=0) return;
            console.log("troll ", this.state);

            let nextTrollLife = this.state.currentLife - this.props.heroData.damage * Math.floor(Math.random() * 4);

            if (nextTrollLife<=0){
                nextTrollLife = 0;
                clearInterval(this.interval);
            }

            this.setState({
                currentLife: nextTrollLife
            });

            setTimeout(() => {
                this.props.getDamageFromTroll(this.state.damage, () => {
                    clearInterval(this.interval);
                    this.setState({
                        theVictoriousTroll: true
                    })
                });
            }, Math.floor(Math.random() * 600) + 250);

        }, 600);
    }

    render() {
        let extraClass = classNames('troll',
            {
                well: this.state.maxLife===this.state.currentLife,
                wounded: this.state.maxLife>this.state.currentLife,
                dead: !this.state.currentLife,
                victorious: this.state.theVictoriousTroll
            });

        return (
            <div
                onClick={this.paladinAttackTroll}
                className={extraClass}>
                <div className="ascii">{this.state.troll}</div>
                <div className="name">{this.props.name}</div>
                <div className="life">{this.state.currentLife}</div>
            </div>
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

        let trollsInForest = this.state.trolls.map(
            (name) => <Troll heroData={this.props.heroData}
                             getDamageFromTroll={this.props.getDamageFromTroll}
                             key={name}
                             name={name}
                        />
        )

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
            this.setHealingInterval();
        }
    }

    getDamageFromTroll = (damage, callback) => {
        if (this.state.life <= 0){
            return false;
        }

        console.log("hero", this.state);
        let nextHeroLife = this.state.life - damage;

        if (nextHeroLife <= 0){
            alert("You have died :(\nNo one left to save us :(");
            clearInterval(this.healingInterval);
            callback();
        }

        this.setState({
            life: nextHeroLife<0?0:nextHeroLife,
            isDead: !nextHeroLife
        });
    }

    createHero = (e) => {
        e.preventDefault();

        let hero = e.target;
        let heroType = hero.herotype.value;
        let damage = 10;
        let healingPoints = 3;

        if ( heroType === 'paladin' ) {
            damage = 8;
            healingPoints = 5;
        }
        if ( heroType === 'wizard' ) {
            damage = 4;
            healingPoints = 8;
        }

        const heroData = {
            name: hero.name.value,
            difficultly: hero.difficultly.value,
            type: hero.herotype.value,
            life: Math.floor(100 / hero.difficultly.value),
            damage: damage,
            healingPoints: healingPoints
        }

        localStorage.setItem('heroData', JSON.stringify(heroData));

        this.setState(heroData);
        this.setHealingInterval();
    }

    resetGame = () => {
        this.setState({name: ''});
        localStorage.removeItem("heroData");
    }

    setHealingInterval = () => {
        this.healingInterval = setInterval( () => {
            if (this.state.life==100) return;

            let nextLife = this.state.life + this.state.healingPoints;
            if (nextLife > 100){
                nextLife = 100;
            }

            this.setState({
                life: nextLife
            })
        }, 1000);
    }

    sendHeroToForrest = () => {
        this.setState({isInForrest: true});
    }

    render() {
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
                        heroData={this.state}
                        getDamageFromTroll={this.getDamageFromTroll}
                      >

                      </ForbiddenForest>
                    : null
                }
            </div>
        );
    }
}


ReactDOM.render(<App/>, document.getElementById("root"));