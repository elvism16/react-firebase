import React from "react";

import Firebase from "firebase";
import config from "./config";

class App extends React.Component {
  constructor(props) {
    super(props);
    Firebase.initializeApp(config);

    this.state = {
      developers: []
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.writeUserData();
    }
  }

  writeUserData = () => {
    Firebase.database()
      .ref("/")
      .set(this.state);
  };

  getUserData = () => {
    let ref = Firebase.database().ref("/");
    ref.on("value", snapshot => {
      const state = snapshot.val();
      this.setState(state);
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    let name = this.refs.name.value;
    let uid = this.refs.uid.value;

    if (uid && name) {
      const { developers } = this.state;
      const devIndex = developers.findIndex(data => {
        return data.uid === uid;
      });
      developers[devIndex].name = name;
      this.setState({ developers });
    } else if (name) {
      const uid = new Date().getTime().toString();
      const { developers } = this.state;
      developers.push({ uid, name });
      this.setState({ developers });
    }

    this.refs.name.value = "";
    this.refs.uid.value = "";
  };

  removeData = developer => {
    const { developers } = this.state;
    const newState = developers.filter(data => {
      return data.uid !== developer.uid;
    });
    this.setState({ developers: newState });
  };

  render() {
    const { developers } = this.state;
    return (
      <>
        <header>
          <h1>Firebase with React</h1>
        </header>

        <main>
          <section>
            <h2>Add a person</h2>
            <form onSubmit={this.handleSubmit}>
              <input type='hidden' ref='uid' />
              <div className='input-wrapper'>
                <label>Name</label>
                <input type='text' ref='name' placeholder='Name' />
              </div>
              <button type='submit'>Save name to database</button>
            </form>
          </section>

          <ul>
            {developers.map(developer => (
              <li key={developer.uid}>
                <div>
                  <div className='list-name'>{developer.name}</div>
                  <button onClick={() => this.removeData(developer)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </main>
      </>
    );
  }
}

export default App;
