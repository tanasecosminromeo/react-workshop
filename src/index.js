import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import './troll.css';

class TheBigBoss extends React.Component {
    constructor(props) {
        super(props);

        this.state = { bossDead: false }
    }

    componentWillMount() {
        let ID = Math.floor(Math.random() * 30) + 1;

        this.props.markBossAsActive();

        fetch(`http://swapi.co/api/species/${ID}/`)
            .then(raw => raw.json())
            .then((res) => {
                this.setState(res);
            });
    }

    bossWasKilled = () => {
        alert('Congrats! You killed the boss and rescued the jellys');

        this.setState({
            bossDead: true
        });

        this.props.improveHeroStats();
    };

    render() {
        if (!this.state) return null;

        let bossLife = parseInt(this.state.average_lifespan) || 150;
        if (bossLife > 150) bossLife = 150;

        let bossDamage = bossLife / 25;
        let bossColor = (this.state.eye_colors || 'red').split(',')[0];

        return (
            <div style={{
                fontSize: Math.floor(bossLife / 2),
                textAlign: 'center'
            }}>
                {
                    this.state.bossDead
                        ? 'Boss is dead, you got all the jelly'
                        :
                        <Troll
                            getDamageFromTroll={this.props.getDamageFromTroll}
                            improveHeroStats={this.bossWasKilled}
                            heroData={this.props.heroData}
                            adjustForestLife={this.props.adjustForestLife}
                            name={this.state.name}
                            life={bossLife}
                            damage={bossDamage}
                            color={bossColor}
                        />
                }
            </div>
        )
    }
}
class Troll extends React.Component {
    constructor(props) {
        super(props);

        let trollAscii = ['༼∵༽', '༼⍨༽', '༼⍢༽', '༼⍤༽'];
        let maxLife = props.life || Math.floor(Math.random() * 100) + 5;
        let damage = props.damage || Math.floor(Math.random() * 5) + 1;

        this.state = {
            troll: trollAscii[(Math.floor(Math.random() * 4))],
            maxLife,
            currentLife: maxLife,
            damage: damage,
            theVictoriousTroll: false
        }
    }

    componentDidMount() {
        //Odata aparut pe harta Troll-ul, vrem ca padurea
        //Sa stie de viata lui si sa actualizeze viata intregii paduri.
        this.props.adjustForestLife({
            name: this.props.name,
            life: this.state.currentLife
        });
    }

    shouldComponentUpdate(nextProps, nextState) {

        if (this.state.currentLife !== nextState.currentLife) {
            this.props.adjustForestLife({
                name: this.props.name,
                life: nextState.currentLife
            });
        }

        return true;
    }

    paladinAttackTroll = () => {
        if (this.interval || !this.props.heroData.life) return;

        this.interval = setInterval(() => {
            if (!this.props.heroData.life) {
                clearInterval(this.interval);
                return;
            }

            let nextTrollLife = this.state.currentLife - this.props.heroData.damage * Math.floor(Math.random() * 2);
            if (nextTrollLife <= 0) {
                nextTrollLife = 0;
                this.props.improveHeroStats();
                clearInterval(this.interval);
            }


            this.setState({
                currentLife: nextTrollLife
            });

            setTimeout(() => {
                this.props.getDamageFromTroll(this.state.damage, () => {
                    this.setState({
                        theVictoriousTroll: true
                    });
                    clearInterval(this.interval);
                });
            }, Math.floor(Math.random() * 600) + 250)

        }, 500);
    };

    render() {
        let extraClass = classNames('troll evil', {
            well: this.state.maxLife === this.state.currentLife,
            wounded: this.state.currentLife < this.state.maxLife && this.state.currentLife,
            dead: !this.state.currentLife,
            victorious: this.state.theVictoriousTroll
        });

        return (
            <div
                className={extraClass}
                style={{ color: this.props.color }}
                onClick={this.paladinAttackTroll}
            >
                <div className="ascii">{this.state.troll}</div>
                <div className="name">{this.props.name}</div>
                <div className="life">{this.state.currentLife}</div>
            </div>
        )
    }
}
class ForbiddenForest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            trolls: ['Kazraz', 'Wonulkaz', 'Trezumike', 'Zol\'Sora', 'Raknanju', 'Mugnanlai', 'Zaliznay', 'Uthelumijo', 'Anoji', 'Gul\'Ojin'],
            currentLife: 1,
            bossIsActive: false
        };

        this.totalLife = {};
    }

    markBossAsActive = () => {
        this.setState({
            bossIsActive: true
        })
    };

    // troll = {name: 'Kazraz', life: 35}
    adjustForestLife = (troll) => {
        this.totalLife[troll.name] = troll.life;

        let totalLifeCount = 0;
        Object.keys(this.totalLife).forEach((trollName) => {
            totalLifeCount += this.totalLife[trollName];
        });

        console.log('The life of the Forrest', totalLifeCount);
        if (totalLifeCount !== this.state.currentLife) {
            this.setState({
                currentLife: totalLifeCount
            });
        }
    };

    render() {
        let trollsInForrest = this.state.trolls.map(
            (name) => <Troll
                key={name}
                improveHeroStats={this.props.improveHeroStats}
                getDamageFromTroll={this.props.getDamageFromTroll}
                heroData={this.props.heroData}
                adjustForestLife={this.adjustForestLife}
                name={name}
            />);

        return (
            <div>
                <h5>This is the Forbidden Forest! (Total Trolls: {this.state.currentLife})</h5>
                <div>{trollsInForrest}</div>
                <div>
                    {!this.state.currentLife || this.state.bossIsActive
                        ?
                        <TheBigBoss
                            markBossAsActive={this.markBossAsActive}
                            getDamageFromTroll={this.props.getDamageFromTroll}
                            improveHeroStats={this.props.improveHeroStats}
                            heroData={this.props.heroData}
                            adjustForestLife={this.adjustForestLife}
                        />
                        : null
                    }
                </div>
            </div>
        )
    }
}
class HeroComponent extends React.Component {
    componentWillUnmount() {
        let heroName = this.form.name.value;
        alert(`Good luck, ${heroName}!`);
    }

    render() {
        return (
            <div>
                <div>{this.props.children}</div>
                <form
                    ref={(ref) => { this.form = ref; }}
                    onSubmit={this.props.createHero}>
                    <input
                        required
                        name="name"
                        type="text"
                        placeholder="Enter your hero name"
                    />
                    <select name="herotype">
                        <option value="paladin">Paladin</option>
                        <option value="barbar">Barbar</option>
                        <option value="wizard">Wizard</option>
                    </select>
                    <input type="number" name="difficulty" min={1} max={3} defaultValue={1} />
                    <input type="submit" placeholder="Submit" />
                </form>
            </div>
        )
    }
}
class HeroDetails extends React.Component {
    render() {
        let heroData = this.props.heroData;
        return (
            <div>
                <button
                    onClick={this.props.resetGame}>Reset Game
                </button>
                <div>Name: {heroData.name}</div>
                <div>Class: {heroData.type}</div>
                <div>Life: {heroData.life}</div>
                <button
                    onClick={this.props.sendHeroToForrest}
                >Send hero to fight the trolls!
                </button>
            </div>
        )
    }
}
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            isInForrest: false,
            isDead: false
        }
    }

    componentWillMount() {
        let heroData = localStorage.getItem('heroData');

        if (heroData) {
            heroData = JSON.parse(heroData);
            this.setState(heroData);
            this.setHealingInterval();
        }
    }

    improveHeroStats = () => {
        this.setState({
            damage: this.state.damage + 1,
            maxLife: this.state.maxLife + this.state.maxLife / 2,
            healingPoints: this.state.healingPoints + 0.1,
            life: this.state.life + 20
        });
    };
    getDamageFromTroll = (damage, callback) => {
        if (this.state.isDead) {
            if (this.healingInterval) {
                clearInterval(this.healingInterval);
            }
            callback();
            return;
        }

        let nextHeroLife = this.state.life - damage;
        if (nextHeroLife <= 0) {
            nextHeroLife = 0;
            alert('You have died :( No one left to save us! :(');
            clearInterval(this.healingInterval);
            callback();
        }

        this.setState({
            life: nextHeroLife,
            isDead: !nextHeroLife
        });
    };

    createHero = (e) => {
        e.preventDefault();

        let hero = e.target;
        let heroType = hero.herotype.value;
        let damage = 10;
        let healingPoints = 0.2;
        if (heroType === 'paladin') {
            damage = 8;
            healingPoints = 0.5;
        }
        if (heroType === 'wizard') {
            damage = 4;
            healingPoints = 0.8;
        }

        const heroData = {
            name: hero.name.value,
            difficulty: hero.difficulty.value,
            type: hero.herotype.value,
            life: Math.floor(100 / hero.difficulty.value),
            maxLife: Math.floor(100 / hero.difficulty.value),
            healingPoints,
            damage
        };

        localStorage.setItem('heroData', JSON.stringify(heroData));
        this.setState(heroData);
        this.setHealingInterval();
    };

    setHealingInterval = () => {
        this.healingInterval = setInterval(() => {
            if (
                this.state.life === this.state.maxLife
                || this.state.isDead
            ) return;

            let nextLife = this.state.life + this.state.healingPoints;
            if (nextLife > this.state.maxLife) { nextLife = this.state.maxLife;}

            this.setState({
                life: Math.floor(nextLife * 100) / 100
            })
        }, 300);
    };

    sendHeroToForrest = () => {
        this.setState({
            isInForrest: true
        });
    };

    resetGame = () => {
        this.setState({ name: '', isInForrest: false });
        localStorage.removeItem('heroData');
    };

    changeName = (e) => {
        let currentName = e.target.value;
        this.setState({ name: currentName });
    };

    render() {
        return (
            <div>
                <h1 className="hello">Hello, {(this.state && this.state.name) ? this.state.name : 'Stranger'}!</h1>

                {
                    this.state.name
                        ? <HeroDetails
                        resetGame={this.resetGame}
                        heroData={this.state}
                        sendHeroToForrest={this.sendHeroToForrest}
                    />
                        : <HeroComponent createHero={this.createHero}>
                        <h2>Create Hero:</h2>
                    </HeroComponent>
                }

                {
                    this.state.isInForrest
                        ? <ForbiddenForest
                        improveHeroStats={this.improveHeroStats}
                        getDamageFromTroll={this.getDamageFromTroll}
                        heroData={this.state}
                    />

                        : null
                }

            </div>
        );
    }
}


ReactDOM.render(<App />, document.getElementById('root'));