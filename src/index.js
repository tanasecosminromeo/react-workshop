/**
 * Created by tanasecosminromeo on 10/12/2016.
 */
import React from 'react';
import ReactDOM from 'react-dom';

class EditComponent extends React.Component {
    render() {
        return (
            <div>
                <div>{this.props.children}</div>
                <button
                    onClick={this.props.toggleSuperman}>
                    Make him {this.props.isSuperman?"mortal":"immortal"}!
                </button>
                <input onChange={this.props.changeName}
                       type="text"
                       placeholder="Enter your name" />
            </div>
        );
    }

}

class App extends React.Component {

    constructor(props){
        super(props);

        this.state = {isSuperman: true, name: 'Anonymous'}; //State-urile sunt un fel de props-uri locale componentei = Aka variabile locale pentru componenta curenta

    }

    toggleSuperman = (e) => { //Asa e cu arrow function care se binduieste misto
        this.setState({isSuperman: !this.state.isSuperman});
    }

    changeName = (e) => {
        let currentName = e.target.value;

        this.setState({name: currentName});
    }

    render() {
        return (
            <div>
                <h1 className="hello">Hello, {this.state.name}</h1>
                <div>Is {this.state.name} superman? {this.state.isSuperman?"YES":"No :("}</div>
                <EditComponent
                    changeName={this.changeName}
                    toggleSuperman={this.toggleSuperman}
                    isSuperman={this.state.isSuperman}
                ><h2>Edit Component:</h2></EditComponent>
            </div>
        );
    }

}


ReactDOM.render(<App lastName="Kent" />, document.getElementById("root"));