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

    constructor(props){
        super(props);

        this.state = {
            name: ''
        };
    }

    componentWillMount(){
        //Apare o data, inainte de render, doar prima data! Se foloseste de obicei in cazul in care vrem sa modificam state-uri default sau sa facem request catre server
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
                <h1 className="hello">Hello, {this.state.name}</h1>

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

    componentDidMount(){
        //Se face dupa ce se randeaza. Useful dupa ce se randeaza. Listener de scroll/on click/etc
    }

    componentWillUnmount(){
        //Se apeleaza fix inainte ca si compoenta sa se distruga. Useful pentru cleanup: Eg: Stergem intervale / etc
    }

    componentWillReceiveProps(nextProps){
        //Functie care se apeleaza cand se primesc props-uri noi de la parinte (eg: re-render, etc). Cand se foloseste cand in functie de props vrem sau nu sa schimbam state-uri
    }

    shouldComponentUpdate(nextProps, nextState){
        //Eg: daca moare eroul, faci render. Se da return la true/false (true face render.. false you got it) Practic e bine cand "scurcircuitezi" update-ul la child
    }

    componentDidUpdate(){
        //Se apeleaza imediat dupa update, aka dupa ce se face render. Se apeleaza DOAR daca se face re-render, dupa ce s-a facut prima data. Eg: Did Mount prima data - Asta next times
    }

    

}


ReactDOM.render(<App/>, document.getElementById("root"));