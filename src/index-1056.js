/**
 * Created by tanasecosminromeo on 10/12/2016.
 */
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {

    constructor(props){
        super(props);

        this.state = {isSuperman: true, name: 'Anonymous'}; //State-urile sunt un fel de props-uri locale componentei = Aka variabile locale pentru componenta curenta

        //this.toggleSuperman = this.toggleSuperman.bind(this); //Metoda de a face bind, individual daca nu se foloseste "arrow function"
    }

    /*toggleSuperman(){ //Fara arrow function
     this.setState({isSuperman: !this.state.isSuperman});
     }*/

    /*toggleSuperman(data){ //Fara arrow function
    console.log(data); //La call e onClick={this.toggleSuperman.bind(this, 'mortal'); DAR e mult mai misto cu atribute de html
     this.setState({isSuperman: !this.state.isSuperman});
     }*/

    toggleSuperman = (e) => { //Asa e cu arrow function care se binduieste misto
        let data = e.target.getAttribute('data-type');
        console.log(data);

        this.setState({isSuperman: !this.state.isSuperman});
    }

    changeName = (e) => {
        let currentName = e.target.value;

        this.setState({name: currentName});
    }

    render() {
        //let fullName = this.props.firstName + " " + this.props.lastName; // let este o variabila in scope-ul curent.
        //let fullName = `${this.props.firstName} ${this.props.lastName}`; //Same as above
        let fullName = this.state.name;

        return (
            <div>
                <h1 className="hello">Hello, {fullName}</h1>
                <div>Is {fullName} superman? {this.state.isSuperman?"YES":"No :("}</div>
                <button data-type="mortal" onClick={this.toggleSuperman}>Make him {this.state.isSuperman?"mortal":"immortal"}!</button>
                <input onChange={this.changeName}
                       type="text"
                       placeholder="Enter your name" />
            </div> //<div class="hello"><Hello World</div> in HTML
        );
    }

    //const App = () => <div>Hello World</div> //Metoda de a scrie o functier pe scurt. => bind this to it's parent - same as const App = function (){ return <div>Hello World</div> }
}


/*
    App.defaultProps = {
        //firstName: 'Anonymous'
    }

    App.propTypes = {           //string/array/bool/node(react node)/any
      firstName: React.PropTypes.any, //Definesti constrangeri pt variabile
      lastName: React.PropTypes.string.isRequired
                                //React.PropTypes.string - fara isRequired.. nu e requried thaa
    };
*/

//Props vin de la parents si componentele child nu le pot modifica

ReactDOM.render(<App lastName="Kent" />, document.getElementById("root"));